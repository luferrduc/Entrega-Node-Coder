const numbers = document.querySelectorAll(".numberId")
numbers.forEach((el, key) => {
	el.innerText = key + 1
})

async function changeRole(id) {
	console.log("Changing role of user with ID:", id)
	const response = await fetch(`/api/users/premium/${id}/`, {
		method: "PUT",
		body: "",
		headers: {
			"Content-Type": "application/json"
		}
	})
	let data = await response.json()
	console.log(response)
	if (response.ok) {
		Swal.fire({
			title: "Role changed succesfully!",
			text: `El rol del usuario ${data.payload.email} fue modificado`,
			icon: "success",
			confirmButtonText: "Aceptar"
		})
	} else {
		if (response.status === 422) {
			Swal.fire({
				title: "Role changed imposible!",
				text: `${data.message}`,
				icon: "error",
				confirmButtonText: "Ok"
			})
		}
	}
}

async function deleteUser(id) {
	console.log("Deleting user with ID:", id)
	const response = await fetch(`/api/users/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json"
		}
	})
}
