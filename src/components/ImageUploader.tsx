
import { useState, useRef, useEffect } from 'react';
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
  initialImage?: string | null;
}

const ImageUploader = ({
  onImageSelect,
  label = 'Upload Image',
  className,
  imagePreviewClassName,
  multiple = false,
  accept = 'image/jpeg, image/png, image/jpg',
  initialImage = null
}: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If there's an initialImage, simulate the onImageSelect to ensure parent components know there's an image
  useEffect(() => {
    if (initialImage && fileInputRef.current && fileInputRef.current.files?.length === 0) {
      console.log('ImageUploader: Initial image detected, notifying parent component');
      // Create a mock file to notify the parent component
      fetch(initialImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "initial-image.jpg", {
            type: "image/jpeg",
          });
          onImageSelect(file);
        })
        .catch(err => {
          console.error('ImageUploader: Error processing initial image', err);
        });
    }
  }, [initialImage, onImageSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(`ImageUploader: File selected via input: ${file.name}`);
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setIsLoading(true);
    console.log(`ImageUploader: Processing image file: ${file.name}, size: ${file.size / 1024}KB, type: ${file.type}`);
    
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
      try {
        const result = reader.result as string;
        setPreview(result);
        console.log('ImageUploader: Image preview created successfully');
        
        // Pass file to parent component
        onImageSelect(file);
        console.log('ImageUploader: File passed to parent component:', file.name);
        
        setIsLoading(false);
        
        // Show toast notification to confirm image upload
        toast({
          title: "Image uploaded successfully",
          description: "Your image is ready for analysis.",
        });
      } catch (err) {
        console.error('ImageUploader: Error in FileReader onload:', err);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to process the image. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    reader.onerror = (error) => {
      console.error('ImageUploader: Error creating image preview:', error);
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
      console.log(`ImageUploader: File dropped: ${file.name}`);
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
    console.log('ImageUploader: Clearing image preview');
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Notify parent that image has been cleared by passing null
    // This should trigger the parent component to handle removal of the image
    // Note: Since we can't pass null with the current type definition, we'll create an empty blob
    const emptyBlob = new Blob([], { type: 'image/png' });
    const emptyFile = new File([emptyBlob], 'empty.png', { type: 'image/png' });
    onImageSelect(emptyFile);
    
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
          <p className="font-medium mb-1 text-foreground">{label}</p>
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
