import React, { useEffect, useState } from 'react'
import PopupWrapper from './PopupWrapper'
import { useAuthContext } from '@/context/auth/authContext'
import { useChatContext } from '@/context/chat/chatContext'
import Avatar from '../Avatar'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import Search from '../Search'

const UserPopup = (props) => {
    const { currentUser } = useAuthContext()
    const { users, dispatch } = useChatContext()
    // const [search, setSearch] = useState('')
    const handleChat = async (users) => {
        if (users.uid === currentUser.uid) {
            alert("Sorry You can't connect with same credentials")
            return
        }
        try {
            let combineID = currentUser.uid > users.uid ? currentUser.uid + users.uid : users.uid + currentUser.uid;
            let res = await getDoc(doc(db, 'chats', combineID))
            if (!res.exists()) {
                // if chats of clicking user is exists not
                await setDoc(doc(db, 'chats', combineID), {
                    message: []
                })
                let currentUserRef = await getDoc(doc(db, 'userChats', currentUser.uid))
                let userRef = await getDoc(doc(db, 'userChats', users.uid))
                if (!currentUserRef.exists()) {
                    await setDoc(doc(db, 'userChats', currentUser.uid), {})
                }
                await updateDoc(doc(db, 'userChats', currentUser.uid), {
                    [combineID + '.userInfo']: {
                        uid: users.uid,
                        displayName: users.displayName,
                        profileURL: users.profileURL || null,
                        profileColor: users.profileColor
                    },
                    [combineID + '.date']: serverTimestamp()
                })
                if (!userRef.exists()) {
                    await setDoc(doc(db, 'userChats', users.uid), {})
                }
                await updateDoc(doc(db, 'userChats', users.uid), {
                    [combineID + '.userInfo']: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        profileURL: currentUser.profileURL || null,
                        profileColor: currentUser.profileColor
                    },
                    [combineID + '.date']: serverTimestamp()
                })

            } else {
                // if chats of clicking user is exists 
            }
            dispatch({ type: 'CHANGE_USER', payload: users })
            props.onHide()
        } catch (error) {
            console.error(error)
        }
    }
    // const handleSearch = (e) => {
    //     setSearch(e.target.value)
    // }
    /// useEffect(() => {
    //     let data = Object.values(users).filter((p) => p.displayName.toLowerCase() === search.toLowerCase())
    //     console.log(data)
    // }, [search])
    return (
        <PopupWrapper {...props}>
            <Search onHide={props.onHide} />
            <div className='mt-5 flex flex-col grow relative h-[300px] overflow-y-auto scrollbar'>
                <div className="absolute w-full">
                    {/* <div className='w-full rounded-2xl h-9 mb-3 '>
                        <input type="text" className='outline-none border-none bg-c2 text-c3 w-full h-full ' placeholder='Search here' onChange={handleSearch} />
                    </div> */}
                    {users && Object.values(users)?.map((user, i) => (
                        <div className={`flex items-center gap-4 rounded-xl hover:bg-c5 py-2 px-4 cursor-pointer`}
                            onClick={() => handleChat(user)} key={user.uid} >
                            <Avatar size={'large'}
                                user={user}
                            />
                            <div className='flex flex-col gap-2 grow'>
                                <span className="text-base text-white flex items-center justify-between">
                                    <div className="font-medium">{user?.displayName}</div>
                                </span>
                                <p className="text-sm text-c3">{user?.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PopupWrapper>
    )
}

export default UserPopup
