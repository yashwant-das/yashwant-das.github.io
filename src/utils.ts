export function handleError(error: unknown, context = ''): void {
  const message = error instanceof Error ? error.message : String(error);
  console.error('[ERROR]', context ? `${context}: ${message}` : message);
}
