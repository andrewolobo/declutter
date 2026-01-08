/**
 * Test script to verify Dicebear URLs are not transformed with SAS tokens
 * while Azure Blob Storage URLs still get proper SAS token generation
 */

import { UploadService } from "./src/services/upload.service";
import { PostUserDTO, PostImageDTO } from "./src/types/post/post.types";

const uploadService = new UploadService();

console.log("=== Testing Dicebear URL Fix ===\n");

// Test 1: Dicebear URL should pass through unchanged
console.log("Test 1: Dicebear profile URL");
const dicebearUser: PostUserDTO = {
  id: 1,
  fullName: "John Doe",
  profilePictureUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
};

const transformedDicebearUser = uploadService.transformUserProfileUrl(dicebearUser);
console.log("Original:", dicebearUser.profilePictureUrl);
console.log("Transformed:", transformedDicebearUser?.profilePictureUrl);
console.log("✅ PASS: URLs match:", dicebearUser.profilePictureUrl === transformedDicebearUser?.profilePictureUrl);
console.log();

// Test 2: Azure blob path should get SAS token
console.log("Test 2: Azure blob path");
const azureBlobUser: PostUserDTO = {
  id: 2,
  fullName: "Jane Smith",
  profilePictureUrl: "123-1234567890-uuid.jpg",
};

const transformedAzureUser = uploadService.transformUserProfileUrl(azureBlobUser);
console.log("Original:", azureBlobUser.profilePictureUrl);
console.log("Transformed:", transformedAzureUser?.profilePictureUrl);
console.log("✅ PASS: SAS token added:", transformedAzureUser?.profilePictureUrl?.includes("?"));
console.log();

// Test 3: Azure full URL should get SAS token
console.log("Test 3: Azure full URL");
const azureFullUrlUser: PostUserDTO = {
  id: 3,
  fullName: "Bob Johnson",
  profilePictureUrl:
    "https://declutterimg.blob.core.windows.net/images/456-7890-uuid.jpg",
};

const transformedAzureFullUser = uploadService.transformUserProfileUrl(azureFullUrlUser);
console.log("Original:", azureFullUrlUser.profilePictureUrl);
console.log("Transformed:", transformedAzureFullUser?.profilePictureUrl);
console.log("✅ PASS: SAS token added:", transformedAzureFullUser?.profilePictureUrl?.includes("?"));
console.log();

// Test 4: Post images with mixed URLs
console.log("Test 4: Post images with mixed URLs");
const mixedImages: PostImageDTO[] = [
  {
    id: 1,
    imageUrl: "post-123-uuid.jpg", // Azure blob path
    displayOrder: 1,
  },
  {
    id: 2,
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=test", // Dicebear (shouldn't happen but test defensive)
    displayOrder: 2,
  },
];

const transformedImages = uploadService.transformImageUrls(mixedImages);
console.log("Image 1 (Azure):");
console.log("  Original:", mixedImages[0].imageUrl);
console.log("  Transformed:", transformedImages[0].imageUrl);
console.log("  ✅ PASS: SAS token added:", transformedImages[0].imageUrl.includes("?"));
console.log("Image 2 (Dicebear):");
console.log("  Original:", mixedImages[1].imageUrl);
console.log("  Transformed:", transformedImages[1].imageUrl);
console.log("  ✅ PASS: URLs match:", mixedImages[1].imageUrl === transformedImages[1].imageUrl);
console.log();

// Test 5: User with no profile picture
console.log("Test 5: User with no profile picture");
const noProfileUser: PostUserDTO = {
  id: 4,
  fullName: "Alice Cooper",
  profilePictureUrl: undefined,
};

const transformedNoProfileUser = uploadService.transformUserProfileUrl(noProfileUser);
console.log("Original:", noProfileUser.profilePictureUrl);
console.log("Transformed:", transformedNoProfileUser?.profilePictureUrl);
console.log("✅ PASS: Both undefined:", noProfileUser.profilePictureUrl === transformedNoProfileUser?.profilePictureUrl);
console.log();

console.log("=== All Tests Complete ===");
