import { NextRequest, NextResponse } from 'next/server';
import { getCIKFromTicker } from '@/lib/getCIKFromTicker';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ticker = searchParams.get('ticker');

  if (!ticker) {
    return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
  }

  try {
    const cik = getCIKFromTicker(ticker);
    
    if (!cik) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    
    // Get the company's filings
    const filingsUrl = `https://data.sec.gov/submissions/CIK${cik}.json`;
    const filingsResponse = await fetch(filingsUrl, {
      headers: {
        'User-Agent': process.env.SEC_USER_AGENT || '',
      },
    });

    if (!filingsResponse.ok) {
      throw new Error(`Failed to fetch filings from SEC: ${filingsResponse.status}`);
    }

    const filingsData = await filingsResponse.json();
    
    // Check if we have the expected data structure
    if (!filingsData.filings?.recent) {
      throw new Error('Unexpected API response structure');
    }

    // Find the most recent 10-K
    const recent10Ks = filingsData.filings.recent.form.reduce((acc: number[], form: string, index: number) => {
      if (form === '10-K') {
        acc.push(index);
      }
      return acc;
    }, []);

    if (recent10Ks.length === 0) {
      return NextResponse.json({ error: 'No recent 10-K filing found' }, { status: 404 });
    }

    // Get the most recent 10-K (first index)
    const recent10KIndex = recent10Ks[0];
    const accessionNumber = filingsData.filings.recent.accessionNumber[recent10KIndex];
    const primaryDocument = filingsData.filings.recent.primaryDocument[recent10KIndex];
    
    // Construct the URL for the actual document (HTML format)
    const url = `https://www.sec.gov/Archives/edgar/data/${cik}/${accessionNumber.replace(/-/g, '')}/${primaryDocument}`;
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error fetching filing:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch filing information' },
      { status: 500 }
    );
  }
} 