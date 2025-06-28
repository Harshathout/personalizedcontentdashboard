
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { reorderContent, ContentItem } from '@/store/slices/contentSlice';
import { ContentCard } from './ContentCard';
import { motion } from 'framer-motion';

interface ContentGridProps {
  items: ContentItem[];
  enableDragDrop?: boolean;
}

export const ContentGrid: React.FC<ContentGridProps> = ({ items, enableDragDrop = false }) => {
  const dispatch = useDispatch();

  const handleDragEnd = (result: any) => {
    if (!result.destination || !enableDragDrop) return;

    dispatch(reorderContent({
      startIndex: result.source.index,
      endIndex: result.destination.index,
    }));
  };

  if (!enableDragDrop) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <ContentCard key={item.id} item={item} index={index} />
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="content-grid">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`transition-transform duration-200 ${
                      snapshot.isDragging ? 'rotate-2 scale-105 z-50' : ''
                    }`}
                  >
                    <ContentCard item={item} index={index} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
