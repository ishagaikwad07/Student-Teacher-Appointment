import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import app from './firebase-init.js'
// Initialize Firebase
const auth = getAuth(app);
const db = getFirestore(app);

// Check for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        const loggedInUserId = user.uid;
        const docRef = doc(db, "users", loggedInUserId);
        
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.role !== "admin") {
                        window.location.href = "homepage.html"; // Redirect if not admin
                    }
                } else {
                    console.log("No document found for the logged-in user");
                }
            })
            .catch((error) => {
                console.error("Error getting document:", error);
            });
    } else {
        window.location.href = "index.html"; // Redirect to login page if not logged in
    }
});

// Logout functionality
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html'; // Redirect after logging out
        })
        .catch((error) => {
            console.error("Error signing out:", error);
        });
});

// Event listeners for buttons
document.getElementById('addTeacherBtn').addEventListener('click', () => {
    const teacherName = prompt("Enter Teacher's Name:");
    const department = prompt("Enter Teacher's Department:");
    const subject = prompt("Enter Teacher's Subject:");

    if (teacherName && department && subject) {
        const teacherRef = doc(db, "teachers", teacherName); // Teacher name as doc ID
        setDoc(teacherRef, {
            name: teacherName,
            department: department,
            subject: subject,
            createdAt: new Date(),
        })
        .then(() => {
            alert("Teacher added successfully");
        })
        .catch((error) => {
            console.error("Error adding teacher:", error);
        });
    }
});

document.getElementById('manageTeacherBtn').addEventListener('click', () => {
    const teacherName = prompt("Enter Teacher's Name to update/delete:");

    const teacherRef = doc(db, "teachers", teacherName);
    getDoc(teacherRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                const teacherData = docSnap.data();
                const action = prompt("Choose action: 'update' or 'delete'");

                if (action === "update") {
                    const newDepartment = prompt("Enter New Department:", teacherData.department);
                    const newSubject = prompt("Enter New Subject:", teacherData.subject);

                    updateDoc(teacherRef, {
                        department: newDepartment,
                        subject: newSubject,
                    })
                    .then(() => {
                        alert("Teacher updated successfully");
                    })
                    .catch((error) => {
                        console.error("Error updating teacher:", error);
                    });
                } else if (action === "delete") {
                    deleteDoc(teacherRef)
                    .then(() => {
                        alert("Teacher deleted successfully");
                    })
                    .catch((error) => {
                        console.error("Error deleting teacher:", error);
                    });
                }
            } else {
                alert("Teacher not found");
            }
        })
        .catch((error) => {
            console.error("Error fetching teacher:", error);
        });
});

document.getElementById('approveStudentBtn').addEventListener('click', () => {
    const studentEmail = prompt("Enter the email of the student to approve:");

    const studentRef = doc(db, "students", studentEmail);
    getDoc(studentRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                const studentData = docSnap.data();
                if (studentData.status === "pending") {
                    updateDoc(studentRef, {
                        status: "approved",
                    })
                    .then(() => {
                        alert("Student registration approved");
                    })
                    .catch((error) => {
                        console.error("Error approving student:", error);
                    });
                } else {
                    alert("Student is already approved or not pending");
                }
            } else {
                alert("Student not found");
            }
        })
        .catch((error) => {
            console.error("Error fetching student:", error);
        });
});
