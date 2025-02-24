import React, { useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getAllWelcome, updateWelcome, Welcome } from '../api/welcome';
import Modal from '../components/Modal';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import TextArea from '../components/TextArea';
import { uploadImage, getImageUrl } from '../api/FileUpload'; // Add your image upload utility functions

const WelcomeCPT = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWelcome, setSelectedWelcome] = useState<Welcome | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // Fetch data
    const { isLoading, isError, isSuccess, data } = useQuery({
        queryKey: ['welcomeData'],
        queryFn: getAllWelcome,
    });

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Mutation for updating Welcome data
    const updateMutation = useMutation({
        mutationFn: async (updatedData: Welcome) => {
            // Upload new image if selected
            if (file) {
                const filePath = await uploadImage(file);
                updatedData.imgSrc = getImageUrl(filePath);
            }
            return updateWelcome(updatedData);
        },
        onSuccess: () => {
            toast.success('Welcome data updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['welcomeData'] });
            setIsModalOpen(false);
            setFile(null);
            setPreview(null);
        },
        onError: () => {
            toast.error('Failed to update Welcome data!');
        },
    });

    // Columns for DataTable
    const columns: GridColDef[] = [
        {
            field: 'imgSrc',
            headerName: 'Image',
            width: 150,
            renderCell: (params) => (
                <img
                    src={params.value}
                    alt="Welcome"
                    className="w-12 h-12 object-cover rounded"
                />
            )
        },
        {
            field: 'title',
            type: 'string',
            headerName: 'Title',
            minWidth: 200,
            flex: 1,
        },
        {
            field: 'subtitle',
            type: 'string',
            headerName: 'Subtitle',
            minWidth: 200,
            flex: 1,
        },
        {
            field: 'skills',
            type: 'string',
            headerName: 'Skills',
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
                        setSelectedWelcome(params.row as Welcome);
                        setIsModalOpen(true);
                    }}
                    className="btn btn-square btn-primary"
                >
                    <HiOutlinePencilSquare />
                </button>
            ),
        },
    ];

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSelectedWelcome(prev => prev ? { ...prev, [name]: value } : null);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedWelcome) {
            updateMutation.mutate(selectedWelcome);
        }
    };

    // Toast notifications
    React.useEffect(() => {
        if (isLoading) toast.loading('Loading...', { id: 'welcome' });
        if (isError) toast.error('Error loading data!', { id: 'welcome' });
        if (isSuccess) toast.success('Data loaded!', { id: 'welcome' });
    }, [isError, isLoading, isSuccess]);

    return (
        <div className="w-full p-0 m-0">
            <div className="w-full flex flex-col items-stretch gap-3">
                <div className="w-full flex justify-between mb-5">
                    <h2 className="font-bold text-2xl xl:text-4xl text-base-content dark:text-neutral-200">
                        Welcome Section
                    </h2>
                </div>

                <DataTable
                    slug="welcome"
                    columns={columns}
                    rows={isSuccess ? data : []}
                
                    includeActionColumn={false}
                    isOrders={false}
                />

                {/* Edit Modal */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h2 className="text-2xl font-bold mb-6">Edit Welcome Section</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">
                                    Current Image
                                </label>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={preview || selectedWelcome?.imgSrc}
                                        alt="Current"
                                        className="w-20 h-20 object-cover rounded-lg border"
                                    />
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="file-input file-input-bordered w-full"
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            {/* Text Fields */}
                            <TextArea
                                label="Title"
                                name="title"
                                value={selectedWelcome?.title || ''}
                                onChange={handleInputChange}
                                required
                            />
                            <TextArea
                                label="Subtitle"
                                name="subtitle"
                                value={selectedWelcome?.subtitle || ''}
                                onChange={handleInputChange}
                                required
                            />
                            <TextArea
                                label="Skills (comma separated)"
                                name="skills"
                                value={selectedWelcome?.skills || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="btn btn-ghost"
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

export default WelcomeCPT;