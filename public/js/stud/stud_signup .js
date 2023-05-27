const { webApp } = require("telegraf/typings/button");
const { default: isEmail } = require("validator/lib/isEmail");

const signupBtn = document.getElementById("signup-btn");
const caption = $.getElementById("caption");

signupBtn.addEventListener("click", (event) => {
	caption.classList.remove("warning");

	let studId = document.getElementById("id").value;
	let fName = document.getElementById("f-name").value;
	let lName = document.getElementById("l-name").value;
	let email = document.getElementById("email").value;
	let phoneNo = document.getElementById("phone-no").value;

	let batch = document.getElementById("batch").value;
	let department = document.getElementById("department").value;


	if (verify(studId, fName, lName, email, phoneNo)){
		fetch("/stud_signup", {
			method: "post",
			headers : {
				"Content-Type" : "application/json"
			},
			body : JSON.stringify({
				stud_id : studId,
				f_name: fName,
				l_name: lName,
				email,
				phone_no: phoneNo,
				ed_info: {
					batch,
					department
				}
			})
		}).then((res) => {
			res.json().then((data)=>{
				if (data.result){
					if (data.result.route)
						window.location.href = data.result.route
					if (data.result.msg){
						caption.classList.add("warning");
						caption.innerText = data.result.msg;
					}
				}
			}).catch((err)=>{
				console.log(err);
			})
		}).catch((err) => {
			caption.classList.add("warning");
			caption.innerText = "Fetch Error, could not send data to backend.";
		})
	
	}

	
});

function verify(studId, fName, lName, email, phoneNo){
	if(!webApp.isTASHStudId(studId)){
		caption.classList.add("warning")
		caption.innerText = "Your TASH ID is not valid"
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