import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

const index = () => {
  const router =useRouter()
  useEffect(() => {
    router.push('/login')
  }, []);
  return (
    <div>
      home
    </div>
  )
}

export default index
