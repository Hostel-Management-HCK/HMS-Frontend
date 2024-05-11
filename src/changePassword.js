// Get token from localStorage
const token = localStorage.getItem("token");

$(document).ready(function () {
    // Function to make API request
    const makeRequest = (method, url, token, body) => {
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include JWT token in the request headers
            },
            body: JSON.stringify(body)
        });
    };

    // Function to submit password change
    async function changePassword(oldPassword, newPassword,confirmPassword) {

        try {
            const response = await makeRequest("POST", "http://localhost:3000/api/change-password", token,{ oldPassword, newPassword , confirmPassword});
            if (response.ok) {

                alert("Password changed successfully please re login.");
                window.location.href = "index.html"
            } else {

                let data = await response.json();
                alert(data.message)
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert("Error changing password. Please try again later.");
        }
    }

    // Function to handle form submission
    async function handleSubmit() {


        if(!validateForm()){
            return
        }
        const oldPassword = $("#oldPassword").val();
        const newPassword = $("#newPassword").val();
        const confirmPassword = $("#confirmPassword").val();

        // Validate new password and confirm password
        if (newPassword !== confirmPassword) {
            $("#confirmPasswordError").text("Passwords do not match.");
            return;
        }

        // Call the changePassword function to submit the password change
        await changePassword(oldPassword, newPassword,confirmPassword);

        // Clear the form fields after submission
        $("#oldPassword").val("");
        $("#newPassword").val("");
        $("#confirmPassword").val("");
    }

    // Attach event listener to the submit button
    $("#changePasswordForm").on("submit",(event)=>{
        event.preventDefault()
        handleSubmit()
    } );




    
// --------------------------------------------------
function validateForm() {
    var oldPassword = document.getElementById("oldPassword").value;
    var newPassword = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    var oldPasswordError = document.getElementById("oldPasswordError");
    var newPasswordError = document.getElementById("newPasswordError");
    var confirmPasswordError = document.getElementById("confirmPasswordError");

    var specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    var numbers = /[0-9]/;

    if (oldPassword.trim() === "") {
      oldPasswordError.innerText = "Current Password is required";
      return false;
    } else {
      oldPasswordError.innerText = "";
    }

    if (newPassword.trim() === "") {
      newPasswordError.innerText = "New Password is required";
      return false;
    } else if (newPassword.length < 6) {
      newPasswordError.innerText = "Password must be at least 6 characters long";
      return false;
    } else if (!specialChars.test(newPassword) || !numbers.test(newPassword)) {
      newPasswordError.innerText = "Password must contain at least 1 special character and 1 number";
      return false;
    } else {
      newPasswordError.innerText = "";
    }

    if (confirmPassword.trim() === "") {
      confirmPasswordError.innerText = "Confirm Password is required";
      return false;
    } else if (confirmPassword !== newPassword) {
      confirmPasswordError.innerText = "Passwords do not match";
      return false;
    } else {
      confirmPasswordError.innerText = "";
    }

    return true;
  }

});




