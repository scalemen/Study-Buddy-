import { apiRequest } from "@/lib/queryClient";
import {
  GenerateStudyMaterialRequest,
  StudySession,
  GenerateQuizRequest,
  Quiz,
  QuizQuestion,
  SubmitQuizAnswerRequest
} from "@shared/schema";

// Study session API functions
export const createStudySession = async (data: GenerateStudyMaterialRequest): Promise<StudySession> => {
  const res = await apiRequest("POST", "/api/study-sessions", data);
  return await res.json();
};

export const getStudySessions = async (): Promise<StudySession[]> => {
  const res = await apiRequest("GET", "/api/study-sessions");
  return await res.json();
};

export const getStudySession = async (id: number): Promise<StudySession> => {
  const res = await apiRequest("GET", `/api/study-sessions/${id}`);
  return await res.json();
};

export const deleteStudySession = async (id: number): Promise<void> => {
  await apiRequest("DELETE", `/api/study-sessions/${id}`);
};

// Quiz API functions
export const getQuizzes = async (): Promise<Quiz[]> => {
  const res = await apiRequest("GET", "/api/quizzes");
  return await res.json();
};

export const createQuiz = async (data: GenerateQuizRequest): Promise<{
  quiz: Quiz;
  questions: QuizQuestion[];
}> => {
  const res = await apiRequest("POST", "/api/quizzes", data);
  return await res.json();
};

export const getQuiz = async (id: number): Promise<{
  quiz: Quiz;
  questions: QuizQuestion[];
}> => {
  const res = await apiRequest("GET", `/api/quizzes/${id}`);
  return await res.json();
};

export const submitQuizAnswer = async (data: SubmitQuizAnswerRequest): Promise<QuizQuestion> => {
  const res = await apiRequest("POST", `/api/quizzes/${data.quizId}/answers`, data);
  return await res.json();
};

export const getQuizResults = async (id: number): Promise<{
  quiz: Quiz;
  questions: QuizQuestion[];
  completed: boolean;
  score: number;
}> => {
  const res = await apiRequest("GET", `/api/quizzes/${id}/results`);
  return await res.json();
};
