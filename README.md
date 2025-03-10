# Phone Silencer App

A geofencing application that automatically manages phone settings based on location.

## Security Notice

This application uses several sensitive API keys and tokens. Never commit actual API keys to the repository. Instead:

1. Copy `.env.example` to `.env` in both `geo-fence-app` and `location-sms-backend` directories
2. Fill in your actual API keys in the `.env` files
3. Keep your `.env` files private and never commit them

## Setup Instructions

### Frontend (geo-fence-app)

1. Install dependencies:
```bash
cd geo-fence-app
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your actual API keys for:
- OpenCage API (for geocoding)
- Firebase Configuration
- Firebase Cloud Messaging (FCM)

3. Start the development server:
```bash
npm start
```

### Backend (location-sms-backend)

1. Install dependencies:
```bash
cd location-sms-backend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your actual credentials for:
- Telegram Bot
- Twilio SMS
- Email service

3. Set up Firebase Admin:
- Get your Firebase service account key from Firebase Console
- Save it as `serviceAccountKey.json` in the backend directory
- Never commit this file

4. Start the backend server:
```bash
npm start
```

## Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build/`
   - Base directory: `geo-fence-app/`

3. Set up environment variables in Netlify:
   - Go to Site settings > Build & deploy > Environment
   - Add all variables from `.env.production`
   - Make sure to use the production API URL

4. Enable Forms (if using Netlify Forms):
   - Go to Site settings > Forms
   - Enable form detection

5. Configure custom domain (optional):
   - Go to Site settings > Domain management
   - Add your custom domain
   - Set up SSL certificate

### Handling 404 Errors

The `netlify.toml` configuration includes proper redirects for client-side routing. If you still see 404 errors:

1. Check that `netlify.toml` is in the root directory
2. Verify the redirects section is properly configured
3. Clear the Netlify cache and trigger a new deploy

## Features

- Geofence creation and management
- Automatic phone silencing in designated zones
- Push notifications via Firebase Cloud Messaging
- SMS notifications via Twilio
- Telegram notifications
- Email notifications

## Security Best Practices

1. Use environment variables for all sensitive data
2. Keep `.env` files out of version control
3. Regularly rotate API keys and tokens
4. Use secure HTTPS endpoints in production
5. Implement proper authentication and authorization

## Troubleshooting

If you encounter a 404 error:
1. Make sure all routes are properly defined in your React application
2. Verify the `netlify.toml` configuration
3. Check that the build process completed successfully
4. Review the Netlify deployment logs for any errors 