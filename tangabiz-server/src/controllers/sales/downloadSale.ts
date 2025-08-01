import { Context } from "hono";
import { prisma } from "../../helpers/prisma";
import PDFDocument from "pdfkit";

export default async function downloadSale(c: Context) {
  const saleId = c.req.query("saleId");
  if (!saleId) {
    return c.json({ message: "saleId is required" }, 400);
  }

  // Fetch sale with relationships
  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
    include: {
      customer: true,
      business: true,
      items: true,
    },
  });

  if (!sale) {
    return c.json({ message: "Sale not found" }, 404);
  }

  // Generate PDF
  const doc = new PDFDocument({ margin: 40, size: "A4" });
  const buffers: Buffer[] = [];
  doc.on("data", (buf) => buffers.push(buf));

  // Header (Business branding)
  doc
    .fontSize(22)
    .fillColor("#1e293b")
    .text(sale.business?.businessName || "Receipt", { align: "center" });

  doc.moveDown(0.5);
  doc
    .fontSize(12)
    .fillColor("#475569")
    .text(`Receipt #: ${sale.id.substring(0, 8).toUpperCase()}`);
  doc.text(`Date: ${new Date(sale.createdAt).toLocaleString()}`);

  doc.moveDown();

  // Customer section
  if (sale.customer) {
    doc.fontSize(14).fillColor("#1e293b").text("Customer");
    doc
      .fontSize(12)
      .fillColor("#475569")
      .text(`${sale.customer.name}${sale.customer.phone ? " • " + sale.customer.phone : ""}`);
    doc.moveDown();
  }

  // Items table header
  doc.fontSize(14).fillColor("#1e293b").text("Items");
  doc.moveDown(0.3);
  sale.items.forEach((item) => {
    doc
      .fontSize(12)
      .fillColor("#1e293b")
      .text(item.name, { continued: true })
      .text(` $${item.price.toFixed(2)}`, { align: "right" });
  });

  doc.moveDown();

  // Totals
  doc.fontSize(14).fillColor("#1e293b").text("Totals");
  doc.moveDown(0.3);
  doc
    .fontSize(12)
    .text(`Total (USD): $${sale.total.toFixed(2)}`)
    .text(`Total (ZiG): ${sale.zigTotal.toFixed(2)} ZiG`)
    .text(`Payment Method: ${sale.paymentType}`);

  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
  });

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=receipt-${saleId}.pdf`,
    },
  });
}
