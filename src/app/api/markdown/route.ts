const GAFFA_X_API_KEY = process.env.NEXT_PUBLIC_GAFFA_X_API_KEY;
const GAFFA_ENDPOINT =
  process.env.NEXT_PUBLIC_GAFFA_ENDPOINT ||
  "https://api.gaffa.dev/v1/browser/requests";

const RATE_LIMIT = 30; // 30 requests per day

const usersRequests: { [key: string]: { count: number; expiredAt: number } } =
  {};

const validateUsersRequests = () => {
  for (const ip in usersRequests) {
    // Only delete if 24 hours have passed since expiredAt
    if (Date.now() - usersRequests[ip].expiredAt > 24 * 60 * 60 * 1000) {
      delete usersRequests[ip];
    }
  }
};

export async function GET(request: Request) {
  validateUsersRequests();
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = forwardedFor?.split(",")[0].trim();

  if (!clientIp) {
    return new Response(
      JSON.stringify({ error: "Unable to determine client IP" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!usersRequests[clientIp]) {
    usersRequests[clientIp] = {
      count: RATE_LIMIT,
      expiredAt: Date.now() + 24 * 60 * 60 * 1000,
    };
  }

  return new Response(JSON.stringify(usersRequests[clientIp]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  validateUsersRequests();
  const requestBody = await request.json();
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = forwardedFor?.split(",")[0].trim();
  if (!clientIp) {
    return new Response(
      JSON.stringify({ error: "Unable to determine client IP" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
  let gaffaResponse;
  try {
    gaffaResponse = await fetch(GAFFA_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": GAFFA_X_API_KEY || "",
      },
      body: JSON.stringify(requestBody),
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error connecting to Gaffa API" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const responseData = await gaffaResponse.json();

  if (!usersRequests[clientIp]) {
    usersRequests[clientIp] = {
      count: RATE_LIMIT - 1,
      expiredAt: Date.now() + 24 * 60 * 60 * 1000,
    };
  } else {
    const currentUser = usersRequests[clientIp];
    if (currentUser.count <= 0) {
      return new Response(JSON.stringify(currentUser), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      currentUser.count -= 1;
    }
  }

  return new Response(
    JSON.stringify({
      user: usersRequests[clientIp],
      gaffaResponse: responseData,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
