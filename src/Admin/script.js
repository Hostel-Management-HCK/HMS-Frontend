const sideMenu = document.querySelector('aside');
const menuBtn = document.querySelector('#menu_bar');
const closeBtn = document.querySelector('#close_btn');

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = "block";
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = "none";
});
$(document).ready(function () {

    // Make the API request to fetch data
    makeRequest("GET", "http://localhost:3000/api/dashboard", "", {})
        .then(data => {
            // Extract total residents, staffs, and rooms from the response data
            let totalResidents = data.totalResidents;
            let totalStaffs = data.totalStaffs;
            let totalRooms = data.totalRooms;

            // Update the HTML elements with the fetched data
            $("#totalResident").text(totalResidents);
            $("#totalStaffs").text(totalStaffs);
            $("#totalRooms").text(totalRooms);
        })
        .catch(err => {
            console.log(err)
        });
});
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

    // Make API request to fetch room data
    makeRequest("GET", "http://localhost:3000/api/rooms", token)
        .then(async (response) => {
            if (response.ok) {
                const responseData = await response.json();
                const rooms = responseData.rooms;

                // Clear existing table rows
                $("#roomTableBody").empty();

                // Iterate through room data and populate the table
                rooms.forEach(room => {
                    const row = `
                        <tr id="roomRow_${room.roomId}">
                            <td>${room.roomId}</td>
                            <td>${room.price}</td>
                            <td>${room.occupancy}</td>
                            <td><button class="edit-btn" onclick="editRoom(${room.roomId})">Edit</button></td>
                            <td><button class="delete-btn" data-room-id="${room.roomId}">Delete</button></td>
                        </tr>
                    `;
                    $("#roomTableBody").append(row);
                });
                $('table#RoomTable').DataTable();
            } else {
                console.error('Failed to fetch room data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching room data:', error);
        });

    // Make API request to fetch feedback data
    makeRequest("GET", "http://localhost:3000/api/feedback", token)
        .then(async (response) => {
            if (response.ok) {
                const responseData = await response.json();
                const feedbacks = responseData.feedbacks;

                // Clear existing table rows
                $("#feedbackTableBody").empty();

                // Iterate through feedbacks and populate the table
                feedbacks.forEach(feedback => {
                    const row = `
                        <tr>
                            <td>${feedback.residentUsername}</td>
                            <td>${feedback.message}</td>
                        </tr>
                    `;
                    $("#feedbackTableBody").append(row);
                });
            } else {
                console.error('Failed to fetch feedback:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching feedback:', error);
        });





    // --------------------------------------------------------------------maintenance





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
            const staffData = responseData.maintenanceDetails; // Extract staff data from maintenanceDetails
            return staffData;
        } else {
            throw new Error('Failed to fetch staff data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching staff data:', error);
        return [];
    }
}

