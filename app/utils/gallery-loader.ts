import fs from "fs";
import path from "path";

const GALLERY_BASE_PATH = path.join(process.cwd(), "public", "gallery");
const SUPPORTED_IMAGE_EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png", ".gif"]; // prefer .webp ordering

/**
 * Loads all images from a service's gallery directory
 * @param serviceId - The service ID (matches the folder name in public/gallery/)
 * @returns Array of gallery items with src and alt text
 */
export function loadServiceGallery(
  serviceId: string
): { src: string; alt: string }[] {
  const galleryPath = path.join(GALLERY_BASE_PATH, serviceId);

  // Check if gallery directory exists
  if (!fs.existsSync(galleryPath)) {
    console.warn(`Gallery directory not found for service: ${serviceId}`);
    return [];
  }

  try {
    // Read all files in the gallery directory
    const files = fs.readdirSync(galleryPath);

    // Filter for image files and sort them
    const imageFiles = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return SUPPORTED_IMAGE_EXTENSIONS.includes(ext);
      })
      .sort((a, b) => {
        // Extract numbers from filenames for natural sorting
        const aMatch = a.match(/\d+/);
        const bMatch = b.match(/\d+/);
        if (aMatch && bMatch) {
          return parseInt(aMatch[0]) - parseInt(bMatch[0]);
        }
        return a.localeCompare(b);
      });

    // Map to gallery items
    return imageFiles.map((file, index) => {
      const src = `/gallery/${serviceId}/${file}`;
      // Generate a friendly alt text from the service ID and index
      const alt = `${serviceId.replace(/_/g, " ")} image ${index + 1}`;
      return { src, alt };
    });
  } catch (error) {
    console.error(`Error loading gallery for service ${serviceId}:`, error);
    return [];
  }
}

/**
 * Mapping of service IDs to their gallery folder names
 * This allows flexibility if service IDs don't match folder names exactly
 */
export const SERVICE_GALLERY_MAPPING: Record<string, string> = {
  truss: "truss_setup_manufacturing",
  fabrication: "fabrication_works",
  grill: "grill_and_shutter",
  "pravesh-dwar": "dewanjee_pravesh_dwar",
  roofing: "dewanjee_steel_shedding_solutions",
  furniture: "dewanjee_furniture",
  kitchen: "kitchen_and_interior_makeover",
  shedding: "shedding_works",
};

/**
 * Get gallery images for a service using the mapping
 * @param serviceId - The service ID from the URL
 * @returns Array of gallery items
 */
export function getServiceGalleryImages(
  serviceId: string
): { src: string; alt: string }[] {
  const galleryFolderName = SERVICE_GALLERY_MAPPING[serviceId];
  if (!galleryFolderName) {
    console.warn(`No gallery mapping found for service: ${serviceId}`);
    return [];
  }
  return loadServiceGallery(galleryFolderName);
}

