
import { createContext, useContext, useReducer, useState } from 'react'
import { useAuthContext } from '../auth/authContext'

const Context = createContext()
const ChatContext = ({ children }) => {
    const { currentUser } = useAuthContext()
    const initialState = {
        chatId: "",
        user: null
    }
    const chatReducer = (state, action) => {
        // const { currentUser } = useAuthContext()
        switch (action.type) {
            case 'CHANGE_USER':
                return {
                    ...state,
                    user: action.payload,
                    chatId: currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid
                }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(chatReducer, initialState)
    const [users, setUsers] = useState(false)
    return (
        <Context.Provider value={{ ...state, users, setUsers, dispatch }}>
            {children}
        </Context.Provider>
    )
}

export default ChatContext
export const useChatContext = () => {
    return useContext(Context)
}
