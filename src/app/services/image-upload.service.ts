import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(
    private storage: Storage,
    private authService: AuthService
  ) {}

  async uploadImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `${user.id}_${timestamp}_${file.name}`;
      const storageRef = ref(this.storage, `christmas-items/${fileName}`);

      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { success: true, url: downloadURL };
    } catch (error: any) {
      console.error('Error uploading image:', error);
      return { success: false, error: error.message };
    }
  }

  async uploadImageFromInput(input: HTMLInputElement): Promise<{ success: boolean; url?: string; error?: string }> {
    if (!input.files || input.files.length === 0) {
      return { success: false, error: 'No file selected' };
    }

    const file = input.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Please select an image file' };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'Image size must be less than 5MB' };
    }

    return this.uploadImage(file);
  }
}
