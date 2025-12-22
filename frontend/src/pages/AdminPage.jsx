
import { useState, useEffect } from 'react';
import { sweetsApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
    const [sweets, setSweets] = useState([]);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Form State
    const [currentSweet, setCurrentSweet] = useState({ name: '', category: 'Candy', price: '', quantity: '' });
    const [editId, setEditId] = useState(null);

    // Constants
    const categories = ['Candy', 'Chocolate', 'Hard'];

    const getRandomImage = (id) => {
        const images = [
            "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1499195333224-3ce974eecb47?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1478144592103-25e218a04891?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1504185945330-dd4fa29c47f2?auto=format&fit=crop&w=400&q=80"
        ];
        return images[id % images.length];
    };

    useEffect(() => {
        if (!isAuthenticated) return navigate('/login');
        fetchSweets();
    }, [isAuthenticated, navigate]);

    const fetchSweets = async () => {
        try {
            setLoading(true);
            const data = await sweetsApi.getAll();
            const enrichedData = data.map(s => ({ ...s, image_url: getRandomImage(s.id) }));
            setSweets(enrichedData);
        } catch (error) {
            console.error("Failed to fetch sweets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await sweetsApi.delete(id);
                setSweets(prev => prev.filter(sweet => sweet.id !== id));
            } catch (error) {
                console.error("Failed to delete sweet", error);
                alert("Failed to delete sweet");
            }
        }
    };

    const handleRestock = async (id) => {
        const quantityStr = prompt("Enter quantity to restock:");
        if (!quantityStr) return;
        const quantity = parseInt(quantityStr);
        if (isNaN(quantity) || quantity <= 0) {
            alert("Invalid quantity");
            return;
        }

        try {
            await sweetsApi.restock(id, quantity);
            fetchSweets();
        } catch (error) {
            console.error("Restock failed", error);
            alert("Restock failed");
        }
    };

    const openEditModal = (sweet) => {
        setEditId(sweet.id);
        setCurrentSweet({
            name: sweet.name,
            category: sweet.category,
            price: sweet.price,
            quantity: sweet.quantity
        });
        setIsEditModalOpen(true);
    };

    const handleAddSweet = async (e) => {
        e.preventDefault();
        try {
            await sweetsApi.add({
                name: currentSweet.name,
                category: currentSweet.category,
                price: parseFloat(currentSweet.price),
                quantity: parseInt(currentSweet.quantity)
            });
            setIsAddModalOpen(false);
            setCurrentSweet({ name: '', category: 'Candy', price: '', quantity: '' });
            fetchSweets();
        } catch (error) {
            console.error("Failed to add sweet", error);
            alert("Failed to add sweet");
        }
    };

    const handleUpdateSweet = async (e) => {
        e.preventDefault();
        try {
            await sweetsApi.update(editId, {
                name: currentSweet.name,
                category: currentSweet.category,
                price: parseFloat(currentSweet.price),
                quantity: parseInt(currentSweet.quantity)
            });
            setIsEditModalOpen(false);
            setCurrentSweet({ name: '', category: 'Candy', price: '', quantity: '' });
            setEditId(null);
            fetchSweets();
        } catch (error) {
            console.error("Failed to update sweet", error);
            alert("Failed to update sweet");
        }
    };

    // Shared Form Component could be extracted, but keeping simple here
    const SweetForm = ({ onSubmit, submitLabel, onClose }) => (
        <form onSubmit={onSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition-colors"
                    value={currentSweet.name}
                    onChange={e => setCurrentSweet({ ...currentSweet, name: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition-colors"
                    value={currentSweet.category}
                    onChange={e => setCurrentSweet({ ...currentSweet, category: e.target.value })}
                >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition-colors"
                        value={currentSweet.price}
                        onChange={e => setCurrentSweet({ ...currentSweet, price: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Quantity</label>
                    <input
                        type="number"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition-colors"
                        value={currentSweet.quantity}
                        onChange={e => setCurrentSweet({ ...currentSweet, quantity: e.target.value })}
                    />
                </div>
            </div>
            <div className="pt-4 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md transition-all"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );

    if (loading) return <div className="min-h-screen pt-32 text-center text-gray-500">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                    <button
                        onClick={() => {
                            setCurrentSweet({ name: '', category: 'Candy', price: '', quantity: '' });
                            setIsAddModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                    >
                        + Add New Sweet
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Table code is same mostly, just edit button check */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 font-bold text-gray-600 text-sm uppercase tracking-wider">ID</th>
                                    <th className="p-4 font-bold text-gray-600 text-sm uppercase tracking-wider">Product</th>
                                    <th className="p-4 font-bold text-gray-600 text-sm uppercase tracking-wider">Category</th>
                                    <th className="p-4 font-bold text-gray-600 text-sm uppercase tracking-wider">Price</th>
                                    <th className="p-4 font-bold text-gray-600 text-sm uppercase tracking-wider text-center">Stock</th>
                                    <th className="p-4 font-bold text-gray-600 text-sm uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sweets.map((sweet) => (
                                    <tr key={sweet.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="p-4 text-gray-500 font-mono text-sm">#{sweet.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={sweet.image_url}
                                                    alt={sweet.name}
                                                    className="w-10 h-10 rounded-lg object-cover shadow-sm border border-gray-200"
                                                />
                                                <span className="font-bold text-gray-800">{sweet.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold 
                                                ${sweet.category === 'Chocolate' ? 'bg-amber-100 text-amber-800' :
                                                    sweet.category === 'Candy' ? 'bg-pink-100 text-pink-800' :
                                                        'bg-blue-100 text-blue-800'}`}>
                                                {sweet.category}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-gray-700">${sweet.price.toFixed(2)}</td>
                                        <td className="p-4 text-center">
                                            <span className={`font-bold ${sweet.quantity < 20 ? 'text-red-500' : 'text-green-600'}`}>
                                                {sweet.quantity}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => openEditModal(sweet)}
                                                className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleRestock(sweet.id)}
                                                className="text-green-600 hover:text-green-800 font-medium px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
                                            >
                                                Restock
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sweet.id)}
                                                className="text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900">Add New Sweet</h3>
                            </div>
                            <SweetForm onSubmit={handleAddSweet} submitLabel="Add Sweet" onClose={() => setIsAddModalOpen(false)} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900">Edit Sweet</h3>
                            </div>
                            <SweetForm onSubmit={handleUpdateSweet} submitLabel="Save Changes" onClose={() => setIsEditModalOpen(false)} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
