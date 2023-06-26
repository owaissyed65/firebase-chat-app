import { useContext, useEffect, useReducer } from 'react'
import Context from '../createContext'
import authReducer from '../reducer/authReducer'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/firebase/firebase'
import { doc, getDoc } from 'firebase/firestore'

const AuthContext = ({ children }) => {
    const initialState = {
        currentUser: null,
        isLoading: false
    }
    const [state, dispatch] = useReducer(authReducer, initialState)
    const authStateChanged = async (user) => {
        dispatch({ type: 'LOAD_TRUE' })
        if (!user) {
            dispatch({ type: 'LOAD_FALSE' })
            return;
        }
        const docUser = await getDoc(doc(db, 'users', user.uid));
        dispatch({ type: 'LOAD_FALSE_AND_ADD_USER', payload: { user: docUser.data() } })
    }
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, authStateChanged)
        return () => unSubscribe()
    }, []);
    return (
        <Context.Provider value={{ ...state }}>
            {children}
        </Context.Provider>
    )
}
export const useAuthContext = () => {
    return useContext(Context)
}
export default AuthContext