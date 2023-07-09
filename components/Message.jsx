import { useAuthContext } from '@/context/auth/authContext'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { useChatContext } from '@/context/chat/chatContext'
import Image from 'next/image'
import ImageViewer from 'react-simple-image-viewer'
import { formateDate, wrapEmojisInHtmlTag } from '@/utils/helper'
import { Timestamp } from 'firebase/firestore'
import Icon from './Icon'
import { GoChevronDown } from 'react-icons/go'
import MessageMenu from './MessageMenu'
import DeleteMessagePopup from './popup/DeleteMessagePopup'
const Message = ({ message }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { currentUser } = useAuthContext()
  const { users, user, imageViewer, setImageViewer } = useChatContext()
  const self = message?.sender === currentUser?.uid
  const timeStamp = new Timestamp(
    message?.date?.seconds,
    message?.date?.nanoseconds
  )
  const date = timeStamp.toDate();
  return (
    <div className={`mb-5 max-w-[75%] ${self && 'self-end'}`} key={message?.id}>
      {showMenu && <DeleteMessagePopup onHide={() => { setShowMenu(false) }} noHeader={true} shortHeight={true} />}
      <div className={`flex items-end gap-3 ${self ? 'justify-center flex-row-reverse' : ''}`}>
        <Avatar
          size={'small'}
          user={self ? currentUser : users[user?.uid]}
          className='mb-4'
        />
        <div className={`group flex flex-col gap-4 p-4 rounded-3xl relative break-all ${self ? "rounded-br-md bg-c5" : 'rounded-bl-md bg-c1'}`}>
          {message?.text && (
            <div className='text-sm' dangerouslySetInnerHTML={{ __html: wrapEmojisInHtmlTag(message?.text) }}>
            </div>
          )}
          {
            message?.img && (
              <Image
                src={message?.img}
                width={250}
                height={250}
                alt={message?.text || ''}
                className='rounded-3xl max-w-[250px] cursor-pointer'
                onClick={() => {
                  setImageViewer({
                    msgId: message?.id,
                    url: message?.img
                  })
                }}
              />
            )
          }
          {
            imageViewer && (
              <ImageViewer
                src={[imageViewer?.url]}
                currentIndex={0}
                closeOnClickOutside={true}
                disableScroll={false}
                onClose={() => setImageViewer(null)}
              />
            )
          }
          <div className={`${showMenu ? '' : "hidden"} group-hover:flex absolute top-2 ${self ? 'left-2 bg-c5' : 'right-2 bg-c1'}`}>
            <Icon
              size={'medium'}
              className={'bg-inherit rounded-full'}
              icons={<GoChevronDown size={24} className='text-c3' />}
              onClick={() => setShowMenu(true)}
            />
            {showMenu && (<MessageMenu state={{ self, setShowMenu, showMenu }} />)}
          </div>
        </div>
      </div>
      <div className={`flex items-end ${self ? 'justify-start flex-row-reverse mr-12' : 'ml-12'}`}>
        <div className='text-xs text-c3'>
          {formateDate(date)}
        </div>
      </div>
    </div>
  )
}

export default Message
