import React from 'react'
import ClickAwayListener from 'react-click-away-listener'

const ChatMenu = ({ state: { setShowMenu } }) => {
    const handleClick = () => {
        setShowMenu((prev) => !prev)
    }
    return (
        <ClickAwayListener onClickAway={handleClick}>
            <div className='absolute right-0 top-[70px] w-[200px] bg-c0 z-10 rounded-md overflow-hidden'>
                <ul className='flex flex-col py-2'>
                    <li className='flex items-center px-5 py-3 rounded-lg hover:bg-black cursor-pointer'>
                        Block User
                    </li>
                    <li className='flex items-center px-5 py-3 rounded-lg hover:bg-black cursor-pointer'>
                        Delete Chat
                    </li>
                </ul>
            </div>
        </ClickAwayListener>
    )
}

export default ChatMenu
