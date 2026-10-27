# PriceHub frontend

A small Angular UI for the [price-hub](../price-hub) backend: upload a
supplier's CSV price list, configure how its columns map to offer fields,
and manage suppliers/users. Login is handled entirely by Keycloak (the
browser talks to it directly via Authorization Code + PKCE) — there is no
in-app login form, and the backend never sees a password.

# 1) Deploy local

### a) app at host

- `pnpm i`
- `pnpm start` (serves on port 4201, not Angular's default 4200 — that's
  taken by `newapp.frontend` when both projects run side by side)

### b) app in a container

- `make build-loc`

# Usage

- `127.0.0.1:4201` — app (start `price-hub`'s backend first: `make docker-up`
  in that repo)
- Log in with a Keycloak account in the realm `price-hub` that has one of
  the app roles (`supplier_manager`, `catalog_admin`, `system_admin`) —
  accounts and roles are managed in Keycloak, never in this UI.
- A `supplier_manager` account needs a `supplier_id` user attribute
  (mapped into its token as the `supplier_id` claim) pointing at the
  supplier it manages — that's how the backend scopes feeds/mapping
  profiles to "your own supplier" without a picker.
