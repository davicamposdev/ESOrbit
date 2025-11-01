# 💡 Exemplos de Uso

## cURL

### Registrar

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "senha123",
    "displayName": "Teste"
  }'
```

### Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "senha123"
  }'
```

### Buscar Perfil

```bash
# Salve o token da resposta anterior
TOKEN="seu-access-token-aqui"

curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Refresh Token

```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

### Logout

```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -b cookies.txt
```

---

## JavaScript/Fetch

### Registrar

```javascript
const response = await fetch('http://localhost:4000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Importante para cookies
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'senha123',
    displayName: 'Teste',
  }),
});

const data = await response.json();
localStorage.setItem('accessToken', data.accessToken);
```

### Requisição Autenticada

```javascript
const token = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:4000/api/auth/me', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  credentials: 'include',
});

const data = await response.json();
console.log(data.user);
```

---

## Axios

### Configuração

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true, // Para cookies
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refresh automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      const { data } = await axios.post(
        'http://localhost:4000/api/auth/refresh',
        {},
        { withCredentials: true },
      );

      localStorage.setItem('accessToken', data.accessToken);
      error.config.headers.Authorization = `Bearer ${data.accessToken}`;

      return api(error.config);
    }
    return Promise.reject(error);
  },
);

export default api;
```

### Uso

```javascript
// Login
const { data } = await api.post('/auth/login', {
  email: 'test@example.com',
  password: 'senha123',
});
localStorage.setItem('accessToken', data.accessToken);

// Buscar perfil
const { data: profile } = await api.get('/auth/me');
console.log(profile.user);
```

---

## Script de Teste

Execute o script de testes automatizado:

```bash
./test-auth.sh
```

Ou use o arquivo `test-auth.http` no VS Code com a extensão REST Client.
