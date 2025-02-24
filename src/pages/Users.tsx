import React, { useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateAbout, About } from '../api/about';
import Modal from '../components/Modal';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import TextArea from '../components/TextArea';
import { getAllWelcome } from '../api/welcome';

export const Users = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAbout, setSelectedAbout] = useState<About | null>(null);

    // Fetch data
    const { isLoading, isError, isSuccess, data } = useQuery({
        queryKey: ['welcomeData'],
        queryFn: getAllWelcome,
    });

    // Mutation for updating About data
    const updateMutation = useMutation({
        mutationFn: (updatedData: About) => updateAbout(updatedData),
        onSuccess: () => {
            toast.success('About data updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['aboutData'] }); // Refresh data
            setIsModalOpen(false); // Close modal
        },
        onError: () => {
            toast.error('Failed to update About data!');
        },
    });

    // Columns for DataTable
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'firstP',
            type: 'string',
            headerName: 'First Paragraph',
            minWidth: 200,
            flex: 1,
        },
        {
            field: 'secondP',
            type: 'string',
            headerName: 'Second Paragraph',
            minWidth: 200,
            flex: 1,
        },
        {
            field: 'thirdP',
            type: 'string',
            headerName: 'Third Paragraph',
            minWidth: 200,
            flex: 1,
        },
        {
            field: 'fourthP',
            type: 'string',
            headerName: 'Fourth Paragraph',
            minWidth: 200,
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <button
                    onClick={() => {
                        console.log("hi");
                        setSelectedAbout(params.row as About);
                        setIsModalOpen(true);
                    }}
                    className="btn btn-square btn-primary"
                >
                    <HiOutlinePencilSquare />
                </button>
            ),
        },
    ];

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedAbout) {
            updateMutation.mutate(selectedAbout);
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSelectedAbout((prev) => prev ? { ...prev, [name]: value } : null
        );
    };


    // Toast notifications for loading/error states
    React.useEffect(() => {
        if (isLoading) {
            toast.loading('Loading...', { id: 'promiseUsers' });
        }
        if (isError) {
            toast.error('Error while getting the data!', { id: 'promiseUsers' });
        }
        if (isSuccess) {
            toast.success('Got the data successfully!', { id: 'promiseUsers' });
        }
    }, [isError, isLoading, isSuccess]);

    return (
        <div className="w-full p-0 m-0 ">
            <div className="w-full flex flex-col items-stretch gap-3">
                <div className="w-full flex justify-between mb-5">
                    <div className="flex gap-1 justify-start flex-col items-start">
                        <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
                            About Info
                        </h2>
                    </div>
                </div>

                {/* DataTable */}
                {isLoading ? (
                    <DataTable
                        slug="about"
                        columns={columns}
                        rows={[]}
                        includeActionColumn={false}
                        isOrders={false} />
                ) : isSuccess ? (
                    <DataTable
                        slug="about"
                        columns={columns}
                        rows={data}
                        includeActionColumn={false}
                        isOrders={false} />
                ) : (
                    <>
                        <DataTable
                            slug="about"
                            columns={columns}
                            rows={[]}
                            includeActionColumn={false}
                            isOrders={false} />
                        <div className="w-full flex justify-center">
                            Error while getting the data!
                        </div>
                    </>
                )}

                {/* Edit Modal */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h2 className="text-2xl font-bold mb-6">Edit About Section</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 ">
                        <TextArea
                            label="First Paragraph"
                            name="firstP"
                            value={selectedAbout?.firstP || ''}
                            onChange={handleInputChange}
                            required />
                        <TextArea
                            label="Second Paragraph"
                            name="secondP"
                            value={selectedAbout?.secondP || ''}
                            onChange={handleInputChange}
                            required />
                        <TextArea
                            label="Third Paragraph"
                            name="thirdP"
                            value={selectedAbout?.thirdP || ''}
                            onChange={handleInputChange}
                            required />
                        <TextArea
                            label="Fourth Paragraph"
                            name="fourthP"
                            value={selectedAbout?.fourthP || ''}
                            onChange={handleInputChange}
                            required />
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="btn btn-primary"
                            >
                                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
};
