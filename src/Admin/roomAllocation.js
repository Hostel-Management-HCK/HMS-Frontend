let editusername = "";
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


const token = localStorage.getItem("token");
$(document).ready(function () {

    // Function to make API request
    makeRequest("GET", "http://localhost:3000/api/allocated-rooms", token)
        .then(async (response) => {
            if (response.ok) {
                const responseData = await response.json();
                const allocations = responseData.allocations; // Assuming the response contains an 'allocations' array

                // Clear existing table rows
                $("#roomAllocationTableBody").empty();

                // Populate the table
                allocations.forEach(allocation => {
                    const row = `
                    <tr id="allocate_row_${allocation.username}">
                        <td>${allocation.username}</td>
                        <td>${allocation.roomId}</td>
                        <td><button class = "edit-btn edit-allocationdetails" data-username="${allocation.username}">Edit</button></td>
                        <td><button class="delete-allocation delete-btn" data-username="${allocation.username}">Delete</button></td>
                    </tr>
                `;
                    $("#roomAllocationTableBody").append(row);
                });

                // Initialize DataTable
                $('table#roomAllocation').DataTable();
            } else {
                console.error('Failed to fetch allocation data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching allocation data:', error);
        });
});
// Define deleteRoom function
const deleteAllocation = username => {
    if (confirm("Are you sure you want to remove the selected Resident?")) {
        makeRequest("DELETE", `http://localhost:3000/api/allocate-room/${username}`, token)
            .then(response => {
                console.log(response)
                if (response.ok) {
                    $(`#allocate_row_${username}`).remove(); // Remove the table row
                    alert('Allocation deleted successfully.');
                    window.location.reload()
                } else {
                    alert('Failed to Remove Allocation:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error Removing Allocation:', error);
            });
    }
};
// Event delegation for delete button
$(document).on('click', '.delete-allocation', function () {
    const username = $(this).data('username');

    deleteAllocation(username);
});
// -----------------------


// Function to fetch Dropdown 
async function fetchRoomData() {
    try {
        let token = localStorage.getItem("token");
        const response = await makeRequest("GET", "http://localhost:3000/api/rooms", token)
        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            throw new Error('Failed to fetch rooms data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching rooms data:', error);
        return [];
    }
}
async function fetchUserData() {
    try {
        let token = localStorage.getItem("token");
        const response = await makeRequest("GET", "http://localhost:3000/api/residentInfo", token)
        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            throw new Error('Failed to fetch resident data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching resident data:', error);
        return [];
    }
}

// Function to populate the dropdown with staff names
async function populateAllocationDropDown() {

    const residentData = await fetchUserData();
    const roomData = await fetchRoomData();
    console.log(residentData)
    console.log(roomData)

    let unAllocatedResidents = residentData.residentInfo.filter(resident => resident.roomId === "Not allocated")
    console.log(unAllocatedResidents)

    if (unAllocatedResidents.length > 0) {
        const $usernameDropDown = $("#usernameDropDown");

        // Clear existing options
        $usernameDropDown.empty();

        // Iterate through Room data and add options to the dropdown
        unAllocatedResidents.forEach(resident => {
            $usernameDropDown.append(`<option value="${resident.username}">${resident.username}</option>`);
        });
    } else {
        console.error('Invalid resident data received:', residentData);
    }
    if (roomData.rooms) {
        const $roomIdDropDown = $("#roomIdDropDown");
        const $editAllocationDropDown = $("#editAllocationDropDown");

        // Clear existing options
        $roomIdDropDown.empty();
        $editAllocationDropDown.empty();

        // Iterate through Room data and add options to the dropdown
        roomData.rooms.forEach(room => {
            $roomIdDropDown.append(`<option value="${room.roomId}">${room.roomId}</option>`);
            $editAllocationDropDown.append(`<option value="${room.roomId}">${room.roomId}</option>`);
        });
    } else {
        console.error('Invalid room data received:', roomData.rooms);
    }
}

// Call the function to populate the dropdown when the page loads
populateAllocationDropDown();

// Function to submit a task
async function allocateRoom(roomId, username) {
    console.log(roomId)
    try {
        const response = await makeRequest("POST", "http://localhost:3000/api/allocate-room/", token, { username, roomId });
        if (response.ok) {
            alert("Room allocated successfully.");
            window.location.reload()
        } else {
            throw new Error('Failed to allocate room:', response.statusText);
        }
    } catch (error) {
        console.error('Error allocate room:', error);
    }
}

$(document).on('click', '#allocateButton', async function () {
    const roomId = parseInt($("#roomIdDropDown").find(":selected").text());
    const username = $("#usernameDropDown").find(":selected").text();
    await allocateRoom(roomId, username);
})
// Define editRoom function if not already defined
function editRoom(username) {
    // Implement your logic here
    console.log("Editing room for user:", username);
}
// To open the popup menu
$(document).on('click', '.edit-allocationdetails', function () {
    const username = $(this).data('username');
    editTask(username);
})

const editTask = async username => {
    const response = await makeRequest("GET", "http://localhost:3000/api/allocated-rooms?username=" + username, token)
    if(response.ok){
        const data = await response.json()
        $(`#editAllocationDropDown option[value=${data.allocation.roomId}]`).attr("selected", true)
        editusername = username
    }
    document.querySelector(".edit-allocationdetails-popup").classList.add("active")
}

$(document).on('click','#editRoomAllocationbtn',function(){
    const roomId = parseInt($("#editAllocationDropDown").val())
    makeRequest("PUT","http://localhost:3000/api/allocate-room/"+ editusername, token, {roomId})
    .then(response=>{
        if(response.ok){
            alert("Room is successfully allocated")
            window.location.reload()
        }
        else{
            alert("Room allocation failed")
        }
    })
})
