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
                $("#maintenanceTableBody").empty();

                // Iterate through maintenance details and populate the table
                maintenanceDetails.forEach(maintenance => {
                    const row = `
                   <tr>
                       <td>${maintenance.maintenanceId}</td>
                       <td>${maintenance.staffId}</td>
                       <td>${maintenance.staffName}</td>
                       <td>${maintenance.task}</td>
                       <td>${maintenance.jobStatus}</td>
                        <td><button class = "edit-btn edit-taskdetails" data-maintenance-id="${maintenance.maintenanceId}">Edit</button></td>
                       <td><button class="maintaintenace-dl delete-btn" data-maintenance-id="${maintenance.maintenanceId}">Delete</button></td>
                   </tr>
               `;
                    $("#maintenanceTableBody").append(row);
                });
                $('table#maintenance').DataTable();


            } else {
                console.error('Failed to fetch maintenance data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching maintenance data:', error);
        });

    // Function to fetch Dropdown 
    async function fetchStaffData() {
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

    // Function to submit a task
    async function submitTask(staffId, task) {
        try {
            const response = await makeRequest("POST", "http://localhost:3000/api/maintenance", token, { staffId, task });
            if (response.ok) {
                console.log("Task submitted successfully.");
            } else {
                throw new Error('Failed to submit task:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting task:', error);
        }
    }

    // Function to populate the dropdown with staff names
    async function populateStaffDropdown() {

        const staffData = await fetchStaffData();
        let staffs = staffData.staffs;
        if (Array.isArray(staffs)) {
            const $staffDropdown = $("#staffDropDown");
            const $staffEditDropdown = $("#editstaffDropDown");
            
            // Clear existing options
            $staffDropdown.empty();
            $staffEditDropdown.empty();
            
            // Iterate through staff data and add options to the dropdown
            staffs.forEach(staff => {
                $staffDropdown.append(`<option value="${staff.staffId}">${staff.firstName + " " + staff.lastName}</option>`);
                $staffEditDropdown.append(`<option value="${staff.staffId}">${staff.firstName + " " + staff.lastName}</option>`);
            });
        } else {
            console.error('Invalid staff data received:', staffData);
        }
    }

    // Call the function to populate the dropdown when the page loads
    populateStaffDropdown();

    // Function to handle form submission
    async function handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission behavior

        const staffId = $("#staffDropDown").val();
        const assignedTask = $("#assignedTask").val();
        // Call the submitTask function to submit the task
        await submitTask(staffId, assignedTask);

        // Clear the form fields after submission
        $("#assignedTask").val("");
    }

    // Attach event listener to the submit button
    $("#taskForm").on("click", handleSubmit);

    const deleteroomallocation = maintenanceId => {
        if (confirm("Are you sure you want to delete this Task?")) {
            makeRequest("DELETE", `http://localhost:3000/api/maintenance/${maintenanceId}`, token)
                .then(response => {
                    if (response.ok) {
                        $(`#maintenanceRow_${maintenanceId}`).remove(); // Remove the table row
                        console.log('Task deleted successfully.');
                        alert("Task Deleted Successfully")
                    } else {
                        console.error('Failed to delete Task:', response.statusText);
                    }
                })
                .catch(error => {
                    console.error('Error deleting Task:', error);
                });
        }
    };
    // Event delegation for delete button
    $(document).on('click', '.maintaintenace-dl', function () {
        const maintenanceId = $(this).data('maintenance-id');
        console.log(maintenanceId)
        deleteroomallocation(maintenanceId);
    });

    $(document).on('click', '.edit-taskdetails', function () {
        const maintenanceId = $(this).data('maintenance-id');
        editTask(maintenanceId);
        console.log("sldjflksajdf")
    })
    $(document).on('click', '#editTaskbtn', function () {
        const staffId = parseInt($("#editstaffDropDown").val())
        const task = $("#editassignedTask").val()
        makeRequest("PUT", 'http://localhost:3000/api/maintenance/' + editId, token, {staffId,task})
        .then (response=>{
            if(response.ok){
                alert("Updated Successfully")
                window.location.reload()
            }
            else{
                alert("Update Failed");
            }
        })
    })

    const editTask = maintenanceId => {
        makeRequest("GET", 'http://localhost:3000/api/maintenance/' + maintenanceId, token)
        .then(async response => {
            if (response.ok){
                editId = maintenanceId
                const data = await response.json() 
                console.log(data.maintenance.staffName)
                console.log(data)
                $(`#editstaffDropDown option[value='${data.maintenance.staffId}']`).attr('selected', true);
                $("#editassignedTask").val(data.maintenance.task)
                
            }
        })
        document.querySelector(".edit-taskdetails-popup").classList.add("active")
    }
});

