
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_SWEETS } from '../api/mockData';
import { sweetsApi } from '../api/api';

export default function SearchOverlay({ isOpen, onClose }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState([]);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Sync internal state with URL params (handles external navigation like clicking Logo)
    useEffect(() => {
        setQuery(searchParams.get('q') || '');
    }, [searchParams]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Image randomizer helper (duplicate logic, could be in util)
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
        const fetchResults = async () => {
            if (query.trim()) {
                try {
                    // Search by both name and category if possible, but API has separate params.
                    // Let's just search by name for now as typical search bar behavior.
                    // Or ideally backend supports a general 'query' param?
                    // Looking at controller: searchSweets(@RequestParam(required = false) String name...)
                    // It filters: if name != null -> filter name.

                    // We can do two requests or just search name for simplicity in this overlay
                    const data = await sweetsApi.search({ name: query });
                    const enrichedData = data.map(s => ({ ...s, image_url: getRandomImage(s.id) }));
                    setResults(enrichedData);
                } catch (e) {
                    console.error("Search failed", e);
                    setResults([]);
                }
            } else {
                setResults([]);
            }
        };

        // Debounce API call and URL update
        const timer = setTimeout(() => {
            fetchResults();

            if (query) {
                setSearchParams(prev => {
                    prev.set('q', query);
                    return prev;
                });
            } else {
                setSearchParams(prev => {
                    prev.delete('q');
                    return prev;
                });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, setSearchParams]);

    const handleCreateSearch = (e) => {
        setQuery(e.target.value);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-xl flex flex-col pt-24 px-4 overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full relative"
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search sweets..."
                                className="w-full bg-transparent text-5xl font-black text-gray-900 placeholder-gray-300 border-b-2 border-gray-200 focus:border-blue-500 outline-none py-6 transition-colors"
                                value={query}
                                onChange={handleCreateSearch}
                            />
                        </motion.div>

                        {/* Live Results Grid */}
                        <div className="mt-12 flex-1 overflow-y-auto pb-20 custom-scrollbar">
                            {results.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {results.map((sweet) => (
                                        <motion.div
                                            key={sweet.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer border border-gray-100 flex items-center space-x-4 transition-all"
                                            onClick={() => {
                                                onClose();
                                                // Navigate to detail page if we had one, or just close to show Home
                                            }}
                                        >
                                            <img src={sweet.image_url} alt={sweet.name} className="w-16 h-16 rounded-lg object-cover" />
                                            <div>
                                                <h4 className="font-bold text-gray-900">{sweet.name}</h4>
                                                <p className="text-sm text-gray-500">{sweet.category}</p>
                                                <p className="text-blue-600 font-bold mt-1">${sweet.price}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : query ? (
                                <p className="text-center text-gray-400 text-xl mt-10">No matches found for "{query}"</p>
                            ) : (
                                <div className="text-center text-gray-400 mt-10">
                                    <p className="text-lg">Try searching for "Chocolate", "Bears", or "Candy"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

