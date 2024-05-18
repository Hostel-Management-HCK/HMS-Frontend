const token = localStorage.getItem("token")
const decodedData = decodeJWT(token)


function getBillingData(){

    console.log(decodedData.payload.staffId)
    makeRequest("GET","http://localhost:3000/api/billing/salary/"+decodedData.payload.staffId,token,{})
    .then((response)=>{

        if(response.salaryPaymentDetails){
            console.log(response)

            const details = response.salaryPaymentDetails;
            const tableBody = $("#billingTableBody")

            const payAmount = $("#payAmount")
            const dueDate =  $("#dueDate")
            payAmount.text(`Salary: ${details.amount}`)

            dueDate.text(`Next pay date: ${details.nextPayDate}`)


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