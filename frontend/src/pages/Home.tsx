import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, History, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          AI-Powered Pneumonia Detection
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Upload chest X-ray images for quick and accurate pneumonia detection using advanced AI technology.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <Link
            to="/upload"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Upload className="h-8 w-8 text-blue-600" />}
            title="Easy Upload"
            description="Simple drag-and-drop interface for uploading chest X-ray images in common formats."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-blue-600" />}
            title="Secure Analysis"
            description="State-of-the-art AI model for accurate pneumonia detection with data privacy."
          />
          <FeatureCard
            icon={<History className="h-8 w-8 text-blue-600" />}
            title="Track History"
            description="Maintain a comprehensive record of all analyses and results."
          />
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Important Notice</h3>
                <div className="ml-4 bg-blue-100 rounded-full p-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 text-gray-600">
                <p>
                  This tool is designed to assist healthcare professionals and should not be used as a
                  substitute for professional medical diagnosis. Always consult with a qualified
                  healthcare provider for medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-50 mx-auto">
      {icon}
    </div>
    <h3 className="mt-6 text-center text-lg font-medium text-gray-900">{title}</h3>
    <p className="mt-2 text-center text-gray-500">{description}</p>
  </div>
);