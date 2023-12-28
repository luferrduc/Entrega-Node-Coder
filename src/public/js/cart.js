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
			setTimeout(function () {
				location.reload();
			}, 5500);
		} else {
			alert("something went wrong. try again");
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

		setTimeout(function () {
			location.reload();
		}, 1500);
	});
});
