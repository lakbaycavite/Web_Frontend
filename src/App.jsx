// import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'

import NavbarModifier from './shared/components/NavbarModifier'
import Navbar from './shared/components/Navbar'
import Home from './user/pages/Home'
import Login from './user/pages/Login'
import Register from './user/pages/Register'
import About from './user/pages/About'
import Contacts from './user/pages/Contacts'

// admin
import Events from './admin/pages/Events'
// import EventDisplay from './admin/pages/EventDisplay'
import Posts from './admin/pages/Posts'
import PostDisplay from './admin/pages/PostDisplay'
import Users from './admin/pages/Users'
import UserDisplay from './admin/pages/UserDisplay'
import Hotlines from './admin/pages/Hotlines'
import Dashboard from './admin/pages/Dashboard'
import { useAuthContext } from './hooks/useAuthContext'
import ForgotPassword from './user/pages/ForgetPassword'
import ResetPassword from './user/pages/ResetPassword'
import TermsOfUse from './user/pages/TermsOfUse'
import PrivacyPolicy from './user/pages/PrivacyPolicy'
import PageNotFound from './user/pages/NotFound'


function App() {

  const { user } = useAuthContext()

  // console.log(user)
  return (
    <ToastProvider>

      <div className='main-body'>
        <BrowserRouter>

          <NavbarModifier>
            <Navbar />
          </NavbarModifier>

          <Routes>
            {/* redirection */}

            <Route path="/" element={<Navigate to="/home" />} />

            <Route path='/home' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contacts' element={<Contacts />} />
            <Route
              path='/login'
              element={!user ? <Login /> : <Navigate to='/home' />} />
            <Route
              path="/forgot-password"
              element={!user ? <ForgotPassword /> : <Navigate to='/home' />} />
            <Route
              path="/reset-password"
              element={!user ? <ResetPassword /> : <Navigate to='/home' />} />

            <Route
              path='/register'
              element={!user ? <Register /> : <Navigate to='/home' />} />

            <Route path='/admin/dashboard'
              exact
              element={user && user.role == 'admin' ? <Dashboard /> : <Navigate to='/login' />} />

            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />


            <Route
              path='/admin/event'
              exact
              element={user && user.role === 'admin' ? <Events /> : <Navigate to='/login' />} />

            <Route
              path='/admin/hotline'
              exact
              element={user && user.role == 'admin' ? <Hotlines /> : <Navigate to='/login' />} />

            <Route path='/admin/post'
              exact
              element={user && user.role == 'admin' ? <Posts /> : <Navigate to='/login' />}
            />
            <Route path='/post/display/:id'
              exact
              element={user && user.role == 'admin' ? < PostDisplay /> : <Navigate to='/login' />} />
            <Route path='/admin/user'
              exact
              element={user && user.role == 'admin' ? <Users /> : <Navigate to='/login' />} />
            <Route path='/user/display/:id'
              exact
              element={user && user.role == 'admin' ? <UserDisplay /> : <Navigate to='/login' />} />

            <Route path="*" element={<PageNotFound />} />

          </Routes>
        </BrowserRouter>

      </div>
    </ToastProvider>

  )
}

export default App
