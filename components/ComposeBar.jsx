import { useAuthContext } from "@/context/auth/authContext";
import { useChatContext } from "@/context/chat/chatContext";
import { db, storage } from "@/firebase/firebase";
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { TbSend } from "react-icons/tb";
import { v4 as uuid } from "uuid";
const ComposeBar = () => {
  let timeout = null;
  const {
    inputText,
    setInputText,
    chatId,
    user,
    attachment,
    setAttachment,
    setAttachmentPreview,
    attachmentPreview,
    editMsg,
    seteditMsg,
  } = useChatContext();
  const { currentUser } = useAuthContext();
  const [load, setLoad] = useState(false);
  useEffect(() => {
    setInputText(editMsg?.text || "");
  }, [editMsg]);
  const keyHandle = (e) => {
    if (
      (e.key === "Enter" || e.keyCode === 13) &&
      (inputText || attachmentPreview)
    ) {
      editMsg ? handleEdit() : handleSubmit();
    }
  };
  const handleSubmit = async () => {
    setLoad(true);
    if (attachmentPreview) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, attachment);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error(error);
        },
        () => {
          setLoad(false);
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
            await updateDoc(doc(db, "chats", chatId), {
              message: arrayUnion({
                id: uuid(),
                text: inputText,
                sender: currentUser?.uid,
                date: Timestamp.now(),
                read: false,
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", chatId), {
        message: arrayUnion({
          id: uuid(),
          text: inputText,
          sender: currentUser?.uid,
          date: Timestamp.now(),
          read: false,
        }),
      });
    }

    try {
      let msg = { text: inputText };
      if (attachmentPreview) {
        msg.image = true;
      }
      await updateDoc(doc(db, "userChats", currentUser?.uid), {
        [chatId + ".lastMessage"]: msg,
        [chatId + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "userChats", user?.uid), {
        [chatId + ".lastMessage"]: msg,
        [chatId + ".date"]: serverTimestamp(),
      });
      setAttachment(null);
      setAttachmentPreview(null);
      setLoad(false);
      setInputText("");
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = async () => {
    setLoad(true);
    const chatRef = doc(db, "chats", chatId);
    const chatData = await getDoc(chatRef);
    if (attachmentPreview) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, attachment);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error(error);
        },
        () => {
          setLoad(false);
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
            let updatedMessage = chatData?.data()?.message?.map((m) => {
              if (m?.id === editMsg?.id) {
                return {
                  ...m,
                  text: inputText,
                  img: downloadURL,
                };
              }
              return m;
            });
            await updateDoc(chatRef, {
              message: updatedMessage,
            });
          });
        }
      );
    } else {
      let updatedMessage = chatData?.data()?.message?.map((m) => {
        if (m?.id === editMsg?.id) {
          return {
            ...m,
            text: inputText,
          };
        }
        return m;
      });
      await updateDoc(chatRef, {
        message: updatedMessage,
      });
    }
    setInputText("");
    seteditMsg(null);
    setAttachment(null);
    setAttachmentPreview(null);
    setLoad(false);
  };
  const isTypingHandler = async (e) => {
    setInputText(e.target.value);
    await updateDoc(doc(db, "chats", chatId), {
      [`typing.${currentUser?.uid}`]: true,
    });
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(async () => {
      await updateDoc(doc(db, "chats", chatId), {
        [`typing.${currentUser?.uid}`]: false,
      });
    }, 500);
  };
  return (
    <div className="flex items-center gap-2 grow h-full">
      <input
        type="text"
        value={inputText}
        onChange={(e) => isTypingHandler(e)}
        onKeyUp={keyHandle}
        className="text-c3 outline-none border-none w-full h-full placeholder:text-c3 bg-transparent px-1 grow"
        placeholder="Text a message..."
      />
      <button
        className={`h-10 w-10 rounded-md ${
          attachmentPreview || inputText.trim()?.length > 0
            ? "bg-c4 cursor-pointer"
            : "cursor-not-allowed"
        } ${load && "cursor-not-allowed"} flex justify-center items-center`}
        onClick={editMsg ? handleEdit : handleSubmit}
        disabled={
          !(inputText.trim().length > 0 || attachmentPreview) ? true : false
        }
      >
        {load ? (
          <Image src="/loader.svg" height={20} width={20} alt="loading..." />
        ) : (
          <TbSend size={20} />
        )}
      </button>
    </div>
  );
};

export default ComposeBar;
