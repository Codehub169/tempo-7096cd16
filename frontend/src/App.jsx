import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// Placeholder for Layout component. In a real app, this would import Header and Footer components.
const Layout = () => (
  <div>
    <header style={{ padding: '1rem', backgroundColor: '#fddde6', color: '#3a3a3a', textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
      Plushie Paradise (Header Placeholder)
    </header>
    <main style={{ padding: '1rem', minHeight: 'calc(100vh - 120px)', fontFamily: 'Inter, sans-serif' }}>
      <Outlet /> 
    </main>
    <footer style={{ padding: '1rem', backgroundColor: '#fddde6', color: '#6d6d6d', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
      © 2024 Plushie Paradise. All Rights Reserved. (Footer Placeholder)
    </footer>
  </div>
);

// Placeholder Page Components - these will be replaced by actual page components from ./pages/ later
const HomePage = () => <div style={{textAlign: 'center', padding: '2rem'}}>Welcome to the Home Page! Discover your new plushie friend.</div>;
const ShopPage = () => <div style={{textAlign: 'center', padding: '2rem'}}>Browse our Cuddly Collection!</div>;
const ProductDetailPage = () => <div style={{textAlign: 'center', padding: '2rem'}}>Product Details: Your chosen plushie awaits!</div>;
const CartPage = () => <div style={{textAlign: 'center', padding: '2rem'}}>Your Shopping Cart: Ready to checkout?</div>;
const CheckoutPage = () => <div style={{textAlign: 'center', padding: '2rem'}}>Checkout: Almost there!</div>;
const OrderConfirmationPage = () => <div style={{textAlign: 'center', padding: '2rem'}}>Order Confirmed! Thank you for your purchase.</div>;
const LoginPage = () => <div style={{textAlign: 'center', padding: '2rem'}}>Login to your Plushie Paradise account.</div>;
const SignupPage = () => <div style={{textAlign: 'center', padding: '2rem'}}>Join the Plushie Paradise Club!</div>;
const NotFoundPage = () => <div style={{textAlign: 'center', padding: '2rem'}}>404 - Page Not Found. This plushie seems to have wandered off!</div>;

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
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
