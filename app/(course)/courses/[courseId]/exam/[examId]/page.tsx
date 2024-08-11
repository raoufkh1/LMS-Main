"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";

import { Preview } from "@/components/preview";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { Prisma, Certificate, Course } from "@prisma/client";
import axios from "axios";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { getProgress } from "@/actions/get-progress";
import { Banner } from "@/components/banner";
import { PrepareCertificateModal } from "@/components/modals/exam-certificate-modal";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { escape } from "querystring";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

type ExamWithQuestionsAndOptions = Prisma.ExamGetPayload<{
  include: {
    certificate: true;
    questions: {
      where: {
        isPublished: true;
      };
      include: {
        options: true;
      };
    };
  };
}>;

const ExamIdPage = ({
  params,
}: {
  params: { courseId: string; examId: string };
}) => {
  const { userId } = useAuth();

  const confetti = useConfettiStore();

  const [exam, setExam] = useState<ExamWithQuestionsAndOptions | null>();

  const [course, setCourse] = useState<Course | null>();

  const [certificateId, setCertificateId] = useState("");

  const [progressCount, setProgressCount] = useState<number>();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [hasSubmitted, sethasSubmitted] = useState<boolean>(false);

  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const [failedInExam, setFailedInExam] = useState<boolean>(false)

  const [isFirstExam, setFirstExam] = useState<boolean>(false)
  // State to store the user's selected options
  const [userSelections, setUserSelections] = useState<{
    [key: string]: number;
  }>({});

  // Calculate the time per question (5 minutes)
  const TIME_PER_QUESTION_MS = 5 * 60 * 1000;
  const router = useRouter()
  const [answeredQuestions, setAnswersQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [scorePercentage, setScorePercentage] = useState(0);

  const hasTakenTheExamBefore =
    exam && exam.userId !== "nil" && exam.beforeScore;

  const hasUserSelections = Object.keys(userSelections).length > 0;

  const handleOptionChange = (questionId: string, optionPosition: number) => {
    setUserSelections((prevSelections) => ({
      ...prevSelections,
      [questionId]: optionPosition,
    }));
  };
  const handleRepeat = () => {

    setUserSelections({})
    sethasSubmitted(false)
    setFailedInExam(false)
    setCanSubmit(false)
  }
  const handleSubmit = useCallback(async () => {
    if (!exam || !hasUserSelections || hasSubmitted) return;

    setIsSubmitting(true);

    try {
      const fieldToUpdate = hasTakenTheExamBefore
        ? "afterScore"
        : "beforeScore";



      sethasSubmitted(true);


      if (isFirstExam) {

        toast.success("يمكنك الان البدء في الدورة التدريبية");
      }

      const response = await axios.patch(
        `/api/courses/${params.courseId}/exam/${exam.id}`,
        {
          [fieldToUpdate]: scorePercentage,
          userId: userId,
        }
      );
      if (!isFirstExam) {
        if (scorePercentage < 50) {
          setFailedInExam(true)
          toast.error(`لقد احرزت علامة ${scorePercentage} يمكنك اعادة الاختبار بعد مراجعة الدورة التدريبية مرة أخرى`);
        }
        else {
          toast.success(`احسنت لقد احرزت علامة ${scorePercentage}  `);
          const certificateResponse = await axios.post(
            `/api/courses/${params.courseId}/exam/${response.data.id}/certificate`
          );
          router.refresh()

          if (certificateResponse.status === 200) {

            toast.success("شهادتك جاهزة!");
            setCertificateId(certificateResponse.data.id);
            confetti.onOpen();
          } else {
            toast.error("لا يمكن إنشاء شهادة في هذا الوقت، آسف!");
          }
        }


      }
      if (response) {
        if (isFirstExam) {
          router.refresh()
          // setTimeout(() => {
          //   return router.push(`/courses/${course?.id}`)

          // }, 1500);

        }
      }

      console.log("====================================");
      console.log("====================================");
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");

      toast.error("هناك شئ غير صحيح");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    confetti,
    exam,
    hasUserSelections,
    hasSubmitted,
    hasTakenTheExamBefore,
    params.courseId,
    scorePercentage,
    userId,
  ]);

  // Get the exam data and update the time remaining
  useEffect(() => {
    // Calculate the total time based on the number of questions
    if (exam) {
      const totalTime = exam.questions.length * TIME_PER_QUESTION_MS;
      setTimeRemaining(totalTime);
    }
  }, [TIME_PER_QUESTION_MS, exam]);

  // Function to decrement the time remaining every second
  const countdown = () => {
    setTimeRemaining((prevTime) => {
      const newTime = Math.max(0, prevTime - 1000);
      return newTime;
    });
  };
  const handleNext = () => {
    router.refresh()
    setTimeout(() => {
      return router.push(`/courses/${course?.id}`)

    }, 1000);


  }
  useEffect(() => {
    // Start the countdown timer when the component mounts
    const timerId = setInterval(countdown, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(timerId);
  }, []);
  useEffect(() => {
    // If time is up, set isSubmitting to true
    if (timeRemaining === 0 && !hasSubmitted) {
      handleSubmit();
    }
  }, [handleSubmit, hasSubmitted, timeRemaining]);

  // useEffect(() => {
  //   if (
  //     (hasTakenTheExamBefore && exam.afterScore && exam.afterScore > 50) ||
  //     (hasSubmitted && hasTakenTheExamBefore)
  //   ) {
  //     sethasSubmitted(true);
  //   }
  // }, [exam?.afterScore, hasSubmitted, hasTakenTheExamBefore, params.courseId]);

  useEffect(() => {
    if (hasSubmitted) return;
    const totalQuestions = exam?.questions.length;

    let correct = 0;
    let answered = 0;
    let wrong = 0;

    if (!totalQuestions) return;

    exam?.questions.forEach((question) => {
      const questionId = question.id;
      const userSelectedPosition = userSelections[questionId];
      const correctAnswerPosition = parseInt(question.answer);

      if (userSelectedPosition !== undefined) {
        answered++;
        if (userSelectedPosition === correctAnswerPosition) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    setAnswersQuestions(answered);
    setCorrectAnswers(correct);
    setWrongAnswers(wrong);
    setScorePercentage((correct / totalQuestions) * 100);

    // Enable submission when all questions are answered
  }, [exam?.questions, userSelections, hasSubmitted]);

  useEffect(() => {
    if (answeredQuestions === exam?.questions.length) {
      setCanSubmit(true);
      console.log("ss")
    }
  }, [answeredQuestions, exam?.questions.length]);
  useEffect(() => {
    console.log(exam)
    if (exam?.starterExam) {
      setFirstExam(true)
    }
    else {
      setFirstExam(false)
    }
  }, [exam])
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`/api/courses/${params.courseId}`);
        setExam(response.data.exams.filter((e: any) => e.id == params.examId)[0]);

        console.log("====================================");
        console.log(response.data);
        console.log("====================================");

        setCourse(response.data);

        console.log("====================================");
        console.log(response.data.exams.certificate);
        console.log("====================================");
      } catch (error) {
        console.log("====================================");
        console.log(error);
        console.log("====================================");
        toast.error("هناك شئ غير صحيح");
      }
    })();

    (async () => {
      if (!userId) return;

      const progressCount = await getProgress(userId, params.courseId);
      setProgressCount(progressCount);
    })();
  }, [params.courseId, userId]);

  if (!userId) {
    return redirect("/");
  }

  return (
    <>
      {exam ?
        (hasSubmitted) ?
          isFirstExam ?
            (<div dir="rtl" className="w-full p-20 flex h-full flex-col  gap-4   ">
              <div className="flex flex-col space-x-4 ">
                <h1 className="text-lg md:text-xl font-medium capitalize" > عزيزتي المتدربة انتهى الاختبار القبلي وحصلتي على نسبة {"%" + scorePercentage} </h1>
                <h1 className="text-base md:text-xl font-medium capitalize" > وأتمنى لك المتعة والفائدة من دراسة هذه الدورة. </h1>
              </div>
              <div className="flex flex-col space-y-4 ">
                <p>مجموع الاسئلة: {exam?.questions.length}</p>
                <p>عدد الآسئلة  الصحيحة: {correctAnswers}</p>
                <p>عدد الآسئلة الخاطئة: {wrongAnswers}</p>
                <p>النسبة المئوية: {scorePercentage}</p>
              </div>
              <button
                type="button"
                onClick={handleNext}
                className={
                  "bg-sky-500 text-white w-fit font-bold text-sm px-4 py-2 rounded-md"
                }
              >
                تقدم
              </button>
            </div>) : scorePercentage > 60 ?
              (<div dir="rtl" className="w-full p-20 flex h-full flex-col  gap-4   ">
                <div className="flex flex-col space-x-4 ">
                  <h1 className="text-lg md:text-xl font-medium capitalize" > لقد اجتزت الاختبار بنجاح، ويمكنك الان الحصول على الشهادة</h1>
                </div>
                <div className="flex flex-col space-y-4 ">
                  <p>مجموع الاسئلة: {exam?.questions.length}</p>
                  <p>عدد الآسئلة  الصحيحة: {correctAnswers}</p>
                  <p>عدد الآسئلة الخاطئة: {wrongAnswers}</p>
                  <p>النسبة المئوية: {scorePercentage}</p>
                </div>
                <div>
                  <PrepareCertificateModal
                    courseId={params.courseId}
                    examId={params.examId}
                    certificateId={certificateId}
                  >
                    <Button
                      size="sm"
                      className="bg-sky-500 text-white hover:bg-sky-400"
                    >
                      احصل على شهادتك
                    </Button>
                  </PrepareCertificateModal>

                </div>
              </div>) :
              (<div dir="rtl" className="w-full p-20 flex h-full flex-col  gap-4   ">
                <div className="flex flex-col space-x-4 ">
                  <h1 className="text-lg md:text-xl font-medium capitalize" > ينبغي عليك إعادة الدورة التدريبية مرة أخرى للاستفادة والحصول على الشهادة. </h1>
                </div>
                <div className="flex flex-col space-y-4 ">
                  <p>مجموع الاسئلة: {exam?.questions.length}</p>
                  <p>عدد الآسئلة  الصحيحة: {correctAnswers}</p>
                  <p>عدد الآسئلة الخاطئة: {wrongAnswers}</p>
                  <p>النسبة المئوية: {scorePercentage}</p>
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className={
                    "bg-sky-500 text-white w-fit font-bold text-sm px-4 py-2 rounded-md"
                  }
                >
                  اعادة الاختبار
                </button>
              </div>) :
          (

            <div className="pb-10">
              {hasSubmitted ? (
                <Banner
                  variant={wrongAnswers > correctAnswers ? "warning" : "success"}
                  label={`الأسئلة التي تمت الإجابة عليها: ${answeredQuestions}    |    الإجابات الصحيحة: ${correctAnswers}    |    إجابات خاطئة: ${wrongAnswers} `}
                />
              ) : (
                <div className="w-full flex flex-col  gap-4 justify-center items-end h-12 pt-12 px-6">
                  <div className="flex space-x-4 items-center">
                    <h1 className="text-lg md:text-xl font-medium capitalize">
                      مجموع الأسئلة {exam?.questions.length}

                    </h1>

                    <span className="mx-4">|</span>

                    <h1 className="text-lg md:text-2xl font-medium capitalize">
                      {exam?.title}
                    </h1>
                    <span className="mx-4">|</span>
                    <h1 className="text-lg md:text-2xl font-medium capitalize">
                      {course?.title}
                    </h1>
                  </div>
                  {
                    isFirstExam &&
                    <div className="flex space-x-3 ">
                      <div className="text-md"> <FroalaEditorView model={exam.description} /></div>

                    </div>
                  }
                </div>
              )}

              <div className="flex flex-col px-10 mt-10  items-center relative">

                {exam?.questions.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0)).map((question, index) => (
                  <CarouselItem key={index} className="w-full mb-4">
                    <div className="bg-sky-100 border border-slate-200 rounded-lg p-4 max-w-full ">
                      <div className="w-full flex h-fit flex-col items-end">
                        <div className="font-medium text-slate-500 mb-4 text-right">
                          سؤال {index + 1}
                        </div>
                        <div className="text-slate-700 mb-4 font-bold text-lg" dir="rtl">
                          <FroalaEditorView model={question.prompt} />
                        </div>
                        {question.explanation && (
                          <div className="text-slate-700 font-bold -mr-4 -mt-1 mb-4" dir="rtl">
                            <FroalaEditorView model={question.explanation} />
                          </div>
                        )}
                        <div className="flex flex-col items-end space-y-2 w-full mb-4 ">
                          {question.options.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0)).map((option, index) => {
                            option.position = index + 1
                            console.log(option.position)
                            return (<div key={option.id}>
                              {hasSubmitted || isSubmitting ? (
                                <div className="flex space-x-2">
                                  <label className="capitalize text-sm" dir="rtl">
                                    {option.text}
                                  </label>
                                  <input
                                    className="mr-2"
                                    type="radio"
                                    name={question.id}
                                    value={index + 1}
                                    disabled
                                  />
                                </div>
                              ) : (
                                <div className="flex space-x-2">
                                  <label className="block capitalize text-sm" dir="rtl">
                                    {option.text}
                                  </label>

                                  <input
                                    className="mr-2"
                                    type="radio"
                                    name={question.id}
                                    value={index + 1}
                                    checked={(userSelections[question.id]) == index + 1}
                                    onChange={() =>
                                      handleOptionChange(
                                        question.id,
                                        option.position
                                      )
                                    }
                                  />
                                </div>
                              )}
                            </div>)
                          })}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}



                <div className="flex flex-col justify-end items-end w-full space-y-3 mr-12 md:mr-20">
                  {hasSubmitted && scorePercentage != undefined ? (
                    <div className="text-right w-1/2">
                      {`لقد سجلت النسبة المئوية ${scorePercentage.toFixed(2)}% ${hasTakenTheExamBefore
                        ? "ستتم إضافة درجاتك وتجميعها مع النتيجة التي تحصل عليها عند إجراء الاختبار بعد تعلم الدورة"
                        : "تهانينا!"
                        } `}
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex flex-row space-x-4 items-center">
                    <div className="flex flex-row-reverse gap-4 space-x-4 items-center">
                      {
                        (hasSubmitted && !isFirstExam) ? "" :
                          <button
                            type="button"
                            onClick={handleSubmit}
                            className={cn(
                              "bg-sky-500 text-white w-fit font-bold text-sm px-4 py-2 rounded-md",
                              (!canSubmit || isSubmitting || hasSubmitted) &&
                              "bg-slate-400 cursor-not-allowed"
                            )}
                          >
                            تقدم
                          </button>
                      }
                      {
                        failedInExam && (
                          <button
                            type="button"
                            onClick={handleRepeat}
                            className={cn(
                              "bg-teal-500 text-white w-fit font-bold text-sm px-4 py-2 rounded-md",

                            )}
                          >
                            إعادة الاختبار
                          </button>
                        )
                      }

                      {certificateId !== "" &&
                        certificateId !== undefined &&
                        hasSubmitted &&
                        !isFirstExam &&
                        scorePercentage >= 50 && (
                          <PrepareCertificateModal
                            courseId={params.courseId}
                            examId={params.examId}
                            certificateId={certificateId}
                          >
                            <Button
                              size="sm"
                              className="bg-sky-500 text-white hover:bg-sky-400"
                            >
                              احصل على شهادتك
                            </Button>
                          </PrepareCertificateModal>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
          <div className="flex items-center justify-center h-full w-full">
            <div className="font-bold text-2xl text-slate-500 animate-pulse">
              ...جارٍ تحميل الأسئلة
            </div>
          </div>
        )}
    </>
  );
};

export default ExamIdPage;
