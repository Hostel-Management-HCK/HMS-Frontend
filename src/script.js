// login form vallidation
document.getElementById("loginForm").addEventListener("submit", function (event) {
  // Prevent the form from submitting
  event.preventDefault();

  // Clear previous errors
  document.getElementById("login_emailError").innerText = "";
  document.getElementById("login_passwordError").innerText = "";
  document.getElementById("errorContainer").innerText = "";

  // Get the values of the email and password fields
  var login_email = document.getElementById("loginEmail").value;
  var login_password = document.getElementById("password").value;

  // Validate email
  if (!login_email) {
    document.getElementById("login_emailError").innerText = "Email is required.";
  } else if (!isValidEmail(login_email)) {
    document.getElementById("login_emailError").innerText = "Please enter a valid email address.";
  }

  // Validate password
  if (!login_password) {
    document.getElementById("login_passwordError").innerText = "Password is required.";
  } else if (!hasSpecialCharacter(login_password)) {
    document.getElementById("login_passwordError").innerText = "Password must contain at least one special character.";
  }

  // If there are no errors, you can submit the form
  if (login_email && login_password) {
    // Submit the form
    this.submit();
  }
});

// Function to validate email address format
function isValidEmail(login_email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(login_email);
}

// Function to check if the password contains at least one special character
function hasSpecialCharacter(login_password) {
  var specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  return specialCharacterRegex.test(login_password);
}

// Sign Up

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
  var password = document.getElementById("currentPassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;

  // Validate first name, middle name, last name, username, email, phone number, date of birth, citizenship number, password, and confirm password
  validateField(firstName, "firstNameError", "First Name is required.", "First Name should start with a capital letter.", "isCapitalized");
  validateField(middleName, "middleNameError", "", "Middle Name should start with a capital letter.", "isCapitalized");
  validateField(lastName, "lastNameError", "Last Name is required.", "Last Name should start with a capital letter.", "isCapitalized");
  validateField(userName, "userNameError", "Username is required.", "Username should start with a capital letter.", "isCapitalized", "Username should contain at least one number.", "containsNumber");
  validateField(email, "emailError", "Email is required.", "Please enter a valid email address.", "isValidEmail");
  validateField(phNumber, "phNumberError", "Phone Number is required.", "Phone Number should start with 98 or 97 followed by 8 digits.", "isValidPhoneNumber");
  validateField(dob, "dobError", "Date of Birth is required.", "Age must be at least 18 years old.", "isValidDOB");
  validateField(citizenshipNumber, "citizenshipNumberError", "Citizenship Number is required.", "Citizenship Number should follow the pattern XX-XX-XX-XXXXX.", "isValidCitizenshipNumber");
  validateField(password, "passwordError", "Password is required.", "Password must contain at least one special character and one number and should be more than 6 characters.", "hasSpecialCharacterAndNumber", "Password should be more than 6 characters.", "isPasswordLengthValid");
  validateField(confirmPassword, "confirmPasswordError", "Confirm password is required.", "Passwords do not match.", "passwordMatch", password);

  // If there are no errors, submit the form
  if (firstName && lastName && userName && email && phNumber && dob && citizenshipNumber && password && confirmPassword && password === confirmPassword) {
    this.submit();
  }
});

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

// Function to validate a field
function validateField(value, errorElementId, requiredError, formatError, validationFunctionName, additionalError, additionalValidationFunctionName) {
  if (!value) {
    document.getElementById(errorElementId).innerText = requiredError;
  } else {
    if (validationFunctionName === "isCapitalized" && !isCapitalized(value)) {
      document.getElementById(errorElementId).innerText = formatError;
    } else if (validationFunctionName === "containsNumber" && !containsNumber(value)) {
      document.getElementById(errorElementId).innerText = additionalError;
    } else if (validationFunctionName === "passwordMatch" && !passwordMatch(value, additionalError)) {
      document.getElementById(errorElementId).innerText = formatError;
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
    } else if (validationFunctionName === "isPasswordLengthValid" && !isPasswordLengthValid(value)) {
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


$("#signupForm").on("submit", function (event) {
  event.preventDefault();


  let firstName = $("#firstName").val();
  let middleName = $("#middleName").val();
  let lastName = $("#lastName").val();
  let userName = $("#userName").val();
  let Email = $("#Email").val();
  let phNumber = $("#phNumber").val();
  let DOB = $("#DOB").val();
  let citizenshipNumber = $("#citizenshipNumber").val();
  let currentPassword = $("#currentPassword").val();
  let confirmPassword = $("#confirmPassword").val();


  if (currentPassword != confirmPassword) {
    alert("Confirm password and current password did not match")
  }

  let body = {
    "username": userName,
    "firstName": firstName,
    "middleName": middleName,
    "role": "Resident",
    "lastName": lastName,
    "email": Email,
    "phone": phNumber,
    "citizenshipNo": citizenshipNumber,
    "password": currentPassword,
    "dateOfBirth": DOB
  }


  makeRequest("POST", "http://localhost:3000/api/signup", "", {}, body)
    .then(response => {
      console.log(response);
      if (response.status === 201) {
        console.log("Sign Up successful");
        alert("Sign Up successful");
      } else {
        console.log("Sign Up error");
        alert("Sign Up error");
      }
    })
    .catch(err => {
      console.log(err);
      alert("Sign Up error");
    });

}


);

$("#loginForm").on("submit", function (event) {

  event.preventDefault();


  let password = $("#password").val();
  let email = $("#loginEmail").val();

  body = { email: email, password: password }


  makeRequest("POST", "http://localhost:3000/api/login", "", {}, body)
    .then(async (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        // Display SweetAlert
        swal({
          title: "Success!",
          text: "Login Successful",
          icon: "success",
          timer: 2000, // Auto close after 2 seconds
          buttons: false // Hide the "OK" button
        }).then(() => {
          // Redirect after a delay of 2 seconds


          console.log(data.role)


          let jwtData = decodeJWT(data.token)
          console.log(jwtData)
          let role = jwtData.payload.role
          if (role === "Admin") {
            setTimeout(() => {
              window.location.href = "./Admin/admin.html";
            }, 1000);
          }
          else if (role === "Staff") {
            setTimeout(() => {
              window.location.href = "./Staff/tasks.html";
            }, 1000);
          }
          else {
            setTimeout(() => {
              window.location.href = "./Resident/facilities.html";
            }, 1000);
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



}


);



