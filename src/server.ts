import { createApp } from "./app";
import { appConfig } from "./config";

const app = createApp();

const server = app.listen(appConfig.port, () => {
  console.log(`🚀 DEC_L API Server running on port ${appConfig.port}`);
  console.log(`📝 Environment: ${appConfig.env}`);
  console.log(
    `🔗 API Base URL: http://localhost:${appConfig.port}${appConfig.apiPrefix}`
  );
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
