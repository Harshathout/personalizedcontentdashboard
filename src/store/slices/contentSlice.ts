
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface ContentItem {
  id: string;
  type: 'news' | 'movie' | 'social';
  title: string;
  description: string;
  image: string;
  url?: string;
  category: string;
  publishedAt: string;
  isFavorite: boolean;
}

interface ContentState {
  items: ContentItem[];
  favorites: ContentItem[];
  trending: ContentItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  searchQuery: string;
  searchResults: ContentItem[];
}

const initialState: ContentState = {
  items: [],
  favorites: [],
  trending: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
  searchQuery: '',
  searchResults: [],
};

// Mock data for demonstration
const mockNewsData: ContentItem[] = [
  {
    id: '1',
    type: 'news',
    title: 'Revolutionary AI Technology Breakthrough',
    description: 'Scientists announce major breakthrough in artificial intelligence that could change everything.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    category: 'technology',
    publishedAt: '2024-06-28T10:00:00Z',
    isFavorite: false,
  },
  {
    id: '2',
    type: 'movie',
    title: 'The Future of Cinema',
    description: 'An epic sci-fi adventure that redefines storytelling in the digital age.',
    image: 'https://images.unsplash.com/photo-1489599316546-1cf6f2bb8c7c?w=400&h=300&fit=crop',
    category: 'entertainment',
    publishedAt: '2024-06-28T09:30:00Z',
    isFavorite: false,
  },
  {
    id: '3',
    type: 'social',
    title: 'Trending: #TechInnovation',
    description: 'Join the conversation about the latest innovations in technology.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    category: 'social',
    publishedAt: '2024-06-28T08:45:00Z',
    isFavorite: false,
  },
];

const mockTrendingData: ContentItem[] = [
  {
    id: 't1',
    type: 'news',
    title: 'Global Climate Summit Announces New Initiatives',
    description: 'World leaders unite for unprecedented climate action plan.',
    image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop',
    category: 'environment',
    publishedAt: '2024-06-28T11:00:00Z',
    isFavorite: false,
  },
  {
    id: 't2',
    type: 'movie',
    title: 'Summer Blockbuster Takes Box Office',
    description: 'The most anticipated movie of the year breaks opening weekend records.',
    image: 'https://images.unsplash.com/photo-1489599316546-1cf6f2bb8c7c?w=400&h=300&fit=crop',
    category: 'entertainment',
    publishedAt: '2024-06-28T10:30:00Z',
    isFavorite: false,
  },
];

export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async ({ page, categories }: { page: number; categories: string[] }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data with pagination
    const filteredData = mockNewsData.filter(item => 
      categories.length === 0 || categories.includes(item.category)
    );
    
    return {
      items: filteredData,
      hasMore: page < 3, // Simulate pagination
    };
  }
);

export const fetchTrending = createAsyncThunk(
  'content/fetchTrending',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockTrendingData;
  }
);

export const searchContent = createAsyncThunk(
  'content/searchContent',
  async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const allContent = [...mockNewsData, ...mockTrendingData];
    const results = allContent.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    
    return results;
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      
      // Update in main items
      const item = state.items.find(item => item.id === itemId);
      if (item) {
        item.isFavorite = !item.isFavorite;
        if (item.isFavorite) {
          state.favorites.push(item);
        } else {
          state.favorites = state.favorites.filter(fav => fav.id !== itemId);
        }
      }
      
      // Update in trending items
      const trendingItem = state.trending.find(item => item.id === itemId);
      if (trendingItem) {
        trendingItem.isFavorite = !trendingItem.isFavorite;
        if (trendingItem.isFavorite && !state.favorites.find(fav => fav.id === itemId)) {
          state.favorites.push(trendingItem);
        } else if (!trendingItem.isFavorite) {
          state.favorites = state.favorites.filter(fav => fav.id !== itemId);
        }
      }
    },
    reorderContent: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
      const { startIndex, endIndex } = action.payload;
      const result = Array.from(state.items);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      state.items = result;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.page === 1) {
          state.items = action.payload.items;
        } else {
          state.items.push(...action.payload.items);
        }
        state.hasMore = action.payload.hasMore;
        state.page = action.meta.arg.page;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch content';
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trending = action.payload;
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  },
});

export const { toggleFavorite, reorderContent, setSearchQuery, clearSearch } = contentSlice.actions;
export default contentSlice.reducer;
