import { useContext, useEffect, useReducer, useState, createContext } from 'react'
import authReducer from '../reducer/authReducer'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/firebase/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'


const Context = createContext()
const AuthContext = ({ children }) => {
    const initialState = {
        currentUser: null,
        isLoading: false
    }
    let data;
    const [progress, setProgress] = useState(0)
    // for top loading bar
    const bar = (loading) => {
        setProgress(loading)
    }
    const [state, dispatch] = useReducer(authReducer, initialState)
    const authStateChanged = async (user) => {
        dispatch({ type: 'LOAD_TRUE' });
        if (!user) {
            if (data) {
                await updateDoc(doc(db, 'users', data.uid), {
                    isOnline: false
                });
            }
            dispatch({ type: 'LOAD_FALSE' });
            data = null
            return;
        }
        const updateDocRef = await getDoc(doc(db, 'users', user.uid))
        if (updateDocRef.exists()) {
            await updateDoc(doc(db, 'users', user.uid), {
                isOnline: true
            })
        }
        const docUser = await getDoc(doc(db, 'users', user.uid));
        dispatch({ type: 'LOAD_FALSE_AND_ADD_USER', payload: { user: docUser.data() } })
        data = docUser.data()
    }
    const setCurrentUser = (obj) => {
        dispatch({ type: 'UPDATEDOC', payload: { obj } })
    }
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, authStateChanged)
        return () => unSubscribe()
    }, []);
    return (
        <Context.Provider value={{ ...state, setCurrentUser, bar, progress }}>
            {children}
        </Context.Provider>
    )
}
export const useAuthContext = () => {
    return useContext(Context)
}
export default AuthContext