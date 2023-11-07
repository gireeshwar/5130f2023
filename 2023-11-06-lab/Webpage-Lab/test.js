document.addEventListener('DOMContentLoaded', (event) => {
  const form = document.getElementById('validationForm');
  form.addEventListener('reset', function () {
    console.log('Form has been reset');
    clearFeedback();
  });

  form.addEventListener('submit', function (event) {
      event.preventDefault();
      
      // Validate and provide detailed feedback
      provideDetailedFeedback('email');
      provideDetailedFeedback('phone');
      provideDetailedFeedback('url');
  });
});

function clearFeedback() {
  document.getElementById('emailFeedback').textContent = '';
  document.getElementById('phoneFeedback').textContent = '';
  document.getElementById('urlFeedback').textContent = '';
}

function provideDetailedFeedback(inputType) {
  const value = document.getElementById(inputType).value;
  let feedbackElement = document.getElementById(`${inputType}Feedback`);
  switch (inputType) {
    case 'email':
      feedbackElement.textContent = getDetailedEmailFeedback(value);
      break;
    case 'phone':
      feedbackElement.textContent = getDetailedPhoneFeedback(value);
      break;
    case 'url':
      feedbackElement.textContent = getDetailedURLFeedback(value);
      break;
  }
  feedbackElement.className = feedbackElement.textContent.includes('Invalid') ? 'error' : 'success';
}

function getDetailedEmailFeedback(email) {
  if (!email.includes('@')) {
    return 'Invalid email: Missing @ symbol.';
  } else if (!email.includes('.')) {
    return 'Invalid email: Missing dot (.) in domain part.';
  } else if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(email)) {
    return 'Invalid email: Incorrect format.';
  }
  return 'Email is valid.';
}

function getDetailedPhoneFeedback(phone) {
  if (!/^\+?1?[-.\s]?(\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/.test(phone)) {
    return 'Invalid phone number: Use +1 (XXX) XXX-XXXX format.';
  }
  return 'Phone number is valid.';
}

function getDetailedURLFeedback(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'Invalid URL: Missing protocol (http:// or https://).';
  } else if (!/\.\w+/.test(url)) {
    return 'Invalid URL: Missing top-level domain (like .com or .org).';
  } else if (!/^(https?:\/\/)?[\w\.-]+\.\w{2,}([\/\w \.-])\/?$/.test(url)) {
    return 'Invalid URL: Incorrect format.';
  }
  return 'URL is valid.';
}