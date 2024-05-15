document.getElementById('logout-link').addEventListener('click', function (event) {
  event.preventDefault();
  localStorage.removeItem("token");
  window.location.href = '../index.html';
});

//   Sign Up
document.getElementById("phNumber").addEventListener("input", function (event) {
  // Remove non-numeric characters
  this.value = this.value.replace(/\D/g, "");
  // Clear error message
  document.getElementById("phNumberError").innerText = "";
});

document.getElementById("signupForm").addEventListener("submit", function (event) {
  // Prevent the form from submitting
  event.preventDefault();

  // Clear previous errors
  clearErrors();

  // Get the values of the form fields
  var firstName = document.getElementById("firstName").value;
  var middleName = document.getElementById("middleName").value;
  var lastName = document.getElementById("lastName").value;
  var userName = document.getElementById("userName").value;
  var email = document.getElementById("email").value;
  var phNumber = document.getElementById("phNumber").value;
  var dob = document.getElementById("DOB").value;
  var citizenshipNumber = document.getElementById("citizenshipNumber").value;

  // Validate first name, middle name, last name, username, email, phone number, date of birth, citizenship number, password, and confirm password
  validateField(firstName, "firstNameError", "First Name is required.", "First Name should start with a capital letter.", "isCapitalized");
  validateField(middleName, "middleNameError", "", "Middle Name should start with a capital letter.", "isCapitalized");
  validateField(lastName, "lastNameError", "Last Name is required.", "Last Name should start with a capital letter.", "isCapitalized");
  validateField(userName, "userNameError", "Username is required.", "Username should contain only small letters and at least one number.", "isValidUsername");
  validateField(email, "emailError", "Email is required.", "Please enter a valid email address.", "isValidEmail");
  validateField(phNumber, "phNumberError", "Phone Number is required.", "Phone Number should start with 98 or 97 followed by 8 digits.", "isValidPhoneNumber");
  validateField(dob, "dobError", "Date of Birth is required.", "Age must be at least 18 years old.", "isValidDOB");
  validateField(citizenshipNumber, "citizenshipNumberError", "Citizenship Number is required.", "Citizenship Number should follow the pattern XX-XX-XX-XXXXX.", "isValidCitizenshipNumber");
  // If there are no errors, submit the form
  if (firstName && lastName && userName && email && phNumber && dob && citizenshipNumber) {
    this.submit();
  }
});
// Function to validate username to contain only small letters and at least one number
function isValidUsername(str) {
  return /^[a-z]+[0-9]*[a-z]*$/.test(str) && /\d/.test(str);
}
// Function to validate email address format
function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to check if a string starts with a capital letter
function isCapitalized(str) {
  return /^[A-Z]/.test(str);
}

// Function to check if a string contains at least one number
function containsNumber(str) {
  return /\d/.test(str);
}

// Function to validate phone number format
function isValidPhoneNumber(phoneNumber) {
  var phoneRegex = /^(98|97)\d{8}$/;
  return phoneRegex.test(phoneNumber);
}

// Function to validate date of birth (DOB)
function isValidDOB(dob) {
  var today = new Date();
  var birthDate = new Date(dob);
  var age = today.getFullYear() - birthDate.getFullYear();
  var monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
}

// Function to validate citizenship number format
function isValidCitizenshipNumber(citizenshipNumber) {
  var citizenshipRegex = /^[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{5}$/;
  return citizenshipRegex.test(citizenshipNumber);
}
// Function to validate a field
function validateField(value, errorElementId, requiredError, formatError, validationFunctionName, additionalError, additionalValidationFunctionName) {
  if (!value) {
    document.getElementById(errorElementId).innerText = requiredError;
  } else {
    if (validationFunctionName === "isCapitalized" && !isCapitalized(value)) {
      document.getElementById(errorElementId).innerText = formatError;
    } else if (validationFunctionName === "isValidUsername" && !isValidUsername(value)) {
      document.getElementById(errorElementId).innerText = formatError;
    } else if (validationFunctionName === "containsNumber" && !containsNumber(value)) {
      document.getElementById(errorElementId).innerText = additionalError;
    } else if (validationFunctionName === "isValidEmail" && !isValidEmail(value)) {
      document.getElementById(errorElementId).innerText = formatError;
    } else if (validationFunctionName === "isValidPhoneNumber" && !isValidPhoneNumber(value)) {
      document.getElementById(errorElementId).innerText = formatError;
    } else if (validationFunctionName === "isValidDOB" && !isValidDOB(value)) {
      document.getElementById(errorElementId).innerText = formatError;
    } else if (validationFunctionName === "isValidCitizenshipNumber" && !isValidCitizenshipNumber(value)) {
      document.getElementById(errorElementId).innerText = formatError;
    } else if (validationFunctionName === "hasSpecialCharacterAndNumber" && !hasSpecialCharacterAndNumber(value)) {
      document.getElementById(errorElementId).innerText = formatError;
    }
  }
}

// Function to clear error messages
function clearErrors() {
  var errorElements = document.querySelectorAll('.error');
  errorElements.forEach(function (element) {
    element.innerText = "";
  });
}

// Keep hyphens in the relevant places while typing numbers
document.getElementById("citizenshipNumber").addEventListener("input", function (event) {
  var inputValue = this.value.replace(/\D/g, ''); // Remove non-numeric characters
  var formattedValue = "";

  // Add hyphens in the relevant places
  for (var i = 0; i < inputValue.length; i++) {
    if (i === 2 || i === 4 || i === 6) {
      formattedValue += "-";
    }
    formattedValue += inputValue[i];
  }

  this.value = formattedValue;

  // Limit input once requirements are met
  if (this.value.length >= 14) {
    this.value = this.value.slice(0, 14);
  }
});

const sideMenu = document.querySelector('aside');
const menuBtn = document.querySelector('#menu_bar');
const closeBtn = document.querySelector('#close_btn');

menuBtn.addEventListener('click', () => {
  sideMenu.style.display = "block"
})
closeBtn.addEventListener('click', () => {
  sideMenu.style.display = "none"
})

