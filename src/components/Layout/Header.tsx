
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleSidebar, toggleDarkMode } from '@/store/slices/uiSlice';
import { setSearchQuery, clearSearch, searchContent } from '@/store/slices/contentSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { motion } from 'framer-motion';
import { Menu, Search, Moon, Sun, Settings, Bell } from 'lucide-react';

export const Header: React.FC = () => {
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const { searchQuery } = useSelector((state: RootState) => state.content);
  const dispatch = useDispatch();
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  React.useEffect(() => {
    if (debouncedSearchQuery) {
      dispatch(setSearchQuery(debouncedSearchQuery));
      dispatch(searchContent(debouncedSearchQuery));
    } else {
      dispatch(clearSearch());
    }
  }, [debouncedSearchQuery, dispatch]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`h-16 ${
        darkMode 
          ? 'bg-gray-800/95 backdrop-blur-sm border-gray-700' 
          : 'bg-white/95 backdrop-blur-sm border-gray-200'
      } border-b px-6 flex items-center justify-between shadow-sm`}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <motion.button
          onClick={() => dispatch(toggleSidebar())}
          className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="w-5 h-5" />
        </motion.button>

        {/* Search Bar */}
        <div className="relative">
          <div className={`flex items-center space-x-2 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          } rounded-xl px-4 py-2 w-80`}>
            <Search className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search content..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className={`flex-1 bg-transparent outline-none ${
                darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        <motion.button
          onClick={() => dispatch(toggleDarkMode())}
          className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'hover:bg-gray-700 text-yellow-400' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        <motion.button
          className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-5 h-5" />
        </motion.button>

        <motion.button
          className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.header>
  );
};
