const signupBtn = document.getElementById("signup-btn");
const caption = document.getElementById("caption");

signupBtn.addEventListener("click", (event) => {
	caption.classList.remove("warning");

	let providerId = document.getElementById("id").value;
	let fName = document.getElementById("f-name").value;
	let lName = document.getElementById("l-name").value;
	let email = document.getElementById("email").value;
	let phoneNo = document.getElementById("phone-no").value;
	let educationalBkg = document.getElementById("educational-bkg").value;
	let workExp = document.getElementById("work-exp").value;
	let officeLocation = document.getElementById("office-location").value;
	let healthTeam = document.getElementById("health-team");
	let startAt = document.getElementById("start-at").value;
	let endAt = document.getElementById("end-at").value;

	if (verify(providerId, fName, lName, email, phoneNo)){

		fetch('/stud_signup', {
			method: "post",
			headers: {
				"Content-Type" : "application/json"
			},
			body: JSON.stringify({
				provider_id : providerId,
				f_name: fName,
				l_name: lName,
				email, 
				phone_no: phoneNo,
				educational_bkg: educationalBkg,
				health_team: healthTeam,
				work_exp: workExp,
				office_location: officeLocation,
				available_at : {
					start_at: startAt,
					end_at: endAt
				},
				initData : webApp.getInitData()
			})
		}).then((result) => {
			if(result.status && result.status == "success"){
				window.location.href = result.result.route
			} else {
				caption.classList.add("warning")
				caption.innerText = result.result.msg
			}
		})
	}

	
});


const verify = function(providerId, fName, lName, email, phoneNo){
	if(!webApp.isTashID(providerId)){
		caption.classList.add('warning')
		caption.innerText = "Invalid TASH provider ID"
		return false
	}
	if(!webApp.isName(fName)){
		caption.classList.add("warning")
		caption.innerText = "Your First Name is not valid!"
		return false
	}

	if(!webApp.isName(lName)){
		caption.classList.add("warning")
		caption.innerText = "Your Last Name is not valid!"
		return false
	}
	if (!webApp.isValidEmail(email)) {
		caption.classList.add("warning");
		caption.innerText = "Your email is not a valid email!";
		return false;
	}
	if(webApp.isPhoneNo(phoneNo)){
		caption.classList.add("warning");
		caption.innerText = "Your email is not a valid email!";
		return false;
	}
	return true;
}