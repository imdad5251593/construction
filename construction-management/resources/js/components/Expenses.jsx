import React from 'react';

const Expenses = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Expenses</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:p-6">
                    <p className="text-gray-500">Expense management interface will be implemented here.</p>
                    <p className="text-sm text-gray-400 mt-2">
                        Features: Record expenses, categorize by type, upload receipts, track vendors.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Expenses;