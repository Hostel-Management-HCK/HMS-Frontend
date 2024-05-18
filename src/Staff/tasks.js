const token = localStorage.getItem("token");
const data = decodeJWT(token)
const staffId = data.payload.staffId

console.log(token)
console.log("sadfadsfasdfdsgfdsfg")


const statusArr = ["Pending", "Done"]
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
    makeRequest("GET", "http://localhost:3000/api/maintenance?staffId=" + staffId, token)
        .then(async (response) => {
            console.log(response)
            if (response.ok) {
                const responseData = await response.json();
                const maintenanceDetails = responseData.maintenanceDetails;
                console.log(maintenanceDetails)
                // Clear existing table rows
                $("#tasksTableBody").empty();

                // Iterate through maintenance details and populate the table
                maintenanceDetails.forEach(maintenance => {

                    console.log(maintenance.jobStatus)
                    const row = `
                   <tr>
                       <td>${maintenance.maintenanceId}</td>
                       <td>${maintenance.task}</td>
                       <td>
                       <select class="status-dropdown" ${maintenance.jobStatus === 'Done' ? 'disabled' : ''} data-maintenanceid="${maintenance.maintenanceid}" id="status_dropdown#${maintenance.maintenanceId}">
                           <option value="Pending" ${maintenance.jobStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                           <option value="Done" ${maintenance.jobStatus === 'Done' ? 'selected' : ''}>Done</option>
                           <!-- Add more options as needed -->
                       </select>
                   </td>
                   </tr>
               `;
                    $("#tasksTableBody").append(row);
                });
                $('table#tasksTableBody').DataTable();


            } else {
                $("#tasksTableBody").empty();
                let h2 = $("<h2>")
                h2.text("No tasks found")
                $("#tasksTableBody").append(h2)
            }
        })
        .catch(error => {
            console.log(error)
        });


    $(document).on('change', '.status-dropdown', function (e) {
        let maintenanceId = parseInt(this.id.split("#")[1]);

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
                makeRequest("PUT", "http://localhost:3000/api/maintenance", token, { maintenanceId })
                .then(response => {
                    if (response.ok) {
                        Swal.fire(
                            'Success!',
                            'Status has been changed.',
                            'success'
                        ).then(() => {
                            window.location.reload(); // Auto-reload the page
                        });
                    } else {
                        Swal.fire(
                            'Failed!',
                            'Failed to change status.',
                            'error'
                        );
                    }
                })
                .catch(error => {
                    console.error('Error changing status:', error);
                    Swal.fire(
                        'Error!',
                        'Error changing status.',
                        'error'
                    );
                });
            } else {
                if (val === statusArr[0]) {
                    e.target.value = statusArr[1];
                } else {
                    e.target.value = statusArr[0];
                }
            }
        });

    });
});

