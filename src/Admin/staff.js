const token = localStorage.getItem("token");

let editstaffId = 0;
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
    makeRequest("GET", "http://localhost:3000/api/staffs", token)
        .then(async (response) => {
            if (response.ok) {
                const responseData = await response.json();
                const staffs = responseData.staffs;

                // Clear existing table rows
                $("#staffTableBody").empty();

                // Iterate through staffs and populate the table
                staffs.forEach(staff => {
                    const row = `
        <tr id = "staff_row${staff.staffId}">
            <td>${staff.staffId}</td>
            <td>${staff.firstName} ${staff.lastName}</td>
            <td>${staff.email}</td>
            <td>${staff.phone}</td>
            <td>${staff.citizenshipNo}</td>
            <td>${staff.billing.amount === null ? "No Salary" : staff.billing.amount}</td>
            <td><button class="edit-btn edit-staffDetails" data-staff-id="${staff.staffId}" (${staff.staffId})">Edit</button></td>
            <td><button class=" staff-delete delete-btn" data-staff-id="${staff.staffId}">Delete</button></td>
        </tr>
    `;
                    $("#staffTableBody").append(row);
                });
                $('table#staffTable').DataTable();
            } else {
                console.error('Failed to fetch staff data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching staff data:', error);
        });
    // Define deleteStaff function
    const deleteStaff = staffId => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                makeRequest("DELETE", `http://localhost:3000/api/staffs/${staffId}`, token)
                    .then(response => {
                        if (response.ok) {
                            $(`#staff_row${staffId}`).remove(); // Remove the table row
                            Swal.fire(
                                'Deleted!',
                                'Staff has been deleted successfully.',
                                'success'
                            );
                        } else {
                            Swal.fire(
                                'Failed!',
                                `Failed to delete staff: ${response.statusText}`,
                                'error'
                            );
                        }
                    })
                    .catch(error => {
                        Swal.fire(
                            'Error!',
                            `Error deleting staff: ${error}`,
                            'error'
                        );
                    });
            }
        });
    };

    $(document).on('click', '.staff-delete', function () {
        const staffId = $(this).data('staff-id');
        deleteStaff(staffId);
    });

    // To create a staff
    const createStaff = () => {
        const firstName = $("#firstName").val();
        let middleName = $("#middleName").val();
        middleName = middleName === "" ? null : middleName
        const lastName = $("#lastName").val();
        const userName = $("#userName").val();
        const email = $("#email").val();
        const phNumber = $("#phNumber").val();
        const citizenshipNumber = $("#citizenshipNumber").val();
        const currentPassword = $("#currentPassword").val();
        const salary = $("#Salary").val();

        const staffData = {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            username: userName,
            email: email,
            phone: phNumber,
            citizenshipNo: citizenshipNumber,
            password: currentPassword,
            amount: salary
        };

        makeRequest("POST", "http://localhost:3000/api/staffs", token, staffData)
        .then(async (response) => {
            let data = await response.json();
            if (response.ok) {
                Swal.fire(
                    'Success!',
                    'The staff data has been created successfully.',
                    'success'
                ).then(() => {
                    // Fetch staff data
                    fetchStaffData();
                    // Close the popup after creating the staff
                    $('.popup.compose').hide();
                });
                
            } else {
                Swal.fire(
                    'Failed!',
                    `Failed to create staff: ${response.statusText}`,
                    'error'
                ).then(() => {
                    // Show error message if available
                    if (data.message) {
                        Swal.fire(
                            'Error',
                            `Error creating the staff: ${data.message}`,
                            'error'
                        );
                    }
                });
            }
        })
        .catch(error => {
            Swal.fire(
                'Error!',
                `Error creating staff: ${error}`,
                'error'
            );
        });   
    };

    // Event listener for the "Send" button in the staff form
    $('#staffSendButton').on('click', function () {
        createStaff();
    });

    $(document).on('click', '.edit-staffDetails', function () {
        const staffId = $(this).data('staff-id');
        editstaff(staffId);
        console.log("sldjflksajdf")
    })

    const editstaff = staffId => {
        document.querySelector(".edit-staffDetails-popup").classList.add("active")
        getStaffDetail(staffId);
    }
});
const getStaffDetail = (staffId) => {

    makeRequest("GET", `http://localhost:3000/api/staffs/${staffId}`, token)
        .then(async (response) => {
            console.log(response)
            if (response.staff) {
                const staff = response.staff;
                editstaffId = staffId;
                console.log(staff)

                $('#editFirstName').val(staff.firstName);
                $('#editMiddleName').val(staff.middleName);
                $('#editLastName').val(staff.lastName);
                $('#editUserName').val(staff.username);
                $('#editEmail').val(staff.email);
                $('#editPhNumber').val(staff.phone);
                $('#editCitizenshipNumber').val(staff.citizenshipNo);
                $('#editSalary').val(staff.billing.amount);
            } else {
                console.error('Failed to fetch room data:', response.statusText);
            }
        })
}
const editStaffData = (staffId) => {

    let token = localStorage.getItem("token");

    let firstName = ($('#editFirstName').val());
    let middleName = ($('#editMiddleName').val());
    middleName= middleName === ""?null:middleName
    let lastName = ($('#editLastName').val());
    let userName = ($('#editUserName').val());
    let email = ($('#editEmail').val());
    let phNumber = parseInt($('#editPhNumber').val());
    let citizenshipNumber = ($('#editCitizenshipNumber').val());
    let currentPassword = ($('#editCurrentPassword').val());
    let salary = ($('#editSalary').val());


    console.log(userName)
    const body = {
        username: userName,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: email,
        phone: phNumber,
        citizenshipNo: citizenshipNumber,
        password: currentPassword,
        amount: salary,

    }

    makeRequest("PUT", "http://localhost:3000/api/staffs/" + staffId, token,{}, body)
    .then(async (response) => {
        if (response.staff) {
            Swal.fire(
                'Success!',
                'The staff data has been updated successfully.',
                'success'
            ).then(() => {
                // Reload the page
                window.location.reload();
                // Close the popup after updating staff data
                $('.popup.edit-details').hide();
            });
        } else {
            Swal.fire(
                'Failed!',
                `Failed to update staff data: ${response.statusText}`,
                'error'
            );
        }
    })
    .catch(error => {
        Swal.fire(
            'Error!',
            `Error updating staff data: ${error}`,
            'error'
        );
    });
}
























































