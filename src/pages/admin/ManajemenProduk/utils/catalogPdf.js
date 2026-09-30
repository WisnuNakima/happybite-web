// Local text catalog with pagination, without a backend or extra dependencies.
export function exportCatalogPdf(products) {
  const clean = (text) =>
    String(text)
      .normalize('NFKD')
      .replace(/[^\x20-\x7E]/g, ' ')
      .replace(/([\\()])/g, '\\$1')
  const lines = [
    'HappyBite - Katalog Produk',
    '',
    ...products.flatMap((p) => [
      `${p.sku} - ${p.name}`,
      `Rp ${p.price.toLocaleString('id-ID')} | Stok: ${p.stokDisplayEtalase} | ${p.isLiveOnWebsite ? 'Live' : 'Draft'}`,
      '',
    ]),
  ]
  const pages = []
  for (let i = 0; i < lines.length; i += 39) pages.push(lines.slice(i, i + 39))
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pages.map((_, i) => `${4 + i * 2} 0 R`).join(' ')}] /Count ${pages.length} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  pages.forEach((page, i) => {
    const stream = `BT /F1 10 Tf 40 790 Td 18 TL\n${page.map((line) => `(${clean(line)}) Tj T*`).join('\n')}\nET`
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5 + i * 2} 0 R >>`,
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    )
  })
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((object, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${object}\nendobj\n`
  })
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, '0')} 00000 n `)
    .join(
      '\n',
    )}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'HappyBite-Katalog.pdf'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
