import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import CreateGuestUser from './Component/GuestUser/GuestUsers';
import ForgotPassword from './Component/ForgotPassword/ForgotPassword';
import VerifyOTP from './Component/ForgotPassword/verifyOTP';
import ResetPassword from './Component/ForgotPassword/ResetPassword';
import MainPage from './Component/MainPage/MainPage';
import UserDetails from './Component/UserDetails/user_details';
import SignUpPage from './Component/SIgnUP/SignUp';
import Register from './Component/Register/Register'; 
import RegisterVerifyOTP from './Component/Register/VerifyOtp';
import ItemDetail from './Component/MainPage/ItemDetails';
import CategoryPage from './Component/MainPage/Category';
import AddressForm from './Component/UserDetails/AddressForm';
import CartPage from './Component/Cart/Cart';
import OrderSuccessPage from './Component/Order/Order';
import PastOrders from './Component/PastOrders/PastOrders';
import UpdateUser from './Component/UserDetails/UpdateUser';

const App = () => {
  return (
    <Routes>
      <Route path="/signin" element={<HomePage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<MainPage />} />
      <Route path="/item/:id" element={<ItemDetail />} />
      <Route path="/user-details" element={<UserDetails />} />
      <Route path="/category/:id" element={<CategoryPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/signup-register" element={<Register />} />
      <Route path="/register" element={<VerifyOTP />} />
      <Route path="/add-address" element={<AddressForm />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/update-user" element={<UpdateUser />} />
      <Route path="/update-address/:addressId" element={<AddressForm />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/past-orders" element={<PastOrders />} />
      <Route path="/register/verify-otp" element={<RegisterVerifyOTP />} />
      <Route path="/guest-user" element={<CreateGuestUser />} />
     </Routes>
  );
};

export default App;
