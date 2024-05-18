// Get token from localStorage
const token = localStorage.getItem("token");

const data = decodeJWT(token)
console.log(data)

const username = data.payload.username

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

// Function to get resident details by ID
const getResidentDetail = (username) => {
    makeRequest("GET", `http://localhost:3000/api/residentInfo/${username}`, token)
        .then(async (response) => {
            console.log(response)
            if (response.ok) {
                const residentData = await response.json();
                const resident = residentData.residentInfo
                if (resident) {
                    console.log(resident)
                    // Populate form fields with resident data
                    $('#firstName').val(resident.firstName);
                    $('#middleName').val(resident.middleName);
                    $('#lastName').val(resident.lastName);
                    $('#userName').val(resident.username);
                    $('#email').val(resident.email);
                    $('#phNumber').val(resident.phone);
                    let dob = new Date(resident.dateOfBirth).toISOString().split('T')[0]
                    $('#DOB').val(dob);
                    $('#citizenshipNumber').val(resident.citizenshipNo);
                } else {
                    console.error('Failed to fetch resident data:', response.statusText);
                }
            } else {
                console.error('Failed to fetch resident data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching resident data:', error);
        });
}
getResidentDetail(username)

// Function to handle editing resident data
const editResidentData = (username) => {
    let firstName = $('#firstName').val();
    let middleName = $('#middleName').val();
    let lastName = $('#lastName').val();
    let email = $('#email').val();
    let newUsername = $('#userName').val();
    let phNumber = parseInt($('#phNumber').val());
    let DOB = $('#DOB').val();
    let citizenshipNumber = $('#CitizenshipNumber').val();

    const body = {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        newUsername: newUsername,
        email: email,
        phone: phNumber,
        dateOfBirth: DOB,
        citizenshipNo: citizenshipNumber,
    }

    makeRequest("PUT", `http://localhost:3000/api/residentInfo/${username}`, token, body)
    .then(async (response) => {
        let data = await response.json();
        if (response.ok) {
            Swal.fire(
                'Success!',
                'The resident data has been updated successfully.',
                'success'
            ).then(() => {
                if(data.newToken){
                    localStorage.setItem("token", data.newToken);
                }
                window.location.reload(); // Auto-reload the page
            });
        } else {
            console.error('Failed to update resident data:', response.statusText);
            Swal.fire(
                'Failed!',
                `Failed to update resident data: ${response.statusText}`,
                'error'
            ).then(() => {
                window.location.reload(); // Auto-reload the page
            });
        }
    })
    .catch(error => {
        console.error('Error updating resident data:', error);
        Swal.fire(
            'Error!',
            `Error updating resident data: ${error}`,
            'error'
        ).then(() => {
            window.location.reload(); // Auto-reload the page
        });
    });
}
$("#editResidentBtn").on("click", ()=>{
    editResidentData(username)
});











