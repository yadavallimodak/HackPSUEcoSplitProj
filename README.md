# EcoSplit - HackPSU 2025

Group Members - Nikhil Saini, Apoorv Thite, Shlok Mehta, Modakapriya Yadavalli

## Inspiration

In today’s world, global warming and sustainability are more than just buzzwords—they’re critical issues that demand attention. While we can’t solve everything overnight, we believe that small, everyday choices matter. Our inspiration stemmed from the idea that real change can happen when people are aware of their impact and motivated to act. We wanted to influence behavior by introducing a simple but effective concept: turn your shopping habits into a game that rewards sustainability. That’s how EcoSplit was born—a web app that lets you upload your receipts, calculates a “Green Score” based on what you bought, and shows how you rank against others in your community.

## What it does

EcoSplit allows users to upload a receipt—either as an image or a pdf—and then analyzes each item for its environmental footprint. Each item receives a score between 0 and 1, depending on its sustainability. For example, a plastic bottle might score around 0.2, while a reusable glass bottle could score 0.7 or higher. After analyzing the receipt, the app gives an overall “Green Score,” and users can compare their score on a community leaderboard. We also introduced a split-bill feature inspired by Splitwise, where users can divide shared receipts and receive individual green scores based on the items they’re responsible for. This makes sustainability a collaborative effort—and a friendly competition.

## How we built it

We began by creating a wireframe using Figma to visualize our design and user experience. Our team of four split into two groups: two members focused on the frontend, initially starting with a Next.js project before transitioning to our current model using React with Vite. Within the frontend team, one teammate worked on designing the logo, while the other developed the website. Meanwhile, the backend team initially attempted to build a custom machine learning model but found it too complex. Instead, we opted for Google’s Gemini model, leveraging its powerful OCR and text classification capabilities to extract and analyze receipt data efficiently.


## Challenges we ran into

One of our biggest challenges was accessing and integrating the API. Connecting the frontend to the backend proved to be more complex than expected, and we spent a significant portion of our time troubleshooting these issues. Additionally, we encountered minor problems with the JSON data structure for POST and GET requests between the backend and frontend, which required careful debugging to resolve.


## Accomplishments that we're proud of

This was our first hackathon, and we’re proud of how we applied concepts from our coursework to build a functional project. We also realized that what we’ve learned so far is just the tip of the iceberg—there’s so much more to explore and master in software development.

## What we learned

Throughout the project, we gained valuable experience in reading documentation, troubleshooting errors, and leveraging AI models to guide us through unfamiliar concepts. This hands-on learning reinforced our ability to adapt and problem-solve in real-world development scenarios.
