new Vue({
    el: '#app',
    data: {
        authUser: null,
        formData: {
            email: '',
            password: '',
        },
        showRegisterForm: true,
        lastLogin: '',
    },
    methods: {
        submitForm: function () {
            return firebase.auth().createUserWithEmailAndPassword(this.formData.email, this.formData.password)
                .then(() => {
                    this.sendVerificationEmail();
                })
                .catch((error) => {
                    console.error('Registration error:', error);
                    alert('Registration error: ' + error.message);
                });
        },
        signIn: function () {
            return firebase.auth().signInWithEmailAndPassword(this.formData.email, this.formData.password)
                .then(() => {
                    const user = firebase.auth().currentUser;

                    if (user) {
                        // Check if the email is verified
                        if (user.emailVerified) {
                            // Default redirection
                            window.location.href = "home(signin).html";
                        } else {
                            // If email is not verified, inform the user and do not redirect
                            alert('Please verify your email before logging in.');
                        }
                    }
                })
                .catch((error) => {
                    alert('Login error: ' + error.message);
                    console.error('Login error:', error);
                });
        },
        signOut: function () {
            firebase.auth().signOut().then(() => {
                this.authUser = null;
            }).catch((error) => {
                alert('Sign-out error: ' + error.message);
                console.error('Sign-out error:', error);
            });
        },
        sendVerificationEmail: function () {
            const user = firebase.auth().currentUser;

            user.sendEmailVerification().then(() => {
                console.log('Verification email sent');
            }).catch((error) => {
                console.error('Error sending verification email:', error);
            });
        },
        reload: function () {
            window.location.reload();
        }
    },
    created: function () {
        firebase.auth().onAuthStateChanged((user) => {
            this.authUser = user;

            if (this.authUser) {
                // Check if the email is verified before redirecting
                if (this.authUser.emailVerified) {
                    window.location.href = "home(signin).html";
                }
            }
        }, (error) => {
            console.log(error);
        });
    }
});