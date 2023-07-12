import { useAuthContext } from "@/context/auth/authContext";
import React, { useState } from "react";
import Avatar from "./Avatar";
import { useChatContext } from "@/context/chat/chatContext";
import Image from "next/image";
import ImageViewer from "react-simple-image-viewer";
import { formateDate, wrapEmojisInHtmlTag } from "@/utils/helper";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import Icon from "./Icon";
import { GoChevronDown } from "react-icons/go";
import MessageMenu from "./MessageMenu";
import DeleteMessagePopup from "./popup/DeleteMessagePopup";
import { db } from "@/firebase/firebase";
import { DELETED_FOR_EVERYONE, DELETED_FOR_ME } from "@/utils/constants";
const Message = ({ message }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const { currentUser } = useAuthContext();
  const {
    users,
    user,
    imageViewer,
    setImageViewer,
    chatId,
    editMsg,
    seteditMsg,
    
  } = useChatContext();
  const self = message?.sender === currentUser?.uid;
  const timeStamp = new Timestamp(
    message?.date?.seconds,
    message?.date?.nanoseconds
  );
  const date = timeStamp.toDate();
  const deletePopupMessage = () => {
    setShowMenu(false);
    setShowDeletePopup((prev) => !prev);
  };
  const deleteMessage = async (action) => {
    try {
      const msgId = message?.id;
      const chatRef = doc(db, "chats", chatId);
      const getData = await getDoc(chatRef);
      const updatedData = getData?.data()?.message?.map((m) => {
        if (m.id === msgId) {
          if (action === DELETED_FOR_ME) {
            return {
              ...m,
              deletedInfo: {
                [currentUser?.uid]: DELETED_FOR_ME,
              },
            };
          }
          if (action === DELETED_FOR_EVERYONE) {
            return {
              ...m,
              deletedInfo: {
                deletedForEveryOne: true,
              },
            };
          }
        } else {
          return m;
        }
      });

      await updateDoc(chatRef, { message: updatedData });
      setShowDeletePopup((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className={`mb-5 max-w-[75%] ${self && "self-end"}`} key={message?.id}>
      {showDeletePopup && (
        <DeleteMessagePopup
          deletePopupMessage={deletePopupMessage}
          noHeader={true}
          shortHeight={true}
          self={self}
          deleteMessage={deleteMessage}
        />
      )}
      <div
        className={`flex items-end gap-3 ${
          self ? "justify-center flex-row-reverse" : ""
        }`}
      >
        <Avatar
          size={"small"}
          user={self ? currentUser : users[user?.uid]}
          className="mb-4"
        />
        <div
          className={`group flex flex-col gap-4 p-4 rounded-3xl relative break-all ${
            self ? "rounded-br-md bg-c5" : "rounded-bl-md bg-c1"
          }`}
        >
          {message?.text && (
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: wrapEmojisInHtmlTag(message?.text),
              }}
            ></div>
          )}
          {message?.img && (
            <Image
              src={message?.img}
              width={250}
              height={250}
              alt={message?.text || ""}
              className="rounded-3xl max-w-[250px] cursor-pointer"
              onClick={() => {
                setImageViewer({
                  msgId: message?.id,
                  url: message?.img,
                });
              }}
            />
          )}
          {imageViewer && (
            <ImageViewer
              src={[imageViewer?.url]}
              currentIndex={0}
              closeOnClickOutside={true}
              disableScroll={false}
              onClose={() => setImageViewer(null)}
            />
          )}
          <div
            className={`${
              showMenu ? "" : "hidden"
            } group-hover:flex absolute top-2 ${
              self ? "left-2 bg-c5" : "right-2 bg-c1"
            }`}
          >
            <Icon
              size={"medium"}
              className={"bg-inherit rounded-full"}
              icons={<GoChevronDown size={24} className="text-c3" />}
              onClick={() => setShowMenu(true)}
            />
            {showMenu && (
              <MessageMenu
                state={{
                  self,
                  setShowMenu,
                  showMenu,
                  deletePopupMessage,
                  editMsgHandler: () => {
                    seteditMsg(message)
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div
        className={`flex items-end ${
          self ? "justify-start flex-row-reverse mr-12" : "ml-12"
        }`}
      >
        <div className="text-xs text-c3">{formateDate(date)}</div>
      </div>
    </div>
  );
};

export default Message;
