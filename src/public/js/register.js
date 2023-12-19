const registerForm = document.getElementById('registerForm')

registerForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const data  = new FormData(registerForm)
  const obj = {}
  data.forEach((value, key) => {
    obj[key] = value
  })
  fetch('/api/sessions/register', {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(result => {
    console.log(result)
    if(result.status === 201){
      window.location.replace("/login")
    }
    if(result.status === 400){
      alert("Usuario ya está registrado")
    }
    if(result.status === 422){
      alert("Error en los campos")
    }
  })

})