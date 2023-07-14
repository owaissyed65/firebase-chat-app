import { useAuthContext } from "@/context/auth/authContext";
import { useChatContext } from "@/context/chat/chatContext";
import { db } from "@/firebase/firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import React, { useState } from "react";
import ClickAwayListener from "react-click-away-listener";

const ChatMenu = ({ state: { setShowMenu } }) => {
  const { currentUser } = useAuthContext();
  const { user, users, chatId, chats, setSelectedChat, dispatch } =
    useChatContext();
  const [load, setLoad] = useState(false);
  const handleClick = () => {
    setShowMenu((prev) => !prev);
  };
  const isUserBlocked = users[currentUser?.uid]?.blockedUsers?.find(
    (u) => u === user?.uid
  );
  const iAmBlocked = users[user?.uid]?.blockedUsers?.find(
    (u) => u === currentUser?.uid
  );
  const handleBlock = async (action) => {
    if (action === "block") {
      await updateDoc(doc(db, "users", currentUser?.uid), {
        blockedUsers: arrayUnion(user?.uid),
      });
    }
    if (action === "unblock") {
      await updateDoc(doc(db, "users", currentUser?.uid), {
        blockedUsers: arrayRemove(user?.uid),
      });
    }
    setShowMenu(false);
  };
  const handleDelete = async () => {
    setLoad(true);
    try {
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);
      const updatedMessage = chatDoc?.data()?.message?.map((data) => {
        data.deleteChatInfo = {
          ...data.deleteChatInfo,
          [currentUser?.uid]: true,
        };
        return data;
      });
      await updateDoc(chatRef, {
        message: updatedMessage,
      });
      await updateDoc(doc(db, "userChats", currentUser?.uid), {
        [chatId + ".chatDeleted"]: true,
      });
      const filterChats = Object.entries(chats || {})
        .filter(([id, chat]) => id !== chatId)
        .sort((a, b) => b[1]?.date - a[1]?.date);
      if (filterChats?.length > 0) {
        setSelectedChat(filterChats?.[0]?.[1]?.userInfo);
        dispatch({
          type: "CHANGE_USER",
          payload: filterChats?.[0]?.[1]?.userInfo,
        });
      } else {
        dispatch({ type: "EMPTY" });
      }
      setLoad(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ClickAwayListener onClickAway={handleClick}>
      <div className="absolute right-0 top-[70px] w-[200px] bg-c0 z-10 rounded-md overflow-hidden">
        <ul className="flex flex-col py-2">
          {!iAmBlocked && (
            <li
              className="flex items-center px-5 py-3 rounded-lg hover:bg-black cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleBlock(isUserBlocked ? "unblock" : "block");
              }}
            >
              {isUserBlocked ? "Unblocked" : "Blocked"}
            </li>
          )}
          <li
            className="flex items-center px-5 py-3 rounded-lg hover:bg-black cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            {load ? "Loading...." : "Delete Chat"}
          </li>
        </ul>
      </div>
    </ClickAwayListener>
  );
};

export default ChatMenu;
