import React, { useEffect, useRef } from 'react'
import ClickAwayListener from 'react-click-away-listener'

const MessageMenu = ({ state: { self, setShowMenu, showMenu } }) => {
    const handleClick = () => {
        setShowMenu((prev) => !prev)
    }
    const ref = useRef()
    useEffect(() => {
        ref.current.scrollIntoViewIfNeeded()
    }, [showMenu])
    return (
        <ClickAwayListener onClickAway={handleClick}>
            <div ref={ref} className={`absolute w-[200px] bg-c0 z-10 rounded-md overflow-hidden ${self ? 'right-0' : 'left-0'} top-0`}>
                <ul className='flex flex-col py-2'>
                    {self && <li className='flex items-center px-5 py-3 rounded-lg hover:bg-black cursor-pointer'>
                        Edit Message
                    </li>}
                    <li className='flex items-center px-5 py-3 rounded-lg hover:bg-black cursor-pointer'>
                        Delete Message
                    </li>
                </ul>
            </div>
        </ClickAwayListener>
    )
}

export default MessageMenu
