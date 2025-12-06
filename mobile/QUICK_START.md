# Mobile App Setup Quick Start

## ⚡ Quick Start Guide

### 1. Install Dependencies
```bash
cd d:\Licenta finalizata\mobile
npm install
```

### 2. Start the Development Server
```bash
npm start
```

### 3. Choose Your Platform
- **iOS**: Press `i` (requires macOS with Xcode)
- **Android**: Press `a` (requires Android Studio or emulator)
- **Web**: Press `w`
- **Mobile Device**: Scan QR code with Expo Go app

---

## 📱 What's Included in Your Mobile App

### ✅ Screens Implemented

1. **Home Screen** (`(tabs)/index.tsx`)
   - User login status display
   - Quick access to all features
   - Age selection buttons
   - Feature cards navigation

2. **Explore Screen** (`(tabs)/explore.tsx`)
   - Learning resources
   - Community features
   - Quick tips and guides

3. **Authentication**
   - **Login** (`auth/login.tsx`) - Sign in with email/password
   - **Register** (`auth/register.tsx`) - Create new account with age

4. **Feature Screens**
   - **Learning** (`screens/learning.tsx`) - AI courses
   - **Photography** (`screens/photography.tsx`) - Photo guides
   - **Portfolio** (`screens/portfolio.tsx`) - User submissions
   - **Contests** (`screens/contests.tsx`) - Join competitions
   - **Age Select** (`screens/age-select.tsx`) - Age-specific content

### 🎨 Design Features
- Purple gradient theme matching your web design
- Responsive layout for all screen sizes
- Material Design principles
- Smooth navigation with Expo Router
- AsyncStorage for persistent user data

---

## 🔗 Backend Connection

The app connects to your backend at: `http://localhost:5000/api`

**Before running the app, make sure your backend server is running:**
```bash
cd d:\Licenta finalizata\backend
npm install
npm start
```

---

## 📁 Project Structure

```
mobile/
├── app/
│   ├── (tabs)/                 # Main tab screens
│   │   ├── index.tsx          # Home
│   │   └── explore.tsx        # Explore
│   ├── auth/                  # Authentication
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── screens/               # Feature screens
│   │   ├── learning.tsx
│   │   ├── photography.tsx
│   │   ├── portfolio.tsx
│   │   ├── contests.tsx
│   │   └── age-select.tsx
│   └── _layout.tsx            # Root navigation
├── components/                # Reusable components
├── constants/                 # App constants & theme
├── hooks/                     # Custom hooks
├── package.json               # Dependencies
└── MOBILE_APP_GUIDE.md       # Full documentation
```

---

## 🚀 Available Commands

```bash
# Start development server
npm start

# iOS emulator
npm run ios

# Android emulator
npm run android

# Web version
npm run web

# Lint check
npm run lint

# Reset project
npm run reset-project
```

---

## 🎯 Current Features

### Home Screen
- ✅ User authentication status
- ✅ Login/Logout functionality
- ✅ Age category selection
- ✅ Quick access to all features
- ✅ About platform information

### Learning
- ✅ Course listing
- ✅ Difficulty levels (Beginner, Intermediate, Advanced)
- ✅ Course descriptions
- ✅ Enroll button

### Photography
- ✅ Photography tips and tutorials
- ✅ AI tools overview
- ✅ Technique guides
- ✅ Learn more buttons

### Portfolio
- ✅ View submissions (requires login)
- ✅ Submission details
- ✅ Login prompt if not authenticated

### Contests
- ✅ Contest listings
- ✅ Prize information
- ✅ Participant count
- ✅ Join contest button

### Authentication
- ✅ Login with email/password
- ✅ Register new account with age
- ✅ Token storage
- ✅ Session management

---

## 🔐 Authentication Flow

1. **User registers** → Email, password, age stored in backend
2. **User logs in** → JWT token returned
3. **Token stored** → Saved in AsyncStorage
4. **Auto-login** → Home screen checks for existing token
5. **Protected routes** → Redirect to login if needed

---

## 💾 Local Storage

The app uses AsyncStorage to persist:
```typescript
- token       // JWT authentication
- userId      // User ID
- userEmail   // Email address
- age         // User age for content filtering
```

---

## 🐛 Common Issues & Solutions

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

### Can't connect to backend
- Check if backend server is running: `http://localhost:5000`
- Verify backend CORS settings
- Update `BACKEND_URL` in screens if needed

### Expo errors
```bash
# Clear cache and restart
expo start --clear
```

### AsyncStorage not working
```bash
npm install @react-native-async-storage/async-storage
```

---

## 📦 Key Dependencies

- **expo**: Development framework
- **expo-router**: File-based routing
- **react-native**: Mobile framework
- **@react-native-async-storage/async-storage**: Local storage
- **@react-navigation**: Navigation library

---

## 🎨 Styling Guide

### Colors Used
- **Primary**: `#a092d3` (Purple)
- **Secondary**: `#9bc0dd` (Light Blue)
- **Accent**: `#ab68e2` (Dark Purple)
- **Text**: `#333` (Dark), `#666` (Medium), `#999` (Light)
- **Background**: `#f5f5f5` (Light Gray), `#fff` (White)

### Common Styles Applied
- Border radius: `8-15px`
- Shadow elevation: `2-3`
- Padding: `15-20px`
- Font sizes: `12px` (small) to `28px` (headers)

---

## 📱 Testing Checklist

- [ ] Home screen loads with user status
- [ ] Login screen accepts credentials
- [ ] Register screen creates account with age
- [ ] Navigation between tabs works
- [ ] Feature cards navigate to correct screens
- [ ] Age-based content shows correctly
- [ ] Portfolio loads user submissions
- [ ] Contests display properly
- [ ] Logout clears local storage
- [ ] Back buttons work correctly

---

## 🚀 Next Steps

1. **Run the app** with `npm start`
2. **Test authentication** by logging in
3. **Explore all screens** using navigation
4. **Verify backend connection** for real data
5. **Test on actual device** using Expo Go
6. **Review MOBILE_APP_GUIDE.md** for detailed docs

---

## 📞 Support

For detailed information, see **MOBILE_APP_GUIDE.md** in the mobile folder.

Happy coding! 🎉
