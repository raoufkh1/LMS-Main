"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Preview } from "@/components/preview";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { Chapter, Course, Prisma } from "@prisma/client";
import axios from "axios";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { Banner } from "@/components/banner";
import Link from "next/link";

type QuizWithQuestionsAndOptions = Prisma.QuizGetPayload<{
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
  params: { courseId: string; examId: string; chapterId: string };
}) => {
  const { userId } = useAuth();

  const router = useRouter();

  const confetti = useConfettiStore();

  const [course, setCourse] = useState<Course | null>();

  const [quiz, setQuiz] = useState<QuizWithQuestionsAndOptions | null>();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [hasSubmitted, sethasSubmitted] = useState<boolean>(false);

  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // State to store the user's selected options
  const [userSelections, setUserSelections] = useState<{
    [key: string]: number;
  }>({});

  // Calculate the time per question (5 minutes)
  const TIME_PER_QUESTION_MS = 5 * 60 * 1000;

  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);

  const [points, setPoints] = useState<number>(0);

  const hasTakenQuiz = quiz && quiz.userId !== "nil";

  // Check if userSelections has any members
  const hasUserSelections = Object.keys(userSelections).length > 0;

  const handleOptionChange = (questionId: string, optionPosition: number) => {
    sethasSubmitted(false)
    setUserSelections((prevSelections) => ({
      ...prevSelections,
      [questionId]: optionPosition,
    }));
  };

  const handleSubmit = useCallback(async () => {
    if (!quiz || !hasUserSelections) return;

    setIsSubmitting(true);
        sethasSubmitted(true);

    try {
      const response = await axios.patch(
        `/api/courses/${params.courseId}/chapters/${params.chapterId}/quiz/${quiz.id}`,
        {
          userId: userId,
        }
      );


      console.log("====================================");
      console.log(response);
      console.log("====================================");

      if (points != undefined && points > 50) {
        const quizResponse = await axios.put(
          `/api/courses/${params.courseId}/chapters/${params.chapterId}/quiz/${quiz.id}/progress`,
          {
            points,
          }
        );

        console.log("====================================");
        console.log(quizResponse);
        console.log("====================================");

        sethasSubmitted(true);

        toast.success("تهانينا على اجتياز الاختبار", {
          duration: 4000,
        });

        confetti.onOpen();
      } else {
        

        toast.error(
          "عذرًا، عليك إجراء الاختبار مرة أخرى. لم تصل إلى علامة النجاح.",
          {
            duration: 4000,
          }
        );
      }

      router.refresh();
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");

      toast.error("هناك خطأ ما");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    confetti,
    hasUserSelections,
    params.chapterId,
    params.courseId,
    points,
    quiz,
    router,
    userId,
  ]);

  // Fetch the quiz data and update the time remaining
  useEffect(() => {
    if (quiz) {
      // Calculate the total time based on the number of questions
      const totalTime = quiz.questions.length * TIME_PER_QUESTION_MS;
      setTimeRemaining(totalTime);
    }
  }, [TIME_PER_QUESTION_MS, quiz]);

  // Function to decrement the time remaining every second
  const countdown = () => {
    setTimeRemaining((prevTime) => Math.max(0, prevTime - 1000));
  };

  useEffect(() => {
    // Start the countdown timer when the component mounts
    const timerId = setInterval(countdown, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    // If time is up, set isSubmitting to true
    if (timeRemaining === 0) {
      handleSubmit();
    }
  }, [handleSubmit, timeRemaining]);

  useEffect(() => {
    if (hasTakenQuiz && hasSubmitted) {
      sethasSubmitted(true);
    }
  }, [hasSubmitted, hasTakenQuiz]);

  useEffect(() => {
    if (hasSubmitted) return;
    const totalQuestions = quiz?.questions.length;

    let correct = 0;
    let answered = 0;
    let wrong = 0;

    if (!totalQuestions) return;

    quiz?.questions.forEach((question) => {
      const questionId = question.id;
      const userSelectedPosition = userSelections[question.id];
      const correctAnswerPosition = parseInt(question.answer) - 1;

      if (userSelectedPosition !== undefined) {
        answered++;
        if (userSelectedPosition === correctAnswerPosition) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    setAnsweredQuestions(answered);
    setCorrectAnswers(correct);
    setWrongAnswers(wrong);
    setPoints((correct / totalQuestions) * 100);

    // Enable submission when all questions are answered
    setCanSubmit(answered === totalQuestions);
  }, [userSelections, hasSubmitted, quiz?.questions]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [chapterResponse, courseResponse] = await Promise.all([
          axios.get(
            `/api/courses/${params.courseId}/chapters/${params.chapterId}`
          ),
          axios.get(`/api/courses/${params.courseId}`),
        ]);

        setQuiz(chapterResponse.data.quiz);
        setCourse(courseResponse.data);

        console.log("====================================");
        console.log("====================================");
      } catch (error) {
        console.log("====================================");
        console.log(error);
        console.log("====================================");
        toast.error("هناك شئ غير صحيح");
      }
    }

    fetchData();
  }, [params.chapterId, params.courseId, userId]);

  if (!userId) {
    return redirect("/");
  }

  return (
    <>
      {quiz ? (
        <div>
          {hasSubmitted ? (
            <Banner
              variant={wrongAnswers > correctAnswers ? "warning" : "success"}
              label={`:الأسئلة التي تمت الإجابة عليها ${answeredQuestions}    |    الإجابات الصحيحة: ${correctAnswers}    |    إجابات خاطئة: ${wrongAnswers} `}
            />
          ) : (
            <div className="w-full flex flex-col justify-center items-end h-12 pt-12 px-6">
              <div className="flex space-x-4 items-center">
                <h1 className="text-lg md:text-xl font-medium capitalize">
                الوقت المتبقي: {Math.floor(timeRemaining / 60000)}:
                  {((timeRemaining % 60000) / 1000).toFixed(0).padStart(2, "0")}
                </h1>

                <span className="mx-4">|</span>

                <h1 className="text-lg md:text-2xl font-medium capitalize">
                  {quiz?.title} <span>اختبار</span>
                </h1>
                <span className="mx-4">|</span>
                <h1 className="text-lg md:text-2xl font-medium capitalize">
                  {course?.title}
                </h1>
              </div>
              <div className="flex space-x-3 ">
                <div className="text-md">
                  {canSubmit} أسئلة تمت الإجابة عليها {answeredQuestions}
                </div>
                <div className="text-md">{quiz?.description}</div>
                <div className="text-md">
                مجموع الأسئلة {quiz?.questions.length}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col px-10 mt-10  items-center relative">
            
                {quiz?.questions.map((question, index) => (
                  <CarouselItem key={index} className="w-full mb-4">
                    <div className="bg-sky-100 border border-slate-200 rounded-lg p-4 max-w-full ">
                      <div className="w-full flex h-fit flex-col items-end">
                        <div className="font-medium text-slate-500 mb-4 text-right">
                        سؤال {index + 1}
                        </div>
                        <div className="text-slate-700 font-bold text-lg">
                          {question.prompt}
                        </div>
                        {question.explanation && (
                          <div className="text-slate-700 font-bold -mr-4 -mt-1 mb-4">
                            <Preview value={question.explanation} />
                          </div>
                        )}
                        <div className="flex flex-col items-end space-y-2 w-full mb-4 ">
                          {question.options.map((option, index) => (
                            <div key={option.id}>
                              {hasSubmitted ? (
                                <div className={`flex space-x-2 ${index + 1 == parseInt(question.answer) ? "text-green-500" : "text-red-500"}`}>
                                  <label className="capitalize text-sm">
                                    {option.text}
                                  </label>
                                  <input
                                    className="mr-2"
                                    type="radio"
                                    name={question.id}
                                    value={index + 1}
                                    onChange={() =>
                                      handleOptionChange(
                                        question.id,
                                        index
                                        
                                      )
                                    }
                                  />
                                </div>
                              ) : (
                                <div className="flex space-x-2">
                                  <label className="block capitalize text-sm">
                                    {option.text}
                                  </label>

                                  <input
                                    className="mr-2"
                                    type="radio"
                                    name={question.id}
                                    value={index + 1}
                                    onChange={() =>
                                      handleOptionChange(
                                        question.id,
                                        index
                                        
                                      )
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              
              
            <div className="flex flex-col justify-end items-end w-full space-y-3 mr-12 md:mr-20">
              {hasSubmitted && points != undefined ? (
                <div>
                  {`You scored ${points.toFixed(2)} points
              `}
                </div>
              ) : (
                <div className="">هل أنت واثق من أنك انتهيت؟</div>
              )}
              <div className="flex flex-row space-x-4 items-center">
                {points > 50 && hasSubmitted ? (
                  <Link
                    href={`/courses/${params.courseId}/chapters/${params.chapterId}`}
                    className={cn(
                      "bg-teal-500 text-white w-fit font-bold text-sm px-4 py-2 rounded-md"
                    )}
                  >
                    العودة إلى الدورة الخاصة بك
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className={cn(
                      "bg-teal-500 text-white w-fit font-bold text-sm px-4 py-2 rounded-md",
                      (!canSubmit || isSubmitting || hasSubmitted) &&
                        "bg-slate-400 cursor-not-allowed pointer-events-none"
                    )}
                  >
                    يُقدِّم
                  </button>
                )}
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
