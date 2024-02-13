import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  ActiveDaysBtn,
  displayMessgae,
  resetApp,
  setupAccount,
  toggleDashboard,
} from "../main";
import { clearForm } from "../compontents/Form";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// reawding the firestore dataBAse
const firebaseConfig = {
  apiKey: "AIzaSyC8y_oaEc2iZQXESczfhZ2Ao2ssqALHU6I",
  authDomain: "idea-routine-project.firebaseapp.com",
  projectId: "idea-routine-project",
  storageBucket: "idea-routine-project.appspot.com",
  messagingSenderId: "671890707999",
  appId: "1:671890707999:web:44e61a7d910ade9fff672a",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// get the database
const db = getFirestore(app);
// getting a reference to the database
// const colRef = collection(db, "users");
// const colRef_ordered = query(colRef, orderBy("time"));

/// Autentication
const auth = getAuth(app);

// FireBase Auth PRovider

// auth status change
onAuthStateChanged(
  auth,
  function (user) {
    if (user) {
      setupAccount(user);
      toggleDashboard("open");

      onSnapshot(
        getData(user),
        function (snapshot) {
          let data: any[] = [];
          snapshot.docs.forEach(function (doc, i) {
            data.push({ ...doc.data(), id: doc.id, index: i + 1 });
          });
          ActiveDaysBtn(data);
        },
        function (err) {
          displayMessgae(extractError(err.message), "error");
        }
      );
    } else {
      displayMessgae("Sign up to open idea notes", "normal");
    }
  },
  function (err) {
    displayMessgae(extractError(err.message), "error");
  }
);

// signup
export function signup(email: string, password: string) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(function (cred) {
      const colRef = collection(db, `USERS/${cred.user.uid}/userData`);
      clearForm("signup");
      addDoc(colRef, {
        content: `// TYPE SOMETHING  ....`,
        date: new Date().toISOString(),
        index: 1,
      });
    })
    .catch(function (err) {
      displayMessgae(extractError(err.message), "error");
    });
}

// signout
export function signout() {
  signOut(auth).then(function () {
    resetApp();
  });
}
//login
export function login(email: string, password: string) {
  signInWithEmailAndPassword(auth, email, password)
    .then(function () {
      clearForm("login");
    })
    .catch(function (err) {
      displayMessgae(extractError(err.message), "error");
    });
}

// google Auth
export function signupWithGoogle() {
  displayMessgae("This feature is not avaliable yet", "normal");
}
/// getting data

export function getData(user: any) {
  // const docRef = getDocs(collection(db, `USERS/${user.uid}/userData`));
  const colRef = collection(db, `USERS/${user.uid}/userData`);
  const orderColRef = query(colRef, orderBy("index"));
  return orderColRef;
}
// updateing dos

export function updateData(
  activeBtn: HTMLButtonElement,
  textarea: HTMLTextAreaElement
  // modifiedDate: HTMLElement
) {
  const dataID = `${activeBtn.getAttribute("data-id")}`.trim();
  const docRef = doc(db, `USERS/${auth.currentUser?.uid}/userData`, dataID);

  updateDoc(docRef, {
    content: textarea.value,
    date: new Date().toISOString(),
  })
    .then(function () {
      displayMessgae("SAVED", "success");
    })
    .catch(function (err) {
      displayMessgae(err.message, "error");
    });
}

export function addData(newDay: number) {
  if (auth.currentUser) {
    const colRef = collection(db, `USERS/${auth.currentUser?.uid}/userData`);

    addDoc(colRef, {
      content: "// TYPE SOMETHING  ....",
      date: new Date().toISOString(),
      index: newDay,
    });
  }
}
export function deleteData(dataID: string) {
  if (auth.currentUser) {
    const docRef = doc(
      db,
      `USERS/${auth.currentUser?.uid}/userData/`,
      dataID.trim()
    );
    deleteDoc(docRef)
      .then(function () {
        displayMessgae("Deleted!", "success");
      })
      .catch(function (err) {
        displayMessgae(extractError(err.message), "error");
      });
  }
}
//////////////////////////////////
//////////////////////////////////
// reusable functions
//////////////////////////////////

function extractError(str: string): string {
  return str.split("/")[1].replace(")", "").split("-").join(" ");
}
