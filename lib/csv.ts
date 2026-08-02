// Minimal CSV serializer — quotes any field containing a comma, quote, or
// newline, doubling internal quotes per RFC 4180. Good enough for admin
// exports; not meant as a general-purpose CSV library.
export function toCsv(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const escape = (value: string | number | null | undefined): string => {
    const s = value == null ? "" : String(value);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(row.map(escape).join(","));
  }
  return lines.join("\r\n");
}
