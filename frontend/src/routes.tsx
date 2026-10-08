// import { Routes, Route, Navigate } from 'react-router-dom';
// import { Layout } from './components/Layout';

// function Placeholder({ title }: { title: string }) {
//     return (
//         <Layout>
//             <h1>{title}</h1>
//             <p>Coming in later phases.</p>
//         </Layout>
//     );
// }

// export function AppRoutes() {
//     return (
//         <Routes>
//             <Route path="/" element={<Placeholder title="Dashboard" />} />
//             <Route path="/transactions" element={<Placeholder title="Transactions" />} />
//             <Route path="/login" element={<Placeholder title="Login" />} />
//             <Route path="*" element={<Placeholder title="Not Found" />} />
//         </Routes>
//     );
// }

// import { Routes, Route, Navigate } from 'react-router-dom';
// import { Layout } from './components/Layout';
// import { RequireAuth } from './features/auth/RequireAuth';
// import { LoginPage } from './features/auth/LoginPage';
// import { RegisterPage } from './features/auth/RegisterPage';

// function Placeholder({ title }: { title: string }) {
//     return <h1>{title}</h1>;
// }

// function PublicOnly({ children }: { children: React.ReactNode }) {
//     const token = localStorage.getItem('auth_token');
//     if (token) return <Navigate to="/" replace />;
//     return <>{children}</>;
// }

// export function AppRoutes() {
//     return (
//         <Routes>
//             {/* Public routes */}
//             <Route
//                 path="/login"
//                 element={
//                     <PublicOnly>
//                         <LoginPage />
//                     </PublicOnly>
//                 }
//             />
//             <Route
//                 path="/register"
//                 element={
//                     <PublicOnly>
//                         <RegisterPage />
//                     </PublicOnly>
//                 }
//             />

//             {/* Protected routes: RequireAuth renders <Outlet /> inside <Layout /> */}
//             <Route element={<RequireAuth />}>
//                 <Route
//                     element={
//                         <Layout>
//                             <Routes>
//                                 <Route path="/" element={<Placeholder title="Dashboard" />} />
//                                 <Route path="/transactions" element={<Placeholder title="Transactions" />} />
//                             </Routes>
//                         </Layout>
//                     }
//                 />
//             </Route>

//             <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//     );
// }


// import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// import { Layout } from './components/Layout';
// import { RequireAuth } from './features/auth/RequireAuth';
// import { LoginPage } from './features/auth/LoginPage';
// import { RegisterPage } from './features/auth/RegisterPage';

// function Placeholder({ title }: { title: string }) {
//     return <h1>{title}</h1>;
// }

// function PublicOnly() {
//     const token = localStorage.getItem('auth_token');
//     if (token) return <Navigate to="/" replace />;
//     return <Outlet />;
// }

// function ProtectedLayout() {
//     return (
//         <Layout>
//             <Outlet />
//         </Layout>
//     );
// }

// export function AppRoutes() {
//     return (
//         <Routes>
//             {/* Public routes */}
//             <Route element={<PublicOnly />}>
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route path="/register" element={<RegisterPage />} />
//             </Route>

//             {/* Protected routes: RequireAuth -> Layout -> page */}
//             <Route element={<RequireAuth />}>
//                 <Route element={<ProtectedLayout />}>
//                     <Route path="/" element={<Placeholder title="Dashboard" />} />
//                     <Route path="/transactions" element={<Placeholder title="Transactions" />} />
//                 </Route>
//             </Route>

//             <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//     );
// }


import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RequireAuth } from './features/auth/RequireAuth';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { TransactionsPage } from './features/transactions/TransactionsPage';
import { TransactionFormPage } from './features/transactions/TransactionFormPage';

function Placeholder({ title }: { title: string }) {
    return <h1>{title}</h1>;
}

function PublicOnly() {
    const token = localStorage.getItem('auth_token');
    if (token) return <Navigate to="/" replace />;
    return <Outlet />;
}

function ProtectedLayout() {
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<PublicOnly />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<RequireAuth />}>
                <Route element={<ProtectedLayout />}>
                    <Route path="/" element={<Placeholder title="Dashboard" />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/transactions/new" element={<TransactionFormPage />} />
                    <Route path="/transactions/:id/edit" element={<TransactionFormPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}