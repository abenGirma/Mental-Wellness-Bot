function deleteAppointment(appointmentId){
    if (appointmentId)
    {
        webApp.showConfirm("Are you sure, you want to delete this appointment?");
        fetch('/sp_check_appointment', {
            method : "post",
            headers : {
				"Content-Type" : "application/json"
			},
			body : JSON.stringify({
				appointmentId,
				initData : webApp.getInitData(),
                initDataUnsafe : webApp.getInitDataUnsafe()
			})
        }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }
}

function editAppointment(appointmentId){
    if (appointmentId)
    {
        window.location.href = "/sp_edit_appointment/" + appointmentId + "/" + webApp.getInitData();
    }
}