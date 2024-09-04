"use client";

import { useEffect, useRef, useState } from "react";
import { htmlToPdf } from "@/lib/html-to-pdf";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import { Certificate } from "@prisma/client";
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';
import fontkit from '@pdf-lib/fontkit'

// Text layer for React-PDF.
import 'react-pdf/dist/Page/TextLayer.css';

const CertificatePage = ({
  params,
}: {
  params: { courseId: string; examId: string; certificateId: string };
}) => {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
  const htmlRef = useRef<HTMLDivElement>(null);
  const [certificatePdf, setCertificatePdf] = useState<string>('')
  const { userId } = useAuth();
  const router = useRouter()
  const [certificate, setCertificate] = useState<Certificate>();

  const [isGettingCertificate, setisGettingCertificate] = useState(false);

  useEffect(() => {
    (async () => {
      setisGettingCertificate(true);
      const url = 'https://uz635cwohid0t4ce.public.blob.vercel-storage.com/Appreciation%20Certificate%20%D8%B4%D9%87%D8%A7%D8%AF%D8%A9%20%D8%AA%D9%82%D8%AF%D9%8A%D8%B1%20%D8%A3%D8%B2%D8%B1%D9%82%20%D9%88%D8%A3%D8%AE%D8%B6%D8%B1%20(2)-4GF2H0oU8fk7pv6dP4xuqGw4mVJUJE.pdf'
      const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
      const pdfDoc = await PDFDocument.load(existingPdfBytes)
      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      console.log(existingPdfBytes)

      try {
        const response = await axios.get(
          `/api/courses/${params.courseId}/exam//${params.examId}/certificate/${params.certificateId}`
        );
        const fontUrl = 'https://uz635cwohid0t4ce.public.blob.vercel-storage.com/Cairo-Regular-IfPEScEah1exU4X87UiQ3sPhWk8hQ6.ttf'
        pdfDoc.registerFontkit(fontkit)
        const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer())
        const customFont = await pdfDoc.embedFont(fontBytes)
        const textSize = 35
        const date = new Date(response.data.createdAt)
        firstPage.drawText(response.data.nameOfStudent, {
          x:  400,
          y: 285,
          size: textSize,
          font: customFont,
          color: rgb(0, 0.53, 0.71),
        })
        firstPage.drawText(response.data.courseTitle, {
          x:  400,
          y: 150,
          size: textSize,
          font: customFont,
          color: rgb(0, 0.53, 0.71),
        })
        firstPage.drawText(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`, {
          x:  150,
          y: 72,
          size: 20,
          font: customFont,
          color: rgb(0, 0.53, 0.71),
        })

        const pdfBytes = await pdfDoc.save()

        var b64encoded = Buffer.from(pdfBytes).toString('base64');
        setCertificatePdf(`data:application/pdf;base64,` + b64encoded)
        console.log(response.data)
        setCertificate(response.data);

        if (!response.data) {
          redirect(`/courses/${params.courseId}`);
        }
        return router.refresh()

        console.log("====================================");
        console.log("====================================");
      } catch (error) {
        console.log("====================================");
        console.log(error);
        console.log("====================================");
        toast.error("هناك شئ غير صحيح");
      } finally {
        setisGettingCertificate(false);
      }
    })();
  }, [params.certificateId, params.courseId, params.examId]);

  if (!userId) {
    return redirect("/");
  }

  const handleDownload = async () => {
    if (!htmlRef.current) {
      toast.error("لا المرجع");
      return;
    }

    try {
      const pdfBlob = await htmlToPdf(htmlRef.current);
      const url = URL.createObjectURL(pdfBlob as Blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "certificate.pdf");
      link.click();
    } catch (error) {
      console.error(error);
      // Handle download failure gracefully
    }
  };

  return (
    <>
      {isGettingCertificate ? (
        <div className="flex items-center justify-center h-full w-full">
          <div className="font-bold text-2xl text-slate-500 animate-pulse">
            ...تحضير شهادتك
          </div>
        </div>
      ) : certificate ? (
        <div className="flex flex-col space-y-8 ml-10 pb-8 mt-8 mr-8">
          <button
            className="self-end rounded-lg text-white font-bold bg-sky-600 max-w-fit py-2 px-3"
            onClick={handleDownload}
          >
            <div> تحميل PDF</div>
          </button>

          <div
            ref={htmlRef}
            id="certificate"
            className="w-full overflow-hidden h-[700px] shadow-lg flex flex-row-reverse text-right"
          >
            <Document file={certificatePdf} >
              <Page height={400} width={1000} pageNumber={1} />
            </Document>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CertificatePage;
