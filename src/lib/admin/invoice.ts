import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type InvoiceLine = { description: string; amount: number };

export function generateReceiptPdf(data: {
  receiptNumber: string;
  date: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  lines: InvoiceLine[];
  totalPaid: number;
  totalFee?: number;
  outstanding?: number;
  method?: string;
  notes?: string;
}) {
  const doc = new jsPDF();
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255);
  doc.setFontSize(20);
  doc.text("ClassCodex", 14, 19);
  doc.setFontSize(10);
  doc.text("Payment Receipt", 196, 19, { align: "right" });

  doc.setTextColor(17);
  doc.setFontSize(11);
  doc.text(`Receipt #: ${data.receiptNumber}`, 14, 42);
  doc.text(`Date: ${data.date}`, 196, 42, { align: "right" });

  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text("Billed to", 14, 54);
  doc.setTextColor(17);
  doc.setFontSize(11);
  doc.text(data.studentName || data.studentEmail, 14, 60);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(data.studentEmail, 14, 65);

  doc.setTextColor(17);
  doc.setFontSize(11);
  doc.text(`Course: ${data.courseTitle}`, 14, 76);

  autoTable(doc, {
    startY: 84,
    head: [["Description", "Amount (INR)"]],
    body: data.lines.map((l) => [l.description, l.amount.toLocaleString("en-IN")]),
    headStyles: { fillColor: [37, 99, 235] },
    theme: "striped",
  });

  let y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.text(`Total Paid: INR ${data.totalPaid.toLocaleString("en-IN")}`, 196, y, { align: "right" });
  if (data.totalFee !== undefined) {
    y += 7;
    doc.setTextColor(80);
    doc.text(`Course Fee: INR ${data.totalFee.toLocaleString("en-IN")}`, 196, y, { align: "right" });
  }
  if (data.outstanding !== undefined) {
    y += 7;
    doc.setTextColor(data.outstanding > 0 ? 200 : 16);
    doc.text(`Outstanding: INR ${data.outstanding.toLocaleString("en-IN")}`, 196, y, { align: "right" });
  }
  if (data.method) {
    y += 9;
    doc.setTextColor(80);
    doc.text(`Method: ${data.method}`, 14, y);
  }
  if (data.notes) {
    y += 7;
    doc.text(`Notes: ${data.notes}`, 14, y);
  }

  doc.setTextColor(120);
  doc.setFontSize(9);
  doc.text("Thank you for learning with ClassCodex.", 105, 285, { align: "center" });

  doc.save(`receipt-${data.receiptNumber}.pdf`);
}
