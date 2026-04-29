export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    await fetch("http://127.0.0.1:7821/ingest/649c78ef-eef0-424c-8acb-0b5f383505dc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "2765ac",
      },
      body: JSON.stringify(body),
    });
  } catch {
    // Swallow: debug route should never break app flows.
  }

  return new Response(null, { status: 204 });
}

