import pdfParse from "pdf-parse";
import mammoth from "mammoth";

/**
 * Extracts raw plain text from an uploaded resume buffer.
 * Supports PDF and DOCX. Throws on unsupported/corrupted files.
 */
export const extractTextFromFile = async (buffer, mimetype) => {
  let text = "";

  if (mimetype === "application/pdf") {
    const data = await pdfParse(buffer);
    text = data.text;
  } else if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const { value } = await mammoth.extractRawText({ buffer });
    text = value;
  } else {
    throw new Error("Unsupported file type");
  }

  const cleaned = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleaned || cleaned.length < 30) {
    throw new Error("Could not extract meaningful text from the file. Is it a scanned image?");
  }

  return cleaned;
};
