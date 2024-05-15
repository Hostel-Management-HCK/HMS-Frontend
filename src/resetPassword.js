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
    async function changePassword(email, newPassword, confirmPassword) {
        try {
            const response = await makeRequest("POST", "http://localhost:3000/api/reset-password", token, { email, newPassword, confirmPassword });
            if (response.ok) {
                Swal.fire(
                    'Success!',
                    'Password changed successfully. Please re-login.',
                    'success'
                ).then(() => {
                    window.location.href = "index.html";
                });
            } else {
                let data = await response.json();
                Swal.fire(
                    'Error!',
                    data.message,
                    'error'
                );
            }
        } catch (error) {
            console.error('Error changing password:', error);
            Swal.fire(
                'Error!',
                'Error changing password. Please try again later.',
                'error'
            );
        }
    }

    // Function to handle form submission
    async function handleSubmit() {


        if (!validateForm()) {
            return
        }
        const email = $("#email").val();
        const newPassword = $("#newPassword").val();
        const confirmPassword = $("#confirmPassword").val();

        // Validate new password and confirm password
        if (newPassword !== confirmPassword) {
            $("#confirmPasswordError").text("Passwords do not match.");
            return;
        }

        // Call the changePassword function to submit the password change
        await changePassword(email, newPassword, confirmPassword);

        // Clear the form fields after submission
        $("#email").val("");
        $("#newPassword").val("");
        $("#confirmPassword").val("");
    }

    // Attach event listener to the submit button
    $("#resetPasswordForm").on("submit", (event) => {
        event.preventDefault()
        handleSubmit()
    });





    // --------------------------------------------------
    function validateForm() {
        var email = document.getElementById("email").value;
        var newPassword = document.getElementById("newPassword").value;
        var confirmPassword = document.getElementById("confirmPassword").value;

        var emailError = document.getElementById("emailError");
        var newPasswordError = document.getElementById("newPasswordError");
        var confirmPasswordError = document.getElementById("confirmPasswordError");

        var specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        var numbers = /[0-9]/;

        if (email.trim() === "") {
            emailError.innerText = "Email is required";
            return false;
        } else {
            emailError.innerText = "";
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




