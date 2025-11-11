/**
 * Health check endpoint para o Docker
 */
export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "esorbit-web",
  });
}
