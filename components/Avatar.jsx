import { useAuthContext } from '@/context/auth/authContext'
import Image from 'next/image'
import React from 'react'

const Avatar = ({ size, user, onClick }) => {
    // const { currentUser: user } = useAuthContext()
    const s = size === 'small' ? 32 : size === 'medium' ? 36 : size === 'x-large' ? 56 : size === 'xx-large' ? 96 : 40
    const c = size === 'small' ? "w-8 h-8" : size === 'medium' ? "w-9 h-9" : size === 'large' ? "w-10 h-10" : size === 'x-large' ? "w-14 h-14" : "w-24 h-24"
    const f = size === 'x-large' ? 'text-2xl' : size === 'xx-large' ? 'text-2xl' : 'text-base'
    return (
        <div className={`${c} rounded-full flex items-center justify-center text-base shrink-0 relative`} style={{ backgroundColor: user?.profileColor }}>
            {user?.isOnline &&
                (size === 'small' || size === 'medium' || size === 'x-large' ||size==='large'? <div className='w-[10px] h-[10px] rounded-full bg-green-500 absolute bottom-0 right-[2px]'></div> : '')
            }
            {
                user?.profileURL ? (
                    <div className={`${c} overflow-hidden rounded-full flex justify-center items-center`} >
                        <Image
                            src={user?.profileURL}
                            alt='profile'
                            width={s}
                            height={s}
                        />
                    </div>
                ) : (
                    <div className={`${f} uppercase font-semibold`}>
                        {user?.displayName?.charAt(0)}
                    </div>
                )
            }
        </div>
    )
}

export default Avatar
