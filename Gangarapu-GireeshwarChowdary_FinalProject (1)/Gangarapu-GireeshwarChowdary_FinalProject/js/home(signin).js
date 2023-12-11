function guest() {
    window.location.href = "guidance2.html";
}
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}
function handleScroll() {
    // Get the position of the social-container
    const socialContainer = document.querySelector('.social-container');
    const socialContainerPosition = socialContainer.getBoundingClientRect().top;

    // Trigger the animation class when the social-container is in view
    if (socialContainerPosition < window.innerHeight / 2) {
        socialContainer.classList.add('tracking-in-contract-bck');
    } else {
        socialContainer.classList.remove('tracking-in-contract-bck');
    }
}

function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this,
            args = arguments;
        const later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Updated scroll event listener using the debounce function
const debouncedHandleScroll = debounce(handleScroll, 100);

function signOut() {
    firebase.auth().signOut().then(() => {
        // Redirect to the first home page after successful sign-out
        window.location.href = "home.html";
    }).catch((error) => {
        console.error('Sign-out error:', error);
    });
}

new Vue({
    // el: '#app', // Commented out
    data: {
        showForm: false,
        formVisible: false,
        authUser: null
    },

    mounted() {
        // Add scroll event listener to trigger animation on scroll
        window.addEventListener('scroll', handleScroll);
        // Add debounced scroll event listener to trigger animation on scroll
        window.addEventListener('scroll', debouncedHandleScroll);
    },
    destroyed() {
        // Remove the scroll event listener when the component is destroyed
        window.removeEventListener('scroll', handleScroll);
        // Add debounced scroll event listener to trigger animation on scroll
        window.addEventListener('scroll', debouncedHandleScroll);
    },
    methods: {
        toggleLoginStatus() {
            const welcomeElement = document.getElementById('user-welcome');
            if (welcomeElement) {
                if (this.authUser) {
                    // If the user is logged in and has an email, display a welcome message
                    const userEmail = this.authUser.email || "Guest";
                    welcomeElement.innerHTML = `Welcome, ${userEmail}!`;
                } else {
                    // If the user is not logged in, clear the welcome message
                    welcomeElement.innerHTML = '';
                }
            }
        },
        toggleForm() {
            this.showForm = !this.showForm;
            document.querySelector('.cards').classList.toggle('move-left', this.showForm);
        },
        toggleFormVisibility() {
            this.formVisible = !this.formVisible;
        },

        scrollToSection: scrollToSection, // Assign the function to the method
        previous() {
            window.location.href = "previous.html";
        },
    },
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            this.authUser = user;
            this.toggleLoginStatus();
        }, (error) => {
            console.log(error);
        });
    }
});