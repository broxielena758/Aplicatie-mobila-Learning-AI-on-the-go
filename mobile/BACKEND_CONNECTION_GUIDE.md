# Mobile App - Backend Configuration Guide

## 🔗 Connecting Mobile App to Backend

### Current Backend URL
```
http://localhost:5000/api
```

This is the default configuration for all API calls in the mobile app.

---

## 📋 Configured API Endpoints

The mobile app is pre-configured to use the following endpoints:

### Authentication (`/api/auth`)
```
POST /api/auth/login
- Request: { email: string, password: string }
- Response: { token: string, user: { id, email, age } }

POST /api/auth/register  
- Request: { email: string, password: string, age: number }
- Response: { success: boolean, message: string }
```

### Portfolio (`/api/portfolio`)
```
GET /api/portfolio/:userId
- Headers: Authorization: Bearer <token>
- Response: Array of submissions
```

### Contests (`/api/contest`)
```
GET /api/contest
- Response: Array of contests
```

---

## 🚀 Getting Started

### 1. Start Your Backend Server

Navigate to the backend folder and start the server:
```bash
cd d:\Licenta finalizata\backend
npm install
npm start
```

**Expected output:**
```
✅ Server running on http://localhost:5000
📊 PHP stats interface at http://localhost:8000
```

### 2. Start the Mobile App

In a new terminal:
```bash
cd d:\Licenta finalizata\mobile
npm install
npm start
```

### 3. Test the Connection

The app will automatically test the connection when:
- Home screen loads
- User attempts to login
- Portfolio screen loads
- Contests screen loads

---

## 🔄 Data Flow

```
Mobile App
    ↓
AsyncStorage (Local Cache)
    ↓
HTTP Request to Backend
    ↓
Backend API (Node.js/Express)
    ↓
Database
```

### 1. User Registration
```
Register Screen → POST /auth/register → Backend Stores User → Response
```

### 2. User Login
```
Login Screen → POST /auth/login → Backend Validates → Returns Token → Stored in AsyncStorage
```

### 3. Access Protected Routes
```
Portfolio/Contests Screen → Reads Token from AsyncStorage → Adds to Authorization Header → Requests Data
```

---

## 📝 Environment Variables (Optional)

For production, create a `.env` file in the mobile folder:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_ENV=development
```

Then update the screens to use:
```typescript
const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
```

---

## 🔐 CORS Configuration

Your backend already has CORS configured:
```javascript
app.use(cors({
    origin: "*",  // Allow all origins
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));
```

✅ The mobile app is compatible with this configuration.

---

## 📡 Network Requests

All network requests use:
```typescript
fetch(url, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token  // For protected routes
  },
  body: JSON.stringify(data)
})
```

---

## ✅ Pre-configured Screens

### Files with API Integration:

#### 1. **app/auth/login.tsx**
```typescript
fetch(`${BACKEND_URL}/auth/login`, { ... })
```

#### 2. **app/auth/register.tsx**
```typescript
fetch(`${BACKEND_URL}/auth/register`, { ... })
```

#### 3. **app/screens/portfolio.tsx**
```typescript
fetch(`${BACKEND_URL}/portfolio/${userId}`, {
  headers: { Authorization: `Bearer ${token}` }
})
```

#### 4. **app/screens/contests.tsx**
```typescript
fetch(`${BACKEND_URL}/contest`)
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"
**Solution:**
1. Verify backend is running: `npm start` in backend folder
2. Check server is on `http://localhost:5000`
3. Try: `curl http://localhost:5000/api/contest` in terminal

### Issue: CORS error
**Solution:**
1. Backend CORS is already configured correctly
2. If custom URL, ensure backend allows mobile origin

### Issue: Token not persisting
**Solution:**
1. AsyncStorage might be cleared
2. Check: `AsyncStorage.getItem('token')`
3. Login again to refresh token

### Issue: API returns 404
**Solution:**
1. Verify endpoint exists in backend routes
2. Check if backend server is actually running
3. Verify API URL in the screen file

---

## 🔄 Data Persistence

The mobile app stores user data locally:

```typescript
// Storage Keys
'token'       → JWT authentication token
'userId'      → User's unique ID  
'userEmail'   → User's email address
'age'         → User's age for content filtering
```

### Clear Local Storage (for testing):
```typescript
AsyncStorage.clear()  // Clears all stored data
```

---

## 📊 Network Monitoring

To debug network requests in Expo:

### Option 1: Console Logs
Logs are automatically shown in terminal when you `npm start`

### Option 2: Flipper
Expo integrates with Flipper for advanced debugging:
https://docs.expo.dev/guides/using-flipper/

### Option 3: React Native Debugger
Download and run while app is in development:
https://github.com/jhen0409/react-native-debugger

---

## 🚀 Deployment

When deploying to production:

1. **Update API URL:**
   ```typescript
   const BACKEND_URL = 'https://your-api.com/api';
   ```

2. **Update all affected files:**
   - app/auth/login.tsx
   - app/auth/register.tsx
   - app/screens/portfolio.tsx
   - app/screens/contests.tsx

3. **Set up backend CORS for production:**
   ```javascript
   app.use(cors({
       origin: "https://your-domain.com",
       methods: ["GET", "POST"]
   }));
   ```

4. **Use environment variables:**
   ```bash
   EXPO_PUBLIC_API_URL=https://your-api.com/api
   ```

---

## 📞 Testing API Endpoints

Use Postman, Insomnia, or curl to test endpoints:

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","age":25}'
```

### Test Contests
```bash
curl http://localhost:5000/api/contest
```

---

## ✨ Additional Notes

- All requests use JSON content type
- Sensitive data (passwords) are never stored locally
- Tokens are stored in AsyncStorage (secure enough for most apps)
- Consider using SecureStore for production
- Network requests time out after 30 seconds (default)

---

## 📚 Related Documentation

- **Backend Setup**: See `backend/README.md` or `server.js`
- **API Routes**: Check `backend/routes/` folder
- **Mobile App Guide**: See `MOBILE_APP_GUIDE.md`
- **Quick Start**: See `QUICK_START.md`

---

**Last Updated**: November 16, 2025
