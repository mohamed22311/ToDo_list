import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Animated, 
  TextInput,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskItem from './TaskItem';
import { useTheme } from '../hooks/useTheme';
import { useTask } from '../hooks/useTask';

const TaskList = ({ 
  onTaskPress,
  onTaskToggle,
  onTaskEdit,
  onTaskDelete,
}) => {
  const { theme } = useTheme();
  const { tasks, categories, filterTasks } = useTask();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef(null);

  // Animation values
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const translateY = useMemo(() => new Animated.Value(50), []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const filteredTasks = useMemo(() => {
    return filterTasks({
      categoryId: selectedCategory,
      priority: selectedPriority,
      searchQuery,
      showCompleted
    });
  }, [tasks, selectedCategory, selectedPriority, searchQuery, showCompleted]);

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : theme.colors.primary;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Here we could fetch new data if needed
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  // Enhanced task toggle handler with scrolling
  const handleTaskToggle = (taskId) => {
    // First call the original toggle handler to update the task
    onTaskToggle(taskId);
    
    // Find the task that was toggled
    const toggledTaskIndex = filteredTasks.findIndex(task => task.id === taskId);
    if (toggledTaskIndex === -1 || !flatListRef.current) return;
    
    // Get the task that was toggled
    const toggledTask = filteredTasks[toggledTaskIndex];
    
    // Only scroll if the task was marked as completed (not when uncompleted)
    // We need to check the current state before the update
    if (!toggledTask.completed) {
      // Find the next incomplete task to scroll to
      let nextTaskIndex = -1;
      
      // Look for the next incomplete task after this one
      for (let i = toggledTaskIndex + 1; i < filteredTasks.length; i++) {
        if (!filteredTasks[i].completed) {
          nextTaskIndex = i;
          break;
        }
      }
      
      // If no incomplete task was found after, look from the beginning
      if (nextTaskIndex === -1) {
        for (let i = 0; i < toggledTaskIndex; i++) {
          if (!filteredTasks[i].completed) {
            nextTaskIndex = i;
            break;
          }
        }
      }
      
      // If we found a task to scroll to, scroll to it after a short delay
      if (nextTaskIndex !== -1) {
        setTimeout(() => {
          try {
            flatListRef.current.scrollToIndex({
              index: nextTaskIndex,
              animated: true,
              viewOffset: 80, // Additional offset to show filters
              viewPosition: 0, // Position at the top
            });
          } catch (error) {
            console.log('Error scrolling to index:', error);
            // Fallback to approximate scrolling
            flatListRef.current.scrollToOffset({
              offset: nextTaskIndex * 100, // Approximate task height
              animated: true,
            });
          }
        }, 300); // Delay to let the UI update
      }
    }
  };
  
  // Pre-calculated item heights for better performance
  const getItemLayout = (data, index) => ({
    length: 100, // Approximate height of each item
    offset: 100 * index,
    index,
  });

  const renderCategoryFilter = () => (
    <View style={styles.filterSection}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryFilters}
      >
        <TouchableOpacity
          style={[
            styles.categoryPill,
            { 
              backgroundColor: !selectedCategory ? theme.colors.primary : 'transparent',
              borderColor: theme.colors.primary 
            }
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={{ 
            color: !selectedCategory ? '#fff' : theme.colors.primary,
            fontWeight: '500'
          }}>
            All
          </Text>
        </TouchableOpacity>
        
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryPill,
              { 
                backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
                borderColor: category.color 
              }
            ]}
            onPress={() => setSelectedCategory(
              selectedCategory === category.id ? null : category.id
            )}
          >
            <Text style={{ 
              color: selectedCategory === category.id ? '#fff' : category.color,
              fontWeight: '500'
            }}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderListEmptyComponent = () => (
    <Animated.View 
      style={[
        styles.emptyContainer, 
        { 
          opacity: fadeAnim,
          transform: [{ translateY: translateY }] 
        }
      ]}
    >
      <Ionicons 
        name="checkmark-done-circle-outline" 
        size={80} 
        color={theme.colors.textLight} 
      />
      <Text style={[styles.emptyText, { color: theme.colors.textLight }]}>
        {searchQuery || selectedCategory || selectedPriority
          ? "No tasks match your filters"
          : "No tasks yet. Add your first task!"}
      </Text>
    </Animated.View>
  );

  const renderListHeaderComponent = () => (
    <>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="search" size={20} color={theme.colors.textLight} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search tasks..."
          placeholderTextColor={theme.colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {renderCategoryFilter()}

      <View style={styles.filtersRow}>
        <View style={styles.priorityFilters}>
          {['high', 'medium', 'low'].map((priority) => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.priorityPill,
                { borderColor: theme.colors[priority] },
                selectedPriority === priority && { backgroundColor: theme.colors[priority] }
              ]}
              onPress={() => setSelectedPriority(
                selectedPriority === priority ? null : priority
              )}
            >
              <Text style={{ 
                color: selectedPriority === priority ? '#fff' : theme.colors[priority],
                fontSize: 12,
                fontWeight: '500'
              }}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.completedFilter}
          onPress={() => setShowCompleted(!showCompleted)}
        >
          <Ionicons
            name={showCompleted ? 'eye' : 'eye-off'}
            size={20}
            color={theme.colors.primary}
          />
          <Text style={[styles.completedFilterText, { color: theme.colors.primary }]}>
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.taskCount, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.taskCountText, { color: theme.colors.textLight }]}>
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </Text>
      </View>
    </>
  );

  return (
    <FlatList
      data={filteredTasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => {
        const animationDelay = index * 50;
        return (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: translateY }],
            }}
          >
            <TaskItem
              task={item}
              onToggle={handleTaskToggle}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
              onPress={onTaskPress}
              getCategoryColor={getCategoryColor}
            />
          </Animated.View>
        );
      }}
      contentContainerStyle={[
        styles.list,
        filteredTasks.length === 0 && styles.emptyList,
        { backgroundColor: theme.colors.background }
      ]}
      ListEmptyComponent={renderListEmptyComponent}
      ListHeaderComponent={renderListHeaderComponent}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      ref={flatListRef}
      getItemLayout={getItemLayout}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    paddingVertical: 8,
  },
  filterSection: {
    marginBottom: 16,
  },
  categoryFilters: {
    paddingVertical: 5,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priorityFilters: {
    flexDirection: 'row',
  },
  priorityPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
    borderWidth: 1,
  },
  completedFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedFilterText: {
    marginLeft: 5,
    fontWeight: '500',
    fontSize: 13,
  },
  taskCount: {
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 16,
  },
  taskCountText: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TaskList; 