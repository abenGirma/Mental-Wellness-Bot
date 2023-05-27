const { error } = require("console");
const { webApp } = require("telegraf/typings/button");

const signupBtn = document.getElementById("signup-btn");
const caption = $.getElementById("caption");
caption.classList.remove("warning");

signupBtn.addEventListener("click", (event) => {

	let providerId = document.getElementById("id").value;
	let fName = document.getElementById("f-name").value;
	let lName = document.getElementById("l-name").value;
	let email = document.getElementById("email").value;
	let phoneNo = document.getElementById("phone-no").value;
	let speciality = document.getElementById("speciality").value;
	let workingHr = document.getElementById("working-hour").value;
	let communication = document.getElementById("communication").value;


	if(verify(providerId, fName, lName, email, phoneNo)){
		fetch('/stud_signup', {
			method: 'post',
			headers: {
				"Content-Type" : "application/json",
				"Accept" : "application/json"
			},
			body: {
				fName: f_name, 
				lName: l_name, 
				email, 
				speciality,
				workingHr: working_hour, 
				communication, 
				phoneNo: phone_no
			}
		}).then((response) => {
			if(response.data.status && response.data.status == "success"){
				webApp.close();
			} else {
				caption.classList.add("warning")
				caption.innerText = response.data.result.msg
			}
		}).catch((error) => {
			caption.classList.add("warning")
			caption.innerText = error.message
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