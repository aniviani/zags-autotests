import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './src/tests',
  timeout: 30000,
  fullyParallel: false,
  retries: 1,
  workers: 1,
  
  reporter: 'html',
  
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    
    // HTTP authentication
    httpCredentials: {
      username: process.env.HTTP_USERNAME || 'user',
      password: process.env.HTTP_PASSWORD || 'senlatest',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});