const fs = require('fs');
const path = require('path');
const { register3DModel } = require('../dist/main');

async function testModelRegistration() {
  try {
    // Sample metadata for a test 3D model
    const sampleModelMetadata = {
      name: "Sample 3D Model",
      description: "A test 3D model for our marketplace",
      // Using a small text file as a mock 3D model for testing
      modelFile: Buffer.from("This is a mock 3D model file"),
      previewImage: "https://placehold.co/600x400",
      attributes: {
        category: "Test",
        format: "GLB",
        polygonCount: 1000,
        textures: true,
        animations: false
      }
    };

    console.log("Starting 3D model registration...");
    const result = await register3DModel(sampleModelMetadata);
    
    console.log("\nRegistration successful!");
    console.log("IP Asset ID:", result.ipId);
    console.log("Transaction Hash:", result.txHash);
    console.log("Explorer URL:", result.explorerUrl);
    console.log("Model URL:", result.modelUrl);
    
  } catch (error) {
    console.error("Error registering 3D model:", error);
  }
}

// Run the test
testModelRegistration();
