import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProductsPage from "./pages/Product/ProductsPage";
import PurchasePage from "./pages/Purchase/PurchasePage";
import SalesPage from "./pages/Sales/SalesPage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/PasswordReset/ForgotPassword";
import Layout from "./components/Layout/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WarehousePage from "./pages/Warehouse/WarehousePage";

/**
 * ProtectedRoute component - redirects unauthenticated users to /login
 */
function ProtectedRoute({ children, isAuthenticated }) {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

/**
 * PublicRoute component - redirects authenticated users to /
 * Useful for login, register, and forgot-password pages.
 */
function PublicRoute({ children, isAuthenticated }) {
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
        setLoading(false);

        // Listen for storage changes (login/logout from other tabs)
        const handleStorageChange = () => {
            const updatedToken = localStorage.getItem("token");
            setIsAuthenticated(!!updatedToken);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <BrowserRouter>
                <Routes>
                    {/* Auth Routes */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute isAuthenticated={isAuthenticated}>
                                <Login onLoginSuccess={handleLoginSuccess} />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute isAuthenticated={isAuthenticated}>
                                <Register />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/forgot-password"
                        element={
                            <PublicRoute isAuthenticated={isAuthenticated}>
                                <ForgotPassword />
                            </PublicRoute>
                        }
                    />

                    {/* Protected Area */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="purchase" element={<PurchasePage />} />
                        <Route path="sales" element={<SalesPage />} />
                        <Route path="warehouse" element={<WarehousePage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
