# Mobile App - AI Learning & Photography Platform

A simplified React Native mobile application using Expo for the AI Learning & Photography platform. This app provides a user-friendly interface for learners of all ages to access courses, view photography insights, manage portfolios, and join contests.

## Features

### 📱 Core Features
- **Home Dashboard** - Overview of all platform features
- **Authentication** - Login and registration system
- **Age-based Learning Paths** - Separate content for users under 14 and over 14
- **Course Management** - Browse and enroll in AI courses
- **Photography Guide** - Learn AI-powered photography techniques
- **Portfolio Management** - View and manage your project submissions
- **Contests** - Join competitions and view prizes

### 🎨 Design
- Modern, clean interface with purple/blue gradient theme
- Responsive design optimized for mobile screens
- Smooth navigation with Expo Router
- Material-inspired components

## Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Setup Steps

1. **Navigate to mobile directory**
   ```bash
   cd d:\Licenta finalizata\mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Backend URL**
   - Update `BACKEND_URL` in authentication and feature screens
   - Default: `http://localhost:5000/api`

4. **Start the development server**
   ```bash
   npm start
   ```

## Running the App

### Development
```bash
npm start
```

Then choose from:
- Press `i` for iOS simulator (macOS only)
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app (mobile device)

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Web
```bash
npm run web
```

## Project Structure

```
mobile/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Bottom tab navigation
│   │   ├── index.tsx           # Home screen
│   │   └── explore.tsx         # Explore screen
│   ├── auth/
│   │   ├── _layout.tsx         # Auth navigation
│   │   ├── login.tsx           # Login screen
│   │   └── register.tsx        # Registration screen
│   ├── screens/
│   │   ├── _layout.tsx         # Screens navigation
│   │   ├── learning.tsx        # Learning courses
│   │   ├── photography.tsx     # Photography guide
│   │   ├── portfolio.tsx       # User portfolio
│   │   ├── contests.tsx        # Contests listing
│   │   └── age-select.tsx      # Age-based content
│   ├── _layout.tsx             # Root layout
│   └── modal.tsx               # Modal example
├── components/                 # Reusable components
├── constants/                  # Theme and constants
├── hooks/                      # Custom React hooks
├── assets/                     # Images and other assets
├── package.json                # Dependencies
└── tsconfig.json              # TypeScript config
```

## Screen Navigation

### Home Screen (`/`)
- Displays user login status
- Quick access to all features
- Age selection buttons
- Feature cards for navigation

### Authentication Screens
- **Login** (`/auth/login`) - Sign in to existing account
- **Register** (`/auth/register`) - Create new account

### Feature Screens
- **Learning** (`/screens/learning`) - Browse AI courses
- **Photography** (`/screens/photography`) - Photography tips and tools
- **Portfolio** (`/screens/portfolio`) - View submissions (requires login)
- **Contests** (`/screens/contests`) - Join competitions
- **Age Select** (`/screens/age-select?category=under14|over14`) - Age-specific content

## API Integration

The app connects to the backend API at `http://localhost:5000/api` with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Portfolio
- `GET /portfolio/:userId` - Get user submissions

### Contests
- `GET /contest` - List all contests

### Local Storage
Uses `AsyncStorage` to store:
- `token` - JWT authentication token
- `userId` - User ID
- `userEmail` - User email address
- `age` - User age for content filtering

## Key Components

### Styled Elements
- **Header** - Purple gradient background with title and navigation
- **Cards** - Feature cards with icons and descriptions
- **Buttons** - Primary buttons for actions
- **Input Fields** - Text inputs for forms with validation

### Navigation
- Bottom tab navigation for main screens
- Stack navigation for nested screens
- Deep linking support via Expo Router

## Dependencies

### Core
- `expo` - Expo framework
- `expo-router` - File-based routing
- `react-native` - React Native framework
- `react-navigation` - Navigation library

### Storage & Networking
- `@react-native-async-storage/async-storage` - Local storage

### UI Components
- `@react-navigation/bottom-tabs` - Tab navigation
- `expo-status-bar` - Status bar management

## Styling

All screens use consistent styling:
- **Primary Color**: `#a092d3` (purple)
- **Accent Colors**: `#9bc0dd` (light blue), `#ab68e2` (darker purple)
- **Text**: Dark gray `#333`, medium `#666`, light `#999`
- **Background**: Light gray `#f5f5f5`, white `#fff`

## Responsive Design

The app is fully responsive with:
- Flexible layouts using `flex` and `flexDirection`
- Padding and margin adjustments for different screen sizes
- Proper spacing for touch targets
- ScrollView for overflow content

## Development

### Testing
```bash
npm run lint
```

### Reset Project
For a fresh start:
```bash
npm run reset-project
```

This moves the current `app` to `app-example` and creates a blank `app` directory.

## Future Enhancements

- [ ] Image uploading for portfolio
- [ ] Real-time notifications
- [ ] Video streaming for courses
- [ ] Payment integration for premium courses
- [ ] Social features (comments, likes)
- [ ] Offline support
- [ ] Dark mode
- [ ] Multiple language support

## Configuration

### Backend URL
Change the `BACKEND_URL` constant in:
- `app/auth/login.tsx`
- `app/auth/register.tsx`
- `app/screens/portfolio.tsx`
- `app/screens/contests.tsx`

### Theme Colors
Modify styles in individual screen files or create a centralized `constants/colors.ts`.

## Troubleshooting

### Module Not Found
```bash
npm install
```

### AsyncStorage Errors
Ensure `@react-native-async-storage/async-storage` is installed:
```bash
npm install @react-native-async-storage/async-storage
```

### Backend Connection Issues
- Ensure backend server is running on `http://localhost:5000`
- Check CORS settings in backend
- Verify API endpoints match backend routes

### Expo Go Issues
- Update Expo CLI: `npm install -g expo-cli@latest`
- Clear cache: `expo start --clear`
- Restart development server

## License

This project is part of the AI Learning & Photography Platform.

## Support

For issues or questions:
1. Check the project documentation
2. Review backend API documentation
3. Check Expo and React Native documentation
4. Consult the team repository

---

**Version**: 1.0.0  
**Last Updated**: November 16, 2025
