import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  ScrollView,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

// Enhanced colors for rich UI
const COLORS = {
  high: '#FF3B30',       // Vivid red for high priority
  medium: '#FF9500',     // Bright orange for medium priority
  low: '#34C759',        // Vibrant green for low priority
  primary: '#007AFF',    // Bright blue as primary
  background: '#F2F2F7', // Light gray background
  card: '#FFFFFF',       // White card background
  text: '#1C1C1E',       // Near black text
  textLight: '#8E8E93',  // Medium gray for light text
  border: '#C7C7CC',     // Light gray for borders
  error: '#FF3B30',      // Red for errors
  success: '#34C759',    // Green for success
  shadow: '#000000',     // Black for shadows
};

// Simple priorities without icons
const PRIORITIES = [
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' }
];

// Complete task form with all features
const TaskForm = ({ 
  visible, 
  onClose, 
  onSubmit, 
  initialTask = {}, 
  categories 
}) => {
  const { theme } = useTheme();
  const textInputRef = useRef(null);
  const isEditMode = initialTask && initialTask.id;
  
  // Form state
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Initialize form when modal becomes visible
  useEffect(() => {
    if (visible) {
      console.log('Modal visible, initializing form');
      
      if (isEditMode) {
        // Edit mode - load values from initialTask
        console.log('Edit mode detected, loading task data:', initialTask.id);
        setText(initialTask.text || '');
        setCategory(initialTask.categoryId || (categories.length > 0 ? categories[0].id : ''));
        setPriority(initialTask.priority || 'medium');
        setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : null);
        setNotes(initialTask.notes || '');
      } else {
        // Add mode - set defaults
        setText('');
        if (categories && categories.length > 0) {
          setCategory(categories[0].id);
        }
        setPriority('medium');
        setDueDate(null);
        setNotes('');
      }
      
      // Focus after a short delay
      setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      }, 300);
    }
  }, [visible, isEditMode]); // Only depend on visible and isEditMode

  // Handle text input changes
  const handleTextChange = (value) => {
    console.log('Text changed:', value);
    setText(value);
  };
  
  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    console.log('Category selected:', categoryId);
    setCategory(categoryId);
  };
  
  // Handle priority selection
  const handlePrioritySelect = (priorityId) => {
    console.log('Priority selected:', priorityId);
    setPriority(priorityId);
  };
  
  // Handle date selection
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      console.log('Date selected:', selectedDate);
      setDueDate(selectedDate);
    }
  };
  
  // Handle notes changes
  const handleNotesChange = (value) => {
    console.log('Notes changed');
    setNotes(value);
  };
  
  // Handle task submission
  const handleSubmit = () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter a task');
      return;
    }
    
    console.log('Submitting task with text:', text);
    console.log('Category:', category);
    console.log('Priority:', priority);
    console.log('Due date:', dueDate);
    console.log('Notes:', notes);
    
    // Create complete task object
    const newTask = {
      ...(isEditMode ? { id: initialTask.id } : {}), // Keep ID if editing
      text: text.trim(),
      categoryId: category,
      priority: priority,
      dueDate: dueDate ? dueDate.toISOString() : null,
      notes: notes.trim(),
      completed: isEditMode ? initialTask.completed : false,
      createdAt: isEditMode ? initialTask.createdAt : new Date().toISOString(),
    };
    
    try {
      const result = onSubmit(newTask);
      
      if (result) {
        Alert.alert('Success', `Task ${isEditMode ? 'updated' : 'added'} successfully!`);
        setText(''); // Only clear text on successful submission
        onClose();
      } else {
        Alert.alert('Error', `Failed to ${isEditMode ? 'update' : 'add'} task`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  // Get priority color based on ID with enhanced colors
  const getPriorityColor = (priorityId) => {
    switch(priorityId) {
      case 'high': return COLORS.high;
      case 'medium': return COLORS.medium;
      case 'low': return COLORS.low;
      default: return COLORS.medium;
    }
  };

  // Get text color - white for light backgrounds, dark for dark backgrounds
  const getTextColor = (bgColor) => {
    // For simple contrast detection
    return bgColor && ['#FFFFFF', '#F2F2F7', '#C7C7CC'].includes(bgColor) 
      ? COLORS.text 
      : '#FFFFFF';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.centeredView}>
          <View style={[
            styles.modalView, 
            { 
              backgroundColor: COLORS.card,
              shadowColor: COLORS.shadow
            }
          ]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: COLORS.text }]}>
                {isEditMode ? 'Edit Task' : 'Add New Task'}
              </Text>
              <TouchableOpacity 
                onPress={onClose} 
                style={[styles.closeButton, { backgroundColor: COLORS.background }]}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            {/* Main form content */}
            <ScrollView 
              style={styles.formScroll}
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Task Input */}
              <Text style={[styles.label, { color: COLORS.text }]}>Task</Text>
              <TextInput
                ref={textInputRef}
                style={[
                  styles.input,
                  { 
                    color: COLORS.text,
                    backgroundColor: COLORS.background,
                    borderColor: COLORS.border
                  }
                ]}
                placeholder="Enter task here"
                placeholderTextColor={COLORS.textLight}
                value={text}
                onChangeText={handleTextChange}
                returnKeyType="next"
              />
              
              {/* Category Selection */}
              <Text style={[styles.label, { color: COLORS.text }]}>Category</Text>
              <View style={styles.optionContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryOption,
                      { borderColor: cat.color },
                      category === cat.id && { backgroundColor: cat.color }
                    ]}
                    onPress={() => handleCategorySelect(cat.id)}
                  >
                    <Text 
                      style={{ 
                        color: category === cat.id ? '#fff' : cat.color,
                        fontWeight: '600' 
                      }}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Priority Selection */}
              <Text style={[styles.label, { color: COLORS.text }]}>Priority</Text>
              <View style={styles.optionContainer}>
                {PRIORITIES.map((pri) => (
                  <TouchableOpacity
                    key={pri.id}
                    style={[
                      styles.priorityOption,
                      { 
                        borderColor: getPriorityColor(pri.id),
                        backgroundColor: priority === pri.id 
                          ? getPriorityColor(pri.id) 
                          : 'transparent' 
                      }
                    ]}
                    onPress={() => handlePrioritySelect(pri.id)}
                  >
                    <Text 
                      style={{ 
                        color: priority === pri.id ? '#fff' : getPriorityColor(pri.id),
                        fontWeight: '600' 
                      }}
                    >
                      {pri.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Due Date Selection */}
              <Text style={[styles.label, { color: COLORS.text }]}>Due Date</Text>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  { 
                    backgroundColor: COLORS.background,
                    borderColor: COLORS.border
                  }
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color={COLORS.primary} />
                <Text style={[styles.dateText, { color: COLORS.text }]}>
                  {dueDate ? format(dueDate, 'PPP') : 'Set due date'}
                </Text>
                {dueDate && (
                  <TouchableOpacity 
                    style={styles.clearDate} 
                    onPress={() => setDueDate(null)}
                  >
                    <Ionicons name="close-circle" size={20} color={COLORS.error} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              
              {/* Notes Section */}
              <Text style={[styles.label, { color: COLORS.text }]}>Notes</Text>
              <TextInput
                style={[
                  styles.input, 
                  styles.notesInput,
                  { 
                    backgroundColor: COLORS.background,
                    color: COLORS.text,
                    borderColor: COLORS.border
                  }
                ]}
                placeholder="Add notes..."
                placeholderTextColor={COLORS.textLight}
                value={notes}
                onChangeText={handleNotesChange}
                multiline
                textAlignVertical="top"
              />
              
              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: COLORS.error }]}
                  onPress={onClose}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.button, 
                    { 
                      backgroundColor: !text.trim() 
                        ? COLORS.textLight 
                        : COLORS.primary 
                    }
                  ]}
                  onPress={handleSubmit}
                  disabled={!text.trim()}
                >
                  <Text style={styles.buttonText}>
                    {isEditMode ? 'Update Task' : 'Add Task'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay for better contrast
  },
  modalView: {
    width: '85%', // Smaller width
    borderRadius: 20, // More rounded corners
    padding: 22, // Slightly more padding
    shadowOffset: {
      width: 0,
      height: 4, // Stronger shadow
    },
    shadowOpacity: 0.3, // More opaque shadow
    shadowRadius: 8, // Larger shadow radius
    elevation: 10, // Higher elevation for Android
    maxHeight: '70%', // Smaller height
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20, // Slightly smaller title
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  formScroll: {
    width: '100%',
  },
  formContent: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 15, // Slightly smaller labels
    fontWeight: '600',
    marginBottom: 6, // Less margin
    marginTop: 14, // Less margin
  },
  input: {
    height: 48, // Slightly smaller inputs
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 10,
  },
  notesInput: {
    height: 80, // Smaller notes area
    textAlignVertical: 'top',
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  categoryOption: {
    paddingHorizontal: 14,
    paddingVertical: 8, // Smaller options
    borderRadius: 24,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  priorityOption: {
    paddingHorizontal: 14,
    paddingVertical: 8, // Smaller options
    borderRadius: 24,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 15, // Slightly smaller text
    flex: 1,
  },
  clearDate: {
    padding: 4, // Smaller padding
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16, // Less margin
  },
  button: {
    paddingVertical: 10, // Smaller buttons
    paddingHorizontal: 18,
    borderRadius: 12,
    minWidth: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15, // Slightly smaller button text
    fontWeight: 'bold',
  },
});

export default TaskForm; 