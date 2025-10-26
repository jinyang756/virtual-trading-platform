// Mock for import.meta.env
const env = {
  VITE_API_BASE: 'http://localhost:3001',
  VITE_APP_NAME: 'Virtual Trading Platform'
};

// Mock the entire import.meta object
const importMeta = {
  env: env
};

module.exports = importMeta;