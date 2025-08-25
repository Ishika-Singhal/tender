import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Protected from './components/Protected'

// Public Pages
import Home from './pages/Public/Home'
import About from './pages/Public/About'
import Contact from './pages/Public/Contact'
import Browse from './pages/Public/Browse'
import TenderDetail from './pages/Public/TenderDetail'
import Login from './pages/Public/Login'
import Register from './pages/Public/Register'

// Buyer Pages
import BuyerDashboard from './pages/Buyer/Dashboard'
import MyTenders from './pages/Buyer/MyTenders'
import PostTender from './pages/Buyer/PostTender'
import ViewBids from './pages/Buyer/ViewBids'
import AwardedTenders from './pages/Buyer/AwardedTenders'

// Seller Pages
import SellerDashboard from './pages/Seller/Dashboard'
import SellerBrowse from './pages/Seller/Browse'
import ApplyTender from './pages/Seller/ApplyTender'
import MyBids from './pages/Seller/MyBids'

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard'
import ManageUsers from './pages/Admin/ManageUsers'
import ManageTenders from './pages/Admin/ManageTenders'
import Reports from './pages/Admin/Reports'

// Utility Pages
import Profile from './pages/Utility/Profile'
import Settings from './pages/Utility/Settings'
import Notifications from './pages/Utility/Notifications'
import NotFound from './pages/Utility/NotFound'

function App() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <Navbar />
      <main className="pt-16">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/tenders/:id" element={<TenderDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Buyer Routes */}
          <Route path="/buyer/dashboard" element={
            <Protected roles={['buyer']}>
              <BuyerDashboard />
            </Protected>
          } />
          <Route path="/buyer/tenders" element={
            <Protected roles={['buyer']}>
              <MyTenders />
            </Protected>
          } />
          <Route path="/buyer/post-tender" element={
            <Protected roles={['buyer']}>
              <PostTender />
            </Protected>
          } />
          <Route path="/buyer/tenders/:id/bids" element={
            <Protected roles={['buyer']}>
              <ViewBids />
            </Protected>
          } />
          <Route path="/buyer/awarded" element={
            <Protected roles={['buyer']}>
              <AwardedTenders />
            </Protected>
          } />

          {/* Seller Routes */}
          <Route path="/seller/dashboard" element={
            <Protected roles={['seller']}>
              <SellerDashboard />
            </Protected>
          } />
          <Route path="/seller/browse" element={
            <Protected roles={['seller']}>
              <SellerBrowse />
            </Protected>
          } />
          <Route path="/seller/apply/:id" element={
            <Protected roles={['seller']}>
              <ApplyTender />
            </Protected>
          } />
          <Route path="/seller/bids" element={
            <Protected roles={['seller']}>
              <MyBids />
            </Protected>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <Protected roles={['admin']}>
              <AdminDashboard />
            </Protected>
          } />
          <Route path="/admin/users" element={
            <Protected roles={['admin']}>
              <ManageUsers />
            </Protected>
          } />
          <Route path="/admin/tenders" element={
            <Protected roles={['admin']}>
              <ManageTenders />
            </Protected>
          } />
          <Route path="/admin/reports" element={
            <Protected roles={['admin']}>
              <Reports />
            </Protected>
          } />

          {/* Utility Routes */}
          <Route path="/profile" element={
            <Protected>
              <Profile />
            </Protected>
          } />
          <Route path="/settings" element={
            <Protected>
              <Settings />
            </Protected>
          } />
          <Route path="/notifications" element={
            <Protected>
              <Notifications />
            </Protected>
          } />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
