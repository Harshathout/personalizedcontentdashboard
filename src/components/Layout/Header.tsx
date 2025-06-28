
import React, { useState } from 'react';
import { RootState } from '@/store/store';
import { toggleSidebar, toggleDarkMode } from '@/store/slices/uiSlice';
import { setSearchQuery, clearSearch, searchContent } from '@/store/slices/contentSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { motion } from 'framer-motion';
import { Menu, Search, Moon, Sun, Settings, Bell, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';

export const Header: React.FC = () => {
  const { darkMode, sidebarOpen } = useAppSelector((state: RootState) => state.ui);
  const { searchQuery } = useAppSelector((state: RootState) => state.content);
  const dispatch = useAppDispatch();
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky top-0 z-40 ${
        darkMode 
          ? 'bg-gray-800/95 backdrop-blur-sm border-gray-700' 
          : 'bg-white/95 backdrop-blur-sm border-gray-200'
      } border-b shadow-sm`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Toggle and Search */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle Button */}
          <motion.button
            onClick={handleToggleSidebar}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </motion.button>

          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search content..."
              value={localSearchQuery}
              onChange={handleSearchChange}
              className={`pl-10 pr-4 py-2 w-80 rounded-xl border transition-all ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          <motion.button
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={handleToggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>

          <motion.button
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};
