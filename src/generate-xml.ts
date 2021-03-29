export function generateXml(barcodes: string[]): string {
  return barcodes.join('\n');
}
