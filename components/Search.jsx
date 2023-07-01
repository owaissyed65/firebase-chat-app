import { db } from '@/firebase/firebase'
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import Avatar from './Avatar'
import Image from 'next/image'
import { useAuthContext } from '@/context/auth/authContext'
import { useChatContext } from '@/context/chat/chatContext'

const Search = (props) => {
    const [searchValue, setSearchValue] = useState('')
    const [load, setLoad] = useState(false);
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)
    // useEffect(() => {
    //     console.log('hello1')
    //     const timeout = setTimeout(() => {
    //         console.log('hello')
    //     }, 1000)
    //     return () => clearTimeout(timeout)
    // }, [searchValue])
    const keyP = async (e) => {
        if (e.code === "Enter" && !!searchValue) {
            try {
                setLoad(true)
                setError(false)
                let userRef = collection(db, 'users');
                let q = query(userRef, where("email", "==", searchValue))
                let snapshotQuery = await getDocs(q);
                if (snapshotQuery.empty) {
                    setLoad(false)
                    setError(true);
                    setUser(null)
                } else {
                    setLoad(false)
                    setError(false);
                    snapshotQuery.forEach((docs) => {
                        setUser(docs.data())
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    // handle select
    const { currentUser } = useAuthContext()
    const { dispatch } = useChatContext()
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
            setUser(null);
            setSearchValue('')
            dispatch({ type: 'CHANGE_USER', payload: users })
            props.onHide()
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div >
            <div className='relative w-full pr-16 pl-11 bg-c1/[0.6] h-12 rounded-2xl '>
                <input type="text"
                    placeholder='Search by email....'
                    className='bg-transparent w-full h-full outline-none border-none placeholder:text-c3 text-c3'
                    autoFocus
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => keyP(e)}
                />
                <span className='absolute top-3 right-4 text-c3'>Enter</span>
                <IoSearch className='absolute top-0 left-2 text-c3 h-full flex items-center cursor-pointer' />
            </div>
            {
                error && <><div className='flex items-center w-full h-full justify-center mt-5 mb-2'>
                    User Not found
                </div>
                    <div className=' w-full bg-black/[0.2] h-0.5'></div>
                </>
            }
            {
                load && <div className='flex items-center w-full h-full justify-center mt-2'>
                    <Image
                        src='/loader.svg'
                        width={40}
                        height={40}
                        alt='load'
                    />
                </div>
            }
            {user && !load && <>
                <div className={` flex items-center gap-4 rounded-xl hover:bg-c5 py-2 px-4 cursor-pointer `}
                    onClick={() => handleChat(user)} >
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
                <div className=' w-full bg-black/[0.2] h-0.5'></div>
            </>
            }
        </div>
    )
}

export default Search
