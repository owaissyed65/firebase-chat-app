import { useChatContext } from '@/context/chat/chatContext'
import { db } from '@/firebase/firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import React, { useEffect } from 'react'

const Chat = () => {
    const { users, setUsers } = useChatContext()
    useEffect(() => {
        onSnapshot(collection(db, 'users'), (snapshot) => {
            let updatedUser = {}
            snapshot.forEach((doc) => {
                updatedUser[doc.id] = doc.data()
            })
            setUsers(updatedUser)
        })
    }, [])
    return (
        <div>
            chat
        </div>
    )
}

export default Chat
