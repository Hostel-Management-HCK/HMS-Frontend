const token = localStorage.getItem("token");
const statusArr = ["Pending", "Up-to-date"];

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

                // Iterate through salary payments and populate the table
                salary.forEach(salaryItem => {

                    let upToDate = false
                    if(salaryItem.status === "Up-to-date"){
    
                        upToDate = true
                    }
                    
                    console.log(salaryItem.status)

                    const row = `
                    <tr id="salary_row${salaryItem.staffId}">
                        <td>${salaryItem.staffId}</td>
                        <td>${salaryItem.staffName}</td>
                        <td>${salaryItem.amount}</td>
                        <td>${salaryItem.dueDate}</td> 
                        <td>${salaryItem.lastPaid}</td>
                        <td>
                            <select class="status-dropdown" disabled=${upToDate} id="status_dropdown${salaryItem.staffId}">
                                <option value="Pending" ${salaryItem.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="Up-to-date" ${salaryItem.status === 'Up-to-date' ? 'selected' : ''}>Up-to-date</option>
                                <!-- Add more options as needed -->
                            </select>
                        </td>
                    </tr>                
                    `;
                    $("#salaryTableBody").append(row);
                });
                $(document).ready(function () {
                    $('table#salaryTable').DataTable();
                });

            } else {
                console.error('Failed to fetch Salary data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching Salary data:', error);
        });
});

$(document).on('change', '.status-dropdown', function (e) {
    const val = e.target.value;
    const staffId = this.id.replace('status_dropdown', '');


    if(val === statusArr[0]){
        alert("Cannot change the status after billing")
        return
    }

    if (window.confirm("Do you want to change the status?")) {
        changeStatusSalary(staffId, val);
    } else {
        // Reset the dropdown value if user cancels
        const salaryStatus = $(`#status_dropdown${staffId}`).data('originalStatus');
        $(`#status_dropdown${staffId}`).val(salaryStatus);
    }
});

function changeStatusSalary(staffId, newStatus) {
    makeRequest("POST", `http://localhost:3000/api/billing/salary`, token, {},{staffId, newStatus })
        .then(async response => {
            if (response.ok) {
                const data = await response.json();
                if (data.salaryPaymentDetails) {
                    alert("Status changed successfully");
                }
            }
        })
        .catch(error => {
            console.error('Error changing status:', error);
        });
}
