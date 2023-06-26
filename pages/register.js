import Link from 'next/link';
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";
import { createUserWithEmailAndPassword, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth, db } from '@/firebase/firebase';
import { useAuthContext } from '@/context/auth/authContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import { doc, setDoc } from 'firebase/firestore';
import { profileColors } from '@/utils/constants';
import Loader from '@/components/Loader';

const login = () => {
    const gProvider = new GoogleAuthProvider()
    const fProvider = new FacebookAuthProvider()
    const { isLoading, currentUser } = useAuthContext()
    const router = useRouter()
    useEffect(() => {
        if (!isLoading && currentUser) {
            router.push('/')
        }
    }, [isLoading, currentUser])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value
        const email = e.target[1].value
        const password = e.target[2].value
        const randColor = Math.floor(Math.random() * profileColors.length)
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password)
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                displayName,
                email: user.email,
                profileColor: profileColors[randColor]
            })
            await setDoc(doc(db, 'userChats', user.uid), {})
            await updateProfile(user, {
                displayName
            })
            console.log(user)
        } catch (error) {
            toast.error('User Already Exist !', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            console.error(error)
        }
    }

    const googleSignIn = async () => {
        try {
            const { user } = await signInWithPopup(auth, gProvider);
            const randColor = Math.floor(Math.random() * profileColors.length)
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                profileColor: profileColors[randColor]
            })
            await setDoc(doc(db, 'userChats', user.uid), {})
        } catch (error) {
            console.error(error)
        }
    }
    const fbSignIN = async () => {
        try {
            await signInWithPopup(auth, fProvider);
        } catch (error) {
            console.error(error);
        }
    }
    return isLoading || (!isLoading && currentUser) ? <Loader /> : (
        <div className='h-[100vh] flex justify-center items-center bg-c1 w-full overflow-y-auto'>
            <ToastContainer />
            <div className="flex items-center flex-col w-auto md:w-[600px]">
                <div className="text-center">
                    <div className="text-4xl font-bold capitalize">Create a new Account</div>
                    <div className="mt-3 text-c3">Connect and chat with anyone and anywhere</div>
                </div>
                <div className='flex gap-5 items-center w-full mt-10 mb-5'>
                    <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 cursor-pointer p-[1px] rounded-md transition-transform duration-400 hover:scale-110' onClick={googleSignIn}>
                        <div className='w-full bg-c1 h-full font-semibold flex justify-center items-center text-center text-white rounded-md gap-3'><span><IoLogoGoogle size={24} /></span> Signup to Google</div>
                    </div>
                    <div className='bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 cursor-pointer p-[1px] rounded-md transition-transform duration-400 hover:scale-110' onClick={fbSignIN}>
                        <div className='w-full bg-c1 h-full font-semibold flex justify-center items-center text-center gap-3 text-white rounded-md'><span><IoLogoFacebook size={24} /></span>Signup to Facebook</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className='bg-c3 h-[1px] w-7'></span>
                    <span className='text-c3 font-semibold'>OR</span>
                    <span className='bg-c3 h-[1px] w-7'></span>
                </div>
                <form className='flex flex-col items-center gap-3 w-[500px] mt-5' onSubmit={handleSubmit}>
                    <input type="text" placeholder='Display Name' className='w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3' autoComplete='off' />
                    <input type="email" placeholder='Email' className='w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3' autoComplete='off' />
                    <input type="password" placeholder='Password' className='w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3' autoComplete='off' />
                    <button className='w-full h-14 outline-none border-none rounded-md bg-gradient-to-r  from-indigo-500 via-purple-500 to-pink-500 transition-transform duration-400 hover:scale-110 '>Create an Account</button>
                </form>
                <div className='w-full text-center text-sm mt-3'>
                    <span className='text-c3 mx-1'>Already Have an Account?</span>
                    <Link href='/login' className='font-semibold underline underline-offset-2 cursor-pointer hover:text-c4'>Click here to login</Link>
                </div>
            </div>
        </div>
    )
}

export default login
