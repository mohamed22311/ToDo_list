import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { formatDistanceToNow } from 'date-fns';

const PriorityIndicator = ({ priority, theme }) => {
  const colors = {
    high: theme.colors.high,
    medium: theme.colors.medium,
    low: theme.colors.low,
  };

  return (
    <View 
      style={[
        styles.priorityIndicator, 
        { backgroundColor: colors[priority] || colors.low }
      ]} 
    />
  );
};

const TaskItem = ({ 
  task, 
  onToggle, 
  onEdit, 
  onDelete, 
  onPress,
  getCategoryColor
}) => {
  const { theme } = useTheme();
  if (!task) return null;
  
  const { 
    id, 
    text = "", 
    completed = false, 
    priority, 
    categoryId, 
    dueDate, 
    createdAt 
  } = task;

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightActions}>
        <Animated.View style={{ transform: [{ translateX: trans }] }}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.info }]}
            onPress={() => onEdit(task)}
          >
            <Ionicons name="pencil" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ transform: [{ translateX: trans }] }}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
            onPress={() => {
              console.log('TaskItem: Delete button pressed for task ID:', id);
              if (id) {
                onDelete(id);
              } else {
                console.error('TaskItem: Cannot delete - missing task ID');
              }
            }}
          >
            <Ionicons name="trash" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const categoryColor = getCategoryColor(categoryId);
  const formattedDate = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '';
  const dueDateFormatted = dueDate ? formatDistanceToNow(new Date(dueDate), { addSuffix: true }) : '';

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => onPress(task)}
      >
        <View style={[
          styles.container, 
          { 
            backgroundColor: theme.colors.card,
            borderLeftColor: categoryColor || theme.colors.primary,
            borderBottomColor: theme.colors.border
          }
        ]}>
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => onToggle(id)}
          >
            <MaterialIcons
              name={completed ? 'check-circle' : 'radio-button-unchecked'}
              size={24}
              color={completed ? theme.colors.success : theme.colors.primary}
            />
          </TouchableOpacity>
          
          <View style={styles.content}>
            <View style={styles.topRow}>
              <Text 
                style={[
                  styles.text, 
                  { color: theme.colors.text },
                  completed && styles.completedText
                ]}
                numberOfLines={1}
              >
                {text}
              </Text>
              {priority && <PriorityIndicator priority={priority} theme={theme} />}
            </View>
            
            <View style={styles.details}>
              {dueDate && (
                <View style={styles.detail}>
                  <Ionicons name="calendar" size={12} color={theme.colors.textLight} />
                  <Text style={[styles.detailText, { color: theme.colors.textLight }]}>
                    {dueDateFormatted}
                  </Text>
                </View>
              )}
              <View style={styles.detail}>
                <Ionicons name="time-outline" size={12} color={theme.colors.textLight} />
                <Text style={[styles.detailText, { color: theme.colors.textLight }]}>
                  {formattedDate}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderBottomWidth: 0,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    marginRight: 12,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  details: {
    flexDirection: 'row',
    marginTop: 6,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
    marginLeft: 5,
    borderRadius: 8,
  },
});

export default TaskItem; 