# Student-Teacher-Appointment


This project integrates Firebase Authentication and Firestore to manage users, teachers, students, and appointments. It allows users to log in, manage teachers, approve student registrations, and schedule appointments. The application also features messaging capabilities between students and teachers.

## Features

- **User Authentication**: Firebase Authentication to manage user login and logout.
- **Role-based Access**: Admins can manage teachers, approve student registrations, and schedule appointments.
- **Teacher Management**: Admins can add, update, or delete teacher information.
- **Student Approval**: Admins can approve or reject student registrations based on their status.
- **Appointment Scheduling**: Students and teachers can schedule and manage appointments.
- **Messaging**: Students can send messages to teachers.
- **Firebase Firestore**: Store and manage user, teacher, appointment, and message data in Firestore.

## Prerequisites

To run this project, you need to have the following installed:
- [Node.js](https://nodejs.org/) (if you plan to use a local server)
- A Firebase project set up with Firebase Authentication and Firestore enabled.

## Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/ishagaikwad07/Student-Teacher-Appointment.git
    ```

2. **Install Dependencies**:

    You may use a live server extension or simply open the `index.html` file in your browser for development. If you want to run it locally, you can set up a basic server using VS Code's live server extension.

3. **Firebase Configuration**:
    - Make sure you have a Firebase project and integrate your Firebase configuration in the `firebase-init.js` file. You can get your Firebase configuration by visiting the Firebase console.
    
    Example Firebase initialization:

    ```js
    // firebase-init.js
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';

    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    export default app;
    ```

## Features and Usage

### 1. **Admin Panel**:

- **Add Teacher**: Admin can add a teacher by entering their name, department, and subject.
- **Manage Teacher**: Admin can update or delete teacher records.
- **Approve Student Registration**: Admin can approve student registrations that are marked as pending.
  
### 2. **Teacher Dashboard**:

- **Schedule Appointments**: Teachers can schedule appointments with students.
- **Approve or Cancel Appointments**: Teachers can approve or cancel scheduled appointments.

### 3. **Student Dashboard**:

- **Search for Teachers**: Students can search for teachers by name.
- **Book Appointments**: Students can book appointments with teachers.
- **Send Messages**: Students can send messages to teachers.

### 4. **Authentication**:
   - Admin users and teachers are redirected to the respective dashboards upon login.
   - Students are redirected to the homepage if not logged in or authorized.

### 5. **Logout**:
   - Users can log out from the application using the logout button, and they will be redirected to the login page (`index.html`).

### 6. **Appointments**:
   - Students can book appointments with teachers, and both can view and manage appointments.
   
### 7. **Messaging**:
   - Students can send messages to teachers. Messages are stored in the Firestore database, and students can select a teacher based on the name search.

## Code Structure
-index.html - The main login page.
-firebase-init.js - Firebase configuration and initialization.
-admin-dashboard.js - Handles teacher management and student approval (for admin).
-teacher-dashboard.js - Handles appointment scheduling and approval for teachers.
-student-dashboard.js - Handles appointment booking and messaging for students.
-style.css - Styling for the pages.


## Firebase Configuration

You need to add your own Firebase configuration in the `firebase-init.js` file to interact with Firebase services like Authentication and Firestore.

## Live Server

If you're using VS Code, you can simply click the **"Go Live"** button in the bottom-right corner to start a local server. If you're not using VS Code, you can serve the project with any server of your choice.

## Acknowledgments

- Firebase for Authentication and Firestore.
- VS Code and Live Server extension for easy development.

