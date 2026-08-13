import PDFDocument from "pdfkit";

/**
 * Streams a one-page ATS report PDF for a resume into the given response.
 * Kept dependency-light: pdfkit only, no external templating.
 */
export const streamResumeReportPDF = (resume, res) => {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="ATS-Report-${resume.fileName}.pdf"`);
  doc.pipe(res);

  const { atsMetrics, parsedContent, strengths, improvementAreas, fileName, createdAt } = resume;

  doc.fontSize(20).fillColor("#12181B").text("Check Way AI — ATS Report", { align: "left" });
  doc.moveDown(0.2);
  doc.fontSize(10).fillColor("#6B6459").text(`${fileName} · scanned ${new Date(createdAt).toLocaleString()}`);
  doc.moveDown(1);

  doc.fontSize(14).fillColor("#12181B").text("Scores");
  doc.moveDown(0.3);
  doc.fontSize(11).fillColor("#2F6F5E");
  [
    ["Overall ATS score", atsMetrics.overallScore],
    ["Formatting", atsMetrics.formattingScore],
    ["Keyword usage", atsMetrics.keywordDensityScore],
    ["Impact & metrics", atsMetrics.actionVerbScore],
  ].forEach(([label, value]) => doc.text(`${label}: ${value}/100`));
  doc.moveDown(1);

  doc.fontSize(14).fillColor("#12181B").text("Strengths");
  doc.fontSize(10).fillColor("#12181B");
  (strengths || []).forEach((s) => doc.text(`+ ${s}`));
  doc.moveDown(0.6);

  doc.fontSize(14).fillColor("#12181B").text("Improvement areas");
  doc.fontSize(10).fillColor("#C8622A");
  (improvementAreas || []).forEach((s) => doc.text(`- ${s}`));
  doc.moveDown(0.6);

  doc.fontSize(14).fillColor("#12181B").text("Extracted skills");
  doc.fontSize(10).fillColor("#12181B").text((parsedContent?.skills || []).join(", "));

  doc.end();
};
