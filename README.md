# ToDo List App

A modern, feature-rich todo list application built with React Native and Expo. This app helps you organize tasks, set priorities, add due dates, and more.

## Features

- ✅ Create, edit, and delete tasks
- 🔄 Mark tasks as complete/incomplete
- 🏷️ Categorize tasks with color-coded categories
- 🚩 Set task priorities (high, medium, low)
- 📅 Add due dates to tasks
- 📝 Add notes to tasks
- 🔍 Search and filter tasks
- 🌙 Dark mode support
- 💾 Local storage for task persistence

## Screenshots

[Add screenshots here]

## Technologies Used

- React Native
- Expo
- Context API for state management
- AsyncStorage for local data persistence
- React Native Gesture Handler for swipe actions
- Date-fns for date formatting

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/todo-list-app.git
   cd todo-list-app
   ```

2. Install dependencies:

   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```
   npx expo start
   ```

4. Run on your device or emulator:
   - Scan the QR code with the Expo Go app on your mobile device
   - Press 'a' to run on an Android emulator
   - Press 'i' to run on an iOS simulator

## App Structure

- `app/components`: UI components like TaskList, TaskItem, TaskForm, etc.
- `app/contexts`: Context providers for task and theme management
- `app/hooks`: Custom hooks for accessing context values
- `app/screens`: Screen components like HomeScreen
- `app/themes`: Theme configurations for light and dark mode

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
