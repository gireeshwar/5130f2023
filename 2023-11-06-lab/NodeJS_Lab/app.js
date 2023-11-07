function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to validate and format phone numbers
function validatePhone(phone) {
  const phoneRegex = /^\+?1?[-.\s]?(\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneRegex.test(phone);
}

// Function to validate and format URLs
function validateURL(url) {
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-])\/?$/;
  return urlRegex.test(url);
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask the user for an email address
rl.question('Enter an email address: ', (email) => {
  if (validateEmail(email)) {
    console.log(`Valid email address: ${email}`);
  } else {
    console.log(`Invalid email address: ${email}`);
  }

  // Ask the user for a phone number
  rl.question('Enter a phone number: ', (phone) => {
    if (validatePhone(phone)) {
      console.log(`Valid phone number: ${phone}`);
    } else {
      console.log(`Invalid phone number: ${phone}`);
    }

    // Ask the user for a URL
    rl.question('Enter a URL: ', (url) => {
      if (validateURL(url)) {
        console.log(`Valid URL: ${url}`);
      } else {
        console.log(`Invalid URL: ${url}`);
      }
      rl.close();
    });
  });
});