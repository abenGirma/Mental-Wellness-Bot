const loginBtn = document.getElementById("verify-btn");
loginBtn.addEventListener("click", (event) => {
	let token = document.getElementById("token").value;
	let caption = document.getElementById("caption");
	caption.classList.remove("warning");
	caption.innerText = "Enter your verification token down here.";

	if (token && token != "" && token != " ")
		webApp.sendData(
			JSON.stringify({
				type: 7564,
				token: token,
			})
		);
	else {
		caption.classList.add("warning");
		caption.innerText = "Token cannot be empty.";
	}
});
