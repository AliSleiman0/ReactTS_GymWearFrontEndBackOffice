import api from './api';

export interface About {
    id: number;
    firstP: string;
    secondP: string;
    thirdP: string;
    fourthP: string;
}

// Get all About entries
export const getAllAbout = async (): Promise<About[]> => {
    const url = '/About/all';
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching About sections:", error);
        throw error;
    }
};

// Get single About entry
export const getAbout = async (id: number): Promise<About> => {
    const url = `/About/${id}`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching About section with ID ${id}:`, error);
        throw error;
    }
};

// Update About entry
export const updateAbout = async ( aboutData: About): Promise<About> => {
    const url = `/About`;
    try {
        const response = await api.put(url, {
             id: 1,
            firstP: aboutData.firstP,
            secondP: aboutData.secondP,
            thirdP: aboutData.thirdP,
            fourthP: aboutData.fourthP
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating About section with ID ${aboutData.id}:`, error);
        throw error;
    }
};