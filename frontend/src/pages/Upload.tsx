import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ predicted_label: string; probability: number } | null>(null);


  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    const file = acceptedFiles[0];
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'application/dicom'].includes(file.type)) {
      setError('Only JPEG, PNG, and DICOM files are supported');
      return;
    }

    setFile(file);
    if (file.type !== 'application/dicom') {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/dicom': ['.dcm'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;
  
    setLoading(true);
    setError(null);
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json(); // Expect JSON from Flask
  
      if (!response.ok) {
        throw new Error(result.error || 'Failed to process image');
      }
  
      setResult({
        predicted_label: result.predicted_label,
        probability: result.confidence_score,
      });
  
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Upload X-ray Image
          </h3>
          
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Upload a chest X-ray image for pneumonia detection analysis.</p>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="mt-4">
            {!file ? (
              <div
                {...getRootProps()}
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                  isDragActive ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-1 text-center">
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <p className="pl-1">
                      Drag and drop your X-ray image here, or click to select
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    JPEG, PNG, or DICOM up to 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <div className="relative">
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-96 mx-auto rounded-lg"
                    />
                  )}
                  <button
                    onClick={clearFile}
                    className="absolute top-2 right-2 p-1 bg-red-100 rounded-full hover:bg-red-200"
                  >
                    <X className="h-5 w-5 text-red-600" />
                  </button>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      'Analyze Image'
                    )}
                  </button>
                </div>
                {result && (
  <div className="mt-4 p-4 bg-green-100 rounded-md">
    <p><strong>Prediction:</strong> {result.predicted_label}</p>
    <p><strong>Confidence:</strong> {(result.probability * 100).toFixed(2)}%</p>
  </div>
)}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}