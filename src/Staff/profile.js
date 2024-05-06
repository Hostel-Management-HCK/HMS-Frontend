$(document).ready(function () {
    const token = localStorage.getItem("token");

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

    // Make API request to fetch staff data
    makeRequest("GET", "http://localhost:3000/api/staff", token)
        .then(async (response) => {
            if (response.ok) {
                const responseData = await response.json();
                const staffList = responseData.staff;

                // Clear existing staff profiles
                $("#staffProfiles").empty();

                // Iterate through staff data and display profiles
                staffList.forEach(staff => {
                    const profile = `
                        <div class="staff-profile">
                            <h3>${staff.firstName} ${staff.lastName}</h3>
                            <p>Email: ${staff.email}</p>
                            <p>Phone Number: ${staff.phoneNumber}</p>
                            <p>Date of Birth: ${staff.dateOfBirth}</p>
                            <p>Citizenship Number: ${staff.citizenshipNumber}</p>
                            <!-- Additional staff profile details can be displayed here -->
                        </div>
                    `;
                    $("#staffProfiles").append(profile);
                });
            } else {
                console.error('Failed to fetch staff data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching staff data:', error);
        });
});
