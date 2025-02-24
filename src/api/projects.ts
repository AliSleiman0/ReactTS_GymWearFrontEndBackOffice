import api from './api';

export interface BaseProject {
    id: number;
    title: string;
    description: string;
    techUsed: string;
    githubUrl?: string;
    liveDemoUrl?: string;
    imgSrc: string;
}

const createProjectApi = <T extends BaseProject>(endpoint: string) => ({
    // Get all projects
    getAll: async (): Promise<T[]> => {
        try {
            const response = await api.get(`/${endpoint}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint} projects:`, error);
            throw error;
        }
    },

    // Get a specific project by ID
    get: async (id: number): Promise<T> => {
        try {
            const response = await api.get(`/${endpoint}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint} project with ID ${id}:`, error);
            throw error;
        }
    },

    // Add a new project
    add: async (projectData: Omit<T, 'id'>): Promise<T> => {
        try {
            const response = await api.post(`/${endpoint}`, projectData);
            return response.data;
        } catch (error) {
            console.error(`Error adding ${endpoint} project:`, error);
            throw error;
        }
    },

    // Update an existing project
    update: async (projectData: Partial<T>): Promise<T> => {
        try {
            const response = await api.put(`/${endpoint}`, projectData);
            return response.data;
        } catch (error) {
            console.error(`Error updating ${endpoint} project:`, error);
            throw error;
        }
    },

    // Delete a project by ID
    delete: async (id: number): Promise<void> => {
        try {
            await api.delete(`/${endpoint}/${id}`);
        } catch (error) {
            console.error(`Error deleting ${endpoint} project with ID ${id}:`, error);
            throw error;
        }
    }
});

// Create API instances for each project type
export const reactTsProjectsApi = createProjectApi('ReactTsProjects');
export const phpProjectsApi = createProjectApi('PhpProjects');
export const netApiProjectsApi = createProjectApi('NetApiProjects');