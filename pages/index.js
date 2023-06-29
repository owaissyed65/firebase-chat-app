
import Chat from '@/components/Chat'
import LeftNav from '@/components/LeftNav'
import Loader from '@/components/Loader'
import { useAuthContext } from '@/context/auth/authContext'
import { auth, db } from '@/firebase/firebase'
import { signOut as signOutUSer } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import LoadingBar from 'react-top-loading-bar'

const index = () => {
  const router = useRouter();
  const { isLoading, currentUser, progress } = useAuthContext();
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login')
    }
  }, [isLoading, currentUser])
  const signOut = async () => {
    await updateDoc(doc(db, 'users',currentUser.uid ), {
      isOnline: false
  });
    await signOutUSer(auth);
  }

  return !currentUser ? <Loader /> : (
    <>
      <LoadingBar
        color='#f11946'
        height="4px"
        progress={progress}
      // onLoaderFinished={{ progress: progress }}
      />
      <div className='bg-c1 flex h-[100vh]'>
        <div className='w-full shrink-0 flex'>
          <LeftNav signOut={signOut} />
          <div className="flex grow bg-c2">
            <div className='w-[400px] overflow-auto shrink-0 p-5 scrollbar border-r border-white/[0.05]'>
              <div className='flex flex-col h-full'><Chat/> </div>
            </div>
            <div>chat</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default index
