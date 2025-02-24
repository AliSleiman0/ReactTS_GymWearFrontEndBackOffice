// import React from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    ScrollRestoration,
    Navigate,
} from 'react-router-dom';

import About from './pages/About';
import WelcomeCPT from './pages/Welcome';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Menu from './components/menu/Menu';
import Error from './pages/Error';
import Orders from './pages/Orders';


import ToasterProvider from './components/ToasterProvider';

import { Signin } from './pages/Signin';
import Socials from './pages/Socials';



function App() {
    const Layout = () => {
        //const { user, accessToken } = useAuth();

        return (


            <div
                id="rootContainer"
                className="w-full p-0 m-0 overflow-visible min-h-screen flex flex-col justify-between"
            >

                <ToasterProvider />
                <ScrollRestoration />
                <div>

                    <Navbar />
                    <div className="w-full flex gap-0 pt-20 xl:pt-[96px] 2xl:pt-[112px] mb-auto">
                        <div className="hidden xl:block xl:w-[250px] 2xl:w-[280px] 3xl:w-[350px] border-r-2 border-base-300 dark:border-slate-700 px-3 xl:px-4 xl:py-1">
                            <Menu />
                        </div>
                        <div className="w-full px-4 xl:px-4 2xl:px-5 xl:py-2 overflow-clip">
                            <Outlet />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

        );
    };

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <Navigate to="/signin" replace />,
                },
                {
                    path: 'about',
                    element: <About />,
                },

                {
                    path: 'welcome',
                    element: <WelcomeCPT />,
                },
                {
                    path: 'skills',
                    element: <Skills />,
                },
                {
                    path: 'projects',
                    element: <Projects />,
                },
                {
                    path: 'socials',
                    element: <Socials />,
                },
                {
                    path: 'orders',
                    element: <Orders />,
                },

            ],
            errorElement: <Error />,
        },
        {
            path: '/signin',
            element: <Signin />,
        },

    ]);

    return <RouterProvider router={router} />;
}

export default App;
