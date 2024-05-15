// Function to validate email address format
function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to check if the password contains at least one special character and one number
function hasSpecialCharacterAndNumber(password) {
  var specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  var numberRegex = /\d/;
  return specialCharacterRegex.test(password) && numberRegex.test(password);
}

// Function to check if the password length is valid (more than 6 characters)
function isPasswordLengthValid(password) {
  return password.length > 6;
}

// Function to check if password matches confirm password
function passwordMatch(password, confirmPassword) {
  return password === confirmPassword;
}

// Function to check if a string starts with a capital letter
function isCapitalized(str) {
  return /^[A-Z]/.test(str);
}

// Function to validate username to contain only small letters and at least one number
function isValidUsername(str) {
  return /^[a-z]+[0-9]*[a-z]*$/.test(str) && /\d/.test(str);
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
function validateField(value, errorElementId, requiredError, formatError, validationFunction, additionalError = null, additionalValidationFunction = null) {
  if (!value) {
    document.getElementById(errorElementId).innerText = requiredError;
    return false;
  }
  if (validationFunction && !validationFunction(value)) {
    document.getElementById(errorElementId).innerText = formatError;
    return false;
  }
  if (additionalValidationFunction && !additionalValidationFunction(value)) {
    document.getElementById(errorElementId).innerText = additionalError;
    return false;
  }
  document.getElementById(errorElementId).innerText = "";
  return true;
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

// Opening form
const formOpenBtn = document.querySelector("#form-open"),
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  signupBtn = document.querySelector("#signup"),
  loginBtn = document.querySelector("#login"),
  pwShowHide = document.querySelectorAll(".pw_hide");

formOpenBtn.addEventListener("click", () => home.classList.add("show"));
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));

pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
});
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
});

const validateSignUpForm = () => {
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
  var password = document.getElementById("currentPassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;

  // Validate all fields
  let validFirstName = validateField(firstName, "firstNameError", "First Name is required.", "First Name should start with a capital letter.", isCapitalized);
  let validMiddleName = middleName === "" ? true : validateField(middleName, "middleNameError", "", "Middle Name should start with a capital letter.", isCapitalized);
  let validLastName = validateField(lastName, "lastNameError", "Last Name is required.", "Last Name should start with a capital letter.", isCapitalized);
  let validUsername = validateField(userName, "userNameError", "Username is required.", "Username should contain only small letters and at least one number.", isValidUsername);
  let validEmail = validateField(email, "emailError", "Email is required.", "Please enter a valid email address.", isValidEmail);
  let validPhoneNumber = validateField(phNumber, "phNumberError", "Phone Number is required.", "Phone Number should start with 98 or 97 followed by 8 digits.", isValidPhoneNumber);
  let validDob = validateField(dob, "dobError", "Date of Birth is required.", "Age must be at least 18 years old.", isValidDOB);
  let validCitizenshipNumber = validateField(citizenshipNumber, "citizenshipNumberError", "Citizenship Number is required.", "Citizenship Number should follow the pattern XX-XX-XX-XXXXX.", isValidCitizenshipNumber);
  let validPassword = validateField(password, "passwordError", "Password is required.", "Password must contain at least one special character and one number and should be more than 6 characters.", hasSpecialCharacterAndNumber, "Password should be more than 6 characters.", isPasswordLengthValid);
  let validConfirmPassword = (password === confirmPassword);

  if ( !validConfirmPassword){
    validateField(confirmPassword, "confirmPasswordError", "Confirm password is required.", "Passwords do not match.", passwordMatch, password);
  }

  return validFirstName && validMiddleName && validLastName && validUsername && validEmail && validPhoneNumber && validDob && validCitizenshipNumber && validPassword && validConfirmPassword;
}

$(document).ready(function () {
  $("#signupForm").on("submit", function (event) {
    event.preventDefault();

    if (!validateSignUpForm()) {
      console.log("Validation failed");
      return;
    }

    let firstName = $("#firstName").val();
    let middleName = $("#middleName").val();
    middleName = middleName === "" ? "" : middleName;
    let lastName = $("#lastName").val();
    let userName = $("#userName").val();
    let email = $("#email").val();
    let phNumber = $("#phNumber").val();
    let dob = $("#DOB").val();
    let citizenshipNumber = $("#citizenshipNumber").val();
    let currentPassword = $("#currentPassword").val();
    let confirmPassword = $("#confirmPassword").val();

    if (currentPassword != confirmPassword) {
      alert("Confirm password and current password did not match");
      return;
    }

    let body = {
      "username": userName,
      "firstName": firstName,
      "middleName": middleName,
      "role": "Resident",
      "lastName": lastName,
      "email": email,
      "phone": phNumber,
      "citizenshipNo": citizenshipNumber,
      "password": currentPassword,
      "dateOfBirth": dob
    };

    makeRequest("POST", "http://localhost:3000/api/signup", "", {}, body)
      .then(response => {
        console.log(response);
        if (response.message) {
          Swal.fire(
            'Success!',
            'Status changed successfully.',
            'success'
        );
        } else {
          console.log("Sign Up error");
          swal("Error", "Sign Up error", "error");
        }
      })
      .catch(err => {
        console.log(err);
        swal("Error", err.message || "An error occurred", "error");
      });
  });

  $("#loginForm").on("submit", function (event) {
    event.preventDefault();

    let password = $("#password").val();
    let email = $("#loginEmail").val();

    let body = { email: email, password: password };

    makeRequest("POST", "http://localhost:3000/api/login", "", {}, body)
      .then(async (data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          swal({
            title: "Success!",
            text: "Login Successful",
            icon: "success",
            timer: 1000,
            buttons: false
          }).then(() => {
            let jwtData = decodeJWT(data.token);
            let role = jwtData.payload.role;
            if (role === "Admin") {
              setTimeout(() => {
                window.location.href = "./Admin/admin.html";
              }, 500);
            } else if (role === "Staff") {
              setTimeout(() => {
                window.location.href = "./Staff/tasks.html";
              }, 500);
            } else {
              setTimeout(() => {
                window.location.href = "./Resident/facilities.html";
              }, 500);
            }
          });
        } else {
          console.log("Login error. No token received.");
          document.getElementById("errorContainer").innerText = "Invalid Email or Password";
        }
      })
      .catch(err => {
        console.log("Error occurred during login:", err);
      });
  });
});
