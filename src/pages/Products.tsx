import React, { useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';

import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AddData from '../components/AddData';
import { getProducts } from '../api/product';
import { ProductViewModal } from '../components/ProductViewModal';
import { ProductEditModal } from '../components/ProductEditModal';


const Products = () => {
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [selectedProductIdEdit, setSelectedProductIdEdit] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { isLoading, isError, isSuccess, data } = useQuery({
        queryKey: ['allproducts'],
        queryFn: getProducts,
    });

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'imgSrc',
            headerName: 'Product',
            minWidth: 300,
            flex: 1,
            renderCell: (params) => {
               

                return (
                    <div className="flex gap-3 items-center">
                        <div className="w-6 xl:w-10 overflow-hidden flex justify-center items-center">
                            <img
                                src={params.row.imgSrc || 'corrugated-box.jpg'}

                                alt="product-picture"
                                className="object-cover"
                            />
                        </div>
                        <span className="mb-0 pb-0 leading-none">
                            {params.row.productName}
                        </span>
                    </div>
                );
            },
        },
        // {
        //   field: 'title',
        //   type: 'string',
        //   headerName: 'Title',
        //   width: 250,
        // },

        {
            field: 'price',
            type: 'string',
            headerName: 'Price',
            minWidth: 100,
            flex: 1,
        },

        {
            field: 'createdAt',
            headerName: 'Created At',
            minWidth: 100,
            type: 'string',
            flex: 1,
        },
        {
            field: 'stockQuantity',
            headerName: 'Stock',
            minWidth: 80,
            type: 'number',
            flex: 1,
        },
    ];

    React.useEffect(() => {
        if (isLoading) {
            toast.loading('Loading...', { id: 'promiseProducts' });
        }
        if (isError) {
            toast.error('Error while getting the data!', {
                id: 'promiseProducts',
            });
        }
        if (isSuccess) {
            toast.success('Got the data successfully!', {
                id: 'promiseProducts',
            });
        }
    }, [isError, isLoading, isSuccess]);

    return (
        <div className="w-full p-0 m-0">
            <ProductViewModal
                productId={selectedProductId}
                onClose={() => setSelectedProductId(null)}
            />
            {selectedProductIdEdit && (
                <ProductEditModal
                    productId={selectedProductIdEdit}  // Remove Number() conversion
                    onClose={() => setSelectedProductIdEdit(null)}
                    onUpdate={() => {
                        // Add any data refresh logic here if needed
                        setSelectedProductIdEdit(null);
                    }}
                />
            )}
            <div className="w-full flex flex-col items-stretch gap-3">
                <div className="w-full flex justify-between xl:mb-5">
                    <div className="flex gap-1 justify-start flex-col items-start">
                        <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
                            Products
                        </h2>
                        {data && data.length > 0 && (
                            <span className="text-neutral dark:text-neutral-content font-medium text-base">
                                {data.length} Products Found
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className={`btn ${isLoading ? 'btn-disabled' : 'btn-primary'
                            }`}
                    >
                        Add New Product +
                    </button>
                </div>

                {isLoading ? (
                    <DataTable
                        slug="products"
                        columns={columns}
                        rows={[]}
                        includeActionColumn={true}
                        isOrders={false}
                    />
                ) : isSuccess ? (
                    <DataTable
                        slug="products"
                        columns={columns}
                            rows={data?.map(order => ({
                                ...order,
                               
                                onViewClick: () => setSelectedProductId(Number(order.id)) ,
                                onEditClick: () => setSelectedProductIdEdit(Number(order.id))
                            })) || []}
                        includeActionColumn={true}
                        isOrders={false}
                    />
                ) : (
                    <>
                        <DataTable
                            slug="products"
                            columns={columns}
                            rows={[]}
                            includeActionColumn={true}
                            isOrders={false}
                        />
                        <div className="w-full flex justify-center">
                            Error while getting the data!
                        </div>
                    </>
                )}

                {isOpen && (
                    <AddData
                        slug={'product'}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                )}
            </div>
        </div>
    );
};

export default Products;
