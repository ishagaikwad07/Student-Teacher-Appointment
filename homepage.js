import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import app from './firebase-init.js'

// Initialize Firebase
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Get the logged-in user's ID from the auth object
        const loggedInUserId = user.uid;

        // Save loggedInUserId to local storage for future use
        localStorage.setItem('loggedInUserId', loggedInUserId);

        // Fetch user data from Firestore
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    const role = userData.role || "N/A";
                    
                    if (role === "Teacher") {
                        window.location.href = "teacher.html";
                    } else if (role === "Student") {
                        window.location.href = "student.html";
                    } else if (role === "Admin") {
                        window.location.href = "admin.html";
                    } else {
                        console.error("Invalid role");
                    }

                } else {
                    console.log('No document found matching ID');
                }
            })
            .catch((error) => {
                console.error('Error getting document:', error);
            });
    } else {
        console.log('User not logged in');
        localStorage.removeItem('loggedInUserId');
        window.location.href = 'index.html'; // Redirect to login page
    }
});

// Logout functionality
const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId'); // Corrected the name here
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.log('Error signing out:', error);
        });
});

// Function to display Teacher features
function displayTeacherFeatures(userData) {
    document.getElementById('role').innerText = "Teacher Dashboard";
    document.getElementById('features').innerHTML = `
        <ul>
            <li><a href="#">Schedule Appointment</a></li>
            <li><a href="#">Approve/Cancel Appointment</a></li>
            <li><a href="#">View Messages</a></li>
            <li><a href="#">View All Appointments</a></li>
        </ul>
    `;
}

// Function to display Student features
function displayStudentFeatures(userData) {
    document.getElementById('role').innerText = "Student Dashboard";
    document.getElementById('features').innerHTML = `
        <ul>
            <li><a href="#">Search Teacher</a></li>
            <li><a href="#">Book Appointment</a></li>
            <li><a href="#">Send Message</a></li>
        </ul>
    `;
}

// Function to display Admin features
function displayAdminFeatures(userData) {
    document.getElementById('role').innerText = "Admin Dashboard";
    document.getElementById('features').innerHTML = `
        <ul>
            <li><a href="#">Add Teacher</a></li>
            <li><a href="#">Update/Delete Teacher</a></li>
            <li><a href="#">Approve Registration Student</a></li>
        </ul>
    `;
}
