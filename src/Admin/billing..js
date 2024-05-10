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

    makeRequest("GET", "http://localhost:3000/api/billing/rent", token)
        .then(async (response) => {
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                const rent = responseData.rentPayments;

                // Clear existing table rows
                $("#rentTableBody").empty();

                // Iterate through rent and populate the table
                rent.forEach(rentItem => {
                    const row = `
                    <tr id="rent_row${rentItem.residentName}">
                    <td>${rentItem.residentName}</td>
                    <td>${rentItem.amount}</td>
                    <td>${rentItem.dueDate}</td>
                    <td>${rentItem.lastPaid}</td>  
                    <td>
                        <select class="status-dropdown"  id="status_dropdown${rentItem.residentName}">
                            <option value="pending" ${rentItem.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="paid" ${rentItem.status === 'paid' ? 'selected' : ''}>Paid</option>
                            <!-- Add more options as needed -->
                        </select>
                    </td>
                </tr>
                
                    `;
                    $("#rentTableBody").append(row);
                });
                $(document).ready(function () {
                    $('table#rentTable').DataTable();
                });

                // Initialize DataTables plugin
                $('#rentTableBody').DataTable();
            } else {
                console.error('Failed to fetch Resident data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching Resident data:', error);
        });
});
  // Function to fetch Dropdown 
  async function fetchBilling() {
    try {
        const response = await makeRequest("GET", "http://localhost:3000/api/staffs", token);
        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            throw new Error('Failed to fetch staff data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching staff data:', error);
        return [];
    }
}

