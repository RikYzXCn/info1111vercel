export const runtime = 'edge';

export async function POST(request: Request) {
  const body = await request.text();
  const data = JSON.parse(body || '{}');

  return new Response(JSON.stringify({
    message: 'Feedback received',
    data,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}