import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView, Platform, Alert, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTask } from '../hooks/useTask';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TaskDetails from '../components/TaskDetails';
import FloatingActionButton from '../components/FloatingActionButton';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const { theme, themeMode } = useTheme();
  const { 
    tasks, 
    categories, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTaskCompletion,
    isLoading,
    clearAllTasks,
    reloadTasks
  } = useTask();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  
  // Add debugging for task state
  useEffect(() => {
    console.log('HomeScreen: Tasks changed, current count:', tasks.length);
  }, [tasks]);
  
  // Debug function - add a test task
  const addTestTask = () => {
    console.log('HomeScreen: Adding test task');
    
    const testTask = {
      text: `Test task ${new Date().toLocaleTimeString()}`,
      priority: 'medium',
      categoryId: '1'
    };
    
    const result = addTask(testTask);
    
    if (result) {
      console.log('HomeScreen: Test task added successfully');
      Alert.alert('Success', 'Test task added successfully');
    } else {
      console.error('HomeScreen: Failed to add test task');
      Alert.alert('Error', 'Failed to add test task');
    }
  };
  
  // Debug function - clear all tasks
  const handleClearAllTasks = async () => {
    console.log('HomeScreen: Clearing all tasks');
    
    try {
      const result = await clearAllTasks();
      
      if (result) {
        console.log('HomeScreen: All tasks cleared successfully');
        Alert.alert('Success', 'All tasks cleared successfully');
      } else {
        console.error('HomeScreen: Failed to clear tasks');
        Alert.alert('Error', 'Failed to clear tasks');
      }
    } catch (error) {
      console.error('HomeScreen: Error clearing tasks:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };
  
  // Debug function - reload tasks
  const handleReloadTasks = () => {
    console.log('HomeScreen: Reloading tasks');
    reloadTasks();
    Alert.alert('Info', 'Tasks reloaded from storage');
  };
  
  // Handle adding a new task
  const handleAddTask = (newTask) => {
    console.log('HomeScreen: Adding task:', JSON.stringify(newTask, null, 2));
    
    if (!newTask || !newTask.text || newTask.text.trim() === '') {
      console.error('HomeScreen: Task validation failed - empty text');
      Alert.alert('Error', 'Task text cannot be empty');
      return null;
    }
    
    try {
      // Create a clean simplified task object (matching our test task approach)
      const taskToAdd = {
        text: newTask.text.trim(),
        priority: newTask.priority || 'medium',
        categoryId: newTask.categoryId || '1',
        notes: newTask.notes || '',
        dueDate: newTask.dueDate || null
      };
      
      console.log('HomeScreen: Calling addTask with simplified task:', JSON.stringify(taskToAdd, null, 2));
      
      // Call the context function directly
      const addedTask = addTask(taskToAdd);
      
      if (addedTask) {
        console.log('HomeScreen: Task added successfully with ID:', addedTask.id);
        Alert.alert('Success', 'Task was successfully added!');
        return addedTask;
      } else {
        console.error('HomeScreen: addTask returned null');
        Alert.alert('Error', 'Failed to add task - unknown error');
        return null;
      }
    } catch (error) {
      console.error('HomeScreen: Error adding task:', error);
      Alert.alert('Error', 'An unexpected error occurred');
      return null;
    }
  };
  
  // Handle long press on a task to open edit modal
  const handleEditTask = (task) => {
    if (task) {
      console.log('HomeScreen: Opening edit modal for task:', task.id);
      
      // First close the details modal if it's open
      if (isDetailsModalVisible) {
        setIsDetailsModalVisible(false);
        
        // Set a small delay before opening the edit modal
        // This gives time for the details modal animation to complete
        setTimeout(() => {
          setCurrentTask(task);
          setIsEditModalVisible(true);
        }, 300);
      } else {
        // If details modal is not open, just open the edit modal directly
        setCurrentTask(task);
        setIsEditModalVisible(true);
      }
    }
  };

  // Handle submission of edit task form
  const handleUpdateTask = (updatedTask) => {
    console.log('HomeScreen: Updating task:', updatedTask.id);
    updateTask(updatedTask.id, updatedTask);
    setIsEditModalVisible(false);
  };

  // Handle task deletion
  const handleDeleteTask = (id) => {
    console.log('HomeScreen: Deleting task with ID:', id);
    
    // Check if id is valid
    if (!id) {
      console.error('HomeScreen: Invalid task ID for deletion:', id);
      Alert.alert('Error', 'Cannot delete task: Invalid ID');
      return;
    }
    
    // Close the details modal first if it's open
    if (isDetailsModalVisible) {
      setIsDetailsModalVisible(false);
      
      // Add a small delay before showing delete confirmation
      setTimeout(() => {
        // Show confirmation dialog
        Alert.alert(
          "Delete Task",
          "Are you sure you want to delete this task?",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            { 
              text: "Delete", 
              style: "destructive",
              onPress: () => {
                console.log('HomeScreen: Confirmed deletion of task:', id);
                deleteTask(id);
              }
            }
          ]
        );
      }, 300);
    } else {
      // If details modal is not open, show confirmation before deleting
      Alert.alert(
        "Delete Task",
        "Are you sure you want to delete this task?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Delete", 
            style: "destructive",
            onPress: () => {
              console.log('HomeScreen: Confirmed deletion of task:', id);
              deleteTask(id);
            }
          }
        ]
      );
    }
  };

  // Handle task toggling
  const handleToggleTask = (id) => {
    console.log('HomeScreen: Toggling task completion:', id);
    toggleTaskCompletion(id);
  };

  // Handle press on a task to view details
  const handleTaskPress = (task) => {
    if (task) {
      console.log('HomeScreen: Opening details for task:', task.id);
      setCurrentTask(task);
      setIsDetailsModalVisible(true);
    }
  };

  // Helper function to get category name by id
  const getCategoryName = (categoryId) => {
    if (!categoryId) return null;
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : null;
  };

  // Debug panel component
  const DebugPanel = () => {
    if (!showDebug) return null;
    
    return (
      <View style={[styles.debugPanel, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.debugTitle, { color: theme.colors.text }]}>Debug Panel</Text>
        
        <View style={styles.debugButtons}>
          <TouchableOpacity 
            style={[styles.debugButton, { backgroundColor: theme.colors.primary }]} 
            onPress={addTestTask}
          >
            <Text style={styles.debugButtonText}>Add Test Task</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.debugButton, { backgroundColor: theme.colors.error }]} 
            onPress={handleClearAllTasks}
          >
            <Text style={styles.debugButtonText}>Clear All Tasks</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.debugButton, { backgroundColor: theme.colors.primary }]} 
            onPress={handleReloadTasks}
          >
            <Text style={styles.debugButtonText}>Reload Tasks</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.debugInfo, { color: theme.colors.text }]}>
          Tasks count: {tasks.length}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: theme.colors.background }
    ]}>
      <StatusBar 
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background}
        translucent={Platform.OS === 'android'}
      />
      
      <Header title={`My Tasks (${tasks.length})`} />

      <View style={styles.content}>
        <TaskList
          onTaskPress={handleTaskPress}
          onTaskToggle={handleToggleTask}
          onTaskEdit={handleEditTask}
          onTaskDelete={handleDeleteTask}
        />
      </View>

      {/* Debug Panel (hidden) */}
      <DebugPanel />

      <FloatingActionButton onPress={() => {
        console.log('HomeScreen: Opening add task modal');
        setCurrentTask(null); // Clear current task
        setIsAddModalVisible(true);
      }} />

      {/* Add Task Modal */}
      <TaskForm
        visible={isAddModalVisible}
        onClose={() => {
          console.log('HomeScreen: Closing add task modal');
          setIsAddModalVisible(false);
        }}
        onSubmit={handleAddTask}
        categories={categories}
      />

      {/* Edit Task Modal */}
      <TaskForm
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSubmit={handleUpdateTask}
        initialTask={currentTask}
        categories={categories}
      />

      {/* Task Details Modal */}
      <TaskDetails
        visible={isDetailsModalVisible}
        task={currentTask}
        onClose={() => setIsDetailsModalVisible(false)}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onToggleCompletion={handleToggleTask}
        getCategoryName={getCategoryName}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  debugPanel: {
    position: 'absolute',
    top: 64,
    right: 16,
    width: 300,
    padding: 12,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 99,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  debugButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  debugButton: {
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  debugInfo: {
    fontSize: 14,
    marginTop: 8,
  }
});

export default HomeScreen; 