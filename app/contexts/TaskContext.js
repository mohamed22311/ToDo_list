import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TaskContext = createContext();

const TASKS_STORAGE_KEY = '@tasks';

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([
    { id: '1', name: 'Personal', color: '#4A6FFF' },
    { id: '2', name: 'Work', color: '#FF4D4F' },
    { id: '3', name: 'Shopping', color: '#FAAD14' },
    { id: '4', name: 'Health', color: '#52C41A' },
  ]);

  // Load tasks from AsyncStorage
  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      console.log('TaskContext: loadTasks - Raw data from storage:', storedTasks);
      
      if (storedTasks !== null) {
        const parsedTasks = JSON.parse(storedTasks);
        console.log('TaskContext: loadTasks - Parsed tasks count:', parsedTasks.length);
        setTasks(parsedTasks);
      } else {
        console.log('TaskContext: loadTasks - No tasks found in storage');
        setTasks([]);
      }
    } catch (error) {
      console.error('TaskContext: loadTasks - Error loading tasks:', error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save tasks to AsyncStorage
  const saveTasks = useCallback(async (tasksToSave) => {
    try {
      const tasksJson = JSON.stringify(tasksToSave);
      console.log('TaskContext: saveTasks - Saving tasks to storage, count:', tasksToSave.length);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, tasksJson);
      console.log('TaskContext: saveTasks - Successfully saved tasks to storage');
      return true;
    } catch (error) {
      console.error('TaskContext: saveTasks - Error saving tasks:', error);
      return false;
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Save whenever tasks change
  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks);
    }
  }, [tasks, isLoading, saveTasks]);

  // Add a task
  const addTask = useCallback((task) => {
    console.log('TaskContext: addTask called with:', JSON.stringify(task, null, 2));
    
    if (!task) {
      console.error('TaskContext: addTask - task is null or undefined');
      return null;
    }
    
    if (!task.text || task.text.trim() === '') {
      console.error('TaskContext: addTask - missing text');
      return null;
    }
    
    try {
      // Create a new task with defaults and the provided values
      const newTask = { 
        id: Date.now().toString(), // Ensure unique ID
        createdAt: new Date().toISOString(),
        completed: false,
        text: task.text.trim(),
        priority: task.priority || 'medium',
        categoryId: task.categoryId || '1', // Default to Personal if no category
        dueDate: task.dueDate || null,
        notes: task.notes || ''
      };
      
      console.log('TaskContext: addTask - Created new task:', JSON.stringify(newTask, null, 2));
      
      // Update state with the new task
      setTasks(prevTasks => {
        console.log('TaskContext: addTask - Previous tasks count:', prevTasks.length);
        const updatedTasks = [newTask, ...prevTasks];
        console.log('TaskContext: addTask - New tasks count:', updatedTasks.length);
        
        // Immediately save to storage
        saveTasks(updatedTasks);
        
        return updatedTasks;
      });
      
      return newTask; // Return the created task
    } catch (error) {
      console.error('TaskContext: addTask - Error:', error);
      return null;
    }
  }, [saveTasks]);

  // Update a task
  const updateTask = useCallback((id, updatedTask) => {
    console.log('TaskContext: updateTask - Updating task:', id, JSON.stringify(updatedTask, null, 2));
    
    setTasks(prevTasks => {
      const updated = prevTasks.map(task => 
        task.id === id ? { ...task, ...updatedTask } : task
      );
      
      // Immediately save to storage
      saveTasks(updated);
      
      return updated;
    });
  }, [saveTasks]);

  // Delete a task
  const deleteTask = useCallback((id) => {
    console.log('TaskContext: deleteTask - Deleting task:', id);
    
    setTasks(prevTasks => {
      const filtered = prevTasks.filter(task => task.id !== id);
      
      // Immediately save to storage
      saveTasks(filtered);
      
      return filtered;
    });
  }, [saveTasks]);

  // Toggle task completion
  const toggleTaskCompletion = useCallback((id) => {
    console.log('TaskContext: toggleTaskCompletion - Toggling task:', id);
    
    setTasks(prevTasks => {
      const updated = prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      
      // Immediately save to storage
      saveTasks(updated);
      
      return updated;
    });
  }, [saveTasks]);

  // Add category
  const addCategory = useCallback((category) => {
    const newCategory = { 
      id: Date.now().toString(),
      ...category 
    };
    
    setCategories(prevCategories => [...prevCategories, newCategory]);
  }, []);

  // Delete category
  const deleteCategory = useCallback((id) => {
    setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
  }, []);

  // Filter tasks by various criteria
  const filterTasks = useCallback(({ categoryId, priority, searchQuery = '', showCompleted = true }) => {
    // Clean up search query
    const trimmedQuery = searchQuery.trim().toLowerCase();
    
    return tasks.filter(task => {
      // Filter by completion status
      if (!showCompleted && task.completed) return false;
      
      // Filter by category
      if (categoryId && task.categoryId !== categoryId) return false;
      
      // Filter by priority
      if (priority && task.priority !== priority) return false;
      
      // Filter by search query - improved to handle whole word search
      if (trimmedQuery) {
        const taskText = task.text.toLowerCase();
        return taskText.includes(trimmedQuery);
      }
      
      return true;
    });
  }, [tasks]);

  // Clear all tasks (for testing)
  const clearAllTasks = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(TASKS_STORAGE_KEY);
      setTasks([]);
      console.log('TaskContext: clearAllTasks - All tasks cleared');
      return true;
    } catch (error) {
      console.error('TaskContext: clearAllTasks - Error:', error);
      return false;
    }
  }, []);

  // Force reload tasks from storage
  const reloadTasks = useCallback(() => {
    console.log('TaskContext: reloadTasks - Forcing reload');
    loadTasks();
  }, [loadTasks]);

  return (
    <TaskContext.Provider value={{
      tasks,
      categories,
      isLoading,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion,
      addCategory,
      deleteCategory,
      filterTasks,
      clearAllTasks,
      reloadTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
}; 