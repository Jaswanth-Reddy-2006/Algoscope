import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthSuccess: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userStr = params.get('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                localStorage.setItem('algoscope_token', token);
                localStorage.setItem('algoscope_user', JSON.stringify(user));
                
                // Navigate to dashboard
                navigate('/problems', { replace: true });
            } catch (err) {
                console.error('Failed to parse user data from OAuth redirect', err);
                navigate('/login', { replace: true });
            }
        } else {
            console.error('Missing token or user data in OAuth redirect');
            navigate('/login', { replace: true });
        }
    }, [location, navigate]);

    return (
        <div className="flex-1 min-h-screen flex items-center justify-center bg-[#0c0218]">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-[#EC4186]/20 border-t-[#EC4186] rounded-full animate-spin" />
                <div className="text-center space-y-2">
                    <h2 className="text-white text-xl font-bold tracking-tight">Authenticating...</h2>
                    <p className="text-white/40 text-sm">Syncing your neural profile</p>
                </div>
            </div>
        </div>
    );
};

export default AuthSuccess;
