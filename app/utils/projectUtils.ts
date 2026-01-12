/**
 * Utility functions for project-related operations
 */

/**
 * Image counts for each project folder
 */
export const PROJECT_IMAGE_COUNTS: Record<string, number> = {
  amazon: 19,
  natura: 9,
  royalcanin: 16,
  talent: 20,
};

/**
 * Get formatted title from folder name
 */
export function getEventTitle(folderName: string): string {
  const titleMap: Record<string, string> = {
    amazon: "Amazon",
    natura: "Natura",
    royalcanin: "Royal Canin",
    talent: "Talent",
  };

  return (
    titleMap[folderName] ||
    folderName.charAt(0).toUpperCase() + folderName.slice(1)
  );
}

/**
 * Get all image paths for a project folder
 */
export function getFolderImages(folderName: string): string[] {
  const count = PROJECT_IMAGE_COUNTS[folderName] || 0;
  const images: string[] = [];

  for (let i = 1; i <= count; i++) {
    const imageNumber = String(i).padStart(3, "0");
    images.push(
      `/images/projects/${folderName}/${folderName}_${imageNumber}.jpg`
    );
  }

  return images;
}
