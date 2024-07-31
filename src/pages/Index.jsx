import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const initialColumns = {
  'todo': {
    id: 'todo',
    title: 'To Do',
    cards: [
      { id: 'task1', content: 'Create mockup' },
      { id: 'task2', content: 'Design components' },
    ],
  },
  'inprogress': {
    id: 'inprogress',
    title: 'In Progress',
    cards: [
      { id: 'task3', content: 'Implement drag and drop' },
    ],
  },
  'done': {
    id: 'done',
    title: 'Done',
    cards: [
      { id: 'task4', content: 'Set up project' },
    ],
  },
};

const Index = () => {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const newCards = Array.from(column.cards);
      const [reorderedItem] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, reorderedItem);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          cards: newCards,
        },
      });
    } else {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceCards = Array.from(sourceColumn.cards);
      const destCards = Array.from(destColumn.cards);
      const [movedItem] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, movedItem);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          cards: sourceCards,
        },
        [destination.droppableId]: {
          ...destColumn,
          cards: destCards,
        },
      });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Trello Clone</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="bg-gray-100 p-4 rounded-lg w-80">
              <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px]"
                  >
                    {column.cards.map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-3 rounded shadow mb-2 ${
                              snapshot.isDragging ? 'opacity-50' : ''
                            }`}
                          >
                            {card.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Index;
