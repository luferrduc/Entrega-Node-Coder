document.addEventListener("DOMContentLoaded", (e) => {
	const numbers = document.querySelectorAll(".numberId");
	const purchaseButton = document.querySelector("#purchase-button");
	const voidCartButton = document.querySelector("#void-button");

	const purchaseDetail = document.getElementById("purchase-detail");
	purchaseDetail.innerHTML = ``;
	numbers.forEach((el, key) => {
		el.innerText = key + 1;
	});
	purchaseButton.addEventListener("click", async (e) => {
		const cid = e.target.className;
		const response = await fetch(`/api/carts/${cid}/purchase`, {
			method: "POST",
			body: "",
			headers: {
				"Content-Type": "application/json"
			}
		});

		if (response.ok) {
			const { payload } = await response.json();
			const { ticket } = payload;
			purchaseDetail.innerHTML = `
			<h3>Ticket details</h3>
			<p>Code: ${ticket.code}</p>
			<p>Amount: ${ticket.amount}</p>
			<p>Purchaser: ${ticket.purchaser}</p>
			<p>Purchaser: ${ticket.purchase_datetime}</p>
			`;

			const Toast = Swal.mixin({
				toast: true,
				position: "top-end",
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
				didOpen: (toast) => {
					toast.onmouseenter = Swal.stopTimer;
					toast.onmouseleave = Swal.resumeTimer;
				}
			});
			Toast.fire({
				icon: "success",
				title: "The purchase was made successfully"
			});

			setTimeout(function () {
				location.reload();
			}, 2500);
		} else {
			const Toast = Swal.mixin({
				toast: true,
				position: "top-end",
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
				didOpen: (toast) => {
					toast.onmouseenter = Swal.stopTimer;
					toast.onmouseleave = Swal.resumeTimer;
				}
			});
			Toast.fire({
				icon: "error",
				title: "Something went wrong. try again"
			});
		}
	});

	voidCartButton.addEventListener("click", async (e) => {
		const cid = e.target.className;
		const response = await fetch(`/api/carts/${cid}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			}
		});

		const Toast = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: 1500,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.onmouseenter = Swal.stopTimer;
				toast.onmouseleave = Swal.resumeTimer;
			}
		});
		Toast.fire({
			icon: "sucess",
			title: "The cart was emptied "
		});
		setTimeout(function () {
			location.reload();
		}, 1500);
	});
});
