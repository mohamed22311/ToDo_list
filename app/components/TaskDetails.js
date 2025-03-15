import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { format } from 'date-fns';

const TaskDetails = ({ 
  visible, 
  task, 
  onClose, 
  onEdit,
  onDelete,
  onToggleCompletion,
  getCategoryName
}) => {
  const { theme } = useTheme();
  
  if (!task || !visible) return null;
  
  const { 
    text, 
    completed, 
    priority = 'medium', 
    categoryId, 
    createdAt, 
    dueDate, 
    notes 
  } = task;

  const priorityLabels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  };

  const priorityIcons = {
    high: 'alert-circle',
    medium: 'alert',
    low: 'information-circle'
  };

  const categoryName = getCategoryName(categoryId);
  const formattedCreatedAt = createdAt ? format(new Date(createdAt), 'PPpp') : 'Unknown';
  const formattedDueDate = dueDate ? format(new Date(dueDate), 'PPpp') : 'No due date';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerAction}
                onPress={() => onEdit(task)}
              >
                <Ionicons name="pencil" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerAction}
                onPress={() => {
                  console.log('TaskDetails: Delete button pressed for task ID:', task.id);
                  
                  // First close the modal
                  onClose();
                  
                  // Then trigger the delete with a small delay
                  setTimeout(() => {
                    onDelete(task.id);
                  }, 100);
                }}
              >
                <Ionicons name="trash" size={24} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                {text}
              </Text>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => onToggleCompletion(task.id)}
              >
                <Ionicons
                  name={completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={28}
                  color={completed ? theme.colors.success : theme.colors.primary}
                />
                <Text style={{ 
                  color: completed ? theme.colors.success : theme.colors.primary,
                  marginLeft: 5
                }}>
                  {completed ? 'Completed' : 'Mark as complete'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoSection}>
              {/* Category */}
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="folder" size={20} color={theme.colors.textLight} />
                  <Text style={[styles.infoLabelText, { color: theme.colors.textLight }]}>
                    Category
                  </Text>
                </View>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  {categoryName || 'Uncategorized'}
                </Text>
              </View>

              {/* Priority */}
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="flag" size={20} color={theme.colors.textLight} />
                  <Text style={[styles.infoLabelText, { color: theme.colors.textLight }]}>
                    Priority
                  </Text>
                </View>
                <View style={styles.priorityContainer}>
                  <Ionicons 
                    name={priorityIcons[priority] || 'help-circle'} 
                    size={18} 
                    color={theme.colors[priority]}
                  />
                  <Text style={[
                    styles.priorityText, 
                    { color: theme.colors[priority] }
                  ]}>
                    {priorityLabels[priority] || 'Unknown'}
                  </Text>
                </View>
              </View>

              {/* Created Date */}
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="time" size={20} color={theme.colors.textLight} />
                  <Text style={[styles.infoLabelText, { color: theme.colors.textLight }]}>
                    Created
                  </Text>
                </View>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  {formattedCreatedAt}
                </Text>
              </View>

              {/* Due Date */}
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="calendar" size={20} color={theme.colors.textLight} />
                  <Text style={[styles.infoLabelText, { color: theme.colors.textLight }]}>
                    Due Date
                  </Text>
                </View>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  {formattedDueDate}
                </Text>
              </View>

              {/* Notes */}
              {notes && (
                <View style={styles.notesContainer}>
                  <Text style={[styles.notesTitle, { color: theme.colors.text }]}>
                    Notes
                  </Text>
                  <View style={[
                    styles.notesContent, 
                    { backgroundColor: theme.colors.background }
                  ]}>
                    <Text style={[styles.notes, { color: theme.colors.text }]}>
                      {notes}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerAction: {
    padding: 8,
    marginLeft: 10,
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabelText: {
    marginLeft: 8,
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '500',
  },
  notesContainer: {
    marginTop: 20,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notesContent: {
    padding: 15,
    borderRadius: 8,
  },
  notes: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default TaskDetails; 