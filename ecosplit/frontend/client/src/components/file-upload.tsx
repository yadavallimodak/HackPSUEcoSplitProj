import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type FileUploadProps = {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string[];
  maxSize?: number;
  className?: string;
};

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'],
  maxSize = 5 * 1024 * 1024, // 5MB default
  className = '',
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const onDropRejected = useCallback((fileRejections: any[]) => {
    const rejection = fileRejections[0];
    if (rejection) {
      if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
        toast({
          title: 'File too large',
          description: `The file exceeds the maximum size of ${maxSize / (1024 * 1024)}MB`,
          variant: 'destructive',
        });
      } else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a JPG, PNG, or PDF file',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Upload failed',
          description: 'There was an error uploading your file',
          variant: 'destructive',
        });
      }
    }
  }, [toast, maxSize]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize,
    multiple: false,
  });

  const handleCameraCapture = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    // Add event listener
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    };
    
    // Trigger the input
    input.click();
  };

  return (
    <div className={className}>
      <div 
        {...getRootProps()} 
        className={`w-full border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-150 
          ${isDragActive ? 'border-green-800 bg-green-50' : 'border-gray-300 hover:border-green-700'} 
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-700">Drag and drop a file here, or</p>
          <div className="mt-4">
            <Button 
              type="button" 
              className="px-6 py-2 bg-green-800 hover:bg-green-700"
            >
              Choose File
            </Button>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            className="mt-3 px-6 py-2 border-green-800 text-green-800 hover:bg-green-50"
            onClick={(e) => {
              e.stopPropagation();
              handleCameraCapture();
            }}
          >
            <Camera className="h-4 w-4 mr-2" />
            Take Photo
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Accepted file types: JPG, PNG, PDF
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
