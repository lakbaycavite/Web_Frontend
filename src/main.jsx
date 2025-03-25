import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PostsContextProvider } from './context/postContext.jsx'
import { EventsContextProvider } from './context/eventContext.jsx'
import { UsersContextProvider } from './context/userContext.jsx'
import { AuthContextProvider } from './context/authContext.jsx'
import { HotlineContextProvider } from './context/hotlineContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HotlineContextProvider>
      <AuthContextProvider>
        <UsersContextProvider>
          <EventsContextProvider>
            <PostsContextProvider>
              <App />
            </PostsContextProvider>
          </EventsContextProvider>
        </UsersContextProvider>
      </AuthContextProvider>
    </HotlineContextProvider>
  </StrictMode>,
)
