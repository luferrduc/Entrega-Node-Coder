const newPasswordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordError = document.getElementById("passwordError");
const passwordChangeForm = document.getElementById("passwordChangeForm");

confirmPasswordInput.addEventListener("input", function () {
	if (newPasswordInput.value !== confirmPasswordInput.value) {
		passwordError.textContent = "Las contraseñas no coinciden.";
	} else {
		passwordError.textContent = "";
	}
});

passwordChangeForm.addEventListener("submit", function (event) {
	event.preventDefault();
	if (newPasswordInput.value !== confirmPasswordInput.value) {
		passwordError.textContent = "Las contraseñas no coinciden.";
	} else {
		passwordError.textContent = "";
		const data = new FormData(passwordChangeForm);
		const obj = {};
		data.forEach((value, key) => {
			obj[key] = value;
		});

		fetch("/api/sessions/password-change", {
			method: "PUT",
			body: JSON.stringify(obj),
			headers: {
				"Content-Type": "application/json"
			}
		}).then((result) => {
			console.log(result);
			if (result.status === 200) {
				alert("La contraseña fue cambiada correctamente");
				window.location.href = `http://localhost:8080/login`;
			} else if(result.status === 422){
				alert("La contraseña debe ser diferente a la anterior")
			} else {
				alert("Hubo un error, intenta nuevamente")
			}
			
		});
	}
});
