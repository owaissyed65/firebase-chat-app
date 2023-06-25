import Link from 'next/link';
import React from 'react'
import {IoLogoGoogle,IoLogoFacebook  } from "react-icons/io";
const login = () => {
    return (
        <div className='h-[100vh] flex justify-center items-center bg-c1 w-full'>
            <div className="flex items-center flex-col w-auto md:w-[600px]">
                <div className="text-center">
                    <div className="text-4xl font-bold">Login To Your Account</div>
                    <div className="mt-3 text-c3">Connect and chat with anyone and anywhere</div>
                </div>
                <div className='flex gap-5 items-center w-full mt-10 mb-5'>
                    <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 cursor-pointer p-[1px] rounded-md transition-transform duration-400 hover:scale-110'>
                        <div className='w-full bg-c1 h-full font-semibold flex justify-center items-center text-center text-white rounded-md gap-3'><span><IoLogoGoogle size={24}/></span> Login to Google</div>
                    </div>
                    <div className='bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 cursor-pointer p-[1px] rounded-md transition-transform duration-400 hover:scale-110'>
                        <div className='w-full bg-c1 h-full font-semibold flex justify-center items-center text-center gap-3 text-white rounded-md'><span><IoLogoFacebook size={24}/></span>Login to Facebook</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className='bg-c3 h-[1px] w-7'></span>
                    <span className='text-c3 font-semibold'>OR</span>
                    <span className='bg-c3 h-[1px] w-7'></span>
                </div>
                <form className='flex flex-col items-center gap-3 w-[500px] mt-5'>
                    <input type="email" placeholder='Email' className='w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3' autoComplete='off'/>
                    <input type="password" placeholder='Password' className='w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3' autoComplete='off'/>
                    <div className='text-right w-full text-c3 hover:text-c4'><span className='cursor-pointer '>Forgot Password</span></div>
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
