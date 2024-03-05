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
	if (response.ok) {
		const data = await response.json()

		Swal.fire({
      title: 'Role changed succesfully!',
      text: `El rol del usuario ${data.payload.email} fue modificado`,
      icon: 'success',
      confirmButtonText: 'Cool'
		})
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
