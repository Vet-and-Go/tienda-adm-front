Documentación de Autenticación - API VetAndGo
Endpoints de Autenticación
1. Registro de Usuario (Sign Up)
Endpoint: POST /api/users
Autenticación: No requiere
Descripción: Crea un nuevo usuario en el sistema.

Request Body:
{
  "username": "nombreusuario",
  "password": "contraseña123",
  "role": "CLIENT"
}
Roles disponibles:
ADMIN: Usuario administrador con acceso completo
CLIENT: Usuario cliente con acceso limitado
Response exitoso (201 Created):
{
  "id": 1,
  "username": "nombreusuario",
  "password": "$2a$12$...(hash encriptado)...",
  "role": "CLIENT"
}
Errores posibles:
400 Bad Request: Datos inválidos (ejemplo: username ya existe)
500 Internal Server Error: Error del servidor
2. Inicio de Sesión (Login)
Endpoint: POST /api/auth/login
Autenticación: No requiere
Descripción: Autentica un usuario y devuelve un token de sesión.

Request Body:
{
  "username": "nombreusuario",
  "password": "contraseña123"
}
Response exitoso (200 OK):
{
  "token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "username": "nombreusuario",
  "role": "CLIENT"
}
¡IMPORTANTE! Guarda el token que recibes. Lo necesitarás para hacer peticiones a endpoints protegidos.

Errores posibles:
401 Unauthorized: Usuario o contraseña incorrectos
{
  "error": "User nombreusuario not found."
}
o

{
  "error": "Incorrect password for user nombreusuario."
}
500 Internal Server Error: Error del servidor
3. Cerrar Sesión (Logout)
Endpoint: POST /api/auth/logout
Autenticación: No requiere
Descripción: Invalida el token de sesión del usuario.

Request Body:
{
  "username": "nombreusuario",
  "password": "cualquierCosa"
}
Nota: Solo necesitas enviar el username correcto. El campo password puede estar vacío o contener cualquier valor.

Response exitoso (204 No Content):
No devuelve contenido, solo código de estado 204.

Errores posibles:
500 Internal Server Error: Error del servidor
Endpoints Protegidos
Los siguientes endpoints requieren autenticación mediante token en el header.

Cómo enviar el token:
Debes incluir el token en el header Authorization de todas las peticiones a endpoints protegidos:

Authorization: Bearer a1b2c3d4-e5f6-7890-abcd-ef1234567890
Ejemplo con fetch (JavaScript):
fetch('http://localhost:8080/api/users', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
Ejemplo con axios (JavaScript):
axios.get('http://localhost:8080/api/users', {
  headers: {
    'Authorization': 'Bearer a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  }
})
.then(response => console.log(response.data));
Endpoints que Requieren ROL ADMIN
Los siguientes endpoints solo pueden ser accedidos por usuarios con rol ADMIN:

GET /api/users - Obtener todos los usuarios
GET /api/users/{id} - Obtener usuario por ID
GET /api/users/username/{username} - Obtener usuario por username
PUT /api/users/{id} - Actualizar usuario
DELETE /api/users/{id} - Eliminar usuario
Errores de autorización:
401 Unauthorized: Token inválido o expirado
{
  "error": "Missing or invalid Authorization header"
}
403 Forbidden: Usuario no tiene permisos (no es ADMIN)
Flujo Completo de Autenticación
1. Registro de nuevo usuario:
// Paso 1: Registrar usuario
const signUp = async () => {
  const response = await fetch('http://localhost:8080/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'juan123',
      password: 'miPassword123',
      role: 'CLIENT'
    })
  });
  
  const user = await response.json();
  console.log('Usuario creado:', user);
};
2. Iniciar sesión:
// Paso 2: Hacer login
const login = async () => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'juan123',
      password: 'miPassword123'
    })
  });
  
  const authData = await response.json();
  // Guardar token en localStorage o sessionStorage
  localStorage.setItem('token', authData.token);
  localStorage.setItem('username', authData.username);
  localStorage.setItem('role', authData.role);
  
  console.log('Login exitoso:', authData);
};
3. Hacer peticiones autenticadas:
// Paso 3: Usar el token en peticiones
const getUsers = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8080/api/users', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const users = await response.json();
  console.log('Usuarios:', users);
};
4. Cerrar sesión:
// Paso 4: Logout
const logout = async () => {
  const username = localStorage.getItem('username');
  
  await fetch('http://localhost:8080/api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: ''
    })
  });
  
  // Limpiar datos locales
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  
  console.log('Logout exitoso');
};
Ejemplo de Componente React con Autenticación
import { useState } from 'react';

function AuthComponent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        setToken(data.token);
        alert('Login exitoso!');
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: localStorage.getItem('username'),
          password: ''
        })
      });

      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      setToken(null);
      alert('Logout exitoso!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (token) {
    return (
      <div>
        <h2>Bienvenido, {localStorage.getItem('username')}!</h2>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Iniciar Sesión</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}

export default AuthComponent;
Notas Importantes
Seguridad del Token:

El token debe guardarse de forma segura (localStorage o sessionStorage)
Nunca compartas el token con terceros
El token se invalida al hacer logout
Encriptación de Contraseñas:

Las contraseñas se encriptan automáticamente en el backend usando BCrypt
Nunca envíes contraseñas en texto plano a otros sistemas
Roles de Usuario:

ADMIN: Acceso completo a todos los endpoints
CLIENT: Acceso limitado (solo endpoints públicos)
Endpoints Públicos:

/api/users (POST) - Registro
/api/auth/login (POST) - Login
/api/auth/logout (POST) - Logout
Manejo de Errores:

Siempre verifica el código de estado HTTP
Maneja errores 401 (no autenticado) redirigiendo al login
Maneja errores 403 (sin permisos) mostrando mensaje apropiado
Testing con Postman o cURL
Registro:
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123","role":"CLIENT"}'
Login:
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
Petición autenticada:
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
Logout:
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":""}'
Contacto y Soporte
Si tienes dudas o problemas con la integración, contacta al equipo de backend.