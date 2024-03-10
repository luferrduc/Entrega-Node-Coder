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
		}).then((result) => {
			if (result.isConfirmed) {
				location.reload()
			}
		})
	} else {
		if (response.status === 422) {
			Swal.fire({
				title: "Role changed imposible!",
				text: `${data.message}`,
				icon: "error",
				confirmButtonText: "Ok"
			}).then((result) => {
				if (result.isConfirmed) {
					location.reload()
				}
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
	let data = await response.json()
	console.log(response)
	if (response.ok) {
		Swal.fire({
			title: "User deleted succesfully",
			text: `El usuario ha sido eliminado correctamente`,
			icon: "success",
			confirmButtonText: "Aceptar"
		})
		location.reload()
	} else {
		Swal.fire({
			title: "User could not be deleted",
			text: `${data.message}`,
			icon: "error",
			confirmButtonText: "Ok"
		})
	}
}
