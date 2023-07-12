import React, { useEffect, useState } from "react";
import PopupWrapper from "./PopupWrapper";
import { useAuthContext } from "@/context/auth/authContext";
import { useChatContext } from "@/context/chat/chatContext";
import Image from "next/image";
import { RiErrorWarningLine } from "react-icons/ri";

const DeleteMessagePopup = (props) => {
  const { currentUser } = useAuthContext();
  const { users, dispatch } = useChatContext();
  const [load, setLoad] = useState(false);

  return (
    <PopupWrapper {...props}>
      <div className="mt-10 mb-5">
        <div className="flex items-center justify-center gap-3">
          <RiErrorWarningLine size={24} className="text-red-500" />
          <div className="text-lg">
            Are You sure, You want to delete message
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            className="border-[2px] border-red-700 py-2 px-4 text-sm rounded-md text-red-500 hover:bg-red-700 hover:text-white"
            onClick={() => {props.deleteMessage('DELETED_FOR_ME')}}
          >
            Delete for me
          </button>
          {props.self && (
            <button
              className="border-[2px] border-red-700 py-2 px-4 text-sm rounded-md text-red-500 hover:bg-red-700 hover:text-white"
              onClick={() => {props.deleteMessage('DELETED_FOR_EVERYONE')}}
            >
              Delete for Everyone
            </button>
          )}
          <button
            className="border-[2px] border-white py-2 px-4 text-sm rounded-md text-white hover:bg-white hover:text-black"
            onClick={() => props.deletePopupMessage()}
          >
            Cancel
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
};

export default DeleteMessagePopup;
