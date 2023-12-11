const config = {
    apiKey: "AIzaSyAMX4bZwT4JpwnVK28hNfWOukcjalXZzUA",
    authDomain: "iws1-4be46.firebaseapp.com",
    projectId: "iws1-4be46",
    storageBucket: "iws1-4be46.appspot.com",
    messagingSenderId: "245789471783",
    appId: "1:245789471783:web:a180927220201b036aca02"
};

firebase.initializeApp(config);



// Check authentication state
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.email );
        // You can perform actions when the user is signed in
    } else {
        // No user is signed in
        console.log('No user is signed in.');
        // You can perform actions when the user is signed out
    }
}, (error) => {
    console.log(error);
});