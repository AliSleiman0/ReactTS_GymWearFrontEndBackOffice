import api from './api';

export interface GetCategoryDTO {
     id:number
     name:string
     imgsrc:string
    }
export interface SetCategoryDTO{ 
Name: string
imgsrc: string
}
export enum Gender {
    Male = 1,
    Female = 2
}

export interface TopSellingCategoryDTO {
    categoryId: number;
    categoryName: string;
    totalSold :number
}

export interface TopCategoryProductCountDTO {
    categoryId: number;
    categoryName: string;
    productCount: number
}

export const GetTopCategoriesByProductCount = async (): Promise<TopCategoryProductCountDTO[]> => {
    const url = `Category/GetTopCategoriesByProductCount`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

export const GetTopSellingCategoryDTO = async (): Promise<TopSellingCategoryDTO[]> => {
    const url = `Category/GetTopSellingCategories`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

export const getCategories = async (): Promise<GetCategoryDTO[]> => {
    const url = `/Category`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};
export const getCategoriesByGender = async (gender:Gender): Promise<GetCategoryDTO[]> => {
    const url = `/Category/ProductsByGender?gender=${gender}`;
    try {
        
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};