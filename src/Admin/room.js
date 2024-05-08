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
});
