const db = firebase.firestore();

new Vue({
    el: '#app',
    data: {
        formVisible: false,
        pickupDate: '',
        dropoffDate: '',
        Expectedmileage: '',
        Cartype: '',
        Carsize: '',
        transmission: '',
        features: [],
        selectedPriceLow: 0,
        selectedPrice: 50,
        maxPrice: 100000,
        PreferredCompany: '',
        selectedServices: [],
        selectedCreditScore: '',
        terms_conditions: false,
        otherCompany: '',
        user: firebase.auth().currentUser, // Assuming the user is already signed in
        showSubmissions: false,
        userSubmissions: [],
    },
    methods: {
        async fetchDataAgain(submissionId) {
            try {
                console.log(submissionId)
                // Fetch the stored preferences based on the submission ID
                const doc = await db.collection('carInquiries').doc(submissionId).get();
                const formData = doc.data();

                // Set the form data based on the fetched preferences
                this.pickupDate = formData.pickupDate;
                this.dropoffDate = formData.dropoffDate;
                this.Expectedmileage = formData.Expectedmileage;
                this.Cartype = formData.Cartype;
                this.Carsize = formData.Carsize;
                this.transmission = formData.transmission;
                this.features = formData.features;
                this.selectedPriceLow = formData.selectedPriceLow;
                this.selectedPrice = formData.selectedPrice;
                this.maxPrice = formData.maxPrice;
                this.PreferredCompany = formData.PreferredCompany;
                this.selectedServices = formData.selectedServices;
                this.selectedCreditScore = formData.selectedCreditScore;

                // Show the form with the fetched preferences
                this.formVisible = true;
                this.showSubmissions = false;
            } catch (error) {
                console.error('Error fetching data again:', error);
            }
        },
        async submitForm() {
            document.getElementById("submitBtn").disabled = true;
            if (!this.terms_conditions) {
                alert('Please agree to the terms and conditions.');
                document.getElementById("submitBtn").disabled = false;
                return;
            }

            const formData = {
                pickupDate: this.pickupDate,
                dropoffDate: this.dropoffDate,
                Expectedmileage: this.Expectedmileage,
                Cartype: this.Cartype,
                Carsize: this.Carsize,
                transmission: this.transmission,
                features: this.features,
                selectedPriceLow: this.selectedPriceLow,
                selectedPrice: this.selectedPrice,
                maxPrice: this.maxPrice,
                PreferredCompany: this.PreferredCompany.toLowerCase(),
                selectedServices: this.selectedServices,
                terms_conditions: this.terms_conditions,
                selectedCreditScore: this.selectedCreditScore,
                userId: firebase.auth().currentUser.uid,
                email: firebase.auth().currentUser.email
            };

            try {
                await db.collection('carInquiries').add(formData);
                console.log('Form data saved successfully.');

                const queryString = Object.entries(formData)
                    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                    .filter(pair => pair !== 'terms_conditions=true')
                    .join('&');

                this.resetForm();
                window.location.href = `browseform(signin).html?${queryString}`;
            } catch (error) {
                console.error('Error adding form data: ', error);
                document.getElementById("submitBtn").disabled = false;
            }
        },
        async fetchUserSubmissions() {
            const user = firebase.auth().currentUser;

            if (!user) {
                console.log('User not authenticated');
                return;
            }

            const userId = user.uid.toString(); // Convert UID to string


            try {
                // Query Firestore to get user's submissions
                console.log('User ID:', userId);
                const querySnapshot = await db.collection('carInquiries').where('userId', '==', userId).get();
                console.log('Documents in query snapshot:', querySnapshot.docs);

                // Map Firestore documents to an array
                // this.userSubmissions = querySnapshot.docs.map(doc => doc.data());
                this.userSubmissions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.error('Error fetching user submissions:', error);
            }
        },

        handleSelectChange() {
            // If a pre-defined option is selected, keep the otherCompany value intact
            if (this.PreferredCompany !== 'other') {
                this.otherCompany = '';
            }
        },
        updatePreferredCompany() {
            // If "Other" is selected, update PreferredCompany with the otherCompany value
            if (this.PreferredCompany === 'other') {
                this.$nextTick(() => {
                    this.PreferredCompany = this.otherCompany;
                });
            }
        },
        toggleFormVisibility() {
            this.formVisible = !this.formVisible;
            this.showSubmissions = false;
        },
        toggleshowSubmissions() {
            this.showSubmissions = !this.showSubmissions;
            this.formVisible = false;
        },
        previous() {
            // Toggle the visibility and fetch submissions when the button is clicked
            this.showSubmissions = !this.showSubmissions;
            this.fetchUserSubmissions();
            this.formVisible = false;
        },

        resetForm() {
            document.getElementById("submitBtn").disabled = false;
            this.pickupDate = '';
            this.dropoffDate = '';
            this.Expectedmileage = '';
            this.Cartype = '';
            this.Carsize = '';
            this.transmission = '';
            this.features = [];
            this.selectedPriceLow = 0;
            this.selectedPrice = 50;
            this.maxPrice = 100000;
            this.PreferredCompany = '';
            this.selectedServices = [];
            this.selectedCreditScore = '';
            this.terms_conditions = false;

        },
    }
});