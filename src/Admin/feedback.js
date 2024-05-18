let feedbackId = 0;
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

                    let reply = feedback.adminResponse === null

                    const row = `
                        <tr>
                            <td>${feedback.residentUsername}</td>
                            <td>${feedback.message}</td>
                            <td>${feedback.adminResponse === null ? "No Response" : feedback.adminResponse}</td>
                            
                            <td><button ${!reply ? "disbaled" : ""} data-reply="${!reply}" class="edit-btn edit-replydetails" data-feedbackId="${feedback.feedbackId}">Reply</button></td>
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

    const reply = response => {


        if(response === "") {
            swal.fire({
                title: "Error",
                text: "Reply cannot be empty",
                icon: "error",
                confirmButtonText: "OK"
            })
            return;
        }
        makeRequest("POST", 'http://localhost:3000/api/feedback/respond?feedbackId=' + feedbackId, token, { response })
            .then(async response => {
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    if (data.success) {
                        swal.fire({
                            title: "Success",
                            text: "Added reply",
                            icon: "success",
                            confirmButtonText: "OK"
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        swal.fire({
                            title: "Error",
                            text: "Reply failed",
                            icon: "error",
                            confirmButtonText: "OK"
                        }).then(() => {
                            window.location.reload();
                        });
                    }
                }
            })
            .catch(err => {
                swal.fire({
                    title: "Error",
                    text: "Reply failed",
                    icon: "error",
                    confirmButtonText: "OK"
                }).then(() => {
                    window.location.reload();
                });
            });

    }
    $(document).on('click', '.edit-replydetails', function () {
        const id = $(this).data("feedbackid");
        console.log(id);
        feedbackId = parseInt(id)
        document.querySelector(".reply-popup").classList.add("active");
    });


    $(document).on("click", "#submitReply", function () {
        const value = $("#message").val()

        reply(value)
    })
});
