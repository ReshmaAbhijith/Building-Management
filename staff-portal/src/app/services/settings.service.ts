import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BuildingSettings } from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private _settings = signal<BuildingSettings>({
    id: 'building_1',
    buildingName: 'Sunset Towers',
    address: '123 Main Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    numberOfFloors: 12,
    numberOfUnits: 48,
    logoUrl: undefined,
    contactEmail: 'management@sunsettowers.com',
    contactPhone: '+1-555-0100',
    emergencyPhone: '+1-555-0911',
    updatedAt: new Date('2024-01-01'),
    updatedBy: 'System'
  });

  public settings = this._settings.asReadonly();

  getSettings(): Observable<BuildingSettings> {
    return of(this._settings()).pipe(delay(300));
  }

  updateSettings(updates: Partial<BuildingSettings>, updatedBy: string): Observable<BuildingSettings> {
    const currentSettings = this._settings();
    const updatedSettings: BuildingSettings = {
      ...currentSettings,
      ...updates,
      updatedAt: new Date(),
      updatedBy
    };

    this._settings.set(updatedSettings);
    return of(updatedSettings).pipe(delay(500));
  }

  uploadLogo(logoFile: File): Observable<string> {
    // Mock logo upload - in real app would upload to cloud storage
    const mockUrl = `assets/logos/${logoFile.name}`;
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(mockUrl);
        observer.complete();
      }, 1000);
    });
  }
}
