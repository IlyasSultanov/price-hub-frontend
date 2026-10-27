export const environment = {
  production: true,
  API: `${location.origin}/api/v1`,
  keycloak: {
    url: 'https://__set_me__',
    realm: 'price-hub',
    clientId: 'price-hub-frontend',
  },
};
