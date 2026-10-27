import { environment } from '@env/environment';

const base = environment.API;

/** Single registry of every backend endpoint. Services never hardcode URLs. */
export const API = {
  suppliers: {
    list: `${base}/suppliers/all`,
    detail: (id: string) => `${base}/suppliers/${id}`,
    create: `${base}/suppliers/create`,
  },
  mappingProfiles: {
    create: `${base}/mapping-profiles`,
  },
  feeds: {
    upload: `${base}/feeds`,
    detail: (id: string) => `${base}/feeds/${id}`,
  },
  users: {
    list: `${base}/users`,
    updateRole: (userId: string) => `${base}/users/${userId}/role`,
  },
};
