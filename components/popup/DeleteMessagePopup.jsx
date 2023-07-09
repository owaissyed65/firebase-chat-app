import React, { useEffect, useState } from 'react'
import PopupWrapper from './PopupWrapper'
import { useAuthContext } from '@/context/auth/authContext'
import { useChatContext } from '@/context/chat/chatContext'
import Image from 'next/image'

const DeleteMessagePopup = (props) => {
    const { currentUser } = useAuthContext()
    const { users, dispatch } = useChatContext()
    const [load, setLoad] = useState(false)

    return (
        <PopupWrapper {...props}>
          <div>
            deded
          </div>
        </PopupWrapper>
    )
}

export default DeleteMessagePopup
