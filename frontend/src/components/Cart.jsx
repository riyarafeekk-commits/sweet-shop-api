import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function Cart({ isOpen, onClose }) {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, user, clearCart } = useShop();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleCheckout = (e) => {
        e.preventDefault();
        if (!user) {
            onClose();
            navigate('/login');
        } else {
            if (confirm(`Thank you ${user.name}! Your order of $${cartTotal.toFixed(2)} has been placed.`)) {
                clearCart();
                onClose();
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gray-600/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md bg-white/80 backdrop-blur-2xl shadow-2xl flex flex-col h-full border-l border-white/50">
                    <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Your Bag</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                                <span className="sr-only">Close panel</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-8">
                            {cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <p className="text-gray-500 text-lg">Your cart is empty.</p>
                                    <button onClick={onClose} className="mt-4 text-blue-600 hover:text-blue-800 font-medium">Continue Shopping</button>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200/50">
                                    {cartItems.map((item) => (
                                        <li key={item.id} className="py-6 flex">
                                            <div className="flex-shrink-0 w-24 h-24 border border-white rounded-xl overflow-hidden shadow-sm">
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-center object-cover" />
                                            </div>

                                            <div className="ml-4 flex-1 flex flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3>{item.name}</h3>
                                                        <p className="ml-4 font-bold text-blue-600">${(item.price * item.cartQuantity).toFixed(2)}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                                                </div>
                                                <div className="flex-1 flex items-end justify-between text-sm">
                                                    <div className="flex items-center space-x-3 bg-white/50 rounded-lg px-2 py-1 border border-white/60">
                                                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-full transition-colors font-bold text-gray-600">-</button>
                                                        <span className="font-medium w-4 text-center">{item.cartQuantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-full transition-colors font-bold text-gray-600">+</button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="font-medium text-red-500 hover:text-red-700 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-200/60 bg-white/30 p-6">
                        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                            <p>Subtotal</p>
                            <p className="text-xl font-bold">${cartTotal.toFixed(2)}</p>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                            className={`w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white transition-all transform hover:-translate-y-0.5 active:scale-95 ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-purple-500/30'}`}
                        >
                            {user ? 'Checkout' : 'Login to Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
