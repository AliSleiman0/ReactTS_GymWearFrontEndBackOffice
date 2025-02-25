import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';

import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
<<<<<<< HEAD
=======
import { updateAbout, About } from '../api/about';
import Modal from '../components/Modal';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import TextArea from '../components/TextArea';
>>>>>>> parent of aa1fc9a (fixes)

import { UserRoles, getUsers } from '../api/user';
import AddDataUser from '../components/AddDataUser';

const Users = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { isLoading, isError, isSuccess, data } = useQuery({
        queryKey: ['allusers'],
        queryFn: getUsers,
    });

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 220,
            flex: 1,
            renderCell: (params) => {
                return (
                    <div className="flex gap-3 items-center">
                        <div className="avatar">
                            <div className="w-6 xl:w-9 rounded-full">
                                <img
                                    src={params.row.img || '/Portrait_Placeholder.png'}
                                    alt="user-picture"
                                />
                            </div>
                        </div>
                        <span className="mb-0 pb-0 leading-none">
                            {params.row.name}
                        </span>
                    </div>
                );
            },
        },
        {
            field: 'email',
            type: 'string',
            headerName: 'Email',
            minWidth: 200,
            flex: 1,
        },

        {
            field: 'createdAt',
            headerName: 'Created At',
            minWidth: 100,
            type: 'string',
            flex: 1,
        },
        // {
        //   field: 'fullName',
        //   headerName: 'Full name',
        //   description:
        //     'This column has a value getter and is not sortable.',
        //   sortable: false,
        //   width: 160,
        //   valueGetter: (params: GridValueGetterParams) =>
        //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        // },
        {
            field: 'role',
            headerName: 'Role',
            width: 80,
            type: 'string',
            flex: 1,
            valueGetter: (params) => UserRoles[params.row.role],
        }
    ];

    React.useEffect(() => {
        if (isLoading) {
            toast.loading('Loading...', { id: 'promiseUsers' });
        }
        if (isError) {
            toast.error('Error while getting the data!', {
                id: 'promiseUsers',
            });
        }
        if (isSuccess) {
            toast.success('Got the data successfully!', {
                id: 'promiseUsers',
            });
        }
    }, [isError, isLoading, isSuccess]);

    return (
        <div className="w-full p-0 m-0">
            <div className="w-full flex flex-col items-stretch gap-3">
                <div className="w-full flex justify-between mb-5">
                    <div className="flex gap-1 justify-start flex-col items-start">
                        <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
                            Users
                        </h2>
                        {data && data.length > 0 && (
                            <span className="text-neutral dark:text-neutral-content font-medium text-base">
                                {data.length} Users Found
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className={`btn ${isLoading ? 'btn-disabled' : 'btn-primary'
                            }`}
                    >
                        Add New User +
                    </button>
                </div>
                {isLoading ? (
                    <DataTable
                        slug="users"
                        columns={columns}
                        rows={[]}
                        includeActionColumn={false}
                        isOrders={false}
                    />
                ) : isSuccess ? (
                    <DataTable
                        slug="users"
                        columns={columns}
                        rows={data}
                        includeActionColumn={false}
                        isOrders={false}
                    />
                ) : (
                    <>
                        <DataTable
                            slug="users"
                            columns={columns}
                            rows={[]}
                            includeActionColumn={false}
                            isOrders={false}
                        />
                        <div className="w-full flex justify-center">
                            Error while getting the data!
                        </div>
                    </>
                )}

                {isOpen && (
                    <AddDataUser
                        slug={'user'}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                )}
            </div>
        </div>
    );
};

export default Users;
