const token = localStorage.getItem("token")

document.getElementById("feedbackForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const message = $("#feedbackContent").val()
    makeRequest("POST", "http://localhost:3000/api/feedback", token, {}, { message })
        .then((response) => {
            if (response.success) {
                Swal.fire(
                    'Success!',
                    'Feedback sent successfully.',
                    'success'
                ).then(() => {
                    $("#feedbackContent").val("");
                    fetchFeedbacks();
                    // Optionally, you can add additional actions here
                });
            } else {
                Swal.fire(
                    'Failed!',
                    'Feedback send failed.',
                    'error'
                );
            }
        })
        .catch(error => {
            console.error('Error sending feedback:', error);
            Swal.fire(
                'Error!',
                'Error sending feedback.',
                'error'
            );
        });
})

const fetchFeedbacks = () => {

    makeRequest("GET", "http://localhost:3000/api/feedback", token, {})
        .then((response) => {
            if (response.success) {

                const feedbackTableBody = $("#feedbackTableBody")

                feedbackTableBody.empty()

                const feedbacks = response.feedbacks

                feedbacks.forEach(element => {

                    const adminResponse = element.adminResponse == null ? "No Response" : element.adminResponse
                    const tr = $(`<tr><td>${element.message} </td> <td> ${adminResponse}</td> </tr>`)
                    feedbackTableBody.append(tr)
                });
            }
        })
}

fetchFeedbacks()
