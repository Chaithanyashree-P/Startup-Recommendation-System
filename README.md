# Gram Udyam AI

## Run locally

Install the frontend dependencies and start the Next.js app:

```bash
npm ci
npm run dev
```

The frontend is available at [http://localhost:3000](http://localhost:3000). To run the FastAPI backend, install its dependencies and start it in a second terminal:

```bash
cd backend
python -m pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Deploy

The web app is a Next.js app and the API is a separate FastAPI service.

1. Import this GitHub repository into [Vercel](https://vercel.com/new). Keep the project root at the repository root and use the default Next.js build settings.
2. In Vercel project settings, add `NEXT_PUBLIC_BACKEND_URL` with the public URL of the API service, then redeploy the web app.
3. In [Render](https://dashboard.render.com/), create a Blueprint from this repository and deploy the `startup-recommendation-system-api` web service defined in `render.yaml`. Its health endpoint is `/`.
4. Copy the Render service URL into Vercel's `NEXT_PUBLIC_BACKEND_URL`. Optional third-party API keys can be added as Render environment variables; never commit them to the repository.

Without `NEXT_PUBLIC_BACKEND_URL`, the frontend falls back to local data and attempts to reach `http://localhost:8000` for backend features.
