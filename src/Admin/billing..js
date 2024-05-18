const token = localStorage.getItem("token");
const statusArr = ["Pending","Up-to-date"]

$(document).ready(function () {

    // Function to make API request
    const makeRequest = (method, url, token, body) => {

        console.log(body)
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

                    let upToDate = false
                    if(rentItem.status === "Up-to-date"){
    
                        upToDate = true
                        console.log(rentItem.status)
                    }
                    const row = `
                    <tr id="rent_row${rentItem.username}">
                    <td>${rentItem.username}</td>
                    <td>${rentItem.nextPayDate}</td>
                    <td>${rentItem.residentName}</td>
                    <td>${rentItem.amount === null ? "No Amount" : rentItem.amount}</td>  
                    <td>
                        <select class="status-dropdown" ${upToDate ? "disabled": ""} id="status_dropdown#${rentItem.username}">
                            <option value="Pending" ${rentItem.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Up-to-date" ${rentItem.status === 'Up-to-date' ? 'selected' : ''}>Up to Date</option>
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


            } else {
                console.error('Failed to fetch Resident data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching Resident data:', error);
        });      
});

$(document).on('change', '.status-dropdown', function (e) {
    const val = e.target.value;

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
            const userName = this.id.split("#")[1];
            changeStatusResident(userName, val);
            $(`#${this.id}`).prop('disabled', true);
        } else {
            if (val === statusArr[0]) {
                e.target.value = statusArr[1];
            } else {
                e.target.value = statusArr[0];
            }
        }
    });
});


function changeStatusResident(username,newStatus){
    makeRequest("POST", `http://localhost:3000/api/billing/rent`, token, {}, { username: username, newStatus: newStatus })
    .then(async response => {

        if (response.message === "Payment status updated successfully") {
                Swal.fire(
                    'Success!',
                    'Status change successfully.',
                    'success'
                ).then(() => {
                    window.location.reload();
                });
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