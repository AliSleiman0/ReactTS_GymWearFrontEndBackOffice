import api from './api';

// Define User DTO interfaces
export interface AddUserDTO {
    id: number;         // Added to match C# DTO
    name: string;
    email?: string;     // Made optional (string | undefined) since it's nullable in C#
    role: UserRoles;
    password:string
}
export interface UserSignupDTO {
   
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
    role: UserRoles;

}

export interface GetUserDTO {
    id: number;
    name: string;
    email: string;
}

export interface TopSpendingUserDTO {
    userId: number;
    userName: string;
    email: string;
    totalSpent: number;
}
export enum UserRoles {
    Admin = 1,    // admin of the page
    Staff = 2,    //  manage inventory and orders
    Guest = 3,   // limited access to view items
    Customer = 4
}
export interface FullUser {
    id: number;
    name: string;
    createdAt: string;
    email: string;
    role: UserRoles;
}
export const getTopSpendingUserDTO = async (): Promise<TopSpendingUserDTO[]> => {
    const url = '/User/top-spenders';
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
export const getUsers = async (): Promise<FullUser[]> => {
    const url = '/User/FullUsers';
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const getUserById = async (id: number): Promise<GetUserDTO> => {
    const url = `/User/${id}`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error);
        throw error;
    }
};

export const addUser = async (user: UserSignupDTO): Promise<any> => {
    const url = '/user/auth/signup';
    try {
        const response = await api.post(url, user);
        return response.data;
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
};

export const updateUser = async (user: AddUserDTO): Promise<AddUserDTO> => {
    const url = '/User';
    try {
        const response = await api.put(url, user);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const deleteUser = async (id: number): Promise<void> => {
    const url = `/User?id=${id}`;
    try {
        await api.delete(url);
    } catch (error) {
        console.error(`Error deleting user with id ${id}:`, error);
        throw error;
    }
};