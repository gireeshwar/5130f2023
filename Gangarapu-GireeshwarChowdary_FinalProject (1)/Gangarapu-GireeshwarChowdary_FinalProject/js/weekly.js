const db = firebase.firestore();
new Vue({
    el: '#app',
    data: {
        userLoggedIn: false,
        recommendcars: [],
        formData: {
            selectedCreditScore: 'prime',
            pickupDate: new Date(), // Assuming today's date for pickup
            dropoffDate: new Date(), // Assuming today's date for dropoff
            downpayment: 500,
        },
        return: {
            bestComfortCars: [],
            bestOverallCars: [],
            bestStyleCars: [],
        }
    },
    methods: {
        checkAuthState() {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.userLoggedIn = true;
                } else {
                    this.userLoggedIn = false;
                }
            }, (error) => {
                console.log(error);
            });
        },
        signout() {
            firebase.auth().signOut().then(() => {
                this.userLoggedIn = false;
                window.location.href = "home.html";
            }).catch((error) => {
                console.log(error);
            });
        },
        recommendCars() {
            db.collection('carCost').get()
                .then((querySnapshot) => {
                    const cars = [];
                    querySnapshot.forEach((doc) => {
                        const carData = doc.data();
                        cars.push(carData);
                    });

                    // Randomly select three cars for each category
                    this.bestComfortCars = this.getRandomCars(cars, 2, { carsize: 6, expectedmileage: { $gt: 22 } });
                    this.bestOverallCars = this.getRandomCars(cars, 2, { carsize: 5, expectedmileage: { $gt: 30 } });
                    this.bestStyleCars = this.getRandomCars(cars, 2, { carsize: 2 });

                    // Combine the recommendations
                    this.recommendcars = [...this.bestComfortCars, ...this.bestOverallCars, ...this.bestStyleCars];
                    console.log("Best Comfort Cars:", this.bestComfortCars);
                    console.log("Best Overall Cars:", this.bestOverallCars);
                    console.log("Best Style Cars:", this.bestStyleCars);
                })
                .catch((error) => {
                    console.error('Error fetching car data:', error);
                })
                .finally(() => {
                    // Handle any final logic or loading indicators here
                    console.log("Recommended Cars:", this.recommendcars);
                });
        },
        getRandomCars(cars, count, criteria) {
            const filteredCars = cars.filter(car => {
                for (const key in criteria) {
                    if (criteria.hasOwnProperty(key)) {
                        const condition = criteria[key];
                        if (key === 'carsize' && typeof condition === 'number') {
                            // Convert carsize to number for comparison
                            const carSize = parseInt(car[key], 10);
                            if (isNaN(carSize) || carSize !== condition) return false;
                        } else if (typeof condition === 'object') {
                            // Handle conditions like $gt, $lt, etc.
                            const operator = Object.keys(condition)[0];
                            if (operator === '$gt' && car[key] <= condition[operator]) return false;
                            if (operator === '$lt' && car[key] >= condition[operator]) return false;
                        } else if (car[key] !== condition) {
                            return false;
                        }
                    }
                }
                return true;
            });

            // Ensure the count does not exceed the available cars
            return filteredCars.slice(0, Math.min(count, filteredCars.length));
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
        calculateLeaseCost(car) {
            // Assuming duration between pickup and dropoff is always one hour
            let leaseCost;
            switch (car.cartype) {
                case 'sedan':
                    leaseCost = 15;
                    break;
                case 'suv':
                    leaseCost = 16;
                    break;
                case 'convertible':
                    leaseCost = 17;
                    break;
                default:
                    leaseCost = 0;
                    break;
            }

            return leaseCost.toFixed(2);
        },
        calculateLoanCost(car) {
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
        calculateTotalCost(car) {
            return this.calculateLoanCost(car).totalCost;
        },
        calculateMonthlyPayment(car) {
            return this.calculateLoanCost(car).monthlyPayment;
        },
    },
    created() {
        this.checkAuthState();
        this.recommendCars();
    }
});
