# Authentication API Test

This file contains examples for testing the authentication endpoints.

## Available Endpoints

### 1. Register
```
POST http://localhost:5116/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. Login
```
POST http://localhost:5116/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Get Current User (requires authentication)
```
GET http://localhost:5116/api/auth/me
```

### 4. Logout
```
POST http://localhost:5116/api/auth/logout
```

## Testing with curl

### Register a new user:
```bash
curl -X POST http://localhost:5116/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }' \
  -c cookies.txt
```

### Login:
```bash
curl -X POST http://localhost:5116/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### Get current user (with cookies):
```bash
curl -X GET http://localhost:5116/api/auth/me \
  -b cookies.txt
```

### Logout:
```bash
curl -X POST http://localhost:5116/api/auth/logout \
  -b cookies.txt
```

## Notes
- The authentication uses HTTP-only cookies for security
- CORS is configured to allow credentials from frontend applications
- Password requirements are minimal for development (6 characters minimum)
- Email confirmation is disabled for simplicity
