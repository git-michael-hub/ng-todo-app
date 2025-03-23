import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200', // Your Angular app's development URL
    supportFile: false
  },
  viewportWidth: 1440,
  viewportHeight: 900
});
