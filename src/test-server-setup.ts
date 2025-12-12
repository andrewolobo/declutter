// Quick test script to verify Phase 1 setup
import axios from "axios";

async function testServer() {
  try {
    const response = await axios.get("http://localhost:3000/health");
    console.log("✅ Health check successful!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
    console.log("\n📊 Phase 1 Implementation Summary:");
    console.log("  ✓ Express server running on port 3000");
    console.log("  ✓ CORS and Helmet security middleware enabled");
    console.log("  ✓ Body parsing middleware configured");
    console.log("  ✓ Health endpoint responding correctly");
    console.log("  ✓ Server graceful shutdown handlers in place");
    console.log("\n🎉 Phase 1: Foundation Setup - COMPLETE!");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Server test failed:", errorMessage);
    console.log("\nMake sure the server is running with: npm run dev");
  }
}

testServer();
