// import {
//     GoogleAuthProvider,
//     getAuth,
//     signInWithPopup,
//     signInWithEmailAndPassword,
//     createUserWithEmailAndPassword,
//     sendPasswordResetEmail,
//     signOut,
// } from "firebase/auth";
// import {
//     getFirestore,
//     query,
//     getDocs,
//     collection,
//     where,
//     addDoc,
// } from "firebase/firestore";


// const firebaseConfig = {
//     apiKey: "AIzaSyDTSU9Xvx6atJYoJF1q7KwWyVaKO7wR0G8",
//     authDomain: "hydrachess-e9dcd.firebaseapp.com",
//     databaseURL: "https://hydrachess-e9dcd-default-rtdb.europe-west1.firebasedatabase.app",
//     projectId: "hydrachess-e9dcd",
//     storageBucket: "hydrachess-e9dcd.appspot.com",
//     messagingSenderId: "386533733523",
//     appId: "1:386533733523:web:2c3491497d2d4c38d24966"
// };

// getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// const auth = getAuth(app);
// const db = getFirestore(app);

// const googleProvider = new GoogleAuthProvider();

// const signInWithGoogle = async () => {
//     try {
//         const res = await signInWithPopup(auth, googleProvider);
//         const user = res.user;
//         const q = query(collection(db, "users"), where("uid", "==", user.uid));
//         const docs = await getDocs(q);
//         if (docs.docs.length === 0) {
//             await addDoc(collection(db, "users"), {
//                 uid: user.uid,
//                 name: user.displayName,
//                 authProvider: "google",
//                 email: user.email,
//             });
//         }
//     } catch (err) {
//         console.error(err);
//         alert(err.message);
//     }
// };

// const logout = () => {
//     signOut(auth);
// };


// export { auth, db, signInWithGoogle, logout };

// works!
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, setPersistence, inMemoryPersistence} from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc, doc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDTSU9Xvx6atJYoJF1q7KwWyVaKO7wR0G8",
    authDomain: "hydrachess-e9dcd.firebaseapp.com",
    databaseURL: "https://hydrachess-e9dcd-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hydrachess-e9dcd",
    storageBucket: "hydrachess-e9dcd.appspot.com",
    messagingSenderId: "386533733523",
    appId: "1:386533733523:web:2c3491497d2d4c38d24966"
};

getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore();
const auth = getAuth();
// const provider = new GoogleAuthProvider();

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                lqrigip: "",
            });
        }
    } catch (err) { 
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
};

// export { db, auth, provider, signInWithPopup };
export { auth, db, signInWithGoogle, logout, collection, doc };