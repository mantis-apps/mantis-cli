import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  getBackendBaseUrl(): string {
    return '/api/v1';
  }
}
