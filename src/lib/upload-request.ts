export async function uploadRequest(putUrl: string, body: unknown) {
    const res = await fetch(putUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }, // must match presign
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`S3 PUT ${res.status}: ${text}`);
    }
  }
  