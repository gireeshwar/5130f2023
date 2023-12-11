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
        otherCompany: ''
    },
    methods: {
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
                selectedCreditScore: this.selectedCreditScore
            };

            try {
                await db.collection('carInquiries').add(formData);
                console.log('Form data saved successfully.');

                const queryString = Object.entries(formData)
                    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                    .filter(pair => pair !== 'terms_conditions=true')
                    .join('&');

                this.resetForm();
                window.location.href = `browseform.html?${queryString}`;
            } catch (error) {
                console.error('Error adding form data: ', error);
                document.getElementById("submitBtn").disabled = false;
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
        }
    }
});