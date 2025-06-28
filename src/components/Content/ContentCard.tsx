
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleFavorite, ContentItem } from '@/store/slices/contentSlice';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Clock, Tag } from 'lucide-react';

interface ContentCardProps {
  item: ContentItem;
  index: number;
}

export const ContentCard: React.FC<ContentCardProps> = ({ item, index }) => {
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleFavorite(item.id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'news': return 'bg-blue-500';
      case 'movie': return 'bg-purple-500';
      case 'social': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-800/90 backdrop-blur-sm border border-gray-700' 
          : 'bg-white/90 backdrop-blur-sm border border-gray-200'
      }`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Type Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium text-white ${getTypeColor(item.type)}`}>
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </div>

        {/* Favorite Button */}
        <motion.button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            item.isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {item.title}
        </h3>
        
        <p className={`text-sm mb-4 line-clamp-3 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {item.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatDate(item.publishedAt)}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Tag className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {item.category}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <motion.button
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Read More
          </motion.button>
          
          {item.url && (
            <motion.button
              className={`p-2 rounded-xl border transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
