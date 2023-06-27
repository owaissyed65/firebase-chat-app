import React, { useState } from 'react'
import { BiEdit } from 'react-icons/bi'
import { BsCheck, BsFillCheckCircleFill } from 'react-icons/bs'
import { FiPlus } from 'react-icons/fi'
import { IoClose, IoLogOutOutline } from 'react-icons/io5'
import { MdAddAPhoto, MdPhotoCamera, MdDeleteForever } from 'react-icons/md'
import Avatar from './Avatar'
import { useAuthContext } from '@/context/auth/authContext'
import Icon from './Icon'
import { profileColors } from '@/utils/constants'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from '@/firebase/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'

const LeftNav = ({ signOut }) => {
  const userStill = auth.currentUser;
  const { currentUser: user, setCurrentUser } = useAuthContext()
  const [editName, setEditName] = useState(false);
  const [edit, setEdit] = useState(false)
  const handleUpdateProfile = (type, value) => {
    const currentUser = { ...user };
    switch (type) {
      case 'color':
        currentUser.profileColor = value;
        break;
      case 'name':
        currentUser.displayName = value;
        break;
      case 'photo':
        currentUser.profileURL = value;
        break;
      case 'photo-remove':
        currentUser.profileURL = null;
        break;
      default:
        break;
    }
    try {
      toast.promise(
        async () => {
          const userRef = doc(db, 'users', user.uid)
          await updateDoc(userRef, currentUser);
          setCurrentUser(currentUser)
          if (type === 'photo-remove') {
            await updateProfile(userStill, {
              photoURL: null
            })
          }
          if (type === 'name') {
            await updateProfile(userStill, {
              displayName: value
            })
            setEditName(false)
          }
        },
        {
          pending: 'Updating profile',
          success: 'Profile Updated Success',
          error: 'Please add a correct information'
        },
        {
          autoClose: 5000,
          pauseOnHover: false
        }
      )
    } catch (e) {
      console.log(e)
    }
  }
  const eidtProfileContainer = () => {
    const KeyUp = (e) => {
      if (e.target.innerText.trim() !== user?.displayName) {
        // user name is ediited
        setEditName(true)
      } else {
        setEditName(false)
      }
    }
    const KeyDown = (e) => {
      if (e.key === 'Enter' && e.keyCode === 13) {
        e.preventDefault()
      } else {

      }
    }

    return (
      <div className='flex justify-center items-center relative flex-col'>
        <ToastContainer />
        <Icon
          size={'small'}
          className={'absolute top-0  right-5'}
          icons={<IoClose size={24} />}
          onClick={() => { setEdit(false) }}
        />
        <div className="relative group cursor-pointer">
          <Avatar size={'xx-large'} user={user} />
          <div className='w-full h-full absolute top-0 justify-center items-center hidden group-hover:flex rounded-full bg-black/[0.5]'>
            <label htmlFor="ADDINPUTPIC" className='cursor-pointer'>
              {
                user?.photoURL ? <MdPhotoCamera size={34} /> : <MdAddAPhoto size={34} />
              }
            </label>
            <input type="file" id='ADDINPUTPIC' className='hidden' />
            {user?.photoURL && <div className='w-6 h-6 absolute bottom-0 right-0 justify-center items-center hidden group-hover:flex rounded-full bg-red-500'>
              <MdDeleteForever size={14} />
            </div>}
          </div>

        </div>
        <div className='mt-5 flex flex-col justify-center items-center gap-2 w-full h-full'>
          <div className="flex justify-center gap-2 items-center">
            {editName ? <BsFillCheckCircleFill className='cursor-pointer text-c4' onClick={() => {
              let text = document.getElementById('editValue').innerText
              handleUpdateProfile('name', text)
            }} />
              : <BiEdit className='text-c3' />}
            <div
              contentEditable
              onKeyDown={KeyDown}
              onKeyUp={KeyUp}
              className='border-none outline-none bg-transparent text-center'
              id='editValue'
            >{user?.displayName}</div>
          </div>
          <div className="flex justify-center">
            <span className='text-sm text-c3'>{user?.email}</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {
              profileColors.map((color) => (
                <span key={color} className={`w-10 h-10 flex justify-center items-center rounded-full transition-transform hover:scale-125 cursor-pointer `} style={{ backgroundColor: color }} onClick={() => {
                  handleUpdateProfile('color', color)
                }}>
                  {color === user?.profileColor && <BsCheck size={24} />}
                </span>
              ))
            }
          </div>
        </div>
      </div>
    )
  }

  return (

    <div className={`${edit ? 'w-[350px]' : 'w-[80px] items-center'}  flex flex-col justify-between py-5 shrink-0 transition-all`}>

      {
        edit ? (
          eidtProfileContainer()
        ) :
          (
            <div className="relative group cursor-pointer" onClick={() => { setEdit(true) }}>
              <Avatar size='medium' user={user} />
              <div className="absolute top-0 w-full h-full rounded-full bg-black/[0.5] justify-center items-center hidden group-hover:flex">
                <BiEdit size={18} />
              </div>
            </div>
          )
      }

      <div className={`flex gap-5 items-center ${edit ? 'ml-5' : "flex-col"}`}>
        <Icon
          size='large'
          className={'bg-green-500 hover:bg-gray-600'}
          icons={<FiPlus size={24} />}
          onClick={() => { }}
        />
        <Icon
          size='large'
          className={' hover:bg-c2'}
          icons={<IoLogOutOutline size={24} />}
          onClick={signOut}
        />
      </div>
    </div>
  )
}

export default LeftNav
