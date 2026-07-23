import React from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const UserService = () => {

    const axiosPrivate = useAxiosPrivate()


// ======================================== branch management ========================================

    const getProduct = async (page = null, limit = null) => {
        const url = page && limit ? `/api/products?page=${page}&limit=${limit}` : "/api/products";
        const response = await axiosPrivate.get(url);
        return response.data;
    };

    const getCategories = async () => {
        const response = await axiosPrivate.get("/api/categories");
        return response.data;
    };

    const postProduct= async (data) => {
        const response = await axiosPrivate.post("/api/products", data);
        return response.data;
    };

    const putProduct = async (productId, data) => {
        const response = await axiosPrivate.put(`/api/products/${productId}`, data);
        return response.data;
    };

    const deleteProduct = async (productId) => {
        const response = await axiosPrivate.delete(`/api/products/${productId}`);
        return response.data;
    };

    const getDashboardStats = async () => {
        const response = await axiosPrivate.get("/api/orders/admin/dashboard-stats");
        return response.data;
    };

    const getCustomers = async () => {
        const response = await axiosPrivate.get("/api/auth/admin/customers");
        return response.data;
    };

    const toggleCustomerStatus = async (customerId) => {
        const response = await axiosPrivate.put(`/api/auth/admin/customers/${customerId}/status`);
        return response.data;
    };

    return { 
        getProduct,
        getCategories,
        postProduct,
        putProduct,
        deleteProduct,
        getDashboardStats,
        getCustomers,
        toggleCustomerStatus
    };
};

export default UserService;