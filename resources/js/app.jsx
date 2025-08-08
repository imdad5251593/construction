import './bootstrap';
import '../css/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Investors from './components/Investors';
import Investments from './components/Investments';
import Expenses from './components/Expenses';
import Categories from './components/Categories';
import Reports from './components/Reports';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/investors" element={<Investors />} />
                    <Route path="/investments" element={<Investments />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/reports" element={<Reports />} />
                </Routes>
            </Layout>
        </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
