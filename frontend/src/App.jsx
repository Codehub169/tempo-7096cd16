import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage'; // Import the new NotFoundPage
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import UserAccountPage from './pages/UserAccountPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminPage from './pages/AdminPage'; // Import the new AdminPage

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="product/:productId" element={<ProductDetailPage />} /> 
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="confirmation" element={<OrderConfirmationPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="terms-of-service" element={<TermsOfServicePage />} />
        <Route path="account" element={<UserAccountPage />} />
        <Route path="account/orders" element={<OrderHistoryPage />} />
        <Route path="admin" element={<AdminPage />} /> {/* Add admin route */}
        <Route path="*" element={<NotFoundPage />} /> {/* Use the new NotFoundPage */}
      </Route>
    </Routes>
  );
}

export default App;
