import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';

function Placeholder({ title }: { title: string }) {
    return (
        <Layout>
            <h1>{title}</h1>
            <p>Coming in later phases.</p>
        </Layout>
    );
}

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Placeholder title="Dashboard" />} />
            <Route path="/transactions" element={<Placeholder title="Transactions" />} />
            <Route path="/login" element={<Placeholder title="Login" />} />
            <Route path="*" element={<Placeholder title="Not Found" />} />
        </Routes>
    );
}