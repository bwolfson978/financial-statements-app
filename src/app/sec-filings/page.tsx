'use client';
import { useState } from 'react';

export default function SecFilingsPage() {  // Updated component name
  const [ticker, setTicker] = useState('');
  const [filingUrl, setFilingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFilingUrl(null);

    try {
      // URL path remains the same since it points to the API endpoint
      const response = await fetch(`/api/fetch10k?ticker=${ticker}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch filing');
      }

      setFilingUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">SEC Filing Lookup</h1>
        
        {/* Rest of the component remains the same */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ticker" className="block mb-2">
              Company Ticker:
            </label>
            <input
              id="ticker"
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              placeholder="e.g., AAPL"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !ticker.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Find Latest 10-K'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {filingUrl && (
          <div className="mt-4 p-4 border rounded-md dark:border-gray-700">
            <h2 className="font-bold mb-2">Latest 10-K Filing:</h2>
            <a
              href={filingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View 10-K Filing
            </a>
          </div>
        )}
      </main>
    </div>
  );
} 