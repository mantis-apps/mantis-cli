import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  getBackendBaseUrl(): string {
    return environment.backendBaseUrl;
  }
}
