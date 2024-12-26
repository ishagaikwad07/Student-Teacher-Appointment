// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, setDoc, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import app from './firebase-init.js'

// Initialize Firebase
const auth = getAuth(app);
const db = getFirestore(app);

// Show message function
function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
    setTimeout(() => (messageDiv.style.display = "none"), 500);
  }, 5000);
}

// Sign Up Logic
const signUpButton = document.getElementById("submitSignUp");
signUpButton.addEventListener("click", (event) => {
  event.preventDefault();

  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const firstName = document.getElementById("fName").value;
  const lastName = document.getElementById("lName").value;
  const role = document.getElementById('rRole').value;
  createUserWithEmailAndPassword(auth, email, password,role)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: role, // Make sure you add a role when creating the user
        password:password
      };

      showMessage("Account created successfully", 'signUpMessage');

      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = 'index.html';
        })
        .catch((error) => {
          console.error("Error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        showMessage("Email already exists!", "signUpMessage");
      } else {
        showMessage("Unable to create user", 'signUpMessage');
      }
    });
});

// Sign In Logic
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage('Login is successful', 'signInMessage');
      const user = userCredential.user;
      localStorage.setItem('loggedInUser', user.uid);

      const userRef = doc(db, "users", user.uid);
      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("User data:", userData);
            const userRole = userData.role;
            console.log("User role:", userRole);

            if (userRole === "student") {
              window.location.replace("student.html");
            } else if (userRole === "teacher") {
              window.location.replace("teacher.html");
            } else if (userRole === "admin") {
              window.location.replace("admin.html");
            }
          } else {
            console.error("User document not found.");
          }
        })
        .catch((error) => {
          console.error("Error getting user data: ", error);
        });
    })
    .catch((error) => {
      console.error("Error signing in: ", error);
    });
});
