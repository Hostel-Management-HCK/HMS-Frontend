

let profileToken = localStorage.getItem("token")
let userData = decodeJWT(profileToken)
document.getElementById("roleProfie").innerText =userData.payload.role

document.getElementById("usernameProfile").innerText = userData.payload.username

document.getElementById("usernameProfile").style.fontWeight = 700

console.log(userData)