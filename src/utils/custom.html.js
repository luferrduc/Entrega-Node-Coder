export const loginInvalidCredentials = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .login-container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .error-message {
            color: #ff0000;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
<div class="login-container">
    <h2>Login</h2>
    
    <!-- Mensaje de error para inicio de sesión fallido -->
    <p class="error-message">¡Inicio de sesión fallido! Por favor, verifica tus credenciales.</p>
</div>
</body>
</html>`;

export const resetPasswordEmail = (name, token) => {
	return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecimiento de Contraseña</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
            color: #333333;
        }

        p {
            color: #555555;
        }

        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 15px 0;
            text-decoration: none;
            background-color: #3498db;
            color: white;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Restablecimiento de Contraseña</h2>
        <p>Hola ${name},</p>
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Haz click en el siguiente enlace para completar el proceso:</p>
        <a style="color: white" class="btn" href="http://localhost:8080/reset-password?token=${token}">Restablecer Contraseña</a>
        <p>Si no solicitaste restablecer la contraseña, puedes ignorar este correo electrónico.</p>
        <p>Gracias,<br>El Equipo de Coder55575</p>
    </div>
</body>
</html>
`;
};
