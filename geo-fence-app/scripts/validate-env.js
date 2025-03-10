const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID',
  'REACT_APP_FIREBASE_MEASUREMENT_ID',
  'REACT_APP_FIREBASE_VAPID_KEY',
  'REACT_APP_OPENCAGE_API_KEY',
  'REACT_APP_API_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('\n❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nPlease set these variables in your Netlify environment settings or .env file.\n');
  process.exit(1);
}

// Validate VAPID key format
const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
if (vapidKey) {
  // VAPID key should be a URL-safe base64 string
  const isValidVapidKey = /^[A-Za-z0-9_-]+$/.test(vapidKey);
  if (!isValidVapidKey) {
    console.error('\n❌ Invalid VAPID key format. The key should be the public key from Firebase Cloud Messaging.');
    console.error('Please make sure you are using the public key from Firebase Console > Project Settings > Cloud Messaging > Web Push certificates.\n');
    process.exit(1);
  }
}

console.log('✅ All environment variables are properly configured!\n'); 