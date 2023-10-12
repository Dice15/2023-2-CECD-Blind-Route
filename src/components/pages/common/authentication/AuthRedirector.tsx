import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export type AuthState = "idle" | "loggingIn" | "loggingOut";


export const AuthStateContext = React.createContext<AuthState>("idle");
export const SetAuthStateContext = React.createContext<React.Dispatch<React.SetStateAction<AuthState>> | null>(null);



export default function AuthRedirector() {
    // const
    const navigate = useNavigate();

    // state
    const [authState, setAuthState] = useState<AuthState>("idle");

    // authentication 페이지로 리다이텍트
    useEffect(() => {
        navigate('/authentication');
    }, [navigate]);



    return (
        <AuthStateContext.Provider value={authState}>
            <SetAuthStateContext.Provider value={setAuthState}>
            </SetAuthStateContext.Provider>
        </AuthStateContext.Provider>
    );
};