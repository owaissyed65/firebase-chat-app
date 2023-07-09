import { useChatContext } from '@/context/chat/chatContext'
import { db } from '@/firebase/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import Message from './Message'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const { chatId } = useChatContext()
  useEffect(() => {
    const unsub = chatId && onSnapshot(doc(db, 'chats', chatId), (data) => {
      if (data.exists()) {
        setMessages(data.data().message)
      }
    })
    return () => chatId && unsub()
  }, [chatId])
  return (
    <div className='grow p-5 overflow-auto scrollbar flex flex-col'>
      {messages?.map((m) => {
        return (
          <Message message={m}/>
        )
      })}
    </div>
  )
}

export default Messages
