# Modelle Webcam

Production Next.js App Router website for `modellewebcam.com`.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Environment Variables

The public UI uses internal `/go/*` routes for external destinations.

```bash
MODEL_PROVIDER=chaturbate
CHATURBATE_API_BASE_URL=https://chaturbate.com/api/public/affiliates/onlinerooms/
CHATURBATE_WM=
CHATURBATE_LIMIT=100
CHATURBATE_FORMAT=json
CHATURBATE_USE_REVSHARE=true
LIVE_DESTINATION_URL=
MODEL_DESTINATION_URL=
MODEL_SIGNUP_URL=
```

`MODEL_DESTINATION_URL` may include `{id}` for model-specific redirects.
