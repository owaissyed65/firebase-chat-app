import React, { useState } from 'react'
import { IoSearch } from 'react-icons/io5'

const Search = () => {
    const [searchValue, setSearchValue] = useState('')
    // useEffect(() => {
    //     console.log('hello1')
    //     const timeout = setTimeout(() => {
    //         console.log('hello')
    //     }, 1000)
    //     return () => clearTimeout(timeout)
    // }, [searchValue])
    return (
        <div className='relative w-full pr-16 pl-11 bg-c1/[0.6] h-12 rounded-2xl'>
            <input type="text" placeholder='Search' className='bg-transparent w-full h-full outline-none border-none placeholder:text-c3 text-c3'
                autoFocus
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}

            />
            <span className='absolute top-3 right-4 text-c3'>Enter</span>
            <IoSearch className='absolute top-0 left-2 text-c3 h-full flex items-center cursor-pointer' />
        </div>
    )
}

export default Search
