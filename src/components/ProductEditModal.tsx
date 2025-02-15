import { useEffect, useState } from 'react';
import { getProductWithStocks, updateProduct } from '../api/product';
import { uploadImage, getImageUrl } from '../api/FileUpload';

interface ProductEditModalProps {
    productId: number;
    onClose: () => void;
    onUpdate: () => void;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
    productId,
    onClose,
    onUpdate
}) => {
    const [productData, setProductData] = useState({
        id: 0,
        productName: '',
        price: 0,
        imgSrc: '',
        categoryId: 0,
        productGender: 1,
        stocks: [] as Array<{ color: string; size: string; stock: number }>
    });

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await getProductWithStocks(productId);
                setProductData({
                    ...data,
                    stocks: data.stocks.map(stock => ({
                        color: stock.color,
                        size: stock.size,
                        stock: stock.stock
                    }))
                });
                setPreview(data.imgSrc);
            } catch (error) {
                console.error('Failed to load product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) loadProduct();
    }, [productId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let imgSrc = productData.imgSrc;
            if (file) {
                const filePath = await uploadImage(file);
                imgSrc = getImageUrl(filePath);
            }

            await updateProduct({
                ...productData,
                imgSrc
            });
            onUpdate();
            onClose();  // Ensure this is being called
        } catch (error) {
            alert('Failed to update product');
        }
    };

    const handleStockChange = (index: number, field: string, value: any) => {
        const newStocks = [...productData.stocks];
        newStocks[index] = {
            ...newStocks[index],
            [field]: field === 'color' ? value.toLowerCase() : value
        };
        setProductData({ ...productData, stocks: newStocks });
    };

    const addNewStock = () => {
        setProductData({
            ...productData,
            stocks: [...productData.stocks, { color: '#000000', size: 'M', stock: 0 }]
        });
    };

    const removeStock = (index: number) => {
        const newStocks = productData.stocks.filter((_, i) => i !== index);
        setProductData({ ...productData, stocks: newStocks });
    };

    if (loading) return <div className="text-center py-8">Loading product details...</div>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors text-2xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Product Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    value={productData.productName}
                                    onChange={(e) => setProductData({ ...productData, productName: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={productData.price}
                                    onChange={(e) => setProductData({ ...productData, price: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Image
                                </label>
                                <div className="flex items-center space-x-4">
                                    {preview && (
                                        <img
                                            src={preview}
                                            alt="Product preview"
                                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300"
                                        />
                                    )}
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender
                                </label>
                                <select
                                    value={productData.productGender}
                                    onChange={(e) => setProductData({ ...productData, productGender: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value={1}>Male</option>
                                    <option value={2}>Female</option>
                                </select>
                            </div>
                        </div>

                        {/* Stock Management */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Stock Management</h3>
                                <button
                                    type="button"
                                    onClick={addNewStock}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add Stock
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {productData.stocks.map((stock, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-2 shadow-sm border-2 border-gray-200">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-600">Color</label>
                                                <input
                                                    type="text"
                                                    value={stock.color}
                                                    onChange={(e) => handleStockChange(index, 'color', e.target.value)}
                                                    className="w-full px-3 py-2 rounded border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter color"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeStock(index)}
                                                className="text-red-500 hover:text-red-700 ml-2"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Size</label>
                                            <select
                                                value={stock.size}
                                                onChange={(e) => handleStockChange(index, 'size', e.target.value)}
                                                className="w-full px-3 py-2 rounded border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                                            >
                                                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Quantity</label>
                                            <input
                                                type="number"
                                                value={stock.stock}
                                                onChange={(e) => handleStockChange(index, 'stock', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 rounded border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors border-2 border-gray-300 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};