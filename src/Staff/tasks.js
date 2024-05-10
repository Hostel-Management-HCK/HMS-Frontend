const token = localStorage.getItem("token");
$(document).ready(function () {
    let editId = 0
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
    // Make API request to fetch maintenance data
    makeRequest("GET", "http://localhost:3000/api/maintenance", token)
        .then(async (response) => {
            if (response.ok) {
                const responseData = await response.json();
                const maintenanceDetails = responseData.maintenanceDetails;

                // Clear existing table rows
                $("#tasksTableBody").empty();

                // Iterate through maintenance details and populate the table
                maintenanceDetails.forEach(maintenance => {
                    const row = `
                   <tr>
                       <td>${maintenance.maintenanceId}</td>
                       <td>${maintenance.staffId}</td>
                       <td>${maintenance.staffName}</td>
                       <td>${maintenance.task}</td>
                       <td>${maintenance.jobStatus}</td>
                   </tr>
               `;
                    $("#tasksTableBody").append(row);
                });
                $('table#tasksTableBody').DataTable();


            } else {
                console.error('Failed to fetch maintenance data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching maintenance data:', error);
        });

});