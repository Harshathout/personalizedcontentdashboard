import React, { useEffect } from 'react';
import { RootState } from '@/store/store';
import { fetchContent, fetchTrending } from '@/store/slices/contentSlice';
import { ContentGrid } from '@/components/Content/ContentGrid';
import { motion } from 'framer-motion';
import { TrendingUp, Heart, Rss, Loader2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';

export const Dashboard: React.FC = () => {
  const { activeTab, darkMode } = useAppSelector((state: RootState) => state.ui);
  const { items, favorites, trending, loading, searchQuery, searchResults } = useAppSelector((state: RootState) => state.content);
  const { preferences } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchContent({ page: 1, categories: preferences.categories }));
    dispatch(fetchTrending());
  }, [dispatch, preferences.categories]);

  const getActiveContent = () => {
    if (searchQuery && searchResults.length > 0) {
      return searchResults;
    }

    switch (activeTab) {
      case 'trending':
        return trending;
      case 'favorites':
        return favorites;
      default:
        return items;
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'trending': return TrendingUp;
      case 'favorites': return Heart;
      default: return Rss;
    }
  };

  const getTabTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    
    switch (activeTab) {
      case 'trending': return 'Trending Content';
      case 'favorites': return 'Your Favorites';
      default: return 'Your Personalized Feed';
    }
  };

  const activeContent = getActiveContent();
  const TabIcon = getTabIcon(activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className={`p-3 rounded-xl ${
          darkMode 
            ? 'bg-gray-800 text-blue-400' 
            : 'bg-blue-100 text-blue-600'
        }`}>
          <TabIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {getTabTitle()}
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {activeContent.length} items
          </p>
        </div>
      </motion.div>

      {/* Content */}
      {loading && activeContent.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className={`w-8 h-8 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
          </motion.div>
        </div>
      ) : activeContent.length > 0 ? (
        <ContentGrid 
          items={activeContent} 
          enableDragDrop={activeTab === 'feed' && !searchQuery}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
        >
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            darkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <TabIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            {searchQuery ? 'No search results found' : `No ${activeTab} content yet`}
          </h3>
          <p>
            {searchQuery 
              ? 'Try adjusting your search terms' 
              : `Content will appear here once available`
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};
