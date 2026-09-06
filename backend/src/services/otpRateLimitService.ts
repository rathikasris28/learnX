type RateLimitEntry = {
  count: number;
  windowStartedAt: number;
};

const verificationAttempts = new Map<string, RateLimitEntry>();
const codeRequests = new Map<string, RateLimitEntry>();

function consume(
  store: Map<string, RateLimitEntry>,
  key: string,
  maximum: number,
  windowMilliseconds: number
) {
  const now = Date.now();
  const current = store.get(key);
  if (!current || now - current.windowStartedAt >= windowMilliseconds) {
    store.set(key, { count: 1, windowStartedAt: now });
    return true;
  }
  if (current.count >= maximum) return false;
  current.count += 1;
  return true;
}

export function allowVerificationAttempt(email: string, ipAddress: string) {
  return consume(verificationAttempts, `${email}:${ipAddress}`, 10, 10 * 60 * 1000);
}

export function allowCodeRequest(email: string, ipAddress: string) {
  return consume(codeRequests, `${email}:${ipAddress}`, 3, 60 * 60 * 1000);
}