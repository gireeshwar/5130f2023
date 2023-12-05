function getUserIpAddress(callback) {
    const accessToken = '4013f3df07354a'; // Replace with your actual access token
    const apiUrl = `https://ipinfo.io/json?token=${accessToken}`;

    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        success: (response) => {
            const ipAddress = response.ip;
            callback(ipAddress);
        },
        error: (error) => {
            if (error.status === 429) {
                console.error('Rate limit exceeded. Please wait and try again.');
            } else {
                console.error('Error fetching IP information:', error);
            }
            callback(null);
        }
    });
}
const config = {
    apiKey: "AIzaSyAMX4bZwT4JpwnVK28hNfWOukcjalXZzUA",
    authDomain: "iws1-4be46.firebaseapp.com",
    databaseURL: "https://iws1-4be46-default-rtdb.firebaseio.com",
    projectId: "iws1-4be46",
    storageBucket: "iws1-4be46.appspot.com",
    messagingSenderId: "245789471783",
    appId: "1:245789471783:web:a180927220201b036aca02"
};
firebase.initializeApp(config);

const accessKey = 'daef069f818e061093314837cc748552';

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
        userLocation: '',
        weatherInfo: '',
        countryLanguage: '',
        countryCurrency: '',
        userLocationn: '',
        isPasswordVisible: false,
    },
    methods: {
        submitForm: function () {
            return firebase.auth().createUserWithEmailAndPassword(this.formData.email, this.formData.password)
                .then(() => {
                    this.sendVerificationEmail();
                })
                .catch((error) => {
                    console.error('Registration error:', error);
                });
        },
        signIn: function () {
            return firebase.auth().signInWithEmailAndPassword(this.formData.email, this.formData.password);
        },
        signOut: function () {
            firebase.auth().signOut().then(() => {
                this.authUser = null;
            }).catch((error) => {
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
        showCountryInfo: function () {
            getUserIpAddress((userIpAddress) => {
                if (userIpAddress) {
                    const apiUrl = `http://api.ipstack.com/${userIpAddress}?access_key=${accessKey}&output=json`;

                    $.ajax({
                        url: apiUrl,
                        type: 'GET',
                        dataType: 'json',
                        success: (response) => {
                            console.log(response);

                            // Check if expected properties exist before accessing them
                            const languageName = response.location.languages && response.location.languages.length > 0
                                ? response.location.languages[0].name
                                : 'Language not available';

                            const currencyName = response.currency ? response.currency.code : 'Currency not available';

                            const address = `${response.city}, ${response.region_name}, ${response.country_name}`;

                            // Update the data properties through the Vue instance
                            this.countryLanguage = languageName;
                            this.countryCurrency = currencyName;
                            this.userLocationn = address;

                            // Show the modal
                            const modal = document.getElementById('userInfoModal');
                            modal.style.display = 'block';
                        },
                        error: (error) => {
                            console.error('Error fetching IP information:', error);
                        }
                    });
                } else {
                    console.error('User IP address not available.');
                }
            });
        },

        showUserInfo: function () {
            this.lastLogin = new Date(firebase.auth().currentUser.metadata.lastSignInTime).toLocaleString();

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        this.userLocation = `${latitude}, ${longitude}`;

                        this.fetchWeatherInfo(this.userLocation);
                    },
                    (error) => {
                        console.error('Error getting user location:', error);
                        this.userLocation = 'Location not available';
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
                this.userLocation = 'Location not available';
            }

            const modal = document.getElementById('userInfoModal');
            modal.style.display = 'block';
        },
        fetchWeatherInfo: function (location) {
            const apiKey = '323f5dcbf6574f4498ffb1235b70669d';
            const apiUrl = `https://api.weatherbit.io/v2.0/current?lat=${location.split(',')[0]}&lon=${location.split(',')[1]}&key=${apiKey}`;

            $.ajax({
                url: apiUrl,
                type: 'GET',
                success: (response) => {
                    if (response && response.data && response.data.length > 0) {
                        const weatherData = response.data[0];
                        this.weatherInfo = `${weatherData.weather.description}, ${weatherData.temp}°C`;
                    } else {
                        console.error('Invalid weather response:', response);
                        this.weatherInfo = 'Weather information not available';
                    }
                },
                error: (error) => {
                    console.error('Error fetching weather information:', error);
                    this.weatherInfo = 'Failed to fetch weather information';
                }
            });
        },
        closeUserInfoModal: function () {
            const modal = document.getElementById('userInfoModal');
            modal.style.display = 'none';
        },
        togglePasswordVisibility: function () {
            this.isPasswordVisible = !this.isPasswordVisible;
            const passwordInput = document.getElementById('password');
            passwordInput.type = this.isPasswordVisible ? 'text' : 'password';
        },
        showUserInfoAndCountryInfo: function () {
            this.showUserInfo();
            this.showCountryInfo();
        },
    },
    created: function () {
        firebase.auth().onAuthStateChanged((user) => {
            this.authUser = user;
        }, (error) => {
            console.log(error);
        });
    }
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log('User signed in:', user);
    } else {
        console.log('User signed out');
    }
});