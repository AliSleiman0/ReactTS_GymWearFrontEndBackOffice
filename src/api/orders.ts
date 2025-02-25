import api from './api';

// Order DTO Interfaces
export interface SetOrderDTO {
    userId: number;
    orderProducts: SetOrderProductDTO[];
}

export interface SetOrderProductDTO {
    productId: number;
    quantity: number;
    unitPrice: number; // Renamed from 'price'
    color: string;
    size: string;
}

export interface OrderProductDTO {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    color: string;    // Add these
    size: string;     // New properties
}

export interface GetOrderDTO {
    id: number;
    userId: number;
    createdAt: string;
    totalAmount: number;
    orderStatus: string;
    orderProducts: OrderProductDTO[];
    orderDate: string;
}

// Order API functions
export const getOrders = async (): Promise<GetOrderDTO[]> => {
    const url = '/Order';
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export const getOrderById = async (id: number): Promise<GetOrderDTO> => {
    const url = `/Order/order/${id}`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching order with id ${id}:`, error);
        throw error;
    }
};

export const getCustomerOrders = async (customerId: number): Promise<GetOrderDTO[]> => {
    const url = `/Order/customer/${customerId}`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching orders for customer ${customerId}:`, error);
        throw error;
    }
};

export const placeOrder = async (orderData: SetOrderDTO): Promise<GetOrderDTO> => {
    const url = '/Order'; // Updated URL
    try {
        const response = await api.post(url, orderData);
        return response.data;
    } catch (error) {
        console.error("Error placing order:", error);
        throw error;
    }
};

export const updateOrderStatus = async (status: string, orderId: number): Promise<GetOrderDTO> => {
    const url = `/Order`;  // Remove query parameter from URL
    try {
        const response = await api.put(url, {
            orderStatus: status,
            orderId: orderId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
};

export const cancelOrder = async (id: number): Promise<void> => {
    const url = `/Order/${id}`; 
    try {
        await api.delete(url);
    } catch (error) {
        console.error(`Error canceling order with id ${id}:`, error);
        throw error;
    }
};