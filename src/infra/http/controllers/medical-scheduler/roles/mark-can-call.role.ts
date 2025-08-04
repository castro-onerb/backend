export function MarkCanCallRole(
  flags: Record<string, boolean | undefined>,
): boolean {
  return Object.values(flags).every((flag) => flag !== false);
}
