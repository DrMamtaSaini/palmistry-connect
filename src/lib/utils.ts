
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to ensure text has good contrast with background
export function ensureTextContrast(text: string, backgroundColor: string = '#ffffff'): string {
  // If background is light, use dark text; if background is dark, use light text
  // This is a simple implementation - for more complex cases, use a color contrast algorithm
  const isLightBackground = backgroundColor.toLowerCase() === '#ffffff' || 
                            backgroundColor.toLowerCase() === '#fff' ||
                            backgroundColor.startsWith('rgb(2') || 
                            backgroundColor.startsWith('rgba(2');
                            
  return isLightBackground ? '#000000' : '#ffffff';
}
