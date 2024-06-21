import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  getBackendBaseUrl(): string {
    return `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/v1`;
  }
}
