import { NextResponse } from 'next/server';

export async function GET() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_ANALYTICS_TOKEN;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Validate environment variables
  const missingVars = [];
  if (!accountId) missingVars.push('CLOUDFLARE_ACCOUNT_ID');
  if (!token) missingVars.push('CLOUDFLARE_ANALYTICS_TOKEN');
  if (!siteKey) missingVars.push('NEXT_PUBLIC_TURNSTILE_SITE_KEY');

  if (missingVars.length > 0) {
    console.error('Missing environment variables:', missingVars);
    return NextResponse.json(
      { error: `Missing configuration: ${missingVars.join(', ')}` },
      { status: 500 }
    );
  }

  // Use 7 days ago to ensure we stay within Cloudflare's limits
  const startDate = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)).toISOString();

  const query = `
    query TurnstileAnalytics($accountId: String!, $siteKey: String!, $startDate: String!) {
      viewer {
        accounts(filter: { accountTag: $accountId }) {
          turnstileAdaptiveGroups(
            limit: 5000
            filter: { 
              siteKey: $siteKey
              datetime_geq: $startDate
              datetime_leq: "${new Date().toISOString()}"
            }
            orderBy: [datetime_DESC]
          ) {
            count
            dimensions {
              datetime
              action
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { accountId, siteKey, startDate },
      }),
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Cloudflare API responded with status: ${response.status}`);
    }

    const cfData = await response.json();

    if (cfData.errors) {
      console.error('Cloudflare GraphQL Errors:', cfData.errors);
      return NextResponse.json(
        { error: 'Cloudflare API returned an error', details: cfData.errors },
        { status: 400 }
      );
    }

    const rawData = cfData?.data?.viewer?.accounts?.[0]?.turnstileAdaptiveGroups || [];

    // Process the data
    const processedData = {
      summary: { total: 0, passed: 0, failed: 0, solveRate: '0' },
      timeSeries: [],
      actionDistribution: [],
    };

    const timeSeriesMap = new Map();
    const actionMap = new Map();

    rawData.forEach((item) => {
      const count = item.count;
      const action = item.dimensions.action;
      const datetime = item.dimensions.datetime;
      const date = datetime.split('T')[0]; // Extract just the date part

      // Update totals
      processedData.summary.total += count;
      
      if (action === 'fail' || action === 'managed_challenge_failed') {
        processedData.summary.failed += count;
      } else {
        processedData.summary.passed += count;
      }

      // Update action distribution
      actionMap.set(action, (actionMap.get(action) || 0) + count);

      // Update time series
      if (!timeSeriesMap.has(date)) {
        timeSeriesMap.set(date, { passed: 0, failed: 0 });
      }
      const dayData = timeSeriesMap.get(date);
      if (action === 'fail' || action === 'managed_challenge_failed') {
        dayData.failed += count;
      } else {
        dayData.passed += count;
      }
    });

    // Calculate solve rate
    processedData.summary.solveRate = processedData.summary.total > 0
      ? ((processedData.summary.passed / processedData.summary.total) * 100).toFixed(1)
      : '0';

    // Convert maps to arrays and sort
    processedData.timeSeries = Array.from(timeSeriesMap.entries())
      .map(([date, values]) => ({
        date,
        passed: values.passed,
        failed: values.failed,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    processedData.actionDistribution = Array.from(actionMap.entries())
      .map(([name, value]) => ({
        name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value,
      }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json(processedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });

  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}