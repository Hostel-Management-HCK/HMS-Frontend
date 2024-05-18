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
                    
                    console.log(salaryItem.status)
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
                        <td>${salaryItem.nextPayDate}</td> 
                        <td>
                            <select class="status-dropdown" ${upToDate ? "disabled":""} id="status_dropdown${salaryItem.staffId}">
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

    if (val === statusArr[0]) {
        Swal.fire(
            'Error!',
            'Cannot change the status after billing.',
            'error'
        );
        return;
    }

    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to change the status?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!'
    }).then((result) => {
        if (result.isConfirmed) {
            changeStatusSalary(staffId, val);
        } else {
            // Reset the dropdown value if user cancels
            const salaryStatus = $(`#status_dropdown${staffId}`).data('originalStatus');
            $(`#status_dropdown${staffId}`).val(salaryStatus);
        }
    });
});

function changeStatusSalary(staffId, newStatus) {
    makeRequest("POST", `http://localhost:3000/api/billing/salary`, token, {}, { staffId, newStatus })
        .then(async response => {
            if (response.message === "Payment status updated successfully") {
                    Swal.fire(
                        'Success!',
                        'Status changed successfully.',
                        'success'
                    ).then(() => {
                        window.location.reload();
                    })
                }
        })
        .catch(error => {
            Swal.fire(
                'Error!',
                `Error changing status: ${error}`,
                'error'
            );
        });
}

