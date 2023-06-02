"use strict";

const $ = document;

const WebApp = function () {
	Telegram.WebApp.ready();
	// this.initData = Telegram.WebApp.initData || "";
	// this.initDataUnsafe = Telegram.WebApp.initDataUnsafe || {};
	Telegram.WebApp.MainButton.setParams({
		text: 'CLOSE',
		is_visible: true
	}).onClick(this.close);
};

WebApp.prototype.initData = Telegram.WebApp.initData || "";
WebApp.prototype.initDataUnsafe = Telegram.WebApp.initDataUnsafe || {};

WebApp.prototype.initTheme = function () {
	document.documentElement.className = Telegram.WebApp.colorScheme;
	Telegram.WebApp.onEvent("themeChanged", this.initTheme);
};

WebApp.prototype.sendData = function (data) {
	Telegram.WebApp.sendData(data);
	Telegram.WebApp.close();
};

WebApp.prototype.getInitDataUnsafe = function () {
	return this.initDataUnsafe;
};

WebApp.prototype.getInitData = function () {
	return this.initData;
};

WebApp.prototype.isValidEmail = function (email) {
	return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

WebApp.prototype.isName = function (name){
	let isValid = (name.length > 3);
	return isValid && /^[a-zA-Z]+$/.test(name)
}

WebApp.prototype.isTashID = function (id){
	let isValid = (id && id.length && id.length < 4);
	return isValid
}

WebApp.prototype.isPhoneNo = function(phoneNo){
	return true
}
WebApp.prototype.isTASHStudId = function(studId){
	return true
}

WebApp.prototype.close = function(){
	Telegram.WebApp.close()
}

WebApp.prototype.showAlert = function(alert) {
	Telegram.WebApp.showAlert(JSON.stringify(alert))
}

const webApp = new WebApp();
webApp.initTheme();
