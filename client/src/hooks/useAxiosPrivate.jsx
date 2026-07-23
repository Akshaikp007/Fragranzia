import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { axiosPrivate } from "../axios";
import toast from "react-hot-toast";

const useAxiosPrivate = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (config.data instanceof FormData) {
                    // Delete Content-Type so Axios can automatically set it with the correct boundary
                    delete config.headers["Content-Type"];
                } else if (config.data && !config.headers["Content-Type"]) {
                    config.headers["Content-Type"] = "application/json";
                }

                if (!config.headers['Authorization'] && auth?.accessToken) {
                    config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
                }

                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => {
                return response;
            },
            async error => {
                if (error?.response?.status === 401) {
                    toast.error("Session expired. Please log in again.");
                    logout();
                    navigate("/login");
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth, logout, navigate]);

    return axiosPrivate;
};

export default useAxiosPrivate;