import { users, receipts, receiptItems, greenScores } from "@shared/schema";
import type { User, InsertUser, Receipt, InsertReceipt, GreenScore, InsertGreenScore, ReceiptItem, InsertReceiptItem } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Receipt operations
  getReceiptsByUserId(userId: number): Promise<Receipt[]>;
  getReceiptById(id: number): Promise<Receipt | undefined>;
  createReceipt(receipt: InsertReceipt): Promise<Receipt>;
  
  // Receipt items operations
  getReceiptItemsByReceiptId(receiptId: number): Promise<ReceiptItem[]>;
  createReceiptItem(item: InsertReceiptItem): Promise<ReceiptItem>;
  
  // Green score operations
  getTopGreenScores(limit?: number): Promise<(GreenScore & { username: string })[]>;
  getUserGreenScore(userId: number): Promise<GreenScore | undefined>;
  updateGreenScore(score: InsertGreenScore): Promise<GreenScore>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersStore: Map<number, User>;
  private receiptsStore: Map<number, Receipt>;
  private receiptItemsStore: Map<number, ReceiptItem>;
  private greenScoresStore: Map<number, GreenScore>;
  
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private receiptIdCounter: number;
  private receiptItemIdCounter: number;
  private greenScoreIdCounter: number;

  constructor() {
    this.usersStore = new Map();
    this.receiptsStore = new Map();
    this.receiptItemsStore = new Map();
    this.greenScoresStore = new Map();
    
    this.userIdCounter = 1;
    this.receiptIdCounter = 1;
    this.receiptItemIdCounter = 1;
    this.greenScoreIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }

  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersStore.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersStore.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user = { ...userData, id, createdAt: new Date() };
    this.usersStore.set(id, user);
    return user;
  }

  // Receipt Methods
  async getReceiptsByUserId(userId: number): Promise<Receipt[]> {
    return Array.from(this.receiptsStore.values()).filter(
      (receipt) => receipt.userId === userId
    );
  }

  async getReceiptById(id: number): Promise<Receipt | undefined> {
    return this.receiptsStore.get(id);
  }

  async createReceipt(receiptData: InsertReceipt): Promise<Receipt> {
    const id = this.receiptIdCounter++;
    const receipt = { ...receiptData, id, date: new Date(), processed: false };
    this.receiptsStore.set(id, receipt);
    return receipt;
  }

  // Receipt Item Methods
  async getReceiptItemsByReceiptId(receiptId: number): Promise<ReceiptItem[]> {
    return Array.from(this.receiptItemsStore.values()).filter(
      (item) => item.receiptId === receiptId
    );
  }

  async createReceiptItem(itemData: InsertReceiptItem): Promise<ReceiptItem> {
    const id = this.receiptItemIdCounter++;
    const item = { ...itemData, id };
    this.receiptItemsStore.set(id, item);
    return item;
  }

  // Green Score Methods
  async getTopGreenScores(limit: number = 10): Promise<(GreenScore & { username: string })[]> {
    const scores = Array.from(this.greenScoresStore.values());
    
    // Sort by score in descending order
    const sortedScores = scores.sort((a, b) => b.score - a.score);
    
    // Get top N scores
    const topScores = sortedScores.slice(0, limit);
    
    // Add username to each score
    return await Promise.all(
      topScores.map(async (score) => {
        const user = await this.getUser(score.userId);
        return {
          ...score,
          username: user?.username || 'Unknown',
        };
      })
    );
  }

  async getUserGreenScore(userId: number): Promise<GreenScore | undefined> {
    return Array.from(this.greenScoresStore.values()).find(
      (score) => score.userId === userId
    );
  }

  async updateGreenScore(scoreData: InsertGreenScore): Promise<GreenScore> {
    // Check if user already has a score for this week/year
    const existingScore = Array.from(this.greenScoresStore.values()).find(
      (score) => 
        score.userId === scoreData.userId &&
        score.week === scoreData.week &&
        score.year === scoreData.year
    );
    
    if (existingScore) {
      // Update existing score
      const updatedScore = { ...existingScore, score: scoreData.score };
      this.greenScoresStore.set(existingScore.id, updatedScore);
      return updatedScore;
    } else {
      // Create new score
      const id = this.greenScoreIdCounter++;
      const newScore = { ...scoreData, id };
      this.greenScoresStore.set(id, newScore);
      return newScore;
    }
  }
}

export const storage = new MemStorage();
