import { 
  users, type User, type InsertUser, 
  studySessions, type StudySession, type InsertStudySession,
  quizzes, type Quiz, type InsertQuiz,
  quizQuestions, type QuizQuestion, type InsertQuizQuestion
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Study session methods
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  getStudySession(id: number): Promise<StudySession | undefined>;
  getStudySessionsByUserId(userId: number): Promise<StudySession[]>;
  updateStudySessionLastAccessed(id: number): Promise<StudySession | undefined>;
  deleteStudySession(id: number): Promise<boolean>;

  // Quiz methods
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  getQuizzesByUserId(userId: number): Promise<Quiz[]>;
  getQuizzesBySessionId(sessionId: number): Promise<Quiz[]>;
  updateQuizScore(id: number, score: number): Promise<Quiz | undefined>;
  markQuizCompleted(id: number): Promise<Quiz | undefined>;

  // Quiz question methods
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  getQuizQuestionsByQuizId(quizId: number): Promise<QuizQuestion[]>;
  submitQuizAnswer(questionId: number, answer: number): Promise<QuizQuestion | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Study session methods
  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    // Make sure userId is 1 if not provided (for demo purposes)
    if (!session.userId) {
      session.userId = 1;
    }
    
    const [newSession] = await db.insert(studySessions).values({
      ...session,
      // These will be set by defaultNow() in the schema
      createdAt: undefined,
      lastAccessed: undefined
    }).returning();
    
    return newSession;
  }

  async getStudySession(id: number): Promise<StudySession | undefined> {
    const [session] = await db.select().from(studySessions).where(eq(studySessions.id, id));
    return session;
  }

  async getStudySessionsByUserId(userId: number): Promise<StudySession[]> {
    return await db.select()
      .from(studySessions)
      .where(eq(studySessions.userId, userId))
      .orderBy(desc(studySessions.lastAccessed));
  }

  async updateStudySessionLastAccessed(id: number): Promise<StudySession | undefined> {
    const now = new Date();
    const [updatedSession] = await db.update(studySessions)
      .set({ lastAccessed: now })
      .where(eq(studySessions.id, id))
      .returning();
      
    return updatedSession;
  }

  async deleteStudySession(id: number): Promise<boolean> {
    const result = await db.delete(studySessions).where(eq(studySessions.id, id));
    return !!result; // Convert to boolean
  }

  // Quiz methods
  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    // Make sure userId is 1 if not provided (for demo purposes)
    if (!quiz.userId) {
      quiz.userId = 1;
    }
    
    const [newQuiz] = await db.insert(quizzes).values({
      ...quiz,
      // These will be handled by defaults in the schema
      completed: undefined,
      score: undefined,
      createdAt: undefined
    }).returning();
    
    return newQuiz;
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }

  async getQuizzesByUserId(userId: number): Promise<Quiz[]> {
    return await db.select()
      .from(quizzes)
      .where(eq(quizzes.userId, userId))
      .orderBy(desc(quizzes.createdAt));
  }

  async getQuizzesBySessionId(sessionId: number): Promise<Quiz[]> {
    return await db.select()
      .from(quizzes)
      .where(eq(quizzes.sessionId, sessionId))
      .orderBy(desc(quizzes.createdAt));
  }

  async updateQuizScore(id: number, score: number): Promise<Quiz | undefined> {
    const [updatedQuiz] = await db.update(quizzes)
      .set({ score })
      .where(eq(quizzes.id, id))
      .returning();
      
    return updatedQuiz;
  }

  async markQuizCompleted(id: number): Promise<Quiz | undefined> {
    const [updatedQuiz] = await db.update(quizzes)
      .set({ completed: true })
      .where(eq(quizzes.id, id))
      .returning();
      
    return updatedQuiz;
  }

  // Quiz question methods
  async createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion> {
    const [newQuestion] = await db.insert(quizQuestions).values({
      ...question,
      // These will be null by default
      userAnswer: undefined,
      correct: undefined
    }).returning();
    
    return newQuestion;
  }

  async getQuizQuestionsByQuizId(quizId: number): Promise<QuizQuestion[]> {
    return await db.select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));
  }

  async submitQuizAnswer(questionId: number, answer: number): Promise<QuizQuestion | undefined> {
    // First get the question to check if the answer is correct
    const [question] = await db.select()
      .from(quizQuestions)
      .where(eq(quizQuestions.id, questionId));
      
    if (!question) return undefined;
    
    // Determine if the answer is correct
    const isCorrect = answer === question.correctOptionIndex;
    
    // Update the question with the user's answer
    const [updatedQuestion] = await db.update(quizQuestions)
      .set({
        userAnswer: answer,
        correct: isCorrect
      })
      .where(eq(quizQuestions.id, questionId))
      .returning();
      
    return updatedQuestion;
  }
}

// Create a demo user when the app starts
async function ensureDemoUser() {
  const demoUser = await db.select().from(users).where(eq(users.username, "demo"));
  if (demoUser.length === 0) {
    await db.insert(users).values({
      username: "demo",
      password: "password"
    });
  }
}

ensureDemoUser().catch(console.error);

export const storage = new DatabaseStorage();
