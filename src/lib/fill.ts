/** Replaces `{key}` placeholders in content JSON. Unknown keys are left as-is so gaps stay visible. */
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}
