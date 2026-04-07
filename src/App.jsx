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

/** Redirects unauthenticated users to /login */
function ProtectedRoute({ children, isAuthenticated }) {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}

/** Redirects authenticated users away from login/register pages */
function PublicRoute({ children, isAuthenticated }) {
    if (isAuthenticated) return <Navigate to="/" replace />;
    return children;
}

/** Redirects non-admins to dashboard */
function AdminRoute({ children, role }) {
    if (role !== "ROLE_ADMIN") return <Navigate to="/" replace />;
    return children;
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");
        console.log("App.jsx: Initializing auth state", { token: !!token, role: storedRole });
        setIsAuthenticated(!!token);
        setRole(storedRole);
        setLoading(false);

        const handleStorageChange = () => {
            const updatedToken = localStorage.getItem("token");
            const updatedRole = localStorage.getItem("role");
            setIsAuthenticated(!!updatedToken);
            setRole(updatedRole);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLoginSuccess = (userRole) => {
        console.log("App.jsx: Login success, setting role:", userRole);
        setIsAuthenticated(true);
        setRole(userRole);
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
                                <Layout role={role} />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="products" element={<ProductsPage role={role} />} />
                        <Route path="purchase" element={<PurchasePage />} />
                        <Route path="sales" element={<SalesPage />} />

                        {/* Admin-only routes */}
                        <Route
                            path="warehouse"
                            element={
                                <AdminRoute role={role}>
                                    <WarehousePage />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="register"
                            element={
                                <AdminRoute role={role}>
                                    <Register />
                                </AdminRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
