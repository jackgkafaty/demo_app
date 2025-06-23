import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Call backend AI endpoint
    const backendResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3000'}/api/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      // Pass through the specific error from backend
      return NextResponse.json({ 
        error: data.error || 'AI service unavailable',
        details: data.details,
        suggestion: data.suggestion
      }, { status: backendResponse.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
