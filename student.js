import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import firebaseConfig from "./config";
import app from './firebase-init.js'

// Initialize Firebase
const auth = getAuth(app);
const db = getFirestore(app);

// Variable to store student's name
let studentName = "";

// Check for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        const loggedInUserId = user.uid;

        // Fetch user data from Firestore
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.role === "student") {
                        studentName = userData.name;
                        // User is a student, so allow access to the dashboard
                        console.log("Student logged in successfully");
                    } else {
                        // Redirect non-students to homepage
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
            window.location.href = 'index.html'; // Redirect to login page after logout
        })
        .catch((error) => {
            console.error("Error signing out:", error);
        });
});

// Function to search for teachers
document.getElementById('searchTeacherBtn').addEventListener('click', () => {
    const teacherName = prompt("Enter Teacher's Name:");

    const teachersRef = collection(db, "teachers");
    const q = query(teachersRef, where("name", "==", teacherName));

    getDocs(q)
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                alert("Teacher not found.");
            } else {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data());
                    alert(`Found Teacher: ${doc.data().name}`);
                });
            }
        })
        .catch((error) => {
            console.error("Error searching for teacher:", error);
        });
});

// Function to book an appointment
document.getElementById('bookAppointmentBtn').addEventListener('click', () => {
    const teacherName = prompt("Enter Teacher's Name:");
    const appointmentTime = prompt("Enter Appointment Time (YYYY-MM-DD HH:MM):");

    if (teacherName && studentName && appointmentTime) {
        const appointmentRef = doc(db, "appointments", `${studentName}-${appointmentTime}`); // Use a unique ID
        setDoc(appointmentRef, {
            teacherName: teacherName,
            studentName: studentName,
            appointmentTime: appointmentTime,
            status: "Pending", // Initial status
            createdAt: new Date(),
        })
        .then(() => {
            alert("Appointment booked successfully.");
        })
        .catch((error) => {
            console.error("Error booking appointment:", error);
        });
    }
});

// Function to send a message
document.getElementById('sendMessageBtn').addEventListener('click', async () => {
    const message = prompt("Enter your message:");
    const teacherName = prompt("Enter the teacher's name:");

    if (message && message.trim() !== "" && teacherName && teacherName.trim() !== "") { // Validate non-empty input
        try {
            // Ensure Firestore and Firebase Authentication are initialized
            if (!db || !auth) {
                throw new Error("Firestore or Firebase Authentication is not initialized.");
            }

            // Get the current authenticated user
            const user = auth.currentUser;

            // Check if user is logged in
            if (!user) {
                alert("You must be logged in to send a message.");
                return;
            }

            // Get the student's name (assuming the student data is available in Firestore)
            const studentRef = doc(db, "users", user.uid); // Assuming user data is stored in 'users' collection
            const studentDoc = await getDoc(studentRef);
            if (!studentDoc.exists()) {
                alert("Student data not found.");
                return;
            }

            const studentData = studentDoc.data();
            const studentName = `${studentData.firstName} ${studentData.lastName}`;

            // Reference the Firestore "teachers" collection to search for the teacher by name
            const teachersRef = collection(db, "teachers");
            const q = query(teachersRef, where("name", "==", teacherName));

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert("Teacher not found. Please check the name.");
                return;
            }

            // If multiple teachers are found with the same name, you may want to show them a list
            if (querySnapshot.size > 1) {
                let teacherList = "";
                querySnapshot.forEach((doc, index) => {
                    const teacherData = doc.data();
                    teacherList += `${index + 1}. ${teacherData.name} (${teacherData.subject}) - ${teacherData.email}\n`;
                });
                const teacherChoice = prompt(`Multiple teachers found with the same name. Choose one:\n${teacherList}`);

                const selectedTeacherIndex = parseInt(teacherChoice) - 1;
                if (selectedTeacherIndex < 0 || selectedTeacherIndex >= querySnapshot.size) {
                    alert("Invalid choice.");
                    return;
                }

                const selectedTeacherDoc = querySnapshot.docs[selectedTeacherIndex];
                const teacherEmail = selectedTeacherDoc.data().email; // Get teacher's email

                // Send the message to the specific teacher
                const messageRef = collection(db, "messages");
                await setDoc(doc(messageRef), {
                    sender: studentName,
                    receiver: teacherName,
                    teacherEmail: teacherEmail, // Store teacher's email instead of ID
                    message: message.trim(),
                    createdAt: new Date().toISOString(),
                });

                alert(`Message sent to ${teacherName}.`);
            } else {
                // Only one teacher found, send the message directly
                const teacherDoc = querySnapshot.docs[0];
                const teacherEmail = teacherDoc.data().email; // Get teacher's email

                // Send the message to this teacher
                const messageRef = collection(db, "messages");
                await setDoc(doc(messageRef), {
                    sender: studentName,
                    receiver: teacherName,
                    teacherEmail: teacherEmail, // Store teacher's email instead of ID
                    message: message.trim(),
                    createdAt: new Date().toISOString(),
                });

                alert(`Message sent to ${teacherName}.`);
            }

        } catch (error) {
            console.error("Error sending message:", error);
            alert(`Failed to send message: ${error.message}`);
        }
    } else {
        alert("Please provide both a message and a teacher's name.");
    }
});
