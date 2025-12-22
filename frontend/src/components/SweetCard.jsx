import { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function SweetCard({ sweet }) {
    const { addToCart } = useShop();
    const [quantity, setQuantity] = useState(1);

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        addToCart(sweet, quantity);
        setQuantity(1); // Reset after adding
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full group border border-white/50">
            <div className="relative h-56 overflow-hidden">
                <img
                    src={sweet.image_url}
                    alt={sweet.name}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {sweet.category}
                </span>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1" title={sweet.name}>
                    {sweet.name}
                </h2>

                <div className="flex justify-between items-center mt-2 mb-4 text-sm text-gray-600">
                    <span>Stock:</span>
                    <span className={`font-medium ${sweet.quantity < 20 ? 'text-red-500' : 'text-green-600'}`}>
                        {sweet.quantity} units
                    </span>
                </div>

                <div className="flex-grow"></div>

                <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-gray-900">${sweet.price.toFixed(2)}</span>

                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button onClick={handleDecrement} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-md transition-colors font-bold">-</button>
                            <span className="w-8 text-center font-medium">{quantity}</span>
                            <button onClick={handleIncrement} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-md transition-colors font-bold">+</button>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
