import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  // You'll need to sign up for a free account at https://cloudinary.com/
  // and get your cloud name and upload preset
  private readonly CLOUD_NAME = 'dqtmaiv3b'; // Your cloud name
  private readonly UPLOAD_PRESET = 'christmas-list-uploads'; // Replace with your actual upload preset name
  private readonly UPLOAD_URL = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<{ success: boolean; url?: string; error?: string }> {
    if (!this.CLOUD_NAME) {
      return throwError(() => new Error('Please configure your Cloudinary credentials'));
    }

    // Validate file
    if (!file) {
      return throwError(() => new Error('No file selected'));
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return throwError(() => new Error('Please select an image file'));
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return throwError(() => new Error('Image size must be less than 10MB'));
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.UPLOAD_PRESET);
    formData.append('cloud_name', this.CLOUD_NAME);
    formData.append('folder', 'christmas-list'); // Organize uploads in a folder

    return this.http.post<CloudinaryUploadResponse>(this.UPLOAD_URL, formData).pipe(
      map(response => {
        console.log('Cloudinary upload response:', response);
        return {
          success: true,
          url: response.secure_url
        };
      }),
      catchError(error => {
        console.error('Cloudinary upload error:', error);
        return throwError(() => new Error('Failed to upload image. Please try again.'));
      })
    );
  }

  uploadImageFromInput(input: HTMLInputElement): Observable<{ success: boolean; url?: string; error?: string }> {
    if (!input.files || input.files.length === 0) {
      return throwError(() => new Error('No file selected'));
    }

    const file = input.files[0];
    return this.uploadImage(file);
  }

  // Helper method to validate if Cloudinary is configured
  isConfigured(): boolean {
    return this.CLOUD_NAME && this.CLOUD_NAME.length > 0 && 
           this.UPLOAD_PRESET && this.UPLOAD_PRESET.length > 0;
  }
}
