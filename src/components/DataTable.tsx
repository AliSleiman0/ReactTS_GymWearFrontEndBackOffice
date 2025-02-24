import React from 'react';
import {
    DataGrid,
    GridColDef,
    //   GridToolbarQuickFilter,
    GridToolbar,
    //   GridValueGetterParams,
} from '@mui/x-data-grid';

import {
    HiOutlinePencilSquare,
    HiOutlineEye,
    HiOutlineTrash,
} from 'react-icons/hi2';



interface DataTableProps {
    columns: GridColDef[];
    rows: object[];
    slug?: string;
    includeActionColumn: boolean;
    isOrders: boolean,

}

const DataTable: React.FC<DataTableProps> = ({
    columns,
    rows,
    includeActionColumn,
    isOrders,
    slug
}) => {
    

    const actionColumn: GridColDef = {
        field: 'action',
        headerName: 'Action',
        minWidth: 200,
        flex: 1,
        renderCell: (params) => {
            
            if (slug === 'abouts') {
                return (
                    <div className="flex items-center">
                        <button
                            onClick={() => {
                                params.row.onEditClick?.(params.row.id);
                            }}
                            className="btn btn-square btn-primary"
                        >
                            <HiOutlinePencilSquare />
                        </button>
                    </div>
                );
            } else {
                return (
                    <div className="flex items-center">
                        <button
                            onClick={() => {
                                params.row.onViewClick?.(params.row.id);
                            }}
                            className="btn btn-square btn-ghost"
                        >
                            <HiOutlineEye />
                        </button>
                        <button
                            onClick={() => {
                                params.row.onEditClick?.(params.row.id);
                            }}
                            className="btn btn-square btn-ghost"
                        >
                            <HiOutlinePencilSquare />
                        </button>
                        <button
                            onClick={() => {
                                window.location.reload();
                            }}
                            className="btn btn-square btn-ghost"
                        >
                            <HiOutlineTrash />
                        </button>
                    </div>
                );
            }
        },
    };
    const OrdersActionColumn: GridColDef = {
        field: 'action',
        headerName: 'Action',
        minWidth: 100,
        flex: 1,
        renderCell: (params) => {
            return (
                <div className="flex items-center">
                    {/* <div to={`/${props.slug}/${params.row.id}`}> */}
                    <button
                        onClick={() => {
                            console.log("View clicked:", params.row);
                            params.row.onViewClick?.(params.row);

                        }}

                        className="btn btn-square btn-ghost"
                    >
                        <HiOutlineEye />
                    </button>
                    <button
                        onClick={() => {
                            params.row.onEditClick?.({
                                id: params.row.id,
                                status: params.row.orderStatus
                            });
                        }}
                        className="btn btn-square btn-ghost"
                    >
                        <HiOutlinePencilSquare />
                    </button>
                </div>
            );
        },
    };
    const columnss = isOrders ? [...columns, OrdersActionColumn] : [...columns, actionColumn]
    if (includeActionColumn === true) {
        return (
            <div className="w-full bg-base-100 text-base-content">
                <DataGrid
                    /*className="dataGrid p-0 xl:p-3 w-full bg-base-100 text-white"*/
                    rows={rows}
                    columns={columnss}

                    getRowHeight={() => 'auto'}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    disableColumnFilter
                    disableDensitySelector
                    disableColumnSelector
                />
            </div>
        );
    } else {
        return (
            <div className="w-full bg-base-100 text-base-content">
                <DataGrid
                    /*className="dataGrid p-0 xl:p-3 w-full bg-base-100 text-white"*/
                    rows={rows}
                    columns={[...columns]}
                    getRowHeight={() => 'auto'}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    disableColumnFilter
                    disableDensitySelector
                    disableColumnSelector
                />
            </div>
        );
    }
};

export default DataTable;
