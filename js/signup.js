// Function to validate company name
var isAlpha = /^[a-zA-Z\s]+$/;

function validateCompanyName() {
  const companyName = document.getElementById('companyName').value;
  const errorCompanyName = document.getElementById('errorCompanyName');
  if (companyName.trim() === '') {
      errorCompanyName.textContent = 'Company name is required';
      return false;
  } else if (!isAlpha.test(companyName)) {
      errorCompanyName.textContent = 'Only use letters, don\'t use digits';
      return false;
  }
  errorCompanyName.textContent = '';
  return true;
}

// Function to validate company logo
function validateCompanyLogo() {
  const companyLogo = document.getElementById('companyLogo').value;
  const errorCompanyLogo = document.getElementById('errorCompanyLogo');
  if (companyLogo.trim() === '') {
      errorCompanyLogo.textContent = 'Company logo is required';
      return false;
  }
  errorCompanyLogo.textContent = '';
  return true;
}

// Function to validate company address
function validateCompanyAddress() {
  const companyAddress = document.getElementById('companyAddress').value;
  const errorCompanyAddress = document.getElementById('errorCompanyAddress');
  if (companyAddress.trim() === '') {
      errorCompanyAddress.textContent = 'Company address is required';
      return false;
  }
  errorCompanyAddress.textContent = '';
  return true;
}

// Function to validate username
function validateUsername() {
  const username = document.getElementById('username').value;
  const errorUsername = document.getElementById('errorUsername');
  if (username.trim() === '') {
      errorUsername.textContent = 'Username is required';
      return false;
  } else if (!isAlpha.test(username)) {
      errorUsername.textContent = 'Only use letters, don\'t use digits';
      return false;
  }
  errorUsername.textContent = '';
  return true;
}

// Function to validate password
function validatePassword() {
  const password = document.getElementById('password').value;
  const errorPassword = document.getElementById('errorPassword');
  if (password.trim() === '') {
      errorPassword.textContent = 'Password is required';
      return false;
  } else if (password.length < 8) {
      errorPassword.textContent = 'Password must be at least 8 characters';
      return false;
  }
  errorPassword.textContent = '';
  return true;
}

// Function to validate the entire form
function validateForm() {
    document.getElementById('overlay').style.display = 'flex';
  const isCompanyNameValid = validateCompanyName();
  const isCompanyLogoValid = validateCompanyLogo();
  const isCompanyAddressValid = validateCompanyAddress();
  const isUsernameValid = validateUsername();
  const isPasswordValid = validatePassword();

  if (isCompanyNameValid && isCompanyLogoValid && isCompanyAddressValid && isUsernameValid && isPasswordValid) {
      document.querySelector('.progress-bar').style.width = '50%';
      // Store the values in localStorage
      const companyName = document.getElementById('companyName').value;
      // const companyLogo = document.getElementById('companyLogo').value;
      const companyAddress = document.getElementById('companyAddress').value;
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const logoInput = document.getElementById('companyLogo');

      console.log(logoInput);
      // Check if a file is selected
      if (logoInput.files.length > 0) {
          const file = logoInput.files[0];
          const reader = new FileReader();
      
          // Read the file and convert it to a Data URL
          reader.onloadend = function() {
              const companyLogo = reader.result; // This is the base64 URL
              localStorage.setItem('companyLogo', companyLogo);
              // Store other fields
              localStorage.setItem('companyName', companyName);
              localStorage.setItem('companyAddress', companyAddress);
              localStorage.setItem('username', username);
              localStorage.setItem('password', password);
          };
      
          reader.readAsDataURL(file); // Read the file as a Data URL
      } else {
          console.log("No file selected.");
      }
      // Simulate a delay for the progress bar
      setTimeout(() => {
          window.location.href = "signup2.html";  
          document.getElementById('overlay').style.display = 'none';
        }, 100);
    
  } else {
    //   alert('Please fix the errors in the form');
      document.getElementById('overlay').style.display = 'none';
  }
}
