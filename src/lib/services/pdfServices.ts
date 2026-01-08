// ============================================
// 5. PDF GENERATION SERVICE
// ============================================

// src/lib/services/pdfService.ts
import { Quote } from '@/types/quote'

export class PDFService {
  async generateQuotePDF(quote: Quote): Promise<Buffer> {
    // Using a simple HTML to PDF approach
    // In production, use @react-pdf/renderer or puppeteer
    
    const html = this.generateHTML(quote)
    
    // This would use puppeteer or a similar library
    // For now, returning placeholder
    return Buffer.from(html)
  }

  private generateHTML(quote: Quote): string {
    const itemsHTML = quote.items?.map((item, idx) => `
      <div class="item">
        <h3>ITEM ${item.item_number}: ${item.panel_name}</h3>
        
        <div class="section">
          <strong>Incomer(s):</strong><br/>
          ${item.incomers.map(inc => `
            ${inc.quantity}No. ${inc.amperage}A ${inc.poles} ${inc.type} ${inc.vendor} ${inc.specification}
          `).join('<br/>')}
        </div>

        <div class="section">
          <strong>Busbar:</strong><br/>
          ${item.busbar_specification}
        </div>

        <div class="section">
          <strong>Outgoings:</strong><br/>
          ${item.outgoings.map(out => `
            ${out.quantity}Nos ${out.amperage}A ${out.poles} ${out.type} ${out.vendor}
          `).join('<br/>')}
        </div>

        <div class="section">
          <strong>Control/Instruments:</strong><br/>
          ${item.accessories.map(acc => `
            ${acc.quantity}Nos ${acc.name} ${acc.specification}
          `).join('<br/>')}
        </div>

        <div class="section">
          <strong>Enclosure Size:</strong> ${item.enclosure_dimensions} (HxWxD)
        </div>

        <div class="price">
          <strong>Price: ₦${item.subtotal.toLocaleString()}</strong>
        </div>
      </div>
    `).join('')

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Quote ${quote.quote_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-name { font-size: 24px; font-weight: bold; }
          .item { margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 20px; }
          .section { margin: 10px 0; }
          .price { margin-top: 15px; text-align: right; font-size: 18px; }
          .totals { margin-top: 30px; text-align: right; }
          .grand-total { font-size: 20px; font-weight: bold; color: #0066cc; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">POWER PROJECTS LIMITED</div>
          <div>40, NNPC Road, Ejigbo, Lagos</div>
          <div>Tel: 08078792350</div>
          <div>info@powerprojectsltd.com | www.powerprojectsltd.com</div>
        </div>

        <p><strong>${quote.quote_number}</strong> - ${new Date(quote.created_at).toLocaleDateString()}</p>
        <p><strong>To:</strong> ${quote.client_name}</p>
        <p><strong>Attention:</strong> ${quote.attention}</p>
        <p><strong>Project:</strong> ${quote.project_name}</p>

        <hr/>

        ${itemsHTML}

        <div class="totals">
          <p><strong>Total:</strong> ₦${quote.total.toLocaleString()}</p>
          <p><strong>Add 7.5% VAT:</strong> ₦${quote.vat.toLocaleString()}</p>
          <p class="grand-total">Grand Total: ₦${quote.grand_total.toLocaleString()}</p>
        </div>

        <div style="margin-top: 40px;">
          <p><strong>Payment Terms:</strong> ${quote.payment_terms}</p>
          <p><strong>Execution Period:</strong> ${quote.execution_period}</p>
          <p><strong>Validity:</strong> ${quote.validity_period}</p>
        </div>
      </body>
      </html>
    `
  }
}