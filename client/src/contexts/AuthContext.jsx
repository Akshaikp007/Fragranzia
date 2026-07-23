import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const accessToken = localStorage.getItem("accessToken");
        const image = localStorage.getItem("profileImage");
        const name = localStorage.getItem("name");
        const role = localStorage.getItem("role");
        const id = localStorage.getItem("userId");

        if (accessToken && role) {
            return { accessToken, role, image, name, id };
        }
        return {};
    });

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("profileImage");
        localStorage.removeItem("name");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        setAuth({});
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};