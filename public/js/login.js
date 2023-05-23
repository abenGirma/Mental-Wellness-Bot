const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", (event) => {
	let email = document.getElementById("email").value;
	let caption = document.getElementById("caption");
	caption.classList.remove("warning");
	caption.innerText = "Enter your email to login.";

	if (webApp.isValidEmail(email)){
		fetch("/sp_login", {
			method: "post",
			headers : {
				"Content-Type" : "application/json"
			},
			body : JSON.stringify({
				email
			})
		}).then((res) => {
			res.json().then((data)=>{
				if (data.result && data.result.route)
					window.location.href = data.result.route
			}).catch((err)=>{
				console.log(err);
			})
		}).catch((err) => {
			caption.classList.remove("warning");
			caption.innerText = "Error, could not send data to backend.";
		})
	}
	else {
		caption.classList.add("warning");
		caption.innerText = "'" + email + "'" + " is not a valid email.";
	}
});
