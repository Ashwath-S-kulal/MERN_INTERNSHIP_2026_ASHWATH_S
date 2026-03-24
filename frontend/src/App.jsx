import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/admin/Dashboard";
import ScrollToTop from "./components/ScrollToTop";
import Service from "./pages/Service";
import ApplyforService from "./pages/ApplyforService"
import ProviderRoute from "./components/ProviderRoute";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import Requests from "./pages/admin/Requests";
import ProviderData from "./pages/provider/Myjob";
import ServiceMateV2 from "./pages/ServiceMateV2"
import Analytics from "./pages/admin/Analytics";
import Bookings from "./pages/admin/Bookings";
import Customers from "./pages/admin/Customers";
import Providers from "./pages/admin/Providers";
import Review from "./pages/admin/Review";
import Services from "./pages/admin/Services";
import Dashboardpro from "./pages/provider/Dashboard";
import Earnings from "./pages/provider/Earnings";
import Messages from "./pages/provider/Messages";
import Reviewspro from "./pages/provider/Reviews";
import UserDashboard from "./pages/User/UserDashboard"
import UserBookings from "./pages/User/UserBookings"
import UserOrders from "./pages/User/UserOrders";
import UserReviews from "./pages/User/UserReviews";
import UserMessage from "./pages/User/UserMessage";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>


        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/signup" element={<><Navbar /><SignUp /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/service" element={<ProtectedRoute><Navbar /><Service /></ProtectedRoute>} />
        <Route path="/dummy" element={<ProtectedRoute><ServiceMateV2 /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />


        <Route path="/userdashboard" element={<ProtectedRoute><Navbar /><UserDashboard /></ProtectedRoute>}>
          <Route path="applyforservice" element={<ApplyforService />} />
          <Route path="usermessages" element={<UserMessage />} />
          <Route path="userbookings" element={<UserBookings />} />
          <Route path="userorders" element={<UserOrders />} />
          <Route path="userreviews" element={<UserReviews />} />
          <Route path="profile/:userId" element={<Profile />} />
        </Route>


        {/* Admin Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute adminOnly={true}><Navbar /><Dashboard /></ProtectedRoute>}>
          <Route path="request" element={<Requests />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="customers" element={<Customers />} />
          <Route path="providers" element={<Providers />} />
          <Route path="reviews" element={<Review />} />
          <Route path="services" element={<Services />} />
          <Route path="profile/:userId" element={<Profile />} />
        </Route>



        {/* provider Dashboard */}
        <Route path="/provider" element={<ProviderRoute><><Navbar /><ProviderDashboard /></></ProviderRoute>}>
          <Route path="applyforservice" element={<ApplyforService />} />
          <Route path="myjob/:id" element={<ProviderData />} />
          <Route path="dashboardpro" element={<Dashboardpro />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="reviewspro" element={<Reviewspro />} />
          <Route path="profile/:userId" element={<Profile />} />
        </Route>


      </Routes>
    </BrowserRouter>
  );
}
