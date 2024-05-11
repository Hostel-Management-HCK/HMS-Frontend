const token = localStorage.getItem("token")
const decodedData = decodeJWT(token)


function getBillingData(){
    makeRequest("GET","http://localhost:3000/api/billing/rent/"+decodedData.payload.username,token,{})
    .then((response)=>{

        console.log(response)
        if(response.rentPaymentDetails){

            const details = response.rentPaymentDetails;
            const tableBody = $("#billingTableBody")

            const payAmount = $("#payAmount")
            const dueDate =  $("#dueDate")
            payAmount.text(`Amount ${details.amount}`)

            dueDate.text(`Next pay date ${details.nextPayDate}`)



            details.pastBills.forEach(element => {
                const tr = $("<tr>")
                const amount = $("<td>")
                const paidDate = $("<td>")
        
    
                const date = new Date(element.paidDate).toISOString().split('T')[0]
                paidDate.text(date)

                paidDate.appendTo(tr)
                amount.text(element.amount)
                amount.appendTo(tr)

                tr.appendTo(tableBody)
            });
        }
    })
}

getBillingData()