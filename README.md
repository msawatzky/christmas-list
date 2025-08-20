# 🎄 Christmas Wish List App

A beautiful, modern Christmas wish list application built with Angular 19 and Firebase. Users can create accounts, add items to their wish list, mark items as purchased, and share their lists with family and friends.

## ✨ Features

- **User Authentication**: Secure sign-up and sign-in with Firebase Auth
- **Wish List Management**: Add, edit, and delete items from your wish list
- **Item Details**: Include name, description, price, and links to items
- **Purchase Tracking**: Mark items as purchased and track who bought them
- **Real-time Updates**: Changes sync instantly across all devices
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Beautiful, intuitive interface with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd christmas-list
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your Firebase configuration

4. **Update Environment Files**
   - Open `src/environments/environment.ts`
   - Replace the Firebase config with your actual project details
   - Do the same for `src/environments/environment.prod.ts`

5. **Deploy Firestore Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

6. **Start Development Server**
   ```bash
   npm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:4200`

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm run start:dev` - Start with development configuration
- `npm run start:prod` - Start with production configuration
- `npm run build` - Build for production
- `npm run build:dev` - Build with development configuration
- `npm run build:prod` - Build with production configuration
- `npm test` - Run unit tests

### Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/              # Authentication component
│   │   └── christmas-list/     # Main wish list component
│   ├── services/
│   │   ├── auth.service.ts     # Firebase authentication
│   │   └── christmas-list.service.ts  # Firestore operations
│   ├── environments/           # Environment configurations
│   └── app.config.ts          # App configuration
├── styles.css                 # Global styles
└── main.ts                   # Application entry point
```

## 🌐 Deployment

### Deploy to Firebase Hosting

1. **Build the application**
   ```bash
   npm run build:prod
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

3. **Your app will be live at**
   `https://your-project-id.web.app`

### Environment Configuration

The app uses different configurations for development and production:

- **Development** (`environment.ts`): Local development settings
- **Production** (`environment.prod.ts`): Production settings

Key differences:
- Debug mode enabled/disabled
- Different API endpoints
- Firebase project configurations

## 🔧 Firebase Setup

### 1. Authentication
- Enable Email/Password authentication in Firebase Console
- No additional configuration needed

### 2. Firestore Database
- Create a Firestore database in test mode initially
- Deploy the security rules provided in `firestore.rules`
- The app will create the necessary collections automatically

### 3. Security Rules
The Firestore rules ensure:
- Users can only access their own wish list items
- Authentication is required for all operations
- Data is protected from unauthorized access

## 🎨 Customization

### Styling
- Global styles are in `src/styles.css`
- Component-specific styles are in their respective `.css` files
- The app uses a modern gradient background and clean design

### Adding Features
- New components can be added to `src/app/components/`
- Services for data operations go in `src/app/services/`
- Routes are configured in `src/app/app.routes.ts`

## 🔒 Security

- All data is protected by Firebase Security Rules
- User authentication is required for all operations
- Each user can only access their own wish list items
- No sensitive data is stored in the client

## 📱 Mobile Support

The app is fully responsive and works great on:
- Desktop browsers
- Tablets
- Mobile phones
- Progressive Web App (PWA) ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the Firebase Console for any configuration issues
2. Ensure all dependencies are installed correctly
3. Verify your environment configuration
4. Check the browser console for any errors

## 🎯 Next Steps

Potential enhancements:
- Share wish lists with family members
- Add item categories and filtering
- Email notifications for new items
- Social media sharing
- Gift budget tracking
- Multiple wish lists per user

---

Happy Holidays! 🎄✨
