import { useChatContext } from "@/context/chat/chatContext";
import { db } from "@/firebase/firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { useAuthContext } from "@/context/auth/authContext";
import { DELETED_FOR_ME } from "@/utils/constants";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { chatId, user, setIsTyping, selectedChat } = useChatContext();
  const { currentUser } = useAuthContext();
  const ref = useRef();
  const topToScroll = () => {
    ref.current.scrollTop = ref.current.scrollHeight;
  };
  useEffect(() => {
    const unsub =
      chatId &&
      onSnapshot(doc(db, "chats", chatId), (data) => {
        if (data.exists()) {
          setMessages(data.data().message);
          setIsTyping(data.data()?.typing?.[user?.uid] || false);
        }
        setTimeout(() => {
          topToScroll();
        }, 0);
      });
    return () => chatId && unsub();
  }, [chatId]);

  return (
    <div className="grow p-5 overflow-auto scrollbar flex flex-col" ref={ref}>
      {messages
        ?.filter((m) => {
          return (
            m?.deletedInfo?.[currentUser?.uid] !== DELETED_FOR_ME &&
            !m?.deletedInfo?.deletedForEveryOne &&
            !m?.deleteChatInfo?.[currentUser?.uid]
          );
        })
        .map((m) => {
          return <Message message={m} />;
        })}
    </div>
  );
};

export default Messages;
