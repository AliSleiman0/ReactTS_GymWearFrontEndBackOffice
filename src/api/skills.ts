import api from './api';

// Common skill interface
export interface Skill {
    id: number;
    skillName: string;
}

// Generic skill functions
const createSkillApi = (endpoint: string) => ({
    getAll: async (): Promise<Skill[]> => {
        try {
            const response = await api.get(`/${endpoint}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint} skills:`, error);
            throw error;
        }
    },

    get: async (id: number): Promise<Skill> => {
        try {
            const response = await api.get(`/${endpoint}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint} skill with ID ${id}:`, error);
            throw error;
        }
    },
    

    update: async ( skillData: Partial<Skill>): Promise<Skill> => {
        try {
            const response = await api.put(`/${endpoint}`, skillData);
            return response.data;
        } catch (error) {
            console.error(`Error updating ${endpoint} skill with ID ${skillData.id}:`, error);
            throw error;
        }
    },
    // Add a new skill
    add: async (skillData: Omit<Skill, 'id'>): Promise<Skill> => {
        try {
            const response = await api.post(`/${endpoint}`, skillData);
            return response.data;
        } catch (error) {
            console.error(`Error adding ${endpoint} skill:`, error);
            throw error;
        }
    },
    // Delete a skill by ID
    delete: async (id: number): Promise<void> => {
        try {
            await api.delete(`/${endpoint}/${id}`);
        } catch (error) {
            console.error(`Error deleting ${endpoint} skill with ID ${id}:`, error);
            throw error;
        }
    }
});

// Create API instances for each skill type
export const skillsFApi = createSkillApi('SkillsF'); // Front-end skills
export const skillsBApi = createSkillApi('SkillsB'); // Back-end skills
export const skillsGApi = createSkillApi('SkillsG'); // General skills