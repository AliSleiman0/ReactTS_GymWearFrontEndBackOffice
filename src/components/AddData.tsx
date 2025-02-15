import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineXMark } from 'react-icons/hi2';
import { Gender, addProduct } from '../api/product';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/categories';
import { getImageUrl, uploadImage } from '../api/FileUpload';

interface AddDataProps {
    slug: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddData: React.FC<AddDataProps> = ({ slug, isOpen, setIsOpen }) => {
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    // Product form state
    const [productName, setProductName] = useState('');
    const [gender, setGender] = useState<Gender>(1);
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [stocks, setStocks] = useState<Array<{ color: string; size: string; quantity: string }>>([
        { color: '', size: '', quantity: '' }
    ]);

    // Form validation
    const [formIsValid, setFormIsValid] = useState(false);

    const queryGetTotalCategories = useQuery({
        queryKey: ['totalcategories'],
        queryFn: getCategories,
    });



    useEffect(() => {
        const validateForm = () => {
            const isProductValid = Boolean(
                productName &&
                price &&
                !isNaN(parseFloat(price)) &&
                categoryId &&
                file
            );

            const areStocksValid = stocks.every(stock =>
                stock.color.trim() &&
                stock.size.trim() &&
                stock.quantity.trim() &&
                !isNaN(parseInt(stock.quantity))
            );

            return isProductValid && areStocksValid && stocks.length > 0;
        };

        setFormIsValid(validateForm());
    }, [productName, price, categoryId, file, stocks]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formIsValid || !categoryId) return;

        try {
            // Use Supabase functions to upload the image directly.
            // uploadImage returns a unique file path after uploading.
            const filePath = await uploadImage(file!);
            // Retrieve the public URL for the uploaded image.
            const imgSrc = getImageUrl(filePath);

            // Prepare product data
            const productData = {
                productName,
                productGender: gender,
                price: parseFloat(price),
                imgSrc,
                categoryId,
                stocks: stocks.map((stock) => ({
                    color: stock.color,
                    size: stock.size,
                    stock: parseInt(stock.quantity)
                }))
            };

            await addProduct(productData);
            toast.success('Product added successfully!');
            setIsOpen(false);
        } catch (error) {
            toast.error('Failed to add product');
        }
    };

    const addStockEntry = () => {
        setStocks([...stocks, { color: '', size: '', quantity: '' }]);
    };

    const updateStockEntry = (index: number, field: string, value: string) => {
        const newStocks = [...stocks];
        newStocks[index] = { ...newStocks[index], [field]: value };
        setStocks(newStocks);
    };

    const removeStockEntry = (index: number) => {
        setStocks(stocks.filter((_, i) => i !== index));
    };

    const loadImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const image = e.target.files[0];
            setFile(image);
            setPreview(URL.createObjectURL(image));
        }
    };

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen]);

    if (slug !== 'product') return null;

    return (
        <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/75 z-[99]">
            <div className={`w-[80%] xl:w-[50%] max-h-[90vh] overflow-y-auto rounded-lg p-7 bg-base-100 relative transition duration-300 flex flex-col items-stretch gap-5 
        ${showModal ? 'translate-y-0' : 'translate-y-full'} ${showModal ? 'opacity-100' : 'opacity-0'}`}>

                <div className="w-full flex justify-between pb-5 border-b border-base-content border-opacity-30">
                    <button
                        onClick={() => {
                            setShowModal(false);
                            setIsOpen(false);
                        }}
                        className="absolute top-5 right-3 btn btn-ghost btn-circle"
                    >
                        <HiOutlineXMark className="text-xl font-bold" />
                    </button>
                    <span className="text-2xl font-bold">Add new {slug}</span>
                </div>

                <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        placeholder="Product Name"
                        className="input input-bordered w-full"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />

                    <select
                        className="select select-bordered"
                        value={gender}
                        onChange={(e) => setGender(Number(e.target.value))}
                    >
                        <option value={1}>Men</option>
                        <option value={2}>Women</option>

                    </select>


                    <select
                        className="select select-bordered"
                        value={categoryId || ''}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                    >
                        <option disabled value="">
                            Select Category
                        </option>
                        {queryGetTotalCategories.data ? (
                            queryGetTotalCategories.data.length > 0 ? (
                                queryGetTotalCategories.data.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No categories available</option>
                            )
                        ) : (
                            <option disabled>Loading categories...</option>
                        )}
                    </select>


                    <input
                        type="number"
                        placeholder="Price"
                        className="input input-bordered w-full"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min="0"
                        step="0.01"
                    />

                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Product Image</span>
                        </div>
                        <input
                            type="file"
                            className="file-input file-input-bordered w-full"
                            accept="image/*"
                            onChange={loadImage}
                        />
                    </label>

                    {preview && (
                        <div className="w-full flex flex-col items-start gap-3">
                            <span>Image Preview</span>
                            <div className="avatar">
                                <div className="w-24 rounded">
                                    <img src={preview} alt="Product preview" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">Stock Management</h3>
                            <button
                                type="button"
                                onClick={addStockEntry}
                                className="btn btn-sm btn-primary"
                            >
                                Add Variation
                            </button>
                        </div>

                        {stocks.map((stock, index) => (
                            <div key={index} className="grid grid-cols-4 gap-2 items-center">
                                <input
                                    type="text"
                                    placeholder="Color"
                                    className="input input-bordered"
                                    value={stock.color}
                                    onChange={(e) => updateStockEntry(index, 'color', e.target.value)}
                                />
                                <select
                                    className="input input-bordered"
                                    value={stock.size}
                                    onChange={(e) => updateStockEntry(index, 'size', e.target.value)}
                                >
                                    <option value="">Select Size</option>
                                    <option value="XXS">XXS</option>
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                </select>

                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    className="input input-bordered"
                                    value={stock.quantity}
                                    onChange={(e) => updateStockEntry(index, 'quantity', e.target.value)}
                                    min="0"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeStockEntry(index)}
                                    className="btn btn-error btn-sm"
                                    disabled={stocks.length === 1}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className={`mt-4 btn ${formIsValid ? 'btn-primary' : 'btn-disabled'}`}
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddData;