import { useChatContext } from '@/context/chat/chatContext'
import { db } from '@/firebase/firebase'
import { Timestamp, collection, doc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { RiSearch2Line } from 'react-icons/ri'
import Avatar from './Avatar'
import { useAuthContext } from '@/context/auth/authContext'
import { formateDate } from '@/utils/helper'
import Image from 'next/image'
const Chats = () => {
    const { users, setUsers, selectedChat, setSelectedChat, chats, setChats, dispatch } = useChatContext()
    const [search, setSearch] = useState('')
    const { currentUser } = useAuthContext()
    const forwardRef = useRef(false)
    const userRef = useRef(false)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setLoading(true)
        onSnapshot(collection(db, 'users'), (snapshot) => {
            let updatedUser = {}
            snapshot.forEach((doc) => {
                updatedUser[doc.id] = doc.data()
            })
            setUsers(updatedUser)
            if (!forwardRef.current) {
                userRef.current = true;
            }
        })
    }, [])

    useEffect(() => {
        setLoading(true)
        const getChat = () => {
            onSnapshot(doc(db, 'userChats', currentUser.uid), (snapshot) => {
                if (snapshot.exists()) {
                    setLoading(false)
                    const data = snapshot.data();
                    setChats(data);

                    if (!forwardRef.current && userRef.current && Object.values(users).length > 0) {
                        const firstChat = Object.values(data)?.sort((a, b) => b.date - a.date)[0]
                        if (firstChat) {
                            const user1 = users[firstChat.userInfo.uid]
                            handleSelect(user1, user1?.uid)
                        }
                        forwardRef.current = true
                    }
                }
            })
        }
        currentUser.uid && getChat()
    }, [forwardRef.current, users])
    const filterChats = Object.entries(chats || {}).sort((a, b) => b[1].date - a[1].date).filter(([, user]) => user?.userInfo.displayName.toLowerCase().includes(search.toLowerCase().trim())
    )
    const handleSelect = (user, selectedChatId) => {
        setSelectedChat(selectedChatId)
        dispatch({ type: 'CHANGE_USER', payload: user })
    }
    return (
        <div className='flex flex-col h-full relative'>
            <div className='sticky -top-[20px] z-10 flex justify-center w-full bg-c2 py-5'>
                <RiSearch2Line className='absolute top-9 left-12 text-c3' />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Search Username...'
                    className='w-[300px] h-12 rounded-xl bg-c1/[0.5] pl-11 pr-5 placeholder:text-c3 outline-none text-base'
                />
            </div>
            {
                loading && <div className='flex justify-center w-full items-center mt-4 absolute top-0 left-0 h-full'>
                    <Image
                        width={70}
                        height={70}
                        src='/loader.svg'
                        alt='loading...'
                    />
                </div>
            }
            {!loading && filterChats.length === 0 && <div className='flex justify-center w-full items-center'>
                There is no any chat
            </div>}
            <ul className='flex flex-col w-full my-5 gap-2'>
                {Object.values(users || {}).length > 0
                    && filterChats?.map((data) => {
                        const user = users[data?.[1]?.userInfo?.uid]
                        const timeStamp = new Timestamp(
                            data?.[1]?.date?.seconds,
                            data?.[1]?.date?.nanoseconds
                        )
                        const date = timeStamp.toDate();
                        return (

                            <li className={`h-[90ox] flex items-center gap-4 rounded-3xl hover:bg-c1 p-4 cursor-pointer ${selectedChat && selectedChat === data?.[1].userInfo.uid ? "bg-c1" : ''}`} key={user?.uid} onClick={() => { handleSelect(user, data?.[1].userInfo.uid) }}>
                                <Avatar user={user} size={'x-large'} />
                                <div className='flex flex-col gap-1 grow relative'>
                                    <span className='text-base text-white flex items-center justify-between'>
                                        <div className='font-medium'>{user?.displayName}</div>
                                        <div className='text-c3 text-xs'>{formateDate(date)}</div>
                                    </span>
                                    <p className='text-sm text-c3 line-clamp-1 break-all w-[80%]'>{data?.[1]?.lastMessage?.text || data?.[1]?.lastMessage?.pic && "Image" || `Initialized Message With ${user?.displayName}`}</p>
                                    <div className='w-[20px] h-[20px] rounded-full flex justify-center items-center bg-pink-500 absolute right-0 bottom-0 text-[14px]'>4</div>
                                </div>
                            </li>


                        )
                    })
                }
            </ul>
        </div>
    )
}

export default Chats
