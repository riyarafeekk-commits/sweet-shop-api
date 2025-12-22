import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function Navbar({ onCartClick, onSearchClick }) {
  const { cartCount, user } = useShop();
  const navigate = useNavigate();

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-[90%] md:max-w-4xl">
      <nav className="bg-white/40 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl px-6 py-3 flex justify-between items-center transition-all duration-300 hover:bg-white/50 hover:scale-[1.01] hover:shadow-blue-500/20">
        <Link to="/" className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          Sweet Shop
        </Link>

        <div className="flex items-center space-x-4">
          <button
            onClick={onSearchClick}
            className="p-2 rounded-full hover:bg-white/30 transition-colors group"
            title="Search"
          >
            <svg className="w-6 h-6 text-gray-700 group-hover:text-blue-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button
            onClick={() => navigate('/login')}
            className="p-2 rounded-full hover:bg-white/30 transition-colors group relative"
            title={user ? user.name : "Login"}
          >
            {user && user.photo ? (
              <img src={user.photo} alt="Profile" className="w-8 h-8 rounded-full border border-white/50 shadow-sm object-cover" />
            ) : (
              <svg className="w-6 h-6 text-gray-700 group-hover:text-blue-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={onCartClick}
            className="flex items-center space-x-2 bg-white/60 hover:bg-white/90 text-blue-900 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md border border-white/40"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="font-bold text-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}
