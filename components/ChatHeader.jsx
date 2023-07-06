import { useChatContext } from '@/context/chat/chatContext'

import React, { useState } from 'react'
import Avatar from './Avatar'
import Icon from './Icon'
import { IoEllipsisVerticalSharp } from 'react-icons/io5'
import ChatMenu from './ChatMenu'
const ChatHeader = () => {
    const [showMenu, setShowMenu] = useState(false)
    const { user: specificUser, chatId, selectedChat, users } = useChatContext()
    const user = users[specificUser?.uid]
    const isOnline = users[specificUser?.uid]?.isOnline
    return (
        <div className='flex justify-between items-center pb-5 pt-3 border-b border-white/[0.05] px-4 '>
            {user && <div className='flex items-center gap-3'>
                <Avatar
                    user={user}
                    size={'large'}
                />
                <div className='font-medium'>
                    <div>{user?.displayName}</div>
                    <p className=' text-sm text-c3'>{isOnline ? "Online" : "Offline"}</p>
                </div>
            </div>}
            <div className='flex items-center gap-2 relative'>
                <Icon
                    size={'large'}
                    className={showMenu ? "bg-c1" : ''}
                    icons={<IoEllipsisVerticalSharp
                        className='text-c3'
                        size={20}
                        onClick={() => setShowMenu((prev) => !prev)}
                    />}
                />
                {showMenu && <ChatMenu state={{ showMenu, setShowMenu }} />}
            </div>
        </div>
    )
}

export default ChatHeader
