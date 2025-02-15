import React, { useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
// import AddData from '../components/AddData';

import { GetOrderDTO, getOrders, updateOrderStatus } from '../api/orders';
import StatusEditModal from '../components/StatusEditModal';
import OrderViewModal from '../components/OrderViewModal';

const Orders = () => {
    // const [isOpen, setIsOpen] = React.useState(false);
    const queryClient = useQueryClient();
    const [selectedOrder, setSelectedOrder] = useState<{ id: number; status: string } | null>(null);
    const [selectedCard, setSelectedCard] = useState<GetOrderDTO | null>(null);

    const { isLoading, isError, isSuccess, data } = useQuery({
        queryKey: ['allorders'],
        queryFn: getOrders,
    });

    const mutation = useMutation({
        mutationFn: ({ orderId, newStatus }: { orderId: number; newStatus: string }) =>
            updateOrderStatus(newStatus, orderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allorders'] });
            toast.success('Status updated successfully');
            setSelectedOrder(null);
        },
        onError: () => {
            toast.error('Error updating status');
        }
    });

    const handleStatusUpdate = (orderId: number, newStatus: string) => {
        mutation.mutate({ orderId, newStatus });
    };
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'orderStatus',
            headerName: 'Order Status',
            renderCell: (params) => {
                return (
                    <div className="flex gap-3 items-center">
                        {/* Image */}
                        <div className="w-6 xl:w-10 overflow-hidden flex justify-center items-center">
                            <img
                                src="/corrugated-box.jpg"
                                alt="orders-picture"
                                className="object-cover"
                            />
                        </div>
                        {/* Conditional Status Rendering */}
                        {params.row.orderStatus === 'Pending' ? (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-warning"></div>
                                <div className="text-sm font-medium text-warning">
                                    {params.row.orderStatus}
                                </div>
                            </div>
                        ) : params.row.orderStatus === 'Processing' ? (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-info"></div>
                                <div className="text-sm font-medium text-info">
                                    {params.row.orderStatus}
                                </div>
                            </div>
                        ) : params.row.orderStatus === 'Shipped' ? (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-error"></div>
                                <div className="text-sm font-medium text-error">
                                    {params.row.orderStatus}
                                </div>
                            </div>
                        ) : params.row.orderStatus === 'Delivered' ? (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-success"></div>
                                <div className="text-sm font-medium text-success">
                                    {params.row.orderStatus}
                                </div>
                            </div>
                        ) : params.row.orderStatus === 'Cancelled' ? (
                            < div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-error"></div>
                                <div className="text-sm font-medium text-success">
                                    {params.row.orderStatus}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="badge bg-neutral-content badge-xs"></div>
                                <span className="text-sm font-semibold text-neutral-content">
                                    Unknown
                                </span>
                            </div>
                        )
                        }
                    </div >
                );
            },
        },

        {
            field: 'totalAmount',
            type: 'number',
            headerName: '$ Amount',
            minWidth: 250,
            flex: 1,
        },
        {
            field: 'userId',
            headerName: 'User ID',
            minWidth: 250,
            flex: 1,
            renderCell: (params) => {
                return (
                    <div className="flex gap-3 items-center">
                        <div className="avatar">
                            <div className="w-6 xl:w-9 rounded-full">
                                <img
                                    src='/Portrait_Placeholder.png'
                                    alt="user-picture"
                                />
                            </div>
                        </div>
                        <span className="mb-0 pb-0 leading-none">
                            {params.row.userId}
                        </span>
                    </div>
                );
            },
        },
        {
            field: 'orderDate',
            headerName: 'Order Date',
            minWidth: 100,
            type: 'string',
            flex: 1,
            renderCell: (params) => {
                const dateOnly = new Date(params.row.orderDate).toLocaleDateString("en-CA"); // "YYYY-MM-DD"
                return dateOnly;
            }
        },
        {
            field: 'totalAmount',
            headerName: 'Total',
            minWidth: 100,
            type: 'number',
            flex: 1,
        },


    ];

    React.useEffect(() => {
        if (isLoading) {
            toast.loading('Loading...', { id: 'promiseOrders' });
        }
        if (isError) {
            toast.error('Error while getting the data!', {
                id: 'promiseOrders',
            });
        }
        if (isSuccess) {
            toast.success('Got the data successfully!', {
                id: 'promiseOrders',
            });
        }
    }, [isError, isLoading, isSuccess]);

    return (
        <div className="w-full p-0 m-0">
            <StatusEditModal
                isOpen={!!selectedOrder}
                currentStatus={selectedOrder?.status || ''}
                orderId={selectedOrder?.id}
                onClose={() => setSelectedOrder(null)}
                onConfirm={handleStatusUpdate}
                isLoading={mutation.isPending}
            />
            <OrderViewModal
                isOpen={!!selectedCard}
                card={selectedCard!}
                onClose={() => setSelectedCard(null)}
            />
            <div className="w-full flex flex-col items-stretch gap-3">
                <div className="w-full flex justify-between mb-5">
                    <div className="flex gap-1 justify-start flex-col items-start">
                        <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
                            Orders
                        </h2>
                        {data && data.length > 0 && (
                            <span className="text-neutral dark:text-neutral-content font-medium text-base">
                                {data.length} Orders Found
                            </span>
                        )}
                    </div>
                    {/* <button
            onClick={() => setIsOpen(true)}
            className={`btn ${
              isLoading ? 'btn-disabled' : 'btn-primary'
            }`}
          >
            Add New Order +
          </button> */}
                </div>
                {isLoading ? (
                    <DataTable
                        slug="orders"
                        columns={columns}
                        rows={[]}

                        includeActionColumn={true}
                        isOrders={true}
                    />
                ) : isSuccess ? (
                    <DataTable
                        slug="orders"
                        columns={columns}
                        rows={data?.map(order => ({
                            ...order,
                            onEditClick: setSelectedOrder,

                            onViewClick: () => setSelectedCard(order) // Ensure this passes the order object

                        })) || []}
                        includeActionColumn={true}
                        isOrders={true}
                    />
                ) : (
                    <>
                        <DataTable
                            slug="orders"
                            columns={columns}
                            rows={[]}
                            includeActionColumn={true}
                            isOrders={true}
                        />
                        <div className="w-full flex justify-center">
                            Error while getting the data!
                        </div>
                    </>
                )}

                {/* {isOpen && (
          <AddData
            slug={'user'}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )} */}
            </div>
        </div>
    );
};

export default Orders;
