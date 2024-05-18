// Get token from localStorage
const token = localStorage.getItem("token");

const data = decodeJWT(token)
console.log(data)

const staffId = data.payload.staffId

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
const getStaffDetail = (staffId) => {
    makeRequest("GET", `http://localhost:3000/api/staffs/${staffId}`, token)
        .then(async (response) => {
            console.log(response)
            if (response.ok) {
            
                const staffData = await response.json();
                const staffs = staffData.staff
                if (staffs) {
                    console.log(staffs)
                    // Populate form fields with staff data
                    $('#firstName').val(staffs.firstName);
                    $('#middleName').val(staffs.middleName);
                    $('#lastName').val(staffs.lastName);
                    $('#userName').val(staffs.username);
                    $('#email').val(staffs.email);
                    $('#phNumber').val(staffs.phone);
                    $('#citizenshipNumber').val(staffs.citizenshipNo);
               
                } else {
                    console.error('Failed to fetch staff data:', response.statusText);
                }
            } else {
                console.error('Failed to fetch staff data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching staff data:', error);
        });
}
getStaffDetail(staffId)

// Function to handle editing staffs data
const editResidentData = (staffs) => {
    let firstName = $('#firstName').val();
    let middleName = $('#middleName').val();
    middleName= middleName === ""?null:middleName
    let lastName = $('#lastName').val();
    let email = $('#email').val();
    let newUsername = $('#userName').val();
    let phNumber = parseInt($('#phNumber').val());
    let citizenshipNumber = $('#CitizenshipNumber').val();

    const body = {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        newUsername: newUsername,
        email: email,
        phone: phNumber,
        citizenshipNo: citizenshipNumber,
    }

    makeRequest("PUT", `http://localhost:3000/api/staffs/${staffId}`, token, body)
    .then(async (response) => {

        let data = await response.json();
        if (response.ok) {
            console.log(response);
            Swal.fire(
                'Success!',
                'The resident data has been updated successfully.',
                'success'
            ).then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire(
                'Failed!',
                `Failed to update resident data: ${data.errors.undefined}`,
                'error'
            ).then(() => {
                window.location.reload();
            });
        }
    })
    .catch(error => {
        Swal.fire(
            'Error!',
            `Error updating resident data: ${error}`,
            'error'
        ).then(() => {
            window.location.reload();
        });
    });
}
$("#editstaffs-btn").on("click", ()=>{
    editResidentData(staffId)
});










