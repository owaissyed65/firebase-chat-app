import React from 'react'
import Icon from '../Icon'
import { IoClose } from 'react-icons/io5'

const PopupWrapper = (props,{children}) => {
    return (
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center z-20'>
            <div className='glass-effect w-full h-full absolute' onClick={props.onHide}></div>
            <div className='flex flex-col bg-c2 w-[500px] min-h-[500px] max-h-[80%] relative rounded-3xl px-3'>
                <div className="shrink-0 flex justify-between items-center py-3">
                    <div className='text-[20px]'>{props.title}</div>
                    <Icon size={'medium'} icons={<IoClose size={24} />} onClick={props.onHide} className={'hover:bg-c3'}/>
                </div>
                <div>{props.children}</div>
            </div>
        </div>
    )
}

export default PopupWrapper