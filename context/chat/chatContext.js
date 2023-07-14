import { createContext, useContext, useReducer, useState } from "react";
import { useAuthContext } from "../auth/authContext";

const Context = createContext();
const ChatContext = ({ children }) => {
  const { currentUser } = useAuthContext();
  const initialState = {
    chatId: "",
    user: null,
  };
  const chatReducer = (state, action) => {
    // const { currentUser } = useAuthContext()
    switch (action.type) {
      case "CHANGE_USER":
        return {
          ...state,
          user: action.payload,
          chatId:
            currentUser.uid > action?.payload?.uid
              ? currentUser.uid + action?.payload?.uid
              : action?.payload?.uid + currentUser.uid,
        };
      case "EMPTY":
        return initialState;
      default:
        return state;
    }
  };
  const resetFooterStats = () => {
    setInputText("");
    setAttachment(null);
    setAttachmentPreview(null);
    seteditMsg(null);
    setImageViewer(null);
  };
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const [users, setUsers] = useState({});
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputText, setInputText] = useState("");
  const [attachment, setAttachment] = useState([]);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [editMsg, seteditMsg] = useState(null);
  const [isTyping, setIsTyping] = useState(null);
  const [imageViewer, setImageViewer] = useState(null);

  return (
    <Context.Provider
      value={{
        ...state,
        users,
        setUsers,
        dispatch,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        inputText,
        setInputText,
        attachment,
        setAttachment,
        attachmentPreview,
        setAttachmentPreview,
        editMsg,
        seteditMsg,
        isTyping,
        setIsTyping,
        imageViewer,
        setImageViewer,
        resetFooterStats,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ChatContext;
export const useChatContext = () => {
  return useContext(Context);
};
