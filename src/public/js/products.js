const socket = io();

const container = document.getElementById("container");
const form = document.getElementById("product-form");
const botonesDelete = document.querySelectorAll(".delete-button")
const paginator = document.getElementById("paginator")
const botonesAdd = document.querySelectorAll(".add-button")


// document.addEventListener("DOMContentLoaded", async (e) => {

// })



form.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const data = Object.fromEntries(new FormData(evt.target));

  try {
    let result = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
    if (result.status === 400) return alert("Rellenar los campos");
  } catch (error) {
    console.log(error);
  }
});

async function handleButtonClick(e){
  const target = e.target
  const id = target.parentElement.id
  if(target.className === "delete-button"){
    const result = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
  }
  if(target.className === "add-button"){
    try {
      const resultCart = await fetch(`/api/carts`, {
        method: "POST",
        body: "",
        headers: {
          "Content-Type" : "application/json"
        }
      })
      const { payload } = await resultCart.json()
      const cartId = payload["_id"]
      const result = await fetch(`/api/carts/${cartId}/products/${id}`, {
        method: "POST",
        body: "",
        headers: {
          "Content-Type" : "application/json"
        }
      });
      const data = await result.json()
      if(data.status === "error"){
        console.error(data.message)
      }else{
        alert("Producto agregado correctamente")
      }
    } catch (error) {
      console.log(error.message)
    }
  }
}

botonesDelete.forEach((boton) => {
  boton.addEventListener("click", handleButtonClick)
})

botonesAdd.forEach((boton) => {
  boton.addEventListener("click", handleButtonClick)
})



socket.on("refreshProducts", (data) => {
  container.innerHTML = ``;
  data.forEach((product) => {
    container.innerHTML += `
    <section style="padding: 1.5rem" id=${product.id}>
      <div style="display: flex; flex-direction: column; gap: 10px; padding-bottom:0.8rem">
          <h3 style="margin-bottom: 0;">title: ${product.title}</h3> 
          <p style="margin: 0;">code: ${product.code}</p>
          <p style="margin: 0;">description: ${product.description}</p>
          <span style="margin: 0;">price: $${product.price}</span>
          <p style="margin: 0;">status: ${product.status}</p>
          <span style="margin: 0;">stock: ${product.stock}</span>
      </div>
      <button
      class="delete-button"	
      style="background-color: red; padding:5px 10px; border-radius:25px; cursor:pointer; font-weight:bold"
    >Eliminar</button>
    <button
    class="add-button"				
    style="background-color: rgb(0, 150, 37)(0, 255, 64); padding:5px 10px; border-radius:25px; cursor:pointer; font-weight:bold"
    >Agregar carrito</button>
    </section>
    `;
  });
});
