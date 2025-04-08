import React from 'react';
import { Shield, Award, BookOpen, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900">About PneumoDetect</h1>
        <p className="mt-4 text-lg text-gray-600">
          PneumoDetect leverages advanced AI technology to assist healthcare professionals in detecting pneumonia through chest X-ray analysis.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-blue-600" />}
            title="Medical Grade"
            description="Built to meet stringent healthcare industry standards and requirements"
          />
          <FeatureCard
            icon={<Award className="h-8 w-8 text-blue-600" />}
            title="AI-Powered"
            description="Utilizes state-of-the-art deep learning models for accurate detection"
          />
          <FeatureCard
            icon={<BookOpen className="h-8 w-8 text-blue-600" />}
            title="Research-Backed"
            description="Developed based on extensive medical research and validation"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-blue-600" />}
            title="Expert Support"
            description="Backed by a team of healthcare professionals and AI experts"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Medical Disclaimer</h2>
            <div className="prose prose-blue text-gray-600">
              <p className="mb-4">
                PneumoDetect is designed as a supportive tool for healthcare professionals and should not be used as the sole basis for diagnosis or medical decision-making.
              </p>
              <p className="mb-4">
                The AI-powered analysis provided by this platform is intended to assist and augment professional medical judgment, not replace it. All results should be interpreted by qualified healthcare providers in conjunction with:
              </p>
              <ul className="list-disc pl-5 mb-4">
                <li>Clinical examination</li>
                <li>Patient medical history</li>
                <li>Additional diagnostic tests</li>
                <li>Professional medical expertise</li>
              </ul>
              <p className="mb-4">
                Healthcare providers should exercise their independent professional judgment in evaluating and using any information or analysis provided by PneumoDetect.
              </p>
              <p className="font-semibold">
                Always consult with qualified healthcare professionals for medical advice, diagnosis, and treatment options.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Information</h2>
            <div className="prose prose-blue text-gray-600">
              <p className="mb-4">
                Our AI model is trained on a comprehensive dataset of chest X-rays, validated by medical professionals. The system employs advanced deep learning techniques to identify patterns associated with pneumonia.
              </p>
              <p>
                While our system demonstrates high accuracy in controlled studies, it should be considered one of many tools in the diagnostic process. Regular updates and improvements are made to enhance detection accuracy and reliability.
              </p>
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