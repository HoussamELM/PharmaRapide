'use client';

import { useState } from 'react';
import { uploadImageToImgBB, ImgBBResponse } from '@/lib/imgbb';

export default function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<ImgBBResponse['data'] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadImageToImgBB(selectedFile);
      setUploadedImage(result.data);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Image Upload Demo</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Select Image
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {selectedFile && (
          <div className="text-sm text-gray-600">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Upload to ImgBB'}
        </button>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {uploadedImage && (
          <div className="mt-6 p-4 bg-green-50 rounded-md">
            <h3 className="font-semibold text-green-800 mb-2">Upload Successful!</h3>
            <img
              src={uploadedImage.display_url}
              alt="Uploaded"
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <div className="space-y-1 text-sm text-green-700">
              <p><strong>Image ID:</strong> {uploadedImage.id}</p>
              <p><strong>URL:</strong> <a href={uploadedImage.url} target="_blank" rel="noopener noreferrer" className="underline">{uploadedImage.url}</a></p>
              <p><strong>Size:</strong> {(uploadedImage.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 