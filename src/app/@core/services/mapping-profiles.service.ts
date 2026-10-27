import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API } from '@core/api';
import { CreateMappingProfileRequest, MappingProfile } from '@core/models/mapping-profile.model';
import { BackendService } from '@core/services/backend.service';

/** There's no list/detail endpoint on the backend yet — a profile is only
 *  ever known to the UI right after creating it. */
@Injectable({ providedIn: 'root' })
export class MappingProfilesService {
  private readonly backend = inject(BackendService);

  createProfile(payload: CreateMappingProfileRequest): Observable<MappingProfile> {
    return this.backend.post<MappingProfile>(API.mappingProfiles.create, payload, {
      successMessage: 'Mapping profile saved',
    });
  }
}
