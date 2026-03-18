# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
# pfhard1

## AI backend (starter)

This project now includes a local backend scaffold for AI integration.

### 1) Configure environment

- Create `.env` in the project root using `.env.example`.
- Create `backend/.env` using `backend/.env.example`.

Root `.env`:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8787
```

Backend `backend/.env`:

```bash
PORT=8787
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

### 2) Start backend

```bash
npm run backend:start
```

Health check:

```bash
curl http://localhost:8787/api/health
```

### 3) Start app

```bash
npx expo start
```

### Available backend endpoints

- `GET /api/health`
- `POST /api/ai/reflect`
- `POST /api/ai/interpret-moment`
- `POST /api/ai/interpret-parent-options`

## Run app with local AI backend

1. Configure root app env:
   - Create `.env` if missing (copy from `.env.example`).
   - Set:
   ```bash
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.247:8787
   ```
2. Configure backend env:
   - Create `backend/.env` if missing (copy from `backend/.env.example`).
   - In `backend/.env`, set your real `OPENAI_API_KEY` locally (do not commit it).
3. Start backend:
   ```bash
   npm run backend:start
   ```
4. Verify backend is reachable:
   ```bash
   curl http://192.168.1.247:8787/api/health
   ```
5. Start Expo app:
   ```bash
   npx expo start
   ```
