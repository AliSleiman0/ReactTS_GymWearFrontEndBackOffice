import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem } from '@mui/material';

interface StatusEditModalProps {
    isOpen: boolean;
    currentStatus: string;
    orderId?: number;
    onClose: () => void;
    onConfirm: (orderId: number, newStatus: string) => void;
    isLoading?: boolean;
}

const StatusEditModal: React.FC<StatusEditModalProps> = ({
    isOpen,
    currentStatus,
    orderId,
    onClose,
    onConfirm,
    isLoading
}) => {
    const [selectedStatus, setSelectedStatus] = React.useState(currentStatus);

    React.useEffect(() => {
        setSelectedStatus(currentStatus);
    }, [currentStatus]);

    const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    const handleSubmit = () => {
        if (orderId) {
            onConfirm(orderId, selectedStatus);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogContent className="py-4">
                <Select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as string)}
                    fullWidth
                    className="min-w-[200px]"
                >
                    {statusOptions.map(status => (
                        <MenuItem key={status} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Update Status'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StatusEditModal;