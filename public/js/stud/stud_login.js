const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", (event) => {
	let email = document.getElementById("email").value;
	let caption = document.getElementById("caption");
	caption.classList.remove("warning");
	caption.innerText = "Enter your email to login.";

	if (webApp.isValidEmail(email)){
		fetch("/stud_login", {
			method: "post",
			headers : {
				"Content-Type" : "application/json"
			},
			body : JSON.stringify({
				email
			})
		}).then((res) => {
			res.json().then((data)=>{
				if (data.result){
					if (data.result.status)
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
	else {
		caption.classList.add("warning");
		caption.innerText = "'" + email + "'" + " is not a valid email.";
	}
});
