const socket = io();

const container = document.getElementById("container");
const form = document.getElementById("product-form");
const botonesDelete = document.querySelectorAll(".delete-button")
const paginator = document.getElementById("paginator")
const botonesAdd = document.querySelectorAll(".add-button")


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
    if (result.status === 400){

      const data = await result.json()
      let mensaje = ""
      // console.log(data.message.issues)
      data.message.issues.map((err) => {
        mensaje+= `${err.message}, `
      })
      Swal.fire({
        title: "Error al crear un producto",
        text: mensaje,
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3085d6"
      })
    }
  } catch (error) {
    console.error(error.message);
    Swal.fire({
      title: "Error del servidor",
      text: "Hubo un error en el servidor. Intenta más tarde o contactate con nosotros",
      icon: "error",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#3085d6"
    })
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
      const resultCart = await fetch(`/api/sessions/user-cart`, {
        method: "GET",
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
        // console.error(data.message)
      }else{
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
          title: "Producto agregado correctamente"
        });
      }
    } catch (error) {
      console.error(error.message)
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
    <section style="padding: 1.5rem;" id=${product._id}>
    <div
      style="display: flex; flex-direction: column; gap: 25px; padding-bottom:0.8rem; height: 15rem; margin-bottom: 5px"
    >
      <h3 style="margin-bottom: 0;">title: ${product.title}</h3>
      <p style="margin: 0;">code: ${product.code}</p>
      <p style="margin: 0;">description: ${product.description}</p>
      <a href="/products/${product._id}" class="detalle-link">ver detalle</a>
    </div>
    <button class="delete-button">Eliminar</button>
    <button class="add-button">Agregar carrito</button>
  </section>
    `;
  });
});
