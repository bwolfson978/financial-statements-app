import companyTickers from '../data/company_tickers.json';

interface CompanyInfo {
  cik_str: number;  // Note: this is actually a number in the JSON
  ticker: string;
  title: string;
}

export function getCIKFromTicker(ticker: string): string | null {
  const upperTicker = ticker.toUpperCase();
  
  // Search through the company tickers object
  const entry = Object.values(companyTickers).find(
    (company: CompanyInfo) => company.ticker === upperTicker
  );
  
  // Pad CIK with leading zeros to make it 10 digits
  return entry ? entry.cik_str.toString().padStart(10, '0') : null;
} 