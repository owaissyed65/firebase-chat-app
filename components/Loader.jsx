import Image from 'next/image'
import React from 'react'

const Loader = () => {
    return (
        <div className='fixed top-0 left-0 flex justify-center text-center w-full h-full'>
            <Image
                width={100}
                height={100}
                src={'/loader.svg'}
                alt='loading...'
            />
        </div>
    )
}

export default Loader
