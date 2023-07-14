import { useChatContext } from "@/context/chat/chatContext";
import Image from "next/image";
import React, { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import ChatFooter from "./ChatFooter";
import { useAuthContext } from "@/context/auth/authContext";

const Chat = () => {
  const { user, chatId, selectedChat, users, chats } = useChatContext();

  const { currentUser } = useAuthContext();

  const isUserBlocked = users[currentUser?.uid]?.blockedUsers?.find(
    (u) => u === user?.uid
  );
  const iAmBlocked = users[user?.uid]?.blockedUsers?.find(
    (u) => u === currentUser?.uid
  );
  return (
    <div className="relative w-full h-full flex flex-col">
      <ChatHeader />
      {chatId && <Messages />}
      {!isUserBlocked && !iAmBlocked && <ChatFooter />}

      {isUserBlocked && (
        <div className="w-full text-center py-5 text-c3">
          {user?.displayName} has been blocked{" "}
        </div>
      )}
      {iAmBlocked && (
        <div className="w-full text-center py-5 text-c3">
          {user?.displayName} has blocked you{" "}
        </div>
      )}
      {/* for loading */}
      {!user &&
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
