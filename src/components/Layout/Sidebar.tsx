
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setActiveTab } from '@/store/slices/uiSlice';
import { motion } from 'framer-motion';
import { Home, TrendingUp, Heart, Settings, User } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { sidebarOpen, activeTab, darkMode } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  const menuItems = [
    { id: 'feed' as const, label: 'Feed', icon: Home },
    { id: 'trending' as const, label: 'Trending', icon: TrendingUp },
    { id: 'favorites' as const, label: 'Favorites', icon: Heart },
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: sidebarOpen ? 0 : -300 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed left-0 top-0 h-full w-64 z-30 ${
        darkMode 
          ? 'bg-gray-800/95 backdrop-blur-sm border-gray-700' 
          : 'bg-white/95 backdrop-blur-sm border-gray-200'
      } border-r shadow-lg`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            ContentHub
          </motion.h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => dispatch(setActiveTab(item.id))}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? darkMode
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <motion.div 
            className={`flex items-center space-x-3 p-3 rounded-xl ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } cursor-pointer transition-colors`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Guest User
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                guest@example.com
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
};
