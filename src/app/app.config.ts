import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "christmas-list-5a1e0", appId: "1:974446482113:web:af9c41f8b0e39464f6fa40", storageBucket: "christmas-list-5a1e0.firebasestorage.app", apiKey: "AIzaSyBBzyalfsqHEKOT-iJn2P3-2-oCnnvZ6S8", authDomain: "christmas-list-5a1e0.firebaseapp.com", messagingSenderId: "974446482113" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
