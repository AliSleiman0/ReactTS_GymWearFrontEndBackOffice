import React, { useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import { Social, getAllSocials, updateSocial } from '../api/socials';

const Socials = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSocial, setSelectedSocial] = useState<Social | null>(null);

    // Fetch data
    const { isLoading, isError, isSuccess, data } = useQuery({
        queryKey: ['socialsData'],
        queryFn: getAllSocials,
    });

    // Mutation for updating Social data
    const updateMutation = useMutation({
        mutationFn: (updatedData: Social) => updateSocial(updatedData.id, updatedData),
        onSuccess: () => {
            toast.success('Social links updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['socialsData'] });
            setIsModalOpen(false);
        },
        onError: () => {
            toast.error('Failed to update social links!');
        },
    });

    // Columns for DataTable
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'linkedinUrl',
            type: 'string',
            headerName: 'LinkedIn URL',
            minWidth: 250,
            flex: 1,
            renderCell: (params) => (
                <a href={params.value} target="_blank" rel="noopener noreferrer" className="link link-primary">
                    {params.value}
                </a>
            ),
        },
        {
            field: 'githubUrl',
            type: 'string',
            headerName: 'GitHub URL',
            minWidth: 250,
            flex: 1,
            renderCell: (params) => (
                <a href={params.value} target="_blank" rel="noopener noreferrer" className="link link-primary">
                    {params.value}
                </a>
            ),
        },
        {
            field: 'instaUrl',
            type: 'string',
            headerName: 'Instagram URL',
            minWidth: 250,
            flex: 1,
            renderCell: (params) => (
                <a href={params.value} target="_blank" rel="noopener noreferrer" className="link link-primary">
                    {params.value}
                </a>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <button
                    onClick={() => {
                        setSelectedSocial(params.row as Social);
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
        if (selectedSocial) {
            updateMutation.mutate(selectedSocial);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedSocial((prev) =>
            prev ? { ...prev, [name]: value } : null
        );
    };

    // Toast notifications for loading/error states
    React.useEffect(() => {
        if (isLoading) {
            toast.loading('Loading...', { id: 'socialsPromise' });
        }
        if (isError) {
            toast.error('Error while getting social links!', { id: 'socialsPromise' });
        }
        if (isSuccess) {
            toast.success('Social links loaded successfully!', { id: 'socialsPromise' });
        }
    }, [isError, isLoading, isSuccess]);

    return (
        <div className="w-full p-0 m-0">
            <div className="w-full flex flex-col items-stretch gap-3">
                <div className="w-full flex justify-between mb-5">
                    <div className="flex gap-1 justify-start flex-col items-start">
                        <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
                            Social Links
                        </h2>
                    </div>
                </div>

                {/* DataTable */}
                {isLoading ? (
                    <DataTable
                        slug="socials"
                        columns={columns}
                        rows={[]}
                        includeActionColumn={false}
                        isOrders={false}
                    />
                ) : isSuccess ? (
                    <DataTable
                        slug="socials"
                        columns={columns}
                        rows={data}
                        includeActionColumn={false}
                        isOrders={false}
                    />
                ) : (
                    <>
                        <DataTable
                            slug="socials"
                            columns={columns}
                            rows={[]}
                            includeActionColumn={false}
                            isOrders={false}
                        />
                        <div className="w-full flex justify-center">
                            Error while loading social links!
                        </div>
                    </>
                )}

                {/* Edit Modal */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h2 className="text-2xl font-bold mb-6">Edit Social Links</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">LinkedIn URL</span>
                            </label>
                            <input
                                type="url"
                                name="linkedinUrl"
                                value={selectedSocial?.linkedinUrl || ''}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">GitHub URL</span>
                            </label>
                            <input
                                type="url"
                                name="githubUrl"
                                value={selectedSocial?.githubUrl || ''}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Instagram URL</span>
                            </label>
                            <input
                                type="url"
                                name="instaUrl"
                                value={selectedSocial?.instaUrl || ''}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                required
                            />
                        </div>
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

export default Socials;