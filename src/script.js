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

// Function to display error message
function showError(input, message) {
  var errorElement = document.createElement('div');
  errorElement.className = 'error';
  errorElement.innerText = message;
  errorElement.style.margin = "5px";

  input.parentNode.style.margin = "20px"
  input.parentNode.appendChild(errorElement);
}

// Function to remove error message
function clearError(input) {
  var error = input.parentNode.querySelectorAll('.error');
  if (error) {
    error.forEach(element =>{
      element.parentNode.removeChild(element);

    })
  }
}

// Function to validate login form
function validateLoginForm() {
  var email = document.querySelector('.login_form input[type="email"]');
  var password = document.querySelector('.login_form input[type="password"]');
  var isValid = true;

  clearError(email);
  clearError(password);

  // Simple email validation
  if (!email.value.trim()) {
    showError(email, "Please enter your email");
    isValid = false;
  }

  // Simple password validation
  if (!password.value.trim()) {
    showError(password, "Please enter your password");
    isValid = false;
  }

  return isValid;
}

// Function to validate signup form
function validateSignupForm() {
  var isValid = true;
  return isValid;
}

// Event listener for login form submission
// document.getElementById("loginButton").addEventListener("click", function(event) {
//   if (!validateLoginForm()) {
//       event.preventDefault();
//   }
// });

// Event listener for signup form submission
// document.querySelector('.signup_form button.form_button').addEventListener("click", function (event) {
//   if (!validateSignupForm()) {
//     event.preventDefault();
//   }
// });

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


    if (currentPassword!=confirmPassword){
      alert ("Confirm password and current password did not match")
    }

    let body = {
      "username": userName,
      "firstName": firstName,
      "middleName": middleName,
      "role":"Resident",
      "lastName": lastName,
      "email": Email,
      "phone": phNumber,
      "citizenshipNo": citizenshipNumber,
      "password": currentPassword,
      "dateOfBirth": DOB
    }


    makeRequest("POST", "http://localhost:3000/api/signup", "", {}, body)
  .then(response => {
    if (response.data && response.error) {
      console.log("Both response data and error present");
      alert("Sign Up successful");
    } else if (response.data) {
      console.log(response.data);
      alert("Sign Up successful");
    } else if (response.error) {
      console.log(response.error);
      alert("Sign Up error");
    } else {
      console.log("Unknown error");
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
  .then(data => {
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
        setTimeout(() => {
          window.location.href = "./Admin/admin.html";
        });
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



