
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MOCK_SWEETS } from '../api/mockData'
import { sweetsApi } from '../api/api'
import SweetCard from '../components/SweetCard'

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true);
  const [filteredSweets, setFilteredSweets] = useState([])

  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

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
    const fetchSweets = async () => {
      try {
        setLoading(true);
        // We can use the check search endpoint for all sweets if no params
        // But better to use Client side filtering for specific fields if backend only supports exact matches or 
        // to conform to existing logic.
        // Backend search supports name, category, minPrice, maxPrice.
        // Let's fetch all and filter client side for smoother experience with existing code structure
        // unless dataset is huge. For now, fetch all.
        const data = await sweetsApi.getAll();
        const enrichedData = data.map(s => ({ ...s, image_url: getRandomImage(s.id) }));
        setSweets(enrichedData);
        setFilteredSweets(enrichedData);
      } catch (err) {
        console.error("Failed to fetch sweets", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSweets();
  }, [])

  useEffect(() => {
    let result = sweets;

    // Filter by Search
    if (searchQuery) {
      result = result.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Filter by Category (Multi-select)
    if (selectedCategories.length > 0) {
      result = result.filter(s => selectedCategories.includes(s.category));
    }

    setFilteredSweets(result);
  }, [searchQuery, selectedCategories, sweets]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-xl font-bold text-gray-400">Loading sweets...</p></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
      <div className="container mx-auto">

        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Results for "${searchQuery}"` : 'Our Collection'}
            </h1>
            <p className="text-gray-500 mt-1">
              Showing {filteredSweets.length} sweet treats
            </p>
          </div>

          <div className="relative z-30">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${isFilterOpen || selectedCategories.length > 0
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Filters</span>
              {selectedCategories.length > 0 && (
                <span className="bg-white text-blue-600 w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  {selectedCategories.length}
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Categories</span>
                    {selectedCategories.length > 0 && (
                      <button
                        onClick={() => setSelectedCategories([])}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center space-x-3 cursor-pointer group p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                        />
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(cat)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 group-hover:border-blue-400'
                          }`}>
                          {selectedCategories.includes(cat) && (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`font-medium ${selectedCategories.includes(cat) ? 'text-blue-900' : 'text-gray-700'}`}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence>
            {filteredSweets.map((sweet) => (
              <motion.div
                key={sweet.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <SweetCard sweet={sweet} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredSweets.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl text-gray-400 font-bold">No sweets found.</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
            {(searchQuery || selectedCategories.length > 0) && (
              <button
                onClick={() => { setSelectedCategories([]); }}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

