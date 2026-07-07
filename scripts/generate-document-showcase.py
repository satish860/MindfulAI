from pathlib import Path
from PIL import Image
import json
from bs4 import BeautifulSoup

ocr_root = Path(r'C:\code\OCR\output\ocr_benchmark_30')
doc_root = Path(r'C:\code\OCR\getomni_ocr_benchmark_30\documents')
blog = Path(r'C:\Source\blog')
img_out = blog / 'public/images/hostable-ocr/showcase'
img_out.mkdir(parents=True, exist_ok=True)


def copy_thumb(src: Path, dest_name: str, max_size=(1100, 1500)):
    im = Image.open(src).convert('RGB')
    im.thumbnail(max_size, Image.Resampling.LANCZOS)
    dest = img_out / dest_name
    im.save(dest, optimize=True)
    return f'/images/hostable-ocr/showcase/{dest_name}'


def read_html(sample: str, crop=False):
    p = (ocr_root / sample / 'patent_crop_pipeline_test/patent_references_crop_ocr/chandra_output.html') if crop else (ocr_root / sample / 'ocr/chandra_output.html')
    html = p.read_text(encoding='utf-8', errors='replace')
    return str(BeautifulSoup(html, 'html.parser'))


def statement_html():
    soup = BeautifulSoup(read_html('0011_CREDIT_CARD_STATEMENT_HIGH_QUALITY'), 'html.parser')
    sections = []
    for div in soup.find_all('div'):
        table = div.find('table')
        if not table:
            continue
        prev = div.find_previous_sibling('div')
        title = prev.get_text(' ', strip=True) if prev else 'Table'
        if title in {'Bonus Credits', 'Funds Deduction'}:
            sections.append(f'<section class="ocr-section"><h4>{title}</h4>{str(table)}</section>')
    return '\n'.join(sections)


patent_soup = BeautifulSoup(read_html('0005_PATENT_LOW_QUALITY', crop=True), 'html.parser')
patent_table = patent_soup.find('table')

examples = [
    {
        'id': 'statement',
        'label': 'Statement',
        'title': 'Statement',
        'capability': 'Transaction tables and repeated row structure',
        'why': 'Preserves rows and columns so downstream extraction can validate transactions instead of guessing from plain text.',
        'image': copy_thumb(doc_root / '0011_CREDIT_CARD_STATEMENT_HIGH_QUALITY.png', 'statement.png'),
        'html': statement_html(),
    },
    {
        'id': 'cheque',
        'label': 'Cheque',
        'title': 'Cheque',
        'capability': 'Spatial key-value layout',
        'why': 'Cheques are not tables. The output keeps payee, amount, date, memo, and bank text as separate layout regions.',
        'image': copy_thumb(doc_root / '0003_BANK_CHECK_CLEAN.png', 'cheque.png'),
        'html': read_html('0003_BANK_CHECK_CLEAN'),
    },
    {
        'id': 'invoice',
        'label': 'Invoice',
        'title': 'Invoice',
        'capability': 'Header fields, line items, and totals',
        'why': 'Invoices need mixed understanding: addresses, identifiers, line-item tables, subtotals, tax, and total amount.',
        'image': copy_thumb(doc_root / '0007_SHIPPING_INVOICE_HIGH_QUALITY.png', 'invoice.png'),
        'html': read_html('0007_SHIPPING_INVOICE_HIGH_QUALITY'),
    },
    {
        'id': 'receipt',
        'label': 'Receipt',
        'title': 'Receipt',
        'capability': 'Narrow photo-style receipts',
        'why': 'Operational workflows often receive noisy phone captures. The OCR keeps store details, item rows, tax, total, and cashier information.',
        'image': copy_thumb(doc_root / '0019_PHOTO_RECEIPT_PHOTO.jpg', 'receipt.png'),
        'html': read_html('0019_PHOTO_RECEIPT_PHOTO'),
    },
    {
        'id': 'form',
        'label': 'Form',
        'title': 'Form',
        'capability': 'Sections and filled fields',
        'why': 'Forms require layout awareness: labels, filled values, sections, and contact details need to stay connected.',
        'image': copy_thumb(doc_root / '0021_SCANNED_FORM_PHOTO.png', 'form.png'),
        'html': read_html('0021_SCANNED_FORM_PHOTO'),
    },
    {
        'id': 'dense',
        'label': 'Dense table',
        'title': 'Dense table',
        'capability': 'Small-font table with targeted region retry',
        'why': 'Dense regions can be re-read independently, then returned as semantic table output.',
        'image': '/images/hostable-ocr/patent-full-page.png',
        'html': '<section class="ocr-section"><h4>U.S. Patent Documents</h4>' + str(patent_table) + '</section>',
    },
]