function validateAddStaff() {
    // -------------------------------------------------------- Validation
    //   Sign Up
    document.getElementById("phNumber").addEventListener("input", function (event) {
        // Remove non-numeric characters
        this.value = this.value.replace(/\D/g, "");
        // Clear error message
        document.getElementById("phNumberError").innerText = "";
    });

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
    var citizenshipNumber = document.getElementById("citizenshipNumber").value;
    var password = document.getElementById("currentPassword").value;

    // Validate first name, middle name, last name, username, email, phone number, date of birth, citizenship number, password, and confirm password
    validateField(firstName, "firstNameError", "First Name is required.", "First Name should start with a capital letter.", "isCapitalized");
    validateField(middleName, "middleNameError", "", "Middle Name should start with a capital letter.", "isCapitalized");
    validateField(lastName, "lastNameError", "Last Name is required.", "Last Name should start with a capital letter.", "isCapitalized");
    validateField(userName, "userNameError", "Username is required.", "Username should start with a capital letter.", "isCapitalized", "Username should contain at least one number.", "containsNumber");
    validateField(email, "emailError", "Email is required.", "Please enter a valid email address.", "isValidEmail");
    validateField(phNumber, "phNumberError", "Phone Number is required.", "Phone Number should start with 98 or 97 followed by 8 digits.", "isValidPhoneNumber");
    validateField(citizenshipNumber, "citizenshipNumberError", "Citizenship Number is required.", "Citizenship Number should follow the pattern XX-XX-XX-XXXXX.", "isValidCitizenshipNumber");
    validateField(password, "passwordError", "Password is required.", "Password must contain at least one special character and one number and should be more than 6 characters.", "hasSpecialCharacterAndNumber", "Password should be more than 6 characters.", "isPasswordLengthValid");

    // If there are no errors, submit the form
    if (firstName && lastName && userName && email && phNumber && citizenshipNumber && password) {
        $(this).submit();
    }
};

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
document.getElementById("signupForm").addEventListener("submit", function (event) {
    validateAddStaff()
})

function validateEdit() {
    // -------------------------------------------------------- Validation
    document.getElementById("editPhNumber").addEventListener("input", function (event) {
        // Remove non-numeric characters
        this.value = this.value.replace(/\D/g, "");
        // Clear error message
        document.getElementById("editPhNumberError").innerText = "";
    });

    // Prevent the form from submitting
    event.preventDefault();

    // Clear previous errors
    clearErrors();
    // Get the values of the form fields
    var firstName = document.getElementById("editFirstName").value;
    var middleName = document.getElementById("editMiddleName").value;
    var lastName = document.getElementById("editLastName").value;
    var userName = document.getElementById("editUserName").value;
    var email = document.getElementById("editEmail").value;
    var phNumber = document.getElementById("editPhNumber").value;
    var citizenshipNumber = document.getElementById("editCitizenshipNumber").value;

    // Validate first name, middle name, last name, username, email, phone number, date of birth, citizenship number, password, and confirm password
    validateField(firstName, "editFirstNameError", "First Name is required.", "First Name should start with a capital letter.", "isCapitalized");
    validateField(middleName, "editMiddleNameError", "", "Middle Name should start with a capital letter.", "isCapitalized");
    validateField(lastName, "editLastNameError", "Last Name is required.", "Last Name should start with a capital letter.", "isCapitalized");
    validateField(userName, "editUserNameError", "Username is required.", "Username should contain only small letters and at least one number.", "isValidUsername");
    validateField(email, "editEmailError", "Email is required.", "Please enter a valid email address.", "isValidEmail");
    validateField(phNumber, "editPhNumberError", "Phone Number is required.", "Phone Number should start with 98 or 97 followed by 8 digits.", "isValidPhoneNumber");
    validateField(citizenshipNumber, "editCitizenshipNumberError", "Citizenship Number is required.", "Citizenship Number should follow the pattern XX-XX-XX-XXXXX.", "isValidCitizenshipNumber");


    return firstName && lastName && userName && email && phNumber && citizenshipNumber;
};

// Function to validate username to contain only small letters and at least one number
function isValidUsername(str) {
    return /^[a-z]+[0-9]*[a-z]*$/.test(str) && /\d/.test(str);
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
        } else if (validationFunctionName === "isValidEmail" && !isValidEmail(value)) {
            document.getElementById(errorElementId).innerText = formatError;
        } else if (validationFunctionName === "isValidPhoneNumber" && !isValidPhoneNumber(value)) {
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

// Function to validate email address format
function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to check if a string starts with a capital letter
function isCapitalized(str) {
    return /^[A-Z]/.test(str);
}

// Function to validate phone number format
function isValidPhoneNumber(phoneNumber) {
    var phoneRegex = /^(98|97)\d{8}$/;
    return phoneRegex.test(phoneNumber);
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

// Keep hyphens in the relevant places while typing numbers
document.getElementById("editCitizenshipNumber").addEventListener("input", function (event) {
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

document.getElementById("editSignupForm").addEventListener("submit", function (event) {
    event.preventDefault();
    if (validateEdit()) {
        editStaffData(editstaffId);
    }
});