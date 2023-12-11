const db = firebase.firestore();

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function navigateAndScroll(url, sectionId) {
    window.location.href = url;
    this.scrollToSection(sectionId);
}

new Vue({
    el: '#app',
    data: {
        userLoggedIn: false, // Initialize as false by default
        formData: {
            name: '',
            email: '',
        },
        contactData: {
            name: '',
            email: '',
            message: '',
        }
    },
    methods: {
        checkAuthState() {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    // User is signed in
                    this.userLoggedIn = true;
                } else {
                    // No user is signed in
                    this.userLoggedIn = false;
                }
            }, (error) => {
                console.log(error);
            });
        },
        signout() {
            firebase.auth().signOut().then(() => {
                // Sign-out successful.
                this.userLoggedIn = false;
                window.location.href = "home.html";
            }).catch((error) => {
                // An error happened.
                console.log(error);
            });
        },
        submitForm() {
            document.getElementById("submitBtn").disabled = true;
            db.collection("subscribedUsers").add(this.formData)
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                    alert("You have successfully subscribed!");
                    this.resetForm();
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
        },
        resetForm() {
            document.getElementById("submitBtn").disabled = false;
            this.formData.name = '';
            this.formData.email = '';
        },
        submitContactForm() {
            document.getElementById("submitButton").disabled = true;
            db.collection("contactUs").add(this.contactData)
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                    alert("Your message has been sent!");
                    this.resetContactForm();
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
        },
        resetContactForm() {
            document.getElementById("submitButton").disabled = false;
            this.contactData.name = '';
            this.contactData.email = '';
            this.contactData.message = '';
        },
        navigateAndScroll: navigateAndScroll,
    },
    created() {
        // Call the checkAuthState method when the Vue instance is created
        this.checkAuthState();
    }
});
