
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  label?: string;
  className?: string;
  imagePreviewClassName?: string;
  multiple?: boolean;
  accept?: string;
}

const ImageUploader = ({
  onImageSelect,
  label = 'Upload Image',
  className,
  imagePreviewClassName,
  multiple = false,
  accept = 'image/jpeg, image/png, image/jpg'
}: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setIsLoading(true);
    console.log(`Processing image file: ${file.name}, size: ${file.size / 1024}KB, type: ${file.type}`);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, JPG).",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size exceeds 10MB. Please choose a smaller image.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      console.log('Image preview created successfully');
      
      // Save to session storage
      try {
        sessionStorage.setItem('palmImage', result);
        console.log('Image saved to session storage');
      } catch (err) {
        console.error('Error saving image to session storage:', err);
        // If session storage fails, continue anyway
      }
      
      // Pass file to parent component
      onImageSelect(file);
      setIsLoading(false);
    };
    
    reader.onerror = (error) => {
      console.error('Error creating image preview:', error);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, JPG).",
        variant: "destructive"
      });
    }
  };

  const clearImage = () => {
    console.log('Clearing image preview');
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Reset session storage if it exists
    if (sessionStorage.getItem('palmImage')) {
      console.log('Removing stored palm image from session storage');
      sessionStorage.removeItem('palmImage');
      sessionStorage.removeItem('palmReadingResult');
    }

    toast({
      title: "Image cleared",
      description: "The uploaded image has been removed."
    });
  };

  return (
    <div className={cn("w-full", className)}>
      {preview ? (
        <div className="relative">
          <div className={cn(
            "relative rounded-xl overflow-hidden bg-muted/20",
            imagePreviewClassName
          )}>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 rounded-full bg-foreground/10 backdrop-blur-sm text-background hover:bg-foreground/20 transition-colors"
              aria-label="Clear image"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/20",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload image"
        >
          <div className="p-3 rounded-full bg-primary/10 mb-4">
            {isLoading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : isDragging ? (
              <ImageIcon className="h-6 w-6 text-primary animate-pulse" />
            ) : (
              <Upload className="h-6 w-6 text-primary" />
            )}
          </div>
          <p className="font-medium mb-1">{label}</p>
          <p className="text-sm text-muted-foreground mb-4">
            {isDragging ? 'Drop image here' : 'Drag and drop or click to upload'}
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG or JPEG (max. 10MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            multiple={multiple}
            className="hidden"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
