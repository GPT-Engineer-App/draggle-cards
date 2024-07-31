import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Terminal } from 'lucide-react';

const initialColumns = {
  'recon': {
    id: 'recon',
    title: 'Reconnaissance',
    cards: [
      { id: 'task1', content: 'Scan network vulnerabilities' },
      { id: 'task2', content: 'Identify target systems' },
    ],
  },
  'exploit': {
    id: 'exploit',
    title: 'Exploitation',
    cards: [
      { id: 'task3', content: 'Develop custom exploit' },
    ],
  },
  'exfiltrate': {
    id: 'exfiltrate',
    title: 'Exfiltration',
    cards: [
      { id: 'task4', content: 'Extract sensitive data' },
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
    <div className="p-8 bg-black text-green-400 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Terminal className="mr-2" />
        Hacker's Kanban
      </h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="bg-gray-900 p-4 rounded-lg w-80 border border-green-400">
              <h2 className="text-lg font-semibold mb-4 text-green-400">{column.title}</h2>
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
                            className={`bg-gray-800 p-3 rounded shadow mb-2 border border-green-400 ${
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
