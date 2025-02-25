import React from 'react';
import { GetOrderDTO } from '../api/orders';

interface OrderViewModalProps {
    isOpen: boolean;
    card?: GetOrderDTO | null;
    onClose: () => void;
}

const OrderViewModal: React.FC<OrderViewModalProps> = ({ isOpen, card, onClose }) => {
    if (!card || !isOpen) return null;

    const formattedOrderDate = new Date(card.orderDate).toLocaleDateString('en-CA');
    const statusColor = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Shipped: 'bg-blue-100 text-blue-800',
        Delivered: 'bg-green-100 text-green-800',
        Cancelled: 'bg-red-100 text-red-800',
    }[card.orderStatus] || 'bg-gray-100 text-gray-800';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 ">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Order #{card.id}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Order Date</label>
                            <p className="font-medium text-gray-900">{formattedOrderDate}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Customer ID</label>
                            <p className="font-medium text-gray-900">#{card.userId}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Status</label>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                                {card.orderStatus}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Products</h3>
                        <div className="rounded-lg border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Color</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Size</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Qty</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Price</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {card.orderProducts.map((product, index) => (
                                        <tr key={`${product.productId}-${index}`}>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900">{product.productName}</div>
                                                <div className="text-sm text-gray-500">SKU: {product.productId}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center">
                                                    <span className="w-4 h-4 rounded-full border border-gray-200"
                                                        style={{ backgroundColor: product.color.toLowerCase() }}
                                                    />
                                                    <span className="ml-2 capitalize">{product.color}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">{product.size}</td>
                                            <td className="px-4 py-3 text-gray-700">{product.quantity}</td>
                                            <td className="px-4 py-3 text-right text-gray-700">
                                                ${product.unitPrice.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium">
                                                ${(product.unitPrice * product.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <div className="text-right space-y-2">
                            <div className="text-gray-700">
                                Subtotal: <span className="ml-4 font-medium">
                                    ${card.totalAmount.toFixed(2)}
                                </span>
                            </div>
                            <div className="text-xl font-bold text-gray-900">
                                Order Total: ${card.totalAmount.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderViewModal;