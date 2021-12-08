var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];
$(document).ready(function () {
	//	pegando o Nome do usuário
	database.ref("users/" + USER_ID).once("value")
		.then(function (snapshot) {
			var userInfo = snapshot.val();
			$(".user-name").text("Olá " + userInfo.name)
		})
	//  Pegando usuários do firebase
	database.ref("users").once("value")
		.then(function (snapshot) {
			snapshot.forEach(function (childSnapshot) {
				var childKey = childSnapshot.key;
				var childData = childSnapshot.val();
				createUsers(childData.name, childKey);
			});
		})
	//	Pegando post do firebase
	database.ref('/posts/' + USER_ID).once('value').then(function (snapshot) {
		snapshot.forEach(function (childSnapshot) {
			var childKey = childSnapshot.key;
			var childData = childSnapshot.val();
			var text = childData.text;
			var star = childData.curtidas;
			//Chamando função que coloca post do firebase no html
			createPost(text, childKey, star);
		});
	});
	//	Criando novo post do firebase
	$(".post").click(function (event) {
		event.preventDefault();
		var msg = $(".message").val();
		var contador = 0;
		var postFromDB = database.ref("posts/" + USER_ID).push({
			text: msg,
			curtidas: contador
		});
		var newPostKey = postFromDB.key;
		//Chamando função que coloca novo post no html
		createPost(msg, newPostKey, contador);
		$(".message").val("");
	});
	//	pegando amigos
	database.ref("friend/" + USER_ID).once("value")
		.then(function (snapshot) {
			var friend = snapshot.val();
			snapshot.forEach(function (teste) {
				var childKey = teste.key;
				var childData = teste.val();
				var Idfriend = childData.friendId;
				var name = childData.name;

				//Chamando função que coloca amigos no  html
				createFriends(name, Idfriend, friend);
			});

		})
});

//função de criar posts no HTMl
function createPost(text, key, star) {
	$(".box-list").append("<div class='box-post d-flex mb-3 '><div class='mr-auto'><i class='icon-star mr-4' data-star-id=" + key + ">" + star + "</i><span class='box-msg' data-newedit-id=" + key + ">" + text + "</span></div><button type='button' class='btn btn-outline-warning btn-post' data-posts-id=" + key + ">Deletar</button><button type='button' class='btn btn-outline-warning btn-post ml-2' data-edit-id=" + key + ">Editar</button></div>");
	//Apagar posts
	$(`button[data-posts-id="${key}"]`).click(function () {
		database.ref("posts/" + USER_ID + "/" + key).remove();
		$(this).parent().remove();
	})
	//Editar posts
	$("button[data-edit-id=" + key + "]").click(function () {
		$("span[data-newedit-id=" + key + "]").append("<div><input type='text' class='form-control box-input new-post' placeholder='" + text + "'><button type='button' class='editar btn btn-outline-warning ml-2' data-btedit-id=" + key + ">Finalizar Edição</button></div>");

		//salvar edição
		$("button[data-btedit-id=" + key + "]").click(function () {
			var newText = $(".new-post").val();
			$("span[data-newedit-id=" + key + "]").html(newText);
			database.ref("posts/" + USER_ID + "/" + key).update({
				text: newText
			});
			$(this).parent().remove();
		})
	})
	// curtidas
	$("i[data-star-id=" + key + "]").click(function () {
		var starCont = star + 1;
		$(this).addClass("star");
		$(this).html(starCont);
		database.ref("posts/" + USER_ID + "/" + key).update({
			curtidas: starCont
		});
	})
}
// criando usuários
function createUsers(name, key) {

	if (key !== USER_ID) {
		$(".suggestion-list").append("<div class='box-user p-3 m-2 d-flex flex-column justify-content-center'><span class='mb-2'>" + name + "</span><button type='button' class='btn btn-outline-warning' data-user-id=" + key + ">seguir</button></div>");
	}
	$("button[data-user-id=" + key + "]").click(function () {
		$(".friends-list").append("<div class='box-user p-3 m-2 d-flex flex-column justify-content-center'><span class='mb-2'>" + name + "</span><button type='button' class='btn' data-friend-id=" + key + ">deixar de seguir</button></div>");
		$(this).parent().remove();
		database.ref('friend/' + USER_ID).push({
			name: name,
			friendId: key
		});
		$("button[data-friend-id=" + key + "]").click(function () {
			database.ref("friend/" + USER_ID).once("value")
				.then(function (snapshot) {
					snapshot.forEach(function (childSnapshot) {
						var childKey = childSnapshot.key;
						var childData = childSnapshot.val();
						database.ref("friend/" + USER_ID + "/" + childKey).remove();

					});
				})
			$(this).parent().remove();
		})
	})
}

// criando usuários
function createFriends(name, key) {

	if (key !== USER_ID) {
		$(".friends-list").append("<div class='box-user p-3 m-2 d-flex flex-column justify-content-center'><span class='mb-2'>" + name + "</span><button type='button' class='btn' data-friend-id=" + key + ">deixar de seguir</button></div>");
	}
	$("button[data-friend-id=" + key + "]").click(function () {
		database.ref("friend/" + USER_ID).once("value")
			.then(function (snapshot) {
				snapshot.forEach(function (childSnapshot) {
					var childKey = childSnapshot.key;
					var childData = childSnapshot.val();
					database.ref("friend/" + USER_ID + "/" + childKey).remove();
				});
			})
		$(this).parent().remove();
	})

}
