import api from './api';

export interface Welcome {
    id: number;
    title: string;
    subtitle: string;
    imgSrc: string;
    skills: string;
}
 
export const getAllWelcome = async (): Promise<Welcome[]> => {
    const url = '/Welcome/all';
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching Welcome sections:", error);
        throw error;
    }
};

export const getWelcome = async (id: number): Promise<Welcome> => {
    const url = `/Welcome/${id}`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching Welcome section with ID ${id}:`, error);
        throw error;
    }
};

export const updateWelcome = async (welcomeData: Welcome): Promise<Welcome> => {
    const url = `/Welcome`;
    try {
        const response = await api.put(url, { id: 1, imgSrc: welcomeData.imgSrc, title: welcomeData.title, subtitle: welcomeData.subtitle, skills: welcomeData.skills });
        return response.data;
    } catch (error) {
        console.error(`Error updating Welcome section with ID ${welcomeData.id}:`, error);
        throw error;
    }
};