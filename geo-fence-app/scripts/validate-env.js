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

// Validate Firebase API Key
const firebaseApiKey = process.env.REACT_APP_FIREBASE_API_KEY;
if (firebaseApiKey) {
  // Firebase API keys typically start with 'AIza'
  if (!firebaseApiKey.startsWith('AIza')) {
    console.error('\n❌ Invalid Firebase API key format.');
    console.error('Firebase API key should:');
    console.error('1. Start with "AIza"');
    console.error('2. Be copied exactly as shown in Firebase Console > Project Settings > Web API Key\n');
    process.exit(1);
  }
}

// Validate Project ID
const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
if (projectId) {
  // Project ID should only contain lowercase letters, numbers, and hyphens
  if (!/^[a-z0-9-]+$/.test(projectId)) {
    console.error('\n❌ Invalid Firebase Project ID format.');
    console.error('Project ID should only contain lowercase letters, numbers, and hyphens.\n');
    process.exit(1);
  }
}

// Validate VAPID key format
const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
if (vapidKey) {
  // VAPID key should be a URL-safe base64 string and typically starts with 'B'
  const isValidVapidKey = /^B[A-Za-z0-9_-]+$/.test(vapidKey);
  if (!isValidVapidKey) {
    console.error('\n❌ Invalid VAPID key format. The key should be the public key from Firebase Cloud Messaging.');
    console.error('The VAPID key should:');
    console.error('1. Start with the letter "B"');
    console.error('2. Contain only letters, numbers, underscores, and hyphens');
    console.error('3. Be copied exactly as shown in Firebase Console > Project Settings > Cloud Messaging > Web Push certificates\n');
    process.exit(1);
  }
}

// Log all environment variables (without their values) for debugging
console.log('\n📋 Configured environment variables:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Show first 6 and last 4 characters of the value, rest as ...
    const truncatedValue = value.length > 10 
      ? `${value.substring(0, 6)}...${value.substring(value.length - 4)}`
      : value;
    console.log(`   - ${varName}: ✓ (${truncatedValue})`);
  } else {
    console.log(`   - ${varName}: ✗`);
  }
});

console.log('\n✅ All environment variables are properly configured!\n'); 