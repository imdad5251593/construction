import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    ChartBarIcon, 
    BuildingOfficeIcon, 
    UsersIcon, 
    BanknotesIcon, 
    CurrencyDollarIcon,
    TagIcon,
    DocumentChartBarIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
        { name: 'Projects', href: '/projects', icon: BuildingOfficeIcon },
        { name: 'Investors', href: '/investors', icon: UsersIcon },
        { name: 'Investments', href: '/investments', icon: BanknotesIcon },
        { name: 'Expenses', href: '/expenses', icon: CurrencyDollarIcon },
        { name: 'Categories', href: '/categories', icon: TagIcon },
        { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon },
    ];

    const isActive = (href) => location.pathname === href;

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            {/* Sidebar for mobile */}
            <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <XMarkIcon className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                        <div className="flex-shrink-0 flex items-center px-4">
                            <BuildingOfficeIcon className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">CM System</span>
                        </div>
                        <nav className="mt-5 px-2 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`${
                                        isActive(item.href)
                                            ? 'bg-indigo-100 text-indigo-900'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                                >
                                    <item.icon className="mr-4 h-6 w-6" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
                        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                            <div className="flex items-center flex-shrink-0 px-4">
                                <BuildingOfficeIcon className="h-8 w-8 text-indigo-600" />
                                <span className="ml-2 text-xl font-bold text-gray-900">CM System</span>
                            </div>
                            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`${
                                            isActive(item.href)
                                                ? 'bg-indigo-100 text-indigo-900'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                    >
                                        <item.icon className="mr-3 h-6 w-6" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
                    <button
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </div>
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;