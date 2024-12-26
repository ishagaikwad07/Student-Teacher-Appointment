import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import app from './firebase-init.js'

// Initialize Firebase
const auth = getAuth(app);
const db = getFirestore(app);

// Check for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        const loggedInUserId = user.uid;

        // Get user data from Firestore
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.role === "teacher") {
                        // User is a teacher, so allow access to the dashboard
                        console.log("Teacher logged in successfully");
                    } else {
                        // Redirect non-teachers to homepage
                        window.location.href = "homepage.html"; 
                    }
                } else {
                    console.error("User data not found");
                    // Optionally log out the user if no data is found
                    signOut(auth);
                    window.location.href = "index.html";
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                signOut(auth);
                window.location.href = "index.html";
            });
    } else {
        // Redirect to login page if user is not authenticated
        window.location.href = "index.html";
    }
});

// Logout functionality
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html'; // Redirect to login page
        })
        .catch((error) => {
            console.error("Error signing out:", error);
        });
});

// Function to schedule an appointment
document.getElementById('scheduleAppointmentBtn').addEventListener('click', () => {
    const studentName = prompt("Enter Student's Name:");
    const appointmentTime = prompt("Enter Appointment Time (YYYY-MM-DD HH:MM):");

    if (studentName && appointmentTime) {
        const appointmentRef = doc(db, "appointments", studentName + "-" + appointmentTime); // Unique ID
        setDoc(appointmentRef, {
            studentName: studentName,
            appointmentTime: appointmentTime,
            status: "Scheduled", // Initial status
            createdAt: new Date(),
        })
        .then(() => {
            alert("Appointment scheduled successfully.");
        })
        .catch((error) => {
            console.error("Error scheduling appointment:", error);
        });
    }
});

// Function to approve/cancel an appointment
document.getElementById('approveAppointmentBtn').addEventListener('click', () => {
    const appointmentId = prompt("Enter Appointment ID (StudentName-Time):");

    const appointmentRef = doc(db, "appointments", appointmentId);
    getDoc(appointmentRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                const appointmentData = docSnap.data();
                const action = prompt("Choose action: 'approve' or 'cancel'");

                if (action === "approve") {
                    updateDoc(appointmentRef, {
                        status: "Approved",
                    })
                    .then(() => {
                        alert("Appointment approved.");
                    })
                    .catch((error) => {
                        console.error("Error approving appointment:", error);
                    });
                } else if (action === "cancel") {
                    updateDoc(appointmentRef, {
                        status: "Cancelled",
                    })
                    .then(() => {
                        alert("Appointment cancelled.");
                    })
                    .catch((error) => {
                        console.error("Error cancelling appointment:", error);
                    });
                }
            } else {
                alert("Appointment not found.");
            }
        })
        .catch((error) => {
            console.error("Error fetching appointment:", error);
        });
});

// Function to view messages (if implemented)
document.getElementById('viewMessagesBtn').addEventListener('click', () => {
    const messagesRef = collection(db, "messages");
    getDocs(messagesRef)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                alert(`Message from ${doc.data().sender}: ${doc.data().message}`);
            });
        })
        .catch((error) => {
            console.error("Error getting messages:", error);
        });
});

// Function to view all appointments
document.getElementById('viewAppointmentsBtn').addEventListener('click', () => {
    const appointmentsRef = collection(db, "appointments");
    getDocs(appointmentsRef)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const appointment = doc.data();
                console.log(`Appointment for ${appointment.studentName} at ${appointment.appointmentTime} - Status: ${appointment.status}`);
                alert(`Appointment for ${appointment.studentName} at ${appointment.appointmentTime} - Status: ${appointment.status}`);
            });
        })
        .catch((error) => {
            console.error("Error getting appointments:", error);
        });
});
