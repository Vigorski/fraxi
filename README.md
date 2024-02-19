# Fraxi

## Commands

### Development server
Run the following command to start the development server:
```bash
npm start
```

### Production build
Run the following command to start a one-off production build:
```bash
npm run build
```

Run the following command to build the project and deploy changes to the firebase hosting service. Any changes to the `.env` file will be updated with the deploy.
```bash
npm run build:deploy
```

## Configuration

### Environment variables
In order to run the application locally, some environment configuration is required. Create a `.env` file at the root of the project with the required values.
The environment variables are handled with the package `env-cmd`. In order to update the variables on the firebase hosting service, the app needs to be built and deployed (Refer to the Commands section).
Example `.env` structure:

```
# Google maps
REACT_APP_GOOGLE_MAPS_API_KEY=string
REACT_APP_GOOGLE_MAP_ID=string

# Firebase
REACT_APP_FIREBASE_API_KEY=string
REACT_APP_FIREBASE_AUTH_DOMAIN=string
REACT_APP_FIREBASE_DATABASE_URL=string
REACT_APP_FIREBASE_PROJECT_ID=string
REACT_APP_FIREBASE_STORAGE_BUCKET=string
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=string
REACT_APP_FIREBASE_APP_ID=string
REACT_APP_FIREBASE_MEASUREMENT_ID=string
```

### Store
The app uses Redux and Redux Toolkit to handle the store.