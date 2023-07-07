import { CgAttachment } from 'react-icons/cg'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import Icon from './Icon'
import ComposeBar from './ComposeBar'
import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
import ClickAwayListener from 'react-click-away-listener'
import { useChatContext } from '@/context/chat/chatContext'
import { IoClose } from 'react-icons/io5'
import Image from 'next/image'
import { MdDeleteForever } from 'react-icons/md'

const ChatFooter = () => {
  const [emoji, setEmoji] = useState(false)
  const { isTyping, editMsg, seteditMsg, inputText, setInputText, attachment, setAttachment, attachmentPreview, setAttachmentPreview } = useChatContext()
  const emojiClick = (e) => {
    let text = inputText
    setInputText(text += e.emoji)
  }
  const onFileChange = (e) => {
    const file = e.target.files[0];
    setAttachment(file)
    if(file){
      const blobURL = URL.createObjectURL(file)
      setAttachmentPreview(blobURL)
    }
  }
  return (
    <div className='flex items-center bg-c1/[0.5] p-2 relative rounded-xl '>
     { attachmentPreview &&( <div className='absolute w-[180px] h-[180px] bottom-16 left-3 bg-c1 p-2 rounded-md flex justify-center items-center'>
        <a href={attachmentPreview} target='_blank'><Image src={attachmentPreview} alt="" width={90} height={90} className='rounded-md overflow-hidden' /></a>
        <div className='w-6 h-6 absolute bg-red-500 rounded-full top-0 -right-3 flex justify-center items-center cursor-pointer' onClick={()=>{
          setAttachment(null)
          setAttachmentPreview(null)
        }}>
          <MdDeleteForever size={20}/>
        </div>
      </div>)}
      <div className='shrink-0'>
        <input type="file" name="" id="fileUploader" className='hidden' onChange={onFileChange}/>
        <label htmlFor='fileUploader'>
          <Icon
            size={'large'}
            icons={<CgAttachment
              size={20}
              className='text-c3 cursor-pointer'
            />}
          />
        </label>
      </div>
      <div className='shrink-0 relative '>
        <Icon
          size={'large'}
          icons={<HiOutlineEmojiHappy size={20} className='text-c3' />}
          onClick={() => setEmoji((prev) => !prev)}
          className={'cursor-pointer'}
        />
        {emoji && <ClickAwayListener onClickAway={() => setEmoji(false)}><div className='absolute bottom-12 left-0 shadow-lg'>
          <EmojiPicker
            emojiStyle='native'
            theme='dark'
            onEmojiClick={emojiClick}
            autoFocusSearch={false}
          />
        </div>
        </ClickAwayListener>
        }
      </div>
      {isTyping && <div className="absolute -top-7 left-4 bg-c2 h-6">
        <div className='flex gap-2 w-full h-full opacity-50 text-sm text-white'>
          {'User is typing'}
          <img src="/typing.svg" alt="typing..." />
        </div>
      </div>}
      {editMsg && (<div className='absolute -top-12 left-1/2 -translate-x-1/2 bg-c4 flex items-center gap-2 py-1 px-4 pr-2 rounded-full text-sm font-semibold cursor-pointer shadow-lg' onClick={() => seteditMsg(null)}>
        <span>Edit message</span>
        <IoClose
          className='text-white'
          size={20}
        />
      </div>)}
      <ComposeBar />
    </div>
  )
}

export default ChatFooter
