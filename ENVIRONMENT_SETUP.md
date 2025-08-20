# Environment Configuration

This project uses Angular environment files to manage different configurations for development and production environments.

## Environment Files

- `src/environments/environment.ts` - Development environment configuration
- `src/environments/environment.prod.ts` - Production environment configuration

## Configuration

### Development Environment (`environment.ts`)
- `production: false`
- Debug mode enabled
- Local API endpoints
- Development Firebase configuration

### Production Environment (`environment.prod.ts`)
- `production: true`
- Debug mode disabled
- Production API endpoints
- Production Firebase configuration

## Usage

### Importing Environment Variables

```typescript
import { environment } from '../environments/environment';

// Access environment variables
console.log(environment.production); // true/false
console.log(environment.apiUrl); // API URL
console.log(environment.firebase); // Firebase config
```

### Available Scripts

- `npm start` - Start development server (defaults to development config)
- `npm run start:dev` - Start development server with development config
- `npm run start:prod` - Start development server with production config
- `npm run build` - Build for production (defaults to production config)
- `npm run build:dev` - Build with development config
- `npm run build:prod` - Build with production config

## Firebase Configuration

Update the Firebase configuration in both environment files with your actual Firebase project details:

```typescript
firebase: {
  apiKey: 'your-actual-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: 'your-sender-id',
  appId: 'your-app-id'
}
```

## Security Notes

- Never commit actual API keys or sensitive configuration to version control
- Use environment variables or secure configuration management for production secrets
- Consider using `.env` files for local development (not included in this setup)

## File Replacement

The Angular build system automatically replaces `environment.ts` with `environment.prod.ts` when building for production, ensuring the correct configuration is used.
