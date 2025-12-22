import { createContext, useState, useContext } from 'react';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const validateCredentials = (id, password) => {
        if (id === 'admin' && password === 'admin') {
            return { id: 'admin', name: 'Administrator', role: 'admin', photo: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff' };
        }
        if (id === 'user' && password === 'test') {
            return { id: 'user', name: 'Test User', role: 'customer', photo: 'https://ui-avatars.com/api/?name=Test+User&background=random' };
        }
        return null;
    };

    const logout = () => {
        setUser(null);
    };

    const addToCart = (sweet, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === sweet.id);
            if (existing) {
                return prev.map(item =>
                    item.id === sweet.id
                        ? { ...item, cartQuantity: item.cartQuantity + quantity }
                        : item
                );
            }
            return [...prev, { ...sweet, cartQuantity: quantity }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(0, item.cartQuantity + delta);
                return { ...item, cartQuantity: newQuantity };
            }
            return item;
        }).filter(item => item.cartQuantity > 0));
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.cartQuantity), 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.cartQuantity, 0);

    return (
        <ShopContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            user,
            login,
            logout,
            validateCredentials
        }}>
            {children}
        </ShopContext.Provider>
    );
};
