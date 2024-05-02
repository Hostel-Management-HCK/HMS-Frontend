const  sideMenu = document.querySelector('aside');
const menuBtn = document.querySelector('#menu_bar');
const closeBtn = document.querySelector('#close_btn');

menuBtn.addEventListener('click',()=>{
       sideMenu.style.display = "block"
})
closeBtn.addEventListener('click',()=>{
    sideMenu.style.display = "none"
})

$(document).ready(function(){


  token = localStorage.getItem("token")

  console.log(token)
  // Make the API request to fetch data
  makeRequest("GET", "http://localhost:3000/api/dashboard", token, {})
    .then( async (resp) => {
      // Extract total residents, staffs, and rooms from the response data
      data = await resp.json()
      console.log(data)
      
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

  
