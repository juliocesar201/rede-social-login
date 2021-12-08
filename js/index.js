var database = firebase.database();
$(document).ready(function () {
	// Registrando novo usuário
	$("#register").click(function (event) {
		event.preventDefault();
		var name = $("#sign-up-name").val();
		var email = $("#sign-up-email").val();
		var password = $("#sign-up-password").val();
		firebase.auth().createUserWithEmailAndPassword(email, password).then(function (response) {
			var userId = response.user.uid;
			database.ref("/users/" + userId).set({
				name: name,
				email: email
			})
			window.location = "home.html?id=" + userId;
		}).catch(function (error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorCode, errorMessage);
		});
	});
	// Fazendo o login
	$("#login").click(function () {
		event.preventDefault();

		var email = $("#sign-in-email").val();
		var password = $("#sign-in-password").val();
		firebase.auth().signInWithEmailAndPassword(email, password).then(function (response) {
			window.location = "home.html?id=" + response.user.uid;
		}).catch(function (error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorCode, errorMessage);
		});

	});
});
