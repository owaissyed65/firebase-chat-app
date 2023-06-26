import AuthContext from '@/context/auth/authContext'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <AuthContext >
      <Component {...pageProps} />
    </AuthContext>
  )
}
