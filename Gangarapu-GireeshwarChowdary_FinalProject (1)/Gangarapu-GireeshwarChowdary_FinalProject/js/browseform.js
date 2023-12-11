const db = firebase.firestore();
new Vue({
    el: '#app',
    data: {
        matchedCars: [], // Make sure matchedCars is defined in the data section
        loadallcars: [],
        formData: {
            Cartype: '',
            Carsize: '',
            transmission: '',
            PreferredCompany: '',
            Expectedmileage: 0,
            selectedCreditScore: '',
            pickupDate: new Date(),
            dropoffDate: new Date(),
            features: [],
            selectedServices: [],
            downpayment: 500,
        },
        loading: true,
        error: null,
        sortOption: 'model',

    },
    created() {
        this.loadMatchingCars();
        this.loadAllCars();
    },
    methods: {
        loadMatchingCars() {
            const queryString = window.location.search.substring(1);
            const params = new URLSearchParams(queryString);

            if (
                params.has("Cartype") &&
                params.has("Carsize") &&
                params.has("transmission") &&
                params.has("Expectedmileage") &&
                params.has("selectedCreditScore") &&
                params.has("pickupDate") &&
                params.has("dropoffDate")
            ) {
                this.formData = {
                    Cartype: params.get("Cartype"),
                    Carsize: params.get("Carsize"),
                    transmission: params.get("transmission"),
                    Expectedmileage: Number(params.get("Expectedmileage")),
                    selectedCreditScore: params.get("selectedCreditScore"),
                    pickupDate: new Date(params.get("pickupDate")),
                    dropoffDate: new Date(params.get("dropoffDate")),
                    features: params.getAll("features[]"),
                    selectedServices: params.getAll("selectedServices[]"),
                    downpayment: params.has("downpayment")
                        ? Number(params.get("downpayment"))
                        : 500, // Default downpayment value
                };

                let query = db.collection('carCost')
                    .where('cartype', '==', this.formData.Cartype)
                    .where('carsize', '==', this.formData.Carsize)
                    .where('transmission', '==', this.formData.transmission)
                    .where('expectedmileage', '>=', this.formData.Expectedmileage);

                // Conditionally adding filtering criteria for features
                if (this.formData.features.length > 0) {
                    query = query.where('features', 'array-contains-any', this.formData.features);
                }

                // Conditionally adding filtering criteria for selected services
                if (this.formData.selectedServices.length > 0) {
                    query = query.where('selectedServices', 'array-contains-any', this.formData.selectedServices);
                }

                // Conditionally adding filtering criteria for preferred company
                const preferredCompany = params.get("PreferredCompany");
                if (preferredCompany && preferredCompany !== "no preference") {
                    query = query.where('preferredCompany', '==', preferredCompany);
                }

                query.get()
                    .then((querySnapshot) => {
                        const cars = [];
                        querySnapshot.forEach((doc) => {
                            const carData = doc.data();
                            cars.push(carData);
                        });
                        this.matchedCars = cars;
                    })
                    .catch((error) => {
                        console.error('Error fetching car data:', error);
                        this.error = 'Error fetching car data';
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
        loadAllCars() {
            db.collection('carCost').get()
                .then((querySnapshot) => {
                    const cars = [];
                    querySnapshot.forEach((doc) => {
                        const carData = doc.data();
                        cars.push(carData);
                    });
                    this.loadallcars = cars;
                })
                .catch((error) => {
                    console.error('Error fetching car data:', error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        groupBy(array, property) {
            return array.reduce((result, obj) => {
                const key = obj[property];
                if (!result[key]) {
                    result[key] = [];
                }
                result[key].push(obj);
                return result;
            }, {});
        },
        capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        calculateLeaseCost(car, formData) {
            const pickupDate = formData.pickupDate;
            const dropoffDate = formData.dropoffDate;
            const durationInHours = (dropoffDate - pickupDate) / (60 * 60 * 1000) || 0

            let leaseCost;
            switch (car.cartype) {
                case 'sedan':
                    leaseCost = 15 * durationInHours;
                    break;
                case 'suv':
                    leaseCost = 16 * durationInHours;
                    break;
                case 'convertible':
                    leaseCost = 17 * durationInHours;
                    break;
                default:
                    leaseCost = 0;
                    break;
            }

            return leaseCost.toFixed(2);
        },
        calculateLeaseType(car) {
            const carType = car.cartype.toLowerCase(); // Adjust here if needed

            const leaseRates = {
                sedan: 15,
                suv: 16,
                convertible: 17,
                // Add more car types and their corresponding rates
            };

            if (leaseRates.hasOwnProperty(carType)) {
                const leaseRate = leaseRates[carType];
                return leaseRate.toFixed(2);
            } else {
                return 'N/A'; // Handle unknown car types gracefully
            }
        },

        calculateLoanCost(car, formData) {
            const loanDurationInYears = 3;
            const interestRates = {
                prime: 6.44,
                nonprime: 8.99,
                subprime: 11.72,
                deep_subprime: 14.18,
            };

            const interestRate = interestRates[this.formData.selectedCreditScore];

            const loanAmount = car.cost - parseFloat(this.formData.downpayment);
            const monthlyInterestRate = interestRate / 100 / 12;
            const totalPayments = loanDurationInYears * 12;
            const loanPayment = (monthlyInterestRate * loanAmount) / (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));

            return {
                totalCost: (loanPayment * totalPayments).toFixed(2),
                monthlyPayment: loanPayment.toFixed(2),
            };
        },
        calculateTotalCost(car, formData) {
            return this.calculateLoanCost(car, formData).totalCost;
        },
        calculateMonthlyPayment(car, formData) {
            // Use the updated calculateLoanCost method to get the monthly payment
            return this.calculateLoanCost(car, formData).monthlyPayment;
        },
        getSelectedFeatures(features) {
            return features.filter(feature => this.formData.features.includes(feature)).join(', ');
        },
        getSelectedServices(services) {
            return services.filter(service => this.formData.selectedServices.includes(service)).join(', ');
        },
        // calculate based on down payment method calculatedownpayment

    },
});