const loginBtn = document.getElementById("verify-btn");
loginBtn.addEventListener("click", (event) => {
	let token = document.getElementById("token").value;
	let caption = document.getElementById("caption");
	caption.classList.remove("warning");
	caption.innerText = "Enter your verification token down here.";

	if (token && token != "" && token != " ")
		fetch("/admin_verify", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: JSON.stringify({
				token
			})
		}).then((res) => {
			res.json().then((data)=> {
				if(data.status && data.status == "success"){
					webApp.close()
				}
				else if (data.status && data.status == "unauthorized") {
					caption.classList.add("warning")
					caption.innerText = data.result.msg
				}
				else {
					caption.classList.add("warning")
					caption.innerText = "Invalid Token, Try again"
				}
			}).catch((err) => {
				console.log(err);
			})
		}).catch((err) => {
			caption.classList.add("warning");
			caption.innerText = "Fetch Error, could not send data to backend.";
		})
	else {
		caption.classList.add("warning");
		caption.innerText = "Token cannot be empty.";
	}
});
