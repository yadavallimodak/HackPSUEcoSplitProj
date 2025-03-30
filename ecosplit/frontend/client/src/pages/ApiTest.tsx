import { useState } from 'react';
import { api } from '../lib/api';

export default function ApiTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testSplitApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.splitBill({
        "Alice": [{"name": "apple", "price": 1.99}],
        "Bob": [{"name": "banana", "price": 0.99}]
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testSuggestionsApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSuggestions([
        {"name": "plastic water bottle"},
        {"name": "beef steak"}
      ]);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="flex gap-4 mb-4">
        <button 
          onClick={testSplitApi}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Test Split API
        </button>
        
        <button 
          onClick={testSuggestionsApi}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Test Suggestions API
        </button>
      </div>
      
      {loading && <div className="text-gray-500">Loading...</div>}
      
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 