component = r'''"use client"

import { useState } from 'react'

type Example = {
  id: string
  label: string
  title: string
  capability: string
  why: string
  image: string
  html: string
}

const examples: Example[] = __EXAMPLES__

export function DocumentShowcase() {
  const [selectedId, setSelectedId] = useState(examples[0].id)
  const [view, setView] = useState<'rendered' | 'raw'>('rendered')
  const selected = examples.find((item) => item.id === selectedId) || examples[0]

  return (
    <div className="document-showcase">
      <div className="document-selector">
        {examples.map((item) => {
          const active = item.id === selected.id
          return (
            <button key={item.id} type="button" onClick={() => { setSelectedId(item.id); setView('rendered') }} className={active ? 'active' : ''}>
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="showcase-card">
        <div className="document-pane">
          <div className="pane-label">Original document</div>
          <img src={selected.image} alt={`${selected.title} sample document`} />
        </div>

        <div className="output-pane">
          <div className="output-header">
            <div>
              <div className="pane-label">OCR output</div>
              <h3>{selected.title}</h3>
            </div>
            <div className="output-tabs">
              <button type="button" className={view === 'rendered' ? 'active' : ''} onClick={() => setView('rendered')}>Rendered OCR</button>
              <button type="button" className={view === 'raw' ? 'active' : ''} onClick={() => setView('raw')}>Raw HTML</button>
            </div>
          </div>

          {view === 'rendered' ? (
            <div className="rendered-ocr-output" dangerouslySetInnerHTML={{ __html: selected.html }} />
          ) : (
            <pre className="raw-html"><code>{selected.html}</code></pre>
          )}

          <div className="capability-note">
            <strong>{selected.capability}</strong>
            <p>{selected.why}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .document-showcase { margin: 1.5rem 0 2rem; }
        .document-selector { display: flex; gap: 0.45rem; overflow-x: auto; padding: 0.35rem 0 0.85rem; }
        .document-selector button { border: 1px solid rgba(148, 163, 184, 0.35); border-radius: 999px; background: #fff; color: #64748b; cursor: pointer; font: inherit; font-size: 0.88rem; font-weight: 650; padding: 0.48rem 0.82rem; white-space: nowrap; }
        .document-selector button.active { background: #0f172a; border-color: #0f172a; color: #fff; }
        .showcase-card { display: grid; grid-template-columns: minmax(260px, 0.8fr) minmax(320px, 1.2fr); gap: 1rem; align-items: stretch; }
        .document-pane, .output-pane { border: 1px solid rgba(148, 163, 184, 0.35); border-radius: 16px; background: #fff; overflow: hidden; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06); }
        .document-pane { padding: 1rem; }
        .document-pane img { display: block; width: 100%; max-height: 640px; object-fit: contain; border-radius: 10px; background: #f8fafc; }
        .pane-label { color: #64748b; font-size: 0.76rem; font-weight: 750; letter-spacing: 0.05em; margin-bottom: 0.65rem; text-transform: uppercase; }
        .output-header { align-items: center; background: #f8fafc; border-bottom: 1px solid rgba(148, 163, 184, 0.24); display: flex; gap: 1rem; justify-content: space-between; padding: 0.9rem 1rem; }
        .output-header h3 { font-size: 1rem; margin: 0; }
        .output-tabs { display: flex; gap: 0.35rem; }
        .output-tabs button { border: 1px solid transparent; border-radius: 10px; background: transparent; color: #64748b; cursor: pointer; font: inherit; font-size: 0.82rem; font-weight: 700; padding: 0.48rem 0.68rem; white-space: nowrap; }
        .output-tabs button.active { background: #fff; border-color: rgba(37, 99, 235, 0.25); color: #0f172a; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08); }
        .rendered-ocr-output { color: #111827; max-height: 520px; overflow: auto; padding: 1rem; }
        .raw-html { background: #0f172a; color: #e5e7eb; font-size: 0.78rem; line-height: 1.55; margin: 0; max-height: 520px; overflow: auto; padding: 1rem; white-space: pre-wrap; }
        .capability-note { background: #f8fafc; border-top: 1px solid rgba(148, 163, 184, 0.24); padding: 0.9rem 1rem; }
        .capability-note strong { color: #0f172a; display: block; font-size: 0.92rem; margin-bottom: 0.25rem; }
        .capability-note p { color: #475569; font-size: 0.9rem; margin: 0; }
        .rendered-ocr-output :global(.ocr-section) { margin-bottom: 1.25rem; }
        .rendered-ocr-output :global(h4) { font-size: 0.95rem; font-weight: 750; margin: 0 0 0.75rem; }
        .rendered-ocr-output :global(div[data-label]) { border-left: 2px solid rgba(37, 99, 235, 0.2); margin: 0.45rem 0; padding: 0.25rem 0.5rem; }
        .rendered-ocr-output :global(div[data-label]::before) { content: attr(data-label); color: #64748b; display: block; font-size: 0.68rem; font-weight: 750; letter-spacing: 0.05em; margin-bottom: 0.15rem; text-transform: uppercase; }
        .rendered-ocr-output :global(table) { border-collapse: collapse; font-size: 0.82rem; line-height: 1.35; width: 100%; }
        .rendered-ocr-output :global(th), .rendered-ocr-output :global(td) { border: 1px solid rgba(148, 163, 184, 0.45); padding: 0.35rem 0.45rem; vertical-align: top; }
        .rendered-ocr-output :global(th) { background: rgba(148, 163, 184, 0.16); font-weight: 750; }
        .rendered-ocr-output :global(tr:nth-child(even) td) { background: rgba(148, 163, 184, 0.08); }
        .rendered-ocr-output :global(img:not([src])) { display: none; }
        @media (max-width: 820px) { .showcase-card { grid-template-columns: 1fr; } .output-header { align-items: flex-start; flex-direction: column; } }
      `}</style>
    </div>
  )
}
'''.replace('__EXAMPLES__', json.dumps(examples, ensure_ascii=False, indent=2))

(blog / 'app/components/DocumentShowcase.tsx').write_text(component, encoding='utf-8')
print('wrote component with', len(examples), 'examples')
for e in examples:
    print(e['id'], len(e['html']), e['image'])
