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
MODEL_API_URL=
LIVEJASMIN_MODEL_API_URL=
LIVE_DESTINATION_URL=
MODEL_DESTINATION_URL=
MODEL_SIGNUP_URL=
```

`MODEL_DESTINATION_URL` may include `{id}` for model-specific redirects.
