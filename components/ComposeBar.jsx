import { useAuthContext } from '@/context/auth/authContext'
import { useChatContext } from '@/context/chat/chatContext'
import { db } from '@/firebase/firebase'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { TbSend } from 'react-icons/tb'
import { v4 as uuid } from 'uuid'
const ComposeBar = () => {
    const { inputText, setInputText, chatId, user } = useChatContext()
    const { currentUser } = useAuthContext()
    const [load, setLoad] = useState(false)
    
    const keyHandle = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            handleSubmit()
        }
    }
    const handleSubmit = async () => {
        setLoad(true)
        if (inputText) {
            try {
                await updateDoc(doc(db, 'chats', chatId), {
                    message: arrayUnion({
                        id: uuid(),
                        text: inputText,
                        sender: currentUser?.uid,
                        date: Timestamp.now(),
                        read: false
                    })
                })
                await updateDoc(doc(db, 'userChats', currentUser?.uid), {
                    [chatId + '.lastMessage']: {
                        text: inputText
                    },
                    [chatId + '.date']: serverTimestamp()
                })
                await updateDoc(doc(db, 'userChats', user?.uid), {
                    [chatId + '.lastMessage']: {
                        text: inputText
                    },
                    [chatId + '.date']: serverTimestamp()
                })
                setLoad(false)
                setInputText('')
            } catch (error) {
                console.log(error)
            }
        }
    }
    return (
        <div className='flex items-center gap-2 grow h-full'>
            <input type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyUp={keyHandle}
                className='text-c3 outline-none border-none w-full h-full placeholder:text-c3 bg-transparent px-1 grow'
                placeholder='Text a message...'
            />
            <button className={`h-10 w-10 rounded-md ${inputText.trim()?.length > 0 ? 'bg-c4 cursor-pointer' : 'cursor-not-allowed'} ${load && 'cursor-not-allowed'} flex justify-center items-center`} onClick={handleSubmit}>
                {load ? <Image src='/loader.svg' height={20} width={20} alt='loading...'/>
                    : <TbSend size={20} />}
            </button>
        </div>
    )
}

export default ComposeBar
