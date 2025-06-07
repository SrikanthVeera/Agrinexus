import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { OrderProvider } from "./context/OrderContext";

// Layout Components
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Homepage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerPage from "./pages/SellerPage";
import TransportBooking from "./pages/TransportBooking";
import MarketPrice from "./pages/MarketPrice";
import Profile from "./pages/Profile";
import AboutUsPage from "./pages/AboutUsPage";
import Service from "./pages/Service";
import BulkOrderPage from "./pages/BulkOrderPage";
import CartPage from "./pages/CartPage";
import DeliveryPartner from "./pages/DeliveryPartner";
import FarmerDetails from "./pages/FarmerDetails";
import CustomerDetails from "./pages/CustomerDetails";
import CustomerDashboard from "./pages/CustomerDashboard";
import SellerLogin from "./pages/SellerLogin";
import BuyerLogin from "./pages/BuyerLogin";
import PartnerLogin from "./pages/PartnerLogin";
import EntrepreneurLogin from "./pages/EntrepreneurLogin";
import TrackOrder from "./pages/TrackOrder";
import EntrepreneurPage from "./pages/EntrepreneurPage"; // ✅ Correct Import
import DeliveryAddressPage from "./components/DeliveryAddressPage";
import PaymentMethodPage from "./pages/PaymentMethodPage";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import DeliveryLogin from "./pages/DeliveryLogin";
import OrderSuccessPage from "./components/OrderSuccessPage";
import OAuthCallback from './pages/OAuthCallback';
import DemandForecasting from './pages/DemandForecasting';
import MyOrders from "./pages/MyOrders";
import FarmerGroupPage from "./pages/FarmerGroupPage";
import OrderPlaced from "./pages/OrderPlaced";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

// Config
import { routeVisibility } from "./config/routeVisibility";

// Placeholder pages for AGROTECH SPECIAL features
const RatingReview = () => <div style={{padding:40}}><h2>Rating & Review System (Coming Soon)</h2></div>;
const Dispute = () => <div style={{padding:40}}><h2>Dispute Resolution System (Coming Soon)</h2></div>;
const Advisory = () => <div style={{padding:40}}><h2>Crop Advisory System (Coming Soon)</h2></div>;
const Forum = () => <div style={{padding:40}}><h2>Community Forum for Farmers (Coming Soon)</h2></div>;

// Dummy Page
const Contact = () => <div>Contact Page</div>;

// Layout Logic
function Layout({ children }) {
  const location = useLocation();
  const { hideNavbarRoutes, showHeaderRoutes, showFooterRoutes } =
    routeVisibility;

  const showNavbar = !hideNavbarRoutes.includes(location.pathname);
  const showHeader = showHeaderRoutes.includes(location.pathname);
  const showFooter = showFooterRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {showHeader && <Header />}
      <main>{children}</main>
      {showFooter && <Footer />}
    </>
  );
}

// App Routes
function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/buyer/dashboard" element={
          <ProtectedRoute allowedRoles={["Buyer"]}>
            <BuyerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/farmer/dashboard" element={
          <ProtectedRoute allowedRoles={["Seller"]}>
            <SellerPage />
          </ProtectedRoute>
        } />
        <Route path="/transport-booking" element={<TransportBooking />} />
        <Route path="/market-price" element={<MarketPrice />} />
                                <Route path="/profile" element={<Profile />} />
        <Route path="/bulk-order" element={<BulkOrderPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service" element={<Service />} />
        <Route path="/delivery-partner" element={
          <ProtectedRoute allowedRoles={["DeliveryPartner"]}>
            <DeliveryPartner />
          </ProtectedRoute>
        } />
        <Route path="/farmer-details" element={<FarmerDetails />} />
        <Route path="/customer-details" element={<CustomerDetails />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/entrepreneur-details" element={
          <ProtectedRoute allowedRoles={["Entrepreneur"]}>
            <EntrepreneurPage />
          </ProtectedRoute>
        } />
        {/* Role-specific login routes are no longer needed as we handle everything in the main login page */}
        <Route path="/seller" element={
          <ProtectedRoute allowedRoles={["Seller"]}>
            <SellerPage />
          </ProtectedRoute>
        } />
        <Route path="/delivery-address" element={<DeliveryAddressPage />} />
        <Route path="/payment-method" element={<PaymentMethodPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/delivery/login" element={<DeliveryLogin />} />
        <Route path="/order-confirmation" element={<OrderSuccessPage />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/demand-forecast" element={<DemandForecasting />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/rating-review" element={<RatingReview />} />
        <Route path="/dispute" element={<Dispute />} />
        <Route path="/advisory" element={<Advisory />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/farmer-group" element={<FarmerGroupPage />} />
        <Route path="/order-placed" element={<OrderPlaced />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Layout>
  );
}

// Main App
function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <OrderProvider>
              <Toaster position="top-right" />
              <AppRoutes />
            </OrderProvider>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
