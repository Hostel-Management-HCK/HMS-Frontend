const token = localStorage.getItem("token");
const data = decodeJWT(token)
const staffId = data.payload.staffId

console.log(token)
console.log("sadfadsfasdfdsgfdsfg")
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

            let maintenanceId =parseInt(this.id.split("#")[1])
            console.log(maintenanceId)

            if(window.confirm("Do you want to complete the job")){


                makeRequest("PUT", "http://localhost:3000/api/maintenance" , token,{maintenanceId})
                .then(response =>{
                    if(response.ok){
                        alert("Status has been changed")
                        window.location.reload()
                    }
                })
            }
        })

});

