import { environment } from '../environments/environment';

// Example of how to use environment variables in your application
export class EnvironmentExample {
  
  // Access environment variables
  static getApiUrl(): string {
    return environment.apiUrl;
  }
  
  static isProduction(): boolean {
    return environment.production;
  }
  
  static getFirebaseConfig() {
    return environment.firebase;
  }
  
  static shouldEnableDebugMode(): boolean {
    return environment.debugMode;
  }
  
  static getLogLevel(): string {
    return environment.logLevel;
  }
  
  // Example usage in a service or component
  static logMessage(message: string): void {
    if (environment.debugMode) {
      console.log(`[${environment.logLevel.toUpperCase()}] ${message}`);
    }
  }
}
