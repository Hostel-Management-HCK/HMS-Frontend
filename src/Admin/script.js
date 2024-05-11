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

        const token = localStorage.getItem("token")
        makeRequest("GET", "http://localhost:3000/api/feedback", token)
        .then(async (response) => {
            if (response.feedbacks) {
                let feedbacks = response.feedbacks
                feedbacks = feedbacks.slice(Math.max(feedbacks.length - 5, 1))
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