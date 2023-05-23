function isEmail(email) {
	return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function isName(name){
	let isValid = (name.length > 3);
	return isValid && /^[a-zA-Z]+$/.test(name)
}

module.exports = {isEmail, isName}