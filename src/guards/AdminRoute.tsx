import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LogoLoader from '@/components/LogoLoader';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isAdmin, isLoading } = useAuth();

    if (isLoading) {
        return <LogoLoader fullScreen size="lg" />;
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/dashboard" replace />;

    return <>{children}</>;
}
