const resetForm = document.getElementById("restablecer")


resetForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const data  = new FormData(resetForm)
  const obj = {}
  data.forEach((value, key) => {
    obj[key] = value
  })

  fetch('/api/sessions/password-link', {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(result => {
    console.log(result)
    if(result.status === 200){
      alert("El correo fue enviado correctamente")

      window.location.href = `http://localhost:8080/login`
    }
  })

})