import Loader from '@/components/Loader';
import { useAuthContext } from '@/context/auth/authContext';
import { auth, db } from '@/firebase/firebase';
import { profileColors } from '@/utils/constants';
import { signInWithEmailAndPassword, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const login = () => {
    const [email, setEmail] = useState()
    const gProvider = new GoogleAuthProvider()
    const fProvider = new FacebookAuthProvider()
    const router = useRouter()

    const { isLoading, currentUser } = useAuthContext()

    useEffect(() => {
        if (!isLoading && currentUser) {
            router.push('/')
        }
    }, [isLoading, currentUser])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value
        const password = e.target[1].value
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            toast.error('Invalid Credentials !', {
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
        } catch (error) {
            console.error(error)
        }
    }
    const fbSignIN = async () => {
        try {
            await signInWithPopup(auth, fProvider);
        } catch (error) {

        }
    }
    const resetPassword = async () => {
        toast.promise(
            async () => { await sendPasswordResetEmail(auth, email) },
            {
                pending: 'Generating Link',
                success: 'Please Check Your email to reset password',
                error: 'Please enter a correct email'
            },
            {
                autoClose: 5000,
                pauseOnHover: false
            }
        )
    }
    return isLoading || (!isLoading && currentUser) ? <Loader /> : (
        <div className='h-[100vh] flex justify-center items-center bg-c1 w-full  overflow-y-auto'>
            <ToastContainer />
            <div className="flex items-center flex-col w-auto md:w-[600px]">
                <div className="text-center">
                    <div className="text-4xl font-bold">Login To Your Account</div>
                    <div className="mt-3 text-c3">Connect and chat with anyone and anywhere</div>
                </div>
                <div className='flex gap-5 items-center w-full mt-10 mb-5'>
                    <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 cursor-pointer p-[1px] rounded-md transition-transform duration-400 hover:scale-110' onClick={googleSignIn}>
                        <div className='w-full bg-c1 h-full font-semibold flex justify-center items-center text-center text-white rounded-md gap-3'><span><IoLogoGoogle size={24} /></span> Login to Google</div>
                    </div>
                    <div className='bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 cursor-pointer p-[1px] rounded-md transition-transform duration-400 hover:scale-110' onClick={fbSignIN}>
                        <div className='w-full bg-c1 h-full font-semibold flex justify-center items-center text-center gap-3 text-white rounded-md'><span><IoLogoFacebook size={24} /></span>Login to Facebook</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className='bg-c3 h-[1px] w-7'></span>
                    <span className='text-c3 font-semibold'>OR</span>
                    <span className='bg-c3 h-[1px] w-7'></span>
                </div>
                <form className='flex flex-col items-center gap-3 w-[500px] mt-5' onSubmit={handleSubmit}>
                    <input type="email" placeholder='Email' className='w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3' autoComplete='off' required onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder='Password' className='w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3' autoComplete='off' required />
                    <div className='text-right w-full text-c3 hover:text-c4'><span className='cursor-pointer ' onClick={resetPassword}>Forgot Password</span></div>
                    <button className='w-full h-14 outline-none border-none rounded-md bg-gradient-to-r  from-indigo-500 via-purple-500 to-pink-500 transition-transform duration-400 hover:scale-110 '>Login to Your Account</button>
                </form>
                <div className='w-full text-center text-sm mt-3'>
                    <span className='text-c3 mx-1'>Not A Member Yet?</span>
                    <Link href='/register' className='font-semibold underline underline-offset-2 cursor-pointer hover:text-c4'>Register Now</Link>
                </div>
            </div>
        </div>
    )
}

export default login
