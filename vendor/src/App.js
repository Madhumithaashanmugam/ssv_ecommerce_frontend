import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/DashBoard';

import AddCategory from './components/category/category';
import { AuthProvider } from './components/Context/AuthContext';
import AddItem from './components/Items/items';
import PendingOrders from './components/PendingOrders/pendingOrder';
import ActiveOrders from './components/ActiveOrders/ActiveOrders';
import Analytics from './components/Analytics/Analytics';
import OrdersByStatus from './components/Analytics/OrderByStatus';
import ViewOrder from './components/Analytics/ViewOrder';
import AllItems from './components/AllTems/AllItems';
import CompletedOrders from './components/Completed/Completed';
import DeclinedOrders from './components/DeclinedOrders/DeclinedOrders';
import RequestOtpPage from './components/SignUp/RequestOTP/RequestOTP';
import VerifyOtpPage from './components/SignUp/VerifyOTP/VerifyOTP';
import VendorSignupPage from './components/SignUp/SignUp/SignUp';
import VendorSigninPage  from './components/SignIn/SignIn/SignIn';
import OfflineOrder from './components/OfflineOrder/OfflineOrder';
import VendorOtpVerification from './components/SignIn/VerifyOTP/VerifyOTP';
import OrderSuccess from './components/OrderSuccess/OrderSuccess';
import ListOrders from './components/ListOrders/ListOrders';
import ReturnedOrders from './components/ReturnedOrders/ReturnedOrders';
import UserDetails from './components/UserDetails/UserDetails';
import ProtectedRoute from './ProtectRoute';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import VerifyOtp from './components/ForgotPassword/VerifyOTP';
import ResetPassword from './components/ForgotPassword/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/vendor/request-otp" element={<RequestOtpPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/vendor-signup" element={<VendorSignupPage />} />
        <Route path="/vendor-signin" element={<VendorSigninPage />} />
        <Route path="/otp-verification" element={<VendorOtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp-forgot" element={<VerifyOtp/>}/>
        <Route path="/reset-password-forgot" element={<ResetPassword/>}/>
        {/* Protected routes below */}
        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/add-category" element={
          <ProtectedRoute><AddCategory /></ProtectedRoute>
        } />
        <Route path='/items' element={
          <ProtectedRoute><AddItem /></ProtectedRoute>
        } />
        <Route path="/all-items" element={
          <ProtectedRoute><AllItems /></ProtectedRoute>
        } />
        <Route path="/orders/pending" element={
          <ProtectedRoute><PendingOrders /></ProtectedRoute>
        } />
        <Route path="/orders/accepted" element={
          <ProtectedRoute><ActiveOrders /></ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute><Analytics /></ProtectedRoute>
        } />
        <Route path="/view-order/:orderId" element={
          <ProtectedRoute><ViewOrder /></ProtectedRoute>
        } />
        <Route path="/orders/status/:status" element={
          <ProtectedRoute><OrdersByStatus /></ProtectedRoute>
        } />
        <Route path="/orders/completed" element={
          <ProtectedRoute><CompletedOrders /></ProtectedRoute>
        } />
        <Route path="/orders/declined" element={
          <ProtectedRoute><DeclinedOrders /></ProtectedRoute>
        } />
        <Route path="/orders/returned" element={
          <ProtectedRoute><ReturnedOrders /></ProtectedRoute>
        } />
        <Route path="/orders/success" element={
          <ProtectedRoute><OrderSuccess /></ProtectedRoute>
        } />
        <Route path="/orders/list" element={
          <ProtectedRoute><ListOrders /></ProtectedRoute>
        } />
        <Route path="/orders/place-order" element={
          <ProtectedRoute><OfflineOrder /></ProtectedRoute>
        } />
        <Route path="/vendor/details" element={
          <ProtectedRoute><UserDetails /></ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