// Function to submit a task
async function submitTask(staffId, assignedTask) {
    try {
        const response = await makeRequest("POST", "http://localhost:3000/api/maintenance", token, { staffId, assignedTask });
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

    if (Array.isArray(staffData)) {
        const $staffDropdown = $("#staffDropDown");

        // Clear existing options
        $staffDropdown.empty();

        // Iterate through staff data and add options to the dropdown
        staffData.staffs.forEach(staff => {
            $staffDropdown.append(`<option value="${staff.staffId}">${staff.userName}</option>`);
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

    const staffId = $("#staffDropDown").val(); // Get selected staff ID
    const staffName = $("#staffDropDown option:selected").text(); // Get selected staff name
    const assignedTask = $("#assignedTask").val(); // Get assigned task

    // Here you can perform any additional validation if needed

    // Call the submitTask function to submit the task
    await submitTask(staffId, assignedTask);

    // Clear the form fields after submission
    $("#assignedTask").val("");
}

// Attach event listener to the submit button
$(".popup button").on("click", handleSubmit);






    //    ------------------------------------------------------------------------ Rooms










    // Make API request to fetch room data
    function editRoom(roomId) {
        document.querySelector(".popup.edit-details").classList.add("active");
        getRoomDetail(roomId);
    }
    // Event delegation for delete button
    $(document).on('click', '.room-edit', function () {
        const roomId = $(this).data('room-id');
        editRoom(roomId);
    });

    $(document).on('click', '#saveRoomEdit', function () {
        editRoomData();
    });


    const editRoomData = () => {


        let roomId = parseInt($('#editRoomID').val());

        let token = localStorage.getItem("token");
        let price = parseInt($('#editRoomPrice').val());
        let occupancy = parseInt($('#editOccupancyStatus').val());

        makeRequest("PUT", "http://localhost:3000/api/rooms/" + roomId, token, {
            price: price,
            occupancy: occupancy
        })
            .then(async (response) => {
                if (response.ok) {
                    alert("The room data has been updated successfully")
                    window.location.reload();
                    // Close the popup after creating the room
                    $('.popup.edit-details').hide();
                } else {
                    console.error('Failed to update room data:', response.statusText);
                }
            })
    }

    const getRoomDetail = (roomId) => {

        makeRequest("GET", `http://localhost:3000/api/rooms?roomId=${roomId}`, token)
            .then(async (response) => {
                if (response.ok) {
                    const responseData = await response.json();
                    const room = responseData.room;


                    $('#editRoomID').val(room.roomId);
                    $('#editRoomPrice').val(room.price);
                    $('#editOccupancyStatus').val(room.occupancy);
                } else {
                    console.error('Failed to fetch room data:', response.statusText);
                }
            })
    }
    makeRequest("GET", "http://localhost:3000/api/rooms", token)
        .then(async (response) => {
            if (response.ok) {
                const responseData = await response.json();
                const rooms = responseData.rooms;

                // Clear existing table rows
                $("#roomTableBody").empty();
                // Iterate through room data and populate the table
                rooms.forEach(room => {
                    const row = `
                <tr id="rentRow_${room.roomId}">
                    <td>${room.roomId}</td>
                    <td>${room.price}</td>
                    <td>${room.occupancy}</td>
                    <td><button id="edit-${room.roomId}" data-room-id="${room.roomId}" class="edit-btn room-edit">Edit</button></td>
                    <td><button class="delete-btn" data-room-id="${room.roomId}">Delete</button></td>
                </tr>
            `;
                    $("#roomTableBody").append(row);
                });
                $('table#roomTableBody').DataTable(); // Apply DataTable to the table
            } else {
                console.error('Failed to fetch room data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching room data:', error);
        });
    // Define deleteRoom function
    const deleteRoom = roomId => {
        if (confirm("Are you sure you want to delete this room?")) {
            makeRequest("DELETE", `http://localhost:3000/api/room/${roomId}`, token)
                .then(response => {
                    if (response.ok) {
                        $(`#roomRow_${roomId}`).remove(); // Remove the table row
                        console.log('Room deleted successfully.');
                    } else {
                        console.error('Failed to delete room:', response.statusText);
                    }
                })
                .catch(error => {
                    console.error('Error deleting room:', error);
                });
        }
    };
    // Event delegation for delete button
    $(document).on('click', '.delete-btn', function () {
        const roomId = $(this).data('room-id');
        deleteRoom(roomId);
    });
    // Function to create a new room
    const createRoom = () => {
        const roomPrice = parseInt($('#roomPrice').val());
        const roomOccupancy = parseInt($('#roomOccupancy').val());

        const roomData = {
            price: roomPrice,
            occupancy: roomOccupancy
        };

        makeRequest("POST", "http://localhost:3000/api/rooms", token, roomData)
            .then(async (response) => {
                let data = await response.json()
                if (response.ok) {
                    console.log('Room created successfully.');
                    alert("The room data has been created successfully")
                    fetchRoomData();
                    // Close the popup after creating the room
                    $('.popup.compose').hide();
                } else {
                    console.error('Failed to create room:', response.statusText);
                    alert("Error creation of the room" + data.message);
                }
            })
            .catch(error => {
                console.error('Error creating room:', error);
            });
    };

    // Event listener for the "Send" button in the form
    $('#sendButton').on('click', function () {
        createRoom();
    });


    // -------------------------------------------------------------------------- Staffs



    makeRequest("GET", "http://localhost:3000/api/staffs", token)
        .then(async (response) => {
            if (response.ok) {
                const responseData = await response.json();
                const staffs = responseData.staffs;

                // Clear existing table rows
                $("#staffTableBody").empty();

                // Iterate through staffs and populate the table
                staffs.forEach(staff => {
                    const row = `
                <tr id = "staff_row${staff.staffId}">
                    <td>${staff.staffId}</td>
                    <td>${staff.firstName}</td>
                    <td>${staff.lastName}</td>
                    <td>${staff.email}</td>
                    <td>${staff.phone}</td>
                    <td><button onclick="editRoom(${staff.staffId})">Edit</button></td>
                    <td><button class="delete-btn" data-staff-id="${staff.staffId}">Delete</button></td>
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
    // Define deleteStaff function
    const deleteStaff = staffId => {
        if (confirm("Are you sure you want to delete the staff?")) {
            makeRequest("DELETE", `http://localhost:3000/api/staffs/${staffId}`, token)
                .then(response => {
                    if (response.ok) {
                        $(`#staff_row${staffId}`).remove(); // Remove the table row
                        alert("Staff ")
                    } else {
                        console.error('Failed to delete room:', response.statusText);
                    }
                })
                .catch(error => {
                    console.error('Error deleting room:', error);
                });
        }
    };
    $(document).on('click', '.delete-btn', function () {
        const staffId = $(this).data('staff-id');
        deleteStaff(staffId);
    });

    // To create a staff
    const createStaff = () => {
        const firstName = $("#firstName").val();
        const middleName = $("#middleName").val();
        const lastName = $("#lastName").val();
        const userName = $("#userName").val();
        const email = $("#email").val();
        const phNumber = $("#phNumber").val();
        const DOB = $("#DOB").val();
        const citizenshipNumber = $("#citizenshipNumber").val();
        const currentPassword = $("#currentPassword").val();
        const confirmPassword = $("#confirmPassword").val();
    
        const staffData = {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            userName: userName,
            email: email,
            phNumber: phNumber,
            DOB: DOB,
            citizenshipNumber: citizenshipNumber,
            currentPassword: currentPassword,
            confirmPassword: confirmPassword
        };
    
        makeRequest("POST", "http://localhost:3000/api/staffs", token, staffData)
            .then(async (response) => {
                let data = await response.json();
                if (response.ok) {
                    console.log('Staff created successfully.');
                    alert("The staff data has been created successfully");
                    fetchStaffData();
                    // Close the popup after creating the staff
                    $('.popup.compose').hide();
                } else {
                    console.error('Failed to create staff:', response.statusText);
                    alert("Error creating the staff: " + data.message);
                }
            })
            .catch(error => {
                console.error('Error creating staff:', error);
            });
    };
    
    // Event listener for the "Send" button in the staff form
    $('#staffSendButton').on('click', function () {
        createStaff();
    });
    
});
