import { useEffect, useState } from 'react';
import { getProductCardById, ProductCardDTO, Gender } from '../api/product'; // Adjust import path


interface ProductModalProps {
    productId: number | null;
    onClose: () => void;
}

export const ProductViewModal = ({ productId, onClose }: ProductModalProps) => {
    const [productData, setProductData] = useState<ProductCardDTO | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;

            try {
                setIsLoading(true);
                const data = await getProductCardById(productId);
                setProductData(data);
                setError(null);
            } catch (err) {
                setError('Failed to load product details');
                setProductData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (!productId) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Product Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="p-8 text-center">Loading product details...</div>
                )}

                {/* Error State */}
                {error && (
                    <div className="p-8 text-center text-red-500">{error}</div>
                )}

                {/* Product Data */}
                {productData && (
                    <div className="p-6 space-y-4">
                        <div className="h-48 bg-gray-100 rounded-lg mb-4">
                            {productData.background && (
                                <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                                    {productData.background && (
                                        <img
                                            src={productData.background}
                                            alt={productData.title}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <h3 className="text-2xl font-bold">{productData.title}</h3>

                        <div className="flex gap-4">
                            <span className="text-gray-500 line-through">
                                ${productData.oldPrice}
                            </span>
                            <span className="text-xl font-bold text-red-600">
                                ${productData.newPrice}
                            </span>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Available Colors:</h4>
                            <div className="flex gap-2">
                                {productData.colors.map((color: string) => (
                                    <div
                                        key={color}
                                        className="w-8 h-8 rounded-full border"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Available Sizes:</h4>
                            <div className="grid grid-cols-4 gap-2">
                                {productData.sizes.map((size: string) => (
                                    <button
                                        key={size}
                                        className="p-2 border rounded hover:bg-gray-50"
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 text-sm text-gray-600">
                            <span>Category: {productData.category}</span>
                            <span>|</span>
                            <span>
                                Gender: {productData.productGender === Gender.Male ? 'Male' : 'Female'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};