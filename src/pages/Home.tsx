// import React from 'react';
import TopDealsBox from '../components/topDealsBox/TopDealsBox';
import ChartBox from '../components/charts/ChartBox';
import { useQuery } from '@tanstack/react-query';
import {
    MdGroup,
    MdInventory2,
    MdAssessment,
    MdSwapHorizontalCircle,
} from 'react-icons/md';
import { getUsers } from '../api/user';
import { GetTopSellingProductsAsync, getProducts } from '../api/product';
import { GetOrderDTO, getOrders } from '../api/orders';
import { GetTopCategoriesByProductCount, GetTopSellingCategoryDTO } from '../api/categories';

const Home = () => {

    const queryGetTotalUsers = useQuery({
        queryKey: ['totalusers'],
        queryFn: getUsers,
        select: (users) => ({
            total: users.length,
            link: '/users', // Link to the users page
        }),
    });

    const queryGetTotalProducts = useQuery({
        queryKey: ['totalproducts'],
        queryFn: getProducts,
        select: (products) => ({
            total: products.length,
            link: '/products', // Link to the products page
        }),
    });

    const queryGetTotalOrders = useQuery({
        queryKey: ['totalorders'],
        queryFn: getOrders,
        select: (orders) => ({
            total: orders.length,
            link: '/orders', // Link to the orders page
        }),
    });

    const queryGetTotalRevenue = useQuery({
        queryKey: ['totalrevenue'],
        queryFn: getOrders,
        select: (orders) => {
            const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
            return {
                total: `$${totalRevenue.toFixed(2)}`, // Format revenue as a string with "$"
                link: '/orders', // Link to the revenue details page
            };
        },
    });

    const queryGetTopSellingCategoryDTO = useQuery({
        queryKey: ['TopSellingCategoryDTO'],
        queryFn: GetTopSellingCategoryDTO,
        select: (data: Array<{ categoryId: number; categoryName: string; totalSold: number }>) => {
            // Predefined list of colors; you can extend or modify this as needed.
            const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

            // Transform the data array into the chartPieData structure
            const chartPieData = data.map((item, index) => ({
                name: item.categoryName,
                value: item.totalSold,
                color: colors[index % colors.length] // cycle through colors if there are more items than colors
            }));

            // Return the transformed structure
            return {
                title: "Top Selling Categories",
                dataKey: "value",
                chartPieData,
            };
        },
    });
    
    const queryGetRevenueByDay = useQuery({
        queryKey: ['revenueByDay'],
        queryFn: getOrders,
        select: (orders: GetOrderDTO[]) => {
            // Initialize an object with days of the week and numeric revenue
            const revenueByDay: Record<string, number> = {
                Sunday: 0,
                Monday: 0,
                Tuesday: 0,
                Wednesday: 0,
                Thursday: 0,
                Friday: 0,
                Saturday: 0,
            };

            // Iterate over each order and add its totalAmount to the correct day
            orders.forEach((order) => {
                // Create a Date object from the order's orderDate property
                const date = new Date(order.orderDate);
                // Get the full name of the weekday
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                // Accumulate the totalAmount for that day
                revenueByDay[dayName] += order.totalAmount;
            });

            // Transform the object into an array of objects for the chart
            // Each object now has a 'name' and a numeric 'value'
            const chartAreaData = Object.entries(revenueByDay).map(([day, total]) => ({
                name: day,
                value: total,
            }));

            return chartAreaData;
        },
    });
    const queryGetTopCategoriesByProductCount = useQuery({
        queryKey: ['totalProducts/Category'],
        queryFn: GetTopCategoriesByProductCount,
        select: data => ({
            title: "Products/Categories",
            color: "#8884d8", // Default color if not provided
            dataKey: "value", // Matches your current data structure
            chartData: data.map(category => ({
                name: category.categoryName,
                value: category.productCount, // Keep this as 'value' to match dataKey
            })),
        }),
    });
    const queryGetTopSellingProductsAsync = useQuery({
        queryKey: ['TopProducts'],
        queryFn: GetTopSellingProductsAsync,
        select: data => ({
            title: "Top Selling Products",
            color: "#8884d8",
            dataKey: "value",
            chartData: data.map(product => ({
                name: product.productName,
                value: product.stockQuantity, // stock quanttiy is configured on the backend to hold the number of times the product has ben put in orders, this step is taken to minimize the DTOs since we have like alot!
            })),

        })
    });
    console.log(queryGetTopSellingProductsAsync.data);
    return (
        // screen
        <div className="home w-full p-0 m-0">
            {/* grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 grid-flow-dense auto-rows-[minmax(200px,auto)] xl:auto-rows-[minmax(150px,auto)] gap-3 xl:gap-3 px-0">
                <div className="box col-span-full sm:col-span-1 xl:col-span-1 row-span-3 3xl:row-span-5">
                    <TopDealsBox />
                </div>
                <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
                    <ChartBox
                        chartType={'line'}
                        IconBox={MdGroup}
                        title="Total Users"
                        {...queryGetTotalUsers.data}
                        isLoading={queryGetTotalUsers.isLoading}
                        isSuccess={queryGetTotalUsers.isSuccess}
                       
                    />
                </div>
                <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
                    <ChartBox
                        chartType={'line'}
                        IconBox={MdInventory2}
                        title="Total Products"
                        {...queryGetTotalProducts.data}
                        isLoading={queryGetTotalProducts.isLoading}
                        isSuccess={queryGetTotalProducts.isSuccess}
                    />
                </div>
                <div className="box row-span-3 col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-5">
                    <ChartBox
                        chartType={'pie'}
                        title="Top Selling By Categories"
                        {...queryGetTopSellingCategoryDTO.data}
                        isLoading={queryGetTopSellingCategoryDTO.isLoading}
                        isSuccess={queryGetTopSellingCategoryDTO.isSuccess}
                    />
                </div>
                <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
                    <ChartBox
                        chartType={'line'}
                        IconBox={MdAssessment}
                        title="Total Orders"
                        {...queryGetTotalOrders.data}
                        isLoading={queryGetTotalOrders.isLoading}
                        isSuccess={queryGetTotalOrders.isSuccess}
                    />
                </div>
                <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
                    <ChartBox
                        chartType={'line'}
                        IconBox={MdSwapHorizontalCircle}
                        title="Total Revenue"
                        {...queryGetTotalRevenue.data}
                        isLoading={queryGetTotalRevenue.isLoading}
                        isSuccess={queryGetTotalRevenue.isSuccess}
                    />
                </div>
                <div className="box row-span-2 col-span-full xl:col-span-2 3xl:row-span-3">
                    <ChartBox
                        chartType={'area'}
                        title="Revenue by Days"
                        chartAreaData={queryGetRevenueByDay.data}
                        isLoading={queryGetRevenueByDay.isLoading}
                        isSuccess={queryGetRevenueByDay.isSuccess}
                    />
                </div>
                <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
                    <ChartBox
                        chartType={'bar'}
                        title="Products/Categories"
                        { ...queryGetTopCategoriesByProductCount.data}
                        isLoading={queryGetTopCategoriesByProductCount.isLoading}
                        isSuccess={queryGetTopCategoriesByProductCount.isSuccess}
                    />
                </div>
                <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
                    <ChartBox
                        chartType={'bar'}
                        title="Top Selling Products"
                        {...queryGetTopSellingProductsAsync.data}
                        isLoading={queryGetTopSellingProductsAsync.isLoading}
                        isSuccess={queryGetTopSellingProductsAsync.isSuccess}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
