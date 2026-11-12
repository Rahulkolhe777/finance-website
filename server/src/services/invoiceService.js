import Payment from '../models/Payment.js';

// Seller details printed on every invoice. Replace placeholders before going live.
const SELLER = {
  legalName: '[LEGAL NAME]',
  address: '[REGISTERED ADDRESS]',
  gstin: '[GSTIN]',
  sebiRaNo: 'INH000031611',
  sacCode: '[SAC CODE]',
  supplyNote: '[CGST + SGST / IGST as applicable]',
};

// GST_RATE (default 18) and PRICES_INCLUDE_GST ("true" when plan/course prices include GST).
const gstConfig = () => ({
  rate: Number(process.env.GST_RATE ?? 18),
  inclusive: String(process.env.PRICES_INCLUDE_GST ?? 'true').toLowerCase() === 'true',
});

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const rupees = (paise) => '₹' + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Indian financial year label for a date, e.g. 2026-27.
const financialYear = (date) => {
  const y = date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1;
  return y + '-' + String(y + 1).slice(2);
};

// Assigns the next sequential invoice number for the financial year
// (INV/2026-27/0001). Retries on the unique index if two payments race.
export async function assignInvoiceNumber(paymentId, paidAt) {
  const prefix = 'INV/' + financialYear(paidAt) + '/';
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const count = await Payment.countDocuments({ invoiceNumber: { $regex: '^' + prefix.replace(/\//g, '\\/') } });
    const invoiceNumber = prefix + String(count + 1 + attempt).padStart(4, '0');
    try {
      const updated = await Payment.findOneAndUpdate(
        { _id: paymentId, invoiceNumber: { $exists: false } },
        { $set: { invoiceNumber } },
        { new: true }
      );
      return updated ? updated.invoiceNumber : (await Payment.findById(paymentId).lean()).invoiceNumber;
    } catch (err) {
      if (err.code !== 11000) throw err;
    }
  }
  throw new Error('Could not assign an invoice number');
}

// Amount to charge for a listed price (adds GST when prices exclude it).
export function chargeableAmountPaise(pricePaise) {
  const { rate, inclusive } = gstConfig();
  return inclusive ? pricePaise : pricePaise + Math.round((pricePaise * rate) / 100);
}

// Splits an amount actually charged (GST included) into taxable value and GST.
export function gstBreakdown(totalPaise) {
  const { rate } = gstConfig();
  const taxable = Math.round((totalPaise * 100) / (100 + rate));
  return { rate, taxablePaise: taxable, gstPaise: totalPaise - taxable, totalPaise };
}

// HTML tax invoice (embedded in the receipt email; printable / save as PDF).
export function renderInvoiceHtml(payment) {
  const b = gstBreakdown(payment.amountPaise);
  const date = new Date(payment.paidAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' });
  const row = (label, value, bold) =>
    '<tr><td style="padding:6px 0;color:#4F5F6B">' + escapeHtml(label) + '</td><td style="padding:6px 0;text-align:right' + (bold ? ';font-weight:700' : '') + '">' + escapeHtml(value) + '</td></tr>';

  // GST_RATE=0 (not GST-registered): plain payment receipt, no GSTIN or tax lines.
  const gstRegistered = b.rate > 0;

  return (
    '<div style="font-family:Arial,sans-serif;max-width:640px;border:1px solid #D9E5E0;border-radius:12px;padding:24px;color:#0B1B2B">' +
    '<h2 style="margin:0 0 4px">' + (gstRegistered ? 'Tax Invoice' : 'Payment Receipt') + '</h2>' +
    '<p style="margin:0 0 16px;color:#4F5F6B">' + escapeHtml(payment.invoiceNumber) + ' · ' + escapeHtml(date) + '</p>' +
    '<p style="margin:0"><strong>' + escapeHtml(SELLER.legalName) + '</strong><br>' + escapeHtml(SELLER.address) +
    '<br>' + (gstRegistered ? 'GSTIN: ' + escapeHtml(SELLER.gstin) + ' · ' : '') + 'SEBI RA No: ' + escapeHtml(SELLER.sebiRaNo) + '</p>' +
    '<p style="margin:16px 0"><strong>Billed to</strong><br>' + escapeHtml(payment.customer.name) + '<br>' +
    escapeHtml(payment.customer.email) + ' · +91 ' + escapeHtml(payment.customer.phone) + '</p>' +
    '<table style="width:100%;border-collapse:collapse;border-top:1px solid #D9E5E0">' +
    row('Description', payment.description) +
    (gstRegistered ? row('SAC code', SELLER.sacCode) : '') +
    row('Order ID', payment.orderId) +
    (gstRegistered
      ? row('Taxable value', rupees(b.taxablePaise)) + row('GST @ ' + b.rate + '% (' + SELLER.supplyNote + ')', rupees(b.gstPaise))
      : '') +
    row('Total paid', rupees(b.totalPaise), true) +
    '</table>' +
    '<p style="margin:16px 0 0;font-size:12px;color:#4F5F6B">Investments in securities market are subject to market risks. ' +
    'Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.</p>' +
    '</div>'
  );
}
