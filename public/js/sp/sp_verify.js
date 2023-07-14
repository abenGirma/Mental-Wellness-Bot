const tokenBtn = document.getElementById("verify-btn");

let caption = document.getElementById("caption");
caption.classList.remove("warning");

tokenBtn.addEventListener("click", (event) => {
	let token = document.getElementById("token").value;
	caption.innerText = "Enter your verification token down here.";
		
	if (token){
		fetch('/sp_verify', {
			method: "post",
			headers: {
				"Content-Type" : "application/json"
			},
			body: JSON.stringify({ 
				token,
				initData : webApp.getInitData(),
				initDataUnsafe : webApp.getInitDataUnsafe()
			})
		}).then((res) => {
			// caption.classList.add("warning")
			// caption.innerText = JSON.stringify(res);
			res.json().then((data) => {
				if (data.status && data.status == "success"){
					webApp.showAlert(data.result.msg)
					webApp.close()
				}else if ( data.status && data.status == "unauthorized"){
					caption.classList.add("warning")
					caption.innerText = data.result.msg
				}
				else {
					caption.classList.add("warning")
					caption.innerText = "Invalid Token, Try again"
				}
			}).catch((err) => {
				caption.classList.add("warning");
				caption.innerText = "Unrecognized response from the server.";
				console.log(err);
			})
		}).catch((err) => {
			caption.classList.add("warning");
			caption.innerText = "Fetch Error, could not send data to the server.";
		})
	}
	else {
		caption.classList.add("warning");
		caption.innerText = "Token cannot be empty.";
	}
});
