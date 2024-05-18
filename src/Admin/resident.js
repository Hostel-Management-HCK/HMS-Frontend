const token = localStorage.getItem("token");
$(document).ready(function () {

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
makeRequest("GET", "http://localhost:3000/api/residentInfo", token)
.then(async (response) => {
    if (response.ok) {
        const responseData = await response.json();
        console.log(responseData)
        const residents = responseData.residentInfo;
        // Clear existing table rows
        $("#residentTableBody").empty();

        // Iterate through staffs and populate the table
        residents.forEach(resident => {
            const row = `
        <tr id = "resident_row${resident.roomId}">
            <td>${resident.roomId}</td>
            <td>${resident.firstName} ${resident.middleName === null ? "":resident.middleName} ${resident.lastName}</td>
            <td>${resident.username}</td>
            <td>${resident.citizenshipNo}</td>  
            <td>${resident.phone}</td>
            <td>${resident.dateOfBirth.split("T")[0]}</td>
            <td><button class=" delete-resident delete-btn" data-resident-id="${resident.username}">Delete</button></td>
        </tr>
    `;
            $("#residentTableBody").append(row);
        });
        $(document).ready(function(){
            $('table#ResidentTable').DataTable();
        });
    } else {
        console.error('Failed to fetch Resident data:', response.statusText);
    }
})
.catch(error => {
    console.error('Error fetching Resident data:', error);
});
});
// Define deleteResident function
const deleteResident = username => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            makeRequest("DELETE", `http://localhost:3000/api/residentInfo/${username}`, token)
                .then(response => {
                    if (response.message === "Resident deleted successfully") {
                        $(`#residentRow_${username}`).remove(); // Remove the table row
                        Swal.fire(
                            'Deleted!',
                            'Resident has been deleted successfully.',
                            'success'
                        ).then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire(
                            'Failed!',
                            `Failed to Remove Resident: ${response.statusText}`,
                            'error'
                        );
                    }
                })
                .catch(error => {
                    Swal.fire(
                        'Error!',
                        `Error Removing Resident: ${error}`,
                        'error'
                    );
                });
        }
    });
};
// Event delegation for delete button
$(document).on('click', '.delete-resident', function () {
    const username = $(this).data('resident-id');
    deleteResident(username);
});