export const runtime = 'edge';

export async function GET() {
  const timestamp = new Date().toISOString();
  const message = `weather (${timestamp})`;

  return new Response(message, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
}
