import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  getBackendBaseUrl(): string {
    return 'http://localhost:3000/api';
  }
}
