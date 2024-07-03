"use client";

import { useEffect, useRef, useState } from "react";
import { htmlToPdf } from "@/lib/html-to-pdf";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import axios from "axios";
import { Certificate } from "@prisma/client";

const CertificatePage = ({
  params,
}: {
  params: { courseId: string; examId: string; certificateId: string };
}) => {
  const htmlRef = useRef<HTMLDivElement>(null);

  const { userId } = useAuth();

  const [certificate, setCertificate] = useState<Certificate>();

  const [isGettingCertificate, setisGettingCertificate] = useState(false);

  useEffect(() => {
    (async () => {
      setisGettingCertificate(true);
      try {
        const response = await axios.get(
          `/api/courses/${params.courseId}/exam//${params.examId}/certificate/${params.certificateId}`
        );

        setCertificate(response.data);

        if (!response.data) {
          redirect(`/courses/${params.courseId}`);
        }

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
            className="w-full h-[450px] shadow-lg flex flex-row-reverse text-right"
          >
            <div className="h-full flex-[.9] flex flex-col items-end justify-center px-12 pt-2 pb-12 mb-12 space-y-4">
              <div className="flex -space-x-3">
                <div className="font-extrabold text-sky-700 text-5xl italic">ل</div>
                <div className="font-extrabold text-green-700 text-5xl">م</div>
                <div className="font-extrabold text-sky-300 text-5xl italic">س</div>
              </div>

              <div>
                <div className="text-4xl text-sky-700 font-bold">
                شهادة الانتهاء
                </div>
                <div className="text-2xl text-sky-700 font-light">
                تهانينا،
                </div>
              </div>
              <div>
                <div className="text-3xl text-sky-700 font-bold">
                  {certificate?.nameOfStudent}
                </div>
                <div className="text-xl text-sky-700">
                تم إكماله بنجاح
                </div>
              </div>
              <div>
                <div className="text-3xl text-sky-700 font-bold">
                  {certificate?.courseTitle}
                </div>
                <div className="text-xl text-sky-700">
                اكتمل على{" "}
                  <span className="font-semibold">
                    {" "}
                    {certificate?.dateOfIssuance.toLocaleString().split("T")[0]}
                  </span>
                </div>
              </div>
              <div className="-space-y-2">
                <div className="text-base text-sky-700">
                بإكمال هذه الدورة تكون قد أضفت إليك المعرفة والخبرة
                  مهارات،
                </div>
                <div className="text-base text-sky-700">
                وخلقت لك فرصًا جديدة
                </div>
              </div>
            </div>
            <div className="min-h-full h-full bg-sky-700 w-40 flex justify-center border-r-8 border-l-8 border-green-700">
              <div className="bg-sky-700 h-full w-full relative">
                <Image
                  src="/badge.jpg"
                  alt="badge"
                  width={180}
                  height={180}
                  className="aspect-auto mt-8 h-fit rounded-full absolute top-10"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CertificatePage;
