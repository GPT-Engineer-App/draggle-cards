import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Terminal, Plus, Check, BarChart } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactConfetti from 'react-confetti';
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [newTasks, setNewTasks] = useState({
    recon: '',
    exploit: '',
    exfiltrate: '',
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({
    recon: 0,
    exploit: 0,
    exfiltrate: 0,
  });
  const [logs, setLogs] = useState([]);

  const addLog = useCallback((message) => {
    setLogs((prevLogs) => [...prevLogs, `[${new Date().toISOString()}] ${message}`]);
  }, []);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
  }, []);

  const markTaskAsDone = useCallback((columnId, taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [columnId]: prev[columnId] + 1
    }));
    setColumns(prevColumns => {
      const column = prevColumns[columnId];
      const task = column.cards.find(card => card.id === taskId);
      const updatedCards = column.cards.filter(card => card.id !== taskId);
      const updatedColumn = { ...column, cards: updatedCards };
      triggerConfetti();
      addLog(`Task completed in ${column.title}: ${task.content}`);
      return { ...prevColumns, [columnId]: updatedColumn };
    });
  }, [triggerConfetti, addLog]);

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

  const handleAddTask = (columnId) => {
    if (newTasks[columnId].trim() !== '') {
      const newTaskId = `task${Date.now()}`;
      const newTaskContent = newTasks[columnId].trim();
      const updatedColumn = {
        ...columns[columnId],
        cards: [
          ...columns[columnId].cards,
          { id: newTaskId, content: newTaskContent }
        ]
      };

      setColumns({
        ...columns,
        [columnId]: updatedColumn
      });

      setNewTasks({
        ...newTasks,
        [columnId]: ''
      });

      addLog(`New task added to ${columns[columnId].title}: ${newTaskContent}`);
    }
  };

  const columnStats = useMemo(() => {
    return Object.entries(columns).reduce((acc, [columnId, column]) => {
      acc[columnId] = {
        total: column.cards.length,
        completed: completedTasks[columnId]
      };
      return acc;
    }, {});
  }, [columns, completedTasks]);

  useEffect(() => {
    const initialLog = `System initialized.\nLoading Hacker's Kanban...`;
    addLog(initialLog);
  }, [addLog]);

  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        "Scanning network...",
        "Probing firewall...",
        "Analyzing vulnerabilities...",
        "Updating task status...",
        "Monitoring system resources...",
      ];
      addLog(messages[Math.floor(Math.random() * messages.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, [addLog]);

  const TerminalLogs = () => (
    <ScrollArea className="h-64 w-full border border-green-400 rounded-lg p-4 bg-black text-green-400 font-mono text-sm">
      {logs.map((log, index) => (
        <div key={index} className="whitespace-pre-wrap">
          {log}
        </div>
      ))}
    </ScrollArea>
  );

  return (
    <div className="p-8 bg-black text-green-400 min-h-screen">
      {showConfetti && <ReactConfetti colors={['#10B981', '#34D399', '#6EE7B7']} />}
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Terminal className="mr-2" />
        Hacker's Kanban
      </h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="bg-gray-900 p-4 rounded-lg w-80 border border-green-400">
              <h2 className="text-lg font-semibold mb-2 text-green-400">{column.title}</h2>
              <div className="flex items-center mb-4 text-sm">
                <BarChart className="mr-2 h-4 w-4" />
                <span>
                  Tasks: {columnStats[column.id].total} | Completed: {columnStats[column.id].completed}
                </span>
              </div>
              <div className="flex mb-4">
                <Input
                  type="text"
                  placeholder="New task"
                  value={newTasks[column.id]}
                  onChange={(e) => setNewTasks({ ...newTasks, [column.id]: e.target.value })}
                  className="mr-2 bg-gray-800 text-green-400 border-green-400"
                />
                <Button onClick={() => handleAddTask(column.id)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
                            } flex justify-between items-center`}
                          >
                            <span>{card.content}</span>
                            <Button
                              onClick={() => markTaskAsDone(column.id, card.id)}
                              className="bg-green-600 hover:bg-green-700 p-1 rounded-full"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
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
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Terminal className="mr-2" />
          System Logs
        </h2>
        <TerminalLogs />
      </div>
    </div>
  );
};

export default Index;
