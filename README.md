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

The [Render Blueprint](./render.yaml) deploys both the Next.js frontend and FastAPI backend on the free plan. Create a Blueprint in [Render](https://dashboard.render.com/) from this repository's public GitHub URL; the frontend's `NEXT_PUBLIC_BACKEND_URL` is configured to point to the API service.

Free Render services spin down when idle, so their first request after inactivity may take around 50 seconds. If the repository is connected as a public URL rather than through Render's GitHub integration, use Manual Deploy after pushing updates. Optional third-party API keys can be added as Render environment variables; never commit them to the repository.
