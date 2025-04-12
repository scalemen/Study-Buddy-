import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateStudyMaterial, generateQuiz } from "./services/openai";
import { generateStudyMaterialSchema, generateQuizSchema, submitQuizAnswerSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Study session routes
  app.post("/api/study-sessions", async (req: Request, res: Response) => {
    try {
      const result = generateStudyMaterialSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request data", errors: result.error.errors });
      }

      // Default to user ID 1 for demo purposes (in a real app, would use authenticated user)
      const userId = 1;

      // Generate study material using OpenAI
      const content = await generateStudyMaterial(result.data);
      
      // Extract subject from topic or use default
      const subject = result.data.subject || detectSubject(result.data.topic);

      // Create study session
      const session = await storage.createStudySession({
        userId,
        topic: result.data.topic,
        subject,
        content,
        format: result.data.format,
        difficulty: result.data.difficulty,
        learningStyle: result.data.learningStyle,
        includeExamples: result.data.includeExamples,
        includeVisuals: result.data.includeVisuals
      });

      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating study session:", error);
      res.status(500).json({ message: "Failed to create study session" });
    }
  });

  app.get("/api/study-sessions", async (req: Request, res: Response) => {
    try {
      // Default to user ID 1 for demo purposes (in a real app, would use authenticated user)
      const userId = 1;
      const sessions = await storage.getStudySessionsByUserId(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      res.status(500).json({ message: "Failed to fetch study sessions" });
    }
  });

  app.get("/api/study-sessions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }

      const session = await storage.getStudySession(id);
      if (!session) {
        return res.status(404).json({ message: "Study session not found" });
      }

      // Update last accessed timestamp
      await storage.updateStudySessionLastAccessed(id);
      
      res.json(session);
    } catch (error) {
      console.error("Error fetching study session:", error);
      res.status(500).json({ message: "Failed to fetch study session" });
    }
  });

  app.delete("/api/study-sessions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }

      const deleted = await storage.deleteStudySession(id);
      if (!deleted) {
        return res.status(404).json({ message: "Study session not found" });
      }

      res.status(204).end();
    } catch (error) {
      console.error("Error deleting study session:", error);
      res.status(500).json({ message: "Failed to delete study session" });
    }
  });

  // Quiz routes
  app.get("/api/quizzes", async (req: Request, res: Response) => {
    try {
      // Default to user ID 1 for demo purposes (in a real app, would use authenticated user)
      const userId = 1;
      
      // Get quizzes for the user
      const quizzes = await storage.getQuizzesByUserId(userId);
      
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });
  
  app.post("/api/quizzes", async (req: Request, res: Response) => {
    try {
      const result = generateQuizSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request data", errors: result.error.errors });
      }

      // Default to user ID 1 for demo purposes (in a real app, would use authenticated user)
      const userId = 1;
      
      // Generate quiz questions using OpenAI
      const quizData = await generateQuiz(result.data);
      
      // Extract subject from topic or use default
      const subject = result.data.subject || detectSubject(result.data.topic);

      // Create quiz
      const quiz = await storage.createQuiz({
        sessionId: result.data.sessionId,
        userId,
        topic: result.data.topic,
        subject,
        difficulty: result.data.difficulty,
        totalQuestions: result.data.totalQuestions
      });

      // Create quiz questions
      for (const questionData of quizData.questions) {
        await storage.createQuizQuestion({
          quizId: quiz.id,
          questionText: questionData.questionText,
          options: questionData.options,
          correctOptionIndex: questionData.correctOptionIndex,
          explanation: questionData.explanation
        });
      }

      // Get the created quiz with questions
      const questions = await storage.getQuizQuestionsByQuizId(quiz.id);
      
      res.status(201).json({
        quiz,
        questions
      });
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).json({ message: "Failed to create quiz" });
    }
  });

  app.get("/api/quizzes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid quiz ID" });
      }

      const quiz = await storage.getQuiz(id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      const questions = await storage.getQuizQuestionsByQuizId(id);
      
      res.json({
        quiz,
        questions
      });
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  app.post("/api/quizzes/:id/answers", async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.id);
      if (isNaN(quizId)) {
        return res.status(400).json({ message: "Invalid quiz ID" });
      }

      const result = submitQuizAnswerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request data", errors: result.error.errors });
      }

      // Validate quiz ID matches
      if (quizId !== result.data.quizId) {
        return res.status(400).json({ message: "Quiz ID mismatch" });
      }

      // Submit answer
      const updatedQuestion = await storage.submitQuizAnswer(
        result.data.questionId,
        result.data.answer
      );

      if (!updatedQuestion) {
        return res.status(404).json({ message: "Question not found" });
      }

      // Check if all questions are answered for this quiz
      const questions = await storage.getQuizQuestionsByQuizId(quizId);
      const allAnswered = questions.every(q => q.userAnswer !== null);
      
      if (allAnswered) {
        // Calculate score
        const correctCount = questions.filter(q => q.correct).length;
        const score = Math.round((correctCount / questions.length) * 100);
        
        // Update quiz score and mark as completed
        await storage.updateQuizScore(quizId, score);
        await storage.markQuizCompleted(quizId);
      }

      res.json(updatedQuestion);
    } catch (error) {
      console.error("Error submitting quiz answer:", error);
      res.status(500).json({ message: "Failed to submit quiz answer" });
    }
  });

  app.get("/api/quizzes/:id/results", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid quiz ID" });
      }

      const quiz = await storage.getQuiz(id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      const questions = await storage.getQuizQuestionsByQuizId(id);
      
      res.json({
        quiz,
        questions,
        completed: quiz.completed,
        score: quiz.score
      });
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      res.status(500).json({ message: "Failed to fetch quiz results" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to detect subject from topic
function detectSubject(topic: string): string {
  const lowerTopic = topic.toLowerCase();
  
  if (lowerTopic.includes("math") || lowerTopic.includes("calculus") || lowerTopic.includes("algebra") || lowerTopic.includes("geometry")) {
    return "Mathematics";
  } else if (lowerTopic.includes("physics") || lowerTopic.includes("mechanics") || lowerTopic.includes("quantum")) {
    return "Physics";
  } else if (lowerTopic.includes("biology") || lowerTopic.includes("cell") || lowerTopic.includes("organism") || lowerTopic.includes("genetics")) {
    return "Biology";
  } else if (lowerTopic.includes("chemistry") || lowerTopic.includes("chemical") || lowerTopic.includes("molecule")) {
    return "Chemistry";
  } else if (lowerTopic.includes("history") || lowerTopic.includes("war") || lowerTopic.includes("century")) {
    return "History";
  } else if (lowerTopic.includes("literature") || lowerTopic.includes("novel") || lowerTopic.includes("poetry")) {
    return "Literature";
  } else if (lowerTopic.includes("computer") || lowerTopic.includes("programming") || lowerTopic.includes("algorithm")) {
    return "Computer Science";
  } else {
    return "General";
  }
}
