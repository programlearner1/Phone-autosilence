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
try {
  if (vapidKey) {
    atob(vapidKey.split('.')[1] || ''); // Test if the key is base64 encoded
  }
} catch (error) {
  console.error('\n❌ Invalid VAPID key format. The key should be a valid base64-encoded string.');
  process.exit(1);
}

console.log('✅ All environment variables are properly configured!\n'); 