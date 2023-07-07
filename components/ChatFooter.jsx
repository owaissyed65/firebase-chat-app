import { CgAttachment } from 'react-icons/cg'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import Icon from './Icon'
import ComposeBar from './ComposeBar'
import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
import ClickAwayListener from 'react-click-away-listener'

const ChatFooter = () => {
  const [emoji, setEmoji] = useState(false)
  const emojiClick = (e) => {
    console.log(e)
  }
  return (
    <div className='flex items-center bg-c1/[0.5] p-2 relative rounded-xl'>
      <div className='shrink-0'>
        <input type="file" name="" id="fileUploader" className='hidden' />
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
      <div className='shrink-0 relative'>
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
      <ComposeBar />
    </div>
  )
}

export default ChatFooter
