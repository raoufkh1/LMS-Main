import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function htmlToPdf(htmlElement: HTMLElement) {
  const input = document.getElementById(htmlElement.id);

  if (!input) {
    throw new Error("HTML element not found");
  }

  // input.style.height = "794px";
  // input.style.width = "1123px";

  return new Promise((resolve, reject) => {
    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: [297, 180],
        });
        pdf.addImage(imgData, "PNG", 0, 0, 297, 180);
        resolve(pdf.output("blob"));
      })
      .catch((error) => {
        reject(error);
      });
  });
}
