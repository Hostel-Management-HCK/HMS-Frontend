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
makeRequest("GET", "http://localhost:3000/api/resident", token)
.then(async (response) => {
    if (response.ok) {
        const responseData = await response.json();
        const staffs = responseData.staffs;

        // Clear existing table rows
        $("#residentTableBody").empty();

        // Iterate through staffs and populate the table
        staffs.forEach(staff => {
            const row = `
        <tr id = "resident_row${staff.residentId}">
            <td>${resident.residentId}</td>
            <td>${staff.firstName}</td>
            <td>${staff.lastName}</td>
            <td>${staff.email}</td>
            <td>${staff.phone}</td>
            <td><button onclick="editRoom(${staff.residentId})">Edit</button></td>
            <td><button class="delete-btn" data-staff-id="${staff.residentId}">Delete</button></td>
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
});