import AuthContext from '@/context/auth/authContext'
import ChatContext from '@/context/chat/chatContext'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <AuthContext >
      <ChatContext>
        <Component {...pageProps} />
      </ChatContext>
    </AuthContext>
  )
}
