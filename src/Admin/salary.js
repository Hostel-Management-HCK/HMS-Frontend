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

    makeRequest("GET", "http://localhost:3000/api/billing/salary", token)
        .then(async (response) => {
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                const salary = responseData.salaryPayments;

                // Clear existing table rows
                $("#salaryTableBody").empty();

                // Iterate through rent and populate the table
                salary.forEach(salaryItems => {
                    const row = `
                    <tr id="salary_row${salaryItems.staffId}">
                    <td>${salaryItems.staffId}</td>
                    <td>${salaryItems.staffName}</td>
                    <td>${salaryItems.amount}</td>
                    <td>${salaryItems.dueDate}</td> 
                    <td>${salaryItems.lastPaid}</td>
                    <td>
                        <select class="status-dropdown" id="status_dropdown${salaryItems.staffId}">
                            <option value="pending" ${salaryItems.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="paid" ${salaryItems.status === 'paid' ? 'selected' : ''}>Paid</option>
                            <option value="late" ${salaryItems.status === 'late' ? 'selected' : ''}>Late</option>
                            <!-- Add more options as needed -->
                        </select>
                    </td>
                </tr>                
                    `;
                    $("#salaryTableBody").append(row);
                });
                // Initialize DataTables plugin
                $('#salaryTableBody').DataTable();
            } else {
                console.error('Failed to fetch Resident data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching Resident data:', error);
        });
});
