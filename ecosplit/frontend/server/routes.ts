import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // API Routes
  app.get('/api/receipts', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = req.user?.id;
    
    try {
      const receipts = await storage.getReceiptsByUserId(userId);
      res.json(receipts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching receipts" });
    }
  });

  app.post('/api/receipts', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = req.user?.id;
    
    try {
      const receipt = {
        ...req.body,
        userId,
      };
      const newReceipt = await storage.createReceipt(receipt);
      res.status(201).json(newReceipt);
    } catch (error) {
      res.status(500).json({ message: "Error creating receipt" });
    }
  });

  app.get('/api/receipts/:id', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = req.user?.id;
    const receiptId = parseInt(req.params.id);
    
    try {
      const receipt = await storage.getReceiptById(receiptId);
      if (!receipt || receipt.userId !== userId) {
        return res.status(404).json({ message: "Receipt not found" });
      }
      res.json(receipt);
    } catch (error) {
      res.status(500).json({ message: "Error fetching receipt" });
    }
  });

  app.get('/api/greenscores', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const greenScores = await storage.getTopGreenScores();
      res.json(greenScores);
    } catch (error) {
      res.status(500).json({ message: "Error fetching green scores" });
    }
  });

  app.get('/api/greenscores/me', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = req.user?.id;
    
    try {
      const greenScore = await storage.getUserGreenScore(userId);
      res.json(greenScore);
    } catch (error) {
      res.status(500).json({ message: "Error fetching green score" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
