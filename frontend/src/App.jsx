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
// Removed import NotFoundPage from './pages/NotFoundPage'; as it's not used and DefaultNotFoundPage is used instead.

// Placeholder for NotFoundPage if not fully implemented in ./pages/
const DefaultNotFoundPage = () => <div style={{textAlign: 'center', padding: '2rem'}}>404 - Page Not Found. This plushie seems to have wandered off!</div>;

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
        {/* 
          If NotFoundPage.jsx exists and is correctly implemented in src/pages, use: 
          <Route path="*" element={<NotFoundPage />} /> 
          Otherwise, use the placeholder:
        */}
        <Route path="*" element={<DefaultNotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
