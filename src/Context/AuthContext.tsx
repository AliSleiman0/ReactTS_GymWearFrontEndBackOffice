import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define types for the auth context
export enum UserRoles {
    Admin = 1,    // Admin of the page
    Staff = 2,    // Manage inventory and orders
    Guest = 3,    // Limited access to view items
    Customer = 4  // Regular customer
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRoles; // Ensure role is strictly of type UserRoles
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (signupData: SignupData) => Promise<void>;
    logout: () => void;
}

interface SignupData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Create the AuthContext with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        // Check that storedUser exists and is not the string "undefined"
        if (storedToken && storedUser && storedUser !== "undefined") {
            try {
                setAccessToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing stored user:", error);
                // Optionally clear the invalid value:
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);


    // Login function
    const login = async (email: string, password: string): Promise<any> => {
        try {
            const { data } = await axios.post<{ userInfo: User; token: string }>(
                'https://localhost:7250/api/user/auth/login',
                { email, password }
            );

            // Save to local storage
            localStorage.setItem('accessToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.userInfo));

            // Update state
            setUser(data.userInfo);
            setAccessToken(data.token);

            // Return user info
            return data.userInfo;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Login failed');
            } else {
                throw new Error('An unexpected error occurred');
            }
        }
    };

    // Signup function
    const signup = async (signupData: SignupData) => {
        try {
            const { data } = await axios.post<{ user: User; accessToken: string }>(
                'https://localhost:7250/api/user/auth/signup',
                signupData
            );
            localStorage.setItem('accessToken', data.accessToken);
            setUser(data.user);
            setAccessToken(data.accessToken);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Signup failed');
            } else {
                throw new Error('An unexpected error occurred');
            }
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
        setAccessToken(null);
    };

    // Provide auth state and methods to children
    return (
        <AuthContext.Provider value={{ user, accessToken, loading, login, signup, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};