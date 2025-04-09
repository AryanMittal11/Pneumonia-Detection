import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface Analysis {
  id: string;
  created_at: string;
  image_path: string;
  status: string;
  predicted_label: string;
  confidence_score: number;
  result: {
    probability: number;
    timestamp: string;
  } | null; // Allow null in case the result is not available yet
}

export default function History() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (analysis: Analysis) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Pneumonia Detection Report', 20, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${new Date(analysis.created_at).toLocaleDateString()}`, 20, 40);
    doc.text(`Analysis ID: ${analysis.id}`, 20, 50);
    doc.text(
      `Detection Result: ${
        analysis ? analysis.predicted_label : 'Pending'
      }`,
      20,
      60
    );
    doc.text(
      `Detection Probability: ${
        analysis ? (analysis.confidence_score * 100).toFixed(2) + '%' : 'Pending'
      }`,
      20,
      70
    );
    doc.text(`Status: ${analysis.status}`, 20, 80);

    doc.save(`pneumonia-analysis-${analysis.id}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FileText className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading analysis history: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Analysis History</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your previous X-ray analyses and their results.
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {analyses.length === 0 ? (
                <div className="text-center py-12 bg-white">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No analyses</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't uploaded any X-rays for analysis yet.
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Result
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Probability
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {analyses.map((analysis) => (
                      <tr key={analysis.id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(analysis.created_at).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              analysis.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {analysis.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {analysis.status === 'success' && analysis ? (
                            <span>
                              {analysis.predicted_label}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Pending</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {analysis.status === 'success' && analysis ? (
                            <span>
                              {(analysis.confidence_score * 100).toFixed(2) + '%'}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Pending</span>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => downloadReport(analysis)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
