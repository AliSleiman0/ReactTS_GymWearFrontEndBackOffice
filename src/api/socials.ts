import api from './api';

export interface Social {
    id: number;
    linkedinUrl: string;
    githubUrl: string;
    instaUrl: string;
}

export const getAllSocials = async (): Promise<Social[]> => {
    const url = '/Socials';
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching socials:", error);
        throw error;
    }
};

export const getSocial = async (id: number): Promise<Social> => {
    const url = `/Socials/${id}`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching social with ID ${id}:`, error);
        throw error;
    }
};

export const updateSocial = async (id: number, socialData: Partial<Social>): Promise<Social> => {
    const url = `/Socials/${id}`;
    try {
        const response = await api.put(url, socialData);
        return response.data;
    } catch (error) {
        console.error(`Error updating social with ID ${id}:`, error);
        throw error;
    }
};