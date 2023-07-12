import { useChatContext } from "@/context/chat/chatContext";
import Image from "next/image";
import React, { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import ChatFooter from "./ChatFooter";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const Chat = () => {
  const {
    user: specificUser,
    chatId,
    selectedChat,
    users,
    chats,
  } = useChatContext();

  

  return (
    <div className="relative w-full h-full flex flex-col">
      <ChatHeader />
      <Messages />
      <ChatFooter />
      {/* for loading */}
      {!specificUser &&
        !chatId &&
        !selectedChat &&
        Object.values(chats || {})?.length > 0 && (
          <div className="absolute top-0 right-0 w-full h-full flex justify-center items-center">
            <Image
              width={70}
              height={70}
              src={"/loader.svg"}
              alt="Loading..."
            />
          </div>
        )}
    </div>
  );
};

export default Chat;
