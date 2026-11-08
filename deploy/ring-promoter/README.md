# Deploying thaivisaexperts.com

The site is a static Next.js export on **GitHub Pages**, released through
[Ring Promoter](https://rp.workstation.co.uk/?app=thaivisaexperts) (`workstation-ring-promoter`
on k3s1). This follows the same setup as the vyltzero / nebuladb marketing sites.

| Ring   | URL                          | How it gets there                             |
| ------ | ---------------------------- | --------------------------------------------- |
| `prod` | https://thaivisaexperts.com/ | Seeded automatically when CI passes on `main` |

`www.thaivisaexperts.com` redirects to the apex (GitHub Pages does this because
`apps/web/public/CNAME` names the apex).

## How a release flows

```
merge to main ─► ci.yml (format, lint, typecheck, tests, build, e2e)
                   │ success
                   ▼
              seed-ring-promoter.yml ─► POST rp.workstation.co.uk/api/apps/thaivisaexperts/seed
                                          {ring: prod, version: <commit sha>}
                                                     │
Ring Promoter (github deployer) ◄────────────────────┘
  workflow_dispatch pages.yml  DEPLOY_BRANCH=<sha>
    ├─ pnpm build, stamps apps/web/out/version.json {"version": "<sha>"}
    └─ actions/deploy-pages  ─► GitHub Pages
  health: https://thaivisaexperts.com/version.json .version == <sha>
```

If Ring Promoter is unreachable (no `RP_API_TOKEN`, or the app is not registered,
HTTP 404), the seed workflow dispatches `pages.yml` directly, so a green `main`
still goes live.

## DNS

The `thaivisaexperts.com` zone is on Cloudflare (registrar: Namecheap).
`deploy/dns/thaivisaexperts.com.records` is the source of truth, applied by
`.github/workflows/dns.yml` on every change (idempotent; it removes conflicting
A/AAAA records such as the old Wix ones).

| Name                      | Type  | Content            | Proxied |
| ------------------------- | ----- | ------------------ | ------- |
| `thaivisaexperts.com`     | CNAME | `bwalia.github.io` | no      |
| `www.thaivisaexperts.com` | CNAME | `bwalia.github.io` | no      |

Keep both records grey-clouded (unproxied), or GitHub Pages cannot issue the TLS certificate.

## Files

| File                                        | What it is                                                   |
| ------------------------------------------- | ------------------------------------------------------------ |
| `deploy/ring-promoter/thaivisaexperts.yaml` | The RP app (`deployer: github`, one `prod` ring)             |
| `.github/workflows/pages.yml`               | Build + publish to Pages (dispatched by RP)                  |
| `.github/workflows/seed-ring-promoter.yml`  | Seeds RP after CI on `main`; falls back to a direct dispatch |
| `.github/workflows/dns.yml`                 | Applies the Cloudflare records                               |
| `deploy/dns/thaivisaexperts.com.records`    | Cloudflare records                                           |
| `apps/web/public/CNAME`                     | GitHub Pages custom domain                                   |

## One-time setup (done 2026-11-08)

1. GitHub Pages: source **GitHub Actions**, custom domain `thaivisaexperts.com`, enforce HTTPS.
2. Repo secrets on `bwalia/thaivisaexperts.com`: `RP_API_TOKEN` (from Secret
   `workstation-ring-promoter/ring-promoter`), `CLOUDFLARE_API_TOKEN` (Zone:DNS:Edit on the zone).
3. `RP_GITHUB_TOKEN` on Secret `ring-promoter` must have actions:write + contents:read on this repo.
4. Register the app: append the `apps:` item from `thaivisaexperts.yaml` to
   `workstation-ring-promoter/ring-promoter-config` (`data.config.yaml`), then
   `kubectl rollout restart deploy/ring-promoter -n workstation-ring-promoter`.

## Day to day

- **Ship:** merge to `main`. CI passes, then RP deploys and checks the version.
- **Roll back:** Rollback on the `prod` ring in the RP UI (redeploys the previous SHA).
- **Manual deploy of a specific commit:** Actions → _Seed Ring Promoter_ → Run workflow → `VERSION=<sha>`.
- **Check what's live:** `curl -s https://thaivisaexperts.com/version.json`
