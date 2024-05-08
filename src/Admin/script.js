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

});
