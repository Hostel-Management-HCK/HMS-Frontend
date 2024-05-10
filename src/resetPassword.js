let token = localStorage.getItem("token");
const editRoomData = () => {


    let email = ($('#currentEmail').val());
    let newPassword = ($('#editRoomPrice').val());
    let confirmPassword = ($('#editOccupancyStatus').val());

    makeRequest("PUT", "http://localhost:3000/api/rooms/" + roomId, token, {
        email: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword

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
