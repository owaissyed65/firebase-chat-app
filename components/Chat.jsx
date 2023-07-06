import { useChatContext } from '@/context/chat/chatContext'
import Image from 'next/image'
import React from 'react'
import ChatHeader from './ChatHeader'
import Messages from './Messages'
import ChatFooter from './ChatFooter'


const Chat = () => {
  const { user: specificUser, chatId, selectedChat, users } = useChatContext()
  return (
    <div className='relative w-full h-full flex flex-col'>
      <ChatHeader />
      <Messages />
      <ChatFooter />
      {/* for loading */}
      {!specificUser && !chatId && !selectedChat && <div className='absolute top-0 right-0 w-full h-full flex justify-center items-center'>
        <Image
          width={70}
          height={70}
          src={'/loader.svg'}
          alt='Loading...'

        />
      </div>}
    </div>
  )
}

export default Chat
