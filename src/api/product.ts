import api from './api';

export enum Gender {
    Male = 1,
    Female = 2
}

// Define the ProductCardDTO interface in TypeScript
export interface ProductCardDTO {
    id: number;
    background: string;
    title: string;
    oldPrice: number;
    newPrice: number;
    colors: string[];
    sizes: string[];
    category: string;
    productGender: Gender;
}


export interface GetProductDTO {
    id: string;
    productName: string;
    price: number;
    stockQuantity: number;
    productGender: Gender;
    imgSrc: string;
    createdAt: string;
}
export interface AddProductDTO {
    productName: string;
    productGender: Gender;
    price: number;
    imgSrc: string;
    categoryId: number;
    stocks: StockDetailDTO[];
}

export interface StockDetailDTO {
    size: string;
    stock: number;
    color: string;
}
export interface UpdateProductDTO {
    id: number;
    productName: string;
    productGender: number; // 1 for Male, 2 for Female
    price: number;
    imgSrc: string;
    categoryId: number;
    stocks: StockDetailDTO[];
}
export interface StockDetailDTO {
    color: string;
    size: string;
    stock: number; // Using 'stock' instead of 'quantity' to match your frontend naming
}
export const addProduct = async (product: AddProductDTO): Promise<AddProductDTO> => {
    const url = `/Product/AddProduct`;
    try {
        const response = await api.post(url, product);
        return response.data;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};
// Function to get all products
export const GetTopSellingProductsAsync = async (): Promise<GetProductDTO[]> => {
    const url = `/Product/GetTopSellingProductsAsync`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};
export const getProducts = async (): Promise<GetProductDTO[]> => {
    const url = `/Product`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};
//Men products or female
export const getProductsGender = async (gender: number): Promise<ProductCardDTO[]> => {
    const url = `/Product/GetAllProducts?gender=${gender}`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};


// Function to get a product by ID
export const getProductById = async (id: number): Promise<GetProductDTO> => {
    const url = `/Product/${id}`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        throw error;
    }
};
export const getProductCardById = async (id: number): Promise<ProductCardDTO> => {
    const url = `/Product/singleProductCard/${id}`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        throw error;
    }
};
export const getProductWithStocks = async (productId: number): Promise<UpdateProductDTO> => {

    const url = `/Product/GetProductWithStocks/${productId}`
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with id ${productId}:`, error);
        throw error;
    }
};

// Function to add a new product

// Function to update an existing product
export const updateProduct = async (product: UpdateProductDTO): Promise<any> => {
    const url = `/Product`;
    try {
        const response = await api.put(url, product);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

// Function to delete a product by ID
export const deleteProduct = async (id: number): Promise<void> => {
    const url = `/Product?id=${id}`;
    try {
        await api.delete(url);
    } catch (error) {
        console.error(`Error deleting product with id ${id}:`, error);
        throw error;
    }
};
