
// import express from "express";
// import { GoogleGenAI } from "@google/genai";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
// import winston from "winston";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";
// import fs from "fs";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // ✅ Logger setup
// const logger = winston.createLogger({
//   level: process.env.LOG_LEVEL || "info",
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.simple()
//   ),
//   transports: [
//     new winston.transports.Console({ 
//       format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.simple()
//       )
//     })
//   ],
// });

// // ✅ Validate environment variables (but don't exit in test mode)
// const isTestMode = process.env.NODE_ENV === "test";
// if (!process.env.GEMINI_API_KEY && !isTestMode) {
//   logger.error("GEMINI_API_KEY is missing in environment variables!");
//   process.exit(1);
// }

// const app = express();

// // ✅ Rate limiting (skip in test mode)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: { error: "Too many requests, please try again later." },
//   standardHeaders: true,
//   legacyHeaders: false,
//   skip: (req) => isTestMode, // Skip rate limiting in tests
// });

// const askLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: 10,
//   message: { error: "Please slow down. Maximum 10 questions per minute." },
//   standardHeaders: true,
//   legacyHeaders: false,
//   skip: (req) => isTestMode, // Skip rate limiting in tests
// });

// // ✅ Security middleware
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
//       scriptSrc: ["'self'", "'unsafe-inline'"],
//       fontSrc: ["https://fonts.gstatic.com"],
//       imgSrc: ["'self'", "data:", "https:"],
//       connectSrc: ["'self'"],
//     },
//   },
// }));

// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// app.use((req, res, next) => {
//   res.setHeader("X-Content-Type-Options", "nosniff");
//   res.setHeader("X-Frame-Options", "DENY");
//   res.setHeader("X-XSS-Protection", "1; mode=block");
//   res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
//   next();
// });

// // ✅ Request logging
// app.use((req, res, next) => {
//   const start = Date.now();
//   res.on("finish", () => {
//     const duration = Date.now() - start;
//     logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
//   });
//   next();
// });

// app.use("/ask", askLimiter);
// app.use("/api/", limiter);

// // ✅ Mock AI for testing
// let ai;
// if (!isTestMode && process.env.GEMINI_API_KEY) {
//   ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY,
//   });
// }

// // ✅ Cache
// class TTLCache {
//   constructor(ttl = 3600000, maxSize = 50) {
//     this.cache = new Map();
//     this.ttl = ttl;
//     this.maxSize = maxSize;
//   }

//   set(key, value) {
//     if (this.cache.size >= this.maxSize) {
//       const firstKey = this.cache.keys().next().value;
//       this.cache.delete(firstKey);
//     }
//     this.cache.set(key, {
//       value,
//       timestamp: Date.now()
//     });
//   }

//   get(key) {
//     const item = this.cache.get(key);
//     if (!item) return null;
//     if (Date.now() - item.timestamp > this.ttl) {
//       this.cache.delete(key);
//       return null;
//     }
//     return item.value;
//   }

//   clear() {
//     this.cache.clear();
//   }
// }

// const cache = new TTLCache(3600000, 50);

// // ✅ Mock response for testing
// function getMockResponse(question) {
//   const mockResponses = {
//     default: `📊 **CARBON FOOTPRINT CALCULATION:**
// Based on your question about "${question.substring(0, 50)}", the estimated carbon footprint varies depending on factors.

// 🌱 **ECO-FRIENDLY ALTERNATIVES:**
// • Consider public transportation
// • Switch to renewable energy sources
// • Reduce, reuse, recycle

// 💡 **SUSTAINABILITY TIPS:**
// • Plant trees to offset carbon
// • Use energy-efficient appliances
// • Carpool or use electric vehicles

// 📚 **EXPLANATION:**
// Carbon footprint measures the total greenhouse gas emissions caused by an individual, event, organization, or product.`
//   };
  
//   return mockResponses.default;
// }

// // ✅ Generate AI response with fallback
// async function generateAIResponse(question, retries = 2) {
//   // If in test mode or no API key, return mock response
//   if (isTestMode || !process.env.GEMINI_API_KEY) {
//     logger.info(`Using mock response for: ${question.substring(0, 50)}...`);
//     return getMockResponse(question);
//   }
  
//   let lastError;
  
//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await ai.models.generateContent({
//         model: "gemini-2.0-flash-exp",
//         contents: `
// You are an AI Carbon Footprint Awareness Assistant.

// RESPONSE FORMAT:
// 📊 CARBON FOOTPRINT CALCULATION:
// [Estimate]

// 🌱 ECO-FRIENDLY ALTERNATIVES:
// [List 2-3 alternatives]

// 💡 SUSTAINABILITY TIPS:
// [Practical tips]

// 📚 EXPLANATION:
// [Brief explanation]

// User Question: ${question}
// `,
//       });
      
//       if (response && response.text) {
//         return response.text;
//       }
//       throw new Error("Invalid AI response");
//     } catch (error) {
//       lastError = error;
//       logger.warn(`Attempt ${i + 1} failed: ${error.message}`);
//       if (i < retries - 1) {
//         await new Promise(resolve => setTimeout(resolve, 1000));
//       }
//     }
//   }
  
//   // Return mock response on failure
//   logger.error(`AI failed, using mock response`);
//   return getMockResponse(question);
// }

// // ✅ Input validation
// function validateQuestion(question) {
//   if (!question || typeof question !== "string") {
//     return { valid: false, error: "Question must be a non-empty string" };
//   }
  
//   const trimmed = question.trim();
//   if (trimmed.length === 0) {
//     return { valid: false, error: "Question cannot be empty" };
//   }
  
//   if (trimmed.length > 500) {
//     return { valid: false, error: "Question too long. Maximum 500 characters." };
//   }
  
//   const dangerousPatterns = [
//     /<script/i,
//     /javascript:/i,
//     /onload=/i,
//     /onerror=/i,
//   ];
  
//   for (const pattern of dangerousPatterns) {
//     if (pattern.test(trimmed)) {
//       return { valid: false, error: "Question contains invalid characters" };
//     }
//   }
  
//   return { valid: true, value: trimmed };
// }

// // ✅ Routes
// app.get("/health", (req, res) => {
//   res.json({
//     status: "OK",
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     cacheSize: cache.cache.size,
//     mode: isTestMode ? "test" : "production"
//   });
// });

// app.get("/", (req, res) => {
//   const indexPath = join(__dirname, "index.html");
//   if (fs.existsSync(indexPath)) {
//     res.sendFile(indexPath);
//   } else {
//     res.send(`
//       <!DOCTYPE html>
//       <html>
//       <head><title>AI Carbon Assistant</title></head>
//       <body>
//         <h1>🌍 AI Carbon Assistant</h1>
//         <p>Server is running! Please ensure index.html exists.</p>
//       </body>
//       </html>
//     `);
//   }
// });

// app.post("/ask", async (req, res) => {
//   try {
//     const { q } = req.body;
    
//     const validation = validateQuestion(q);
//     if (!validation.valid) {
//       return res.status(400).json({ error: validation.error });
//     }
    
//     const question = validation.value;
    
//     // Check cache
//     const cachedResponse = cache.get(question);
//     if (cachedResponse) {
//       logger.info(`Cache hit for: ${question.substring(0, 50)}`);
//       return res.send(cachedResponse);
//     }
    
//     // Generate response
//     const response = await generateAIResponse(question);
//     cache.set(question, response);
    
//     res.send(response);
    
//   } catch (error) {
//     logger.error(`Error: ${error.message}`);
//     res.status(500).json({ error: "Unable to process your request. Please try again." });
//   }
// });

// // Additional endpoints
// app.post("/compare", async (req, res) => {
//   try {
//     const { activity1, activity2 } = req.body;
//     if (!activity1 || !activity2) {
//       return res.status(400).json({ error: "Both activities are required" });
//     }
    
//     const response = await generateAIResponse(
//       `Compare carbon footprint: "${activity1}" vs "${activity2}". Which has lower impact?`
//     );
//     res.json({ comparison: response });
//   } catch (error) {
//     res.status(500).json({ error: "Unable to complete comparison" });
//   }
// });

// app.get("/export/stats", (req, res) => {
//   const stats = {
//     totalQueries: cache.cache.size,
//     cachedItems: Array.from(cache.cache.keys()).slice(0, 10),
//     serverUptime: process.uptime(),
//     timestamp: new Date().toISOString()
//   };
//   res.json(stats);
// });

// app.get("/tips", async (req, res) => {
//   try {
//     const tips = await generateAIResponse(
//       "Give 5 quick, actionable tips to reduce daily carbon footprint."
//     );
//     res.json({ tips });
//   } catch (error) {
//     res.status(500).json({ error: "Unable to fetch tips" });
//   }
// });

// app.delete("/admin/cache", (req, res) => {
//   cache.clear();
//   res.json({ message: "Cache cleared successfully" });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   logger.error(`Unhandled error: ${err.message}`);
//   res.status(500).json({ error: "An unexpected error occurred" });
// });

// // Start server
// const PORT = process.env.PORT || 3000;
// const server = app.listen(PORT, () => {
//   logger.info(`🚀 Server running on port ${PORT}`);
//   if (isTestMode) {
//     logger.info(`📝 Test mode active - using mock responses`);
//   }
// });

// // Graceful shutdown
// const gracefulShutdown = () => {
//   logger.info("Shutting down gracefully...");
//   server.close(() => {
//     logger.info("Server closed");
//     process.exit(0);
//   });
// };

// process.on("SIGTERM", gracefulShutdown);
// process.on("SIGINT", gracefulShutdown);

// export default app;

import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple cache
const cache = new Map();

// Mock responses (no API key needed)
function getAIResponse(question) {
  const q = question.toLowerCase();
  
  if (q.includes("car") || q.includes("drive") || q.includes("commute")) {
    return `📊 **CARBON FOOTPRINT CALCULATION**

🚗 For a 20km daily drive:
• CO2 emitted: 4 kg per day
• Annual emissions: 1,460 kg CO2
• Equivalent to: 73 trees needed to offset

🌱 **ECO-FRIENDLY ALTERNATIVES:**
• 🚆 Public transport: 70% less emissions
• 🚲 Bicycle: Zero emissions + health benefits
• ⚡ Electric car: 80% less emissions
• 👥 Carpool: Reduces emissions by 50%

💡 **SUSTAINABILITY TIPS:**
• Maintain proper tire pressure
• Avoid rapid acceleration
• Remove excess weight from car
• Plan trips efficiently

📚 **EXPLANATION:**
A typical car produces 0.2 kg CO2 per kilometer. Transportation accounts for 29% of global emissions.`;
  }
  
  if (q.includes("home") || q.includes("energy") || q.includes("electricity")) {
    return `📊 **HOME ENERGY ANALYSIS**

🏠 Average home energy use:
• Annual consumption: 4,000 kWh
• Carbon impact: 2,000 kg CO2/year
• Cost: ~$500-800 per year

🌱 **ENERGY SAVING TIPS:**
• 💡 LED bulbs: 75% less energy
• 🔌 Unplug devices: Save 10% on bills
• 🌡️ Smart thermostat: Save 15%
• 🧺 Cold water wash: Save 90% energy

💡 **QUICK WINS:**
• Air dry clothes: Save 300 kg CO2/year
• Seal windows/doors: Save 20% heating
• Solar panels: Reduce emissions by 80%

📚 **REMEMBER:**
Small changes at home make a big difference for the planet! 🌍`;
  }
  
  if (q.includes("plastic") || q.includes("waste") || q.includes("recycle")) {
    return `📊 **PLASTIC WASTE REDUCTION**

🌍 Impact of plastic:
• 8 million tons enter oceans yearly
• Takes 400+ years to decompose
• Only 9% of plastic is recycled

🌱 **ECO-FRIENDLY ALTERNATIVES:**
• 🛍️ Cloth bags instead of plastic
• 🚰 Reusable water bottle
• 🥤 Bamboo straws
• Glass containers for storage

💡 **REDUCTION TIPS:**
• Buy in bulk to reduce packaging
• Choose products with minimal packaging
• Carry reusable shopping bags
• Avoid single-use plastics

📚 **FACT:**
If we don't change, there will be more plastic than fish in oceans by 2050!`;
  }
  
  return `📊 **CARBON FOOTPRINT GUIDE**

🌍 Understanding Carbon Footprint:
A carbon footprint is the total greenhouse gas emissions caused by an individual, event, organization, or product.

🌱 **WAYS TO REDUCE:**
• 🚗 Use public transport or carpool
• 💡 Switch to energy-efficient appliances
• 🥩 Reduce meat consumption
• ✈️ Avoid short-haul flights
• ♻️ Recycle and compost

💡 **DAILY ACTIONS:**
• Turn off lights when leaving room
• Unplug electronics when not in use
• Take shorter showers
• Plant trees in your community

📚 **YOUR QUESTION:**
"${question.substring(0, 100)}"

Every small action contributes to a sustainable future! 🌍

**Want specific advice? Ask me about:**
• Car emissions
• Home energy saving
• Plastic reduction
• Sustainable diet`;
}

// Routes
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>AI Carbon Assistant</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            .chat-container {
                width: 100%;
                max-width: 900px;
                height: 85vh;
                background: white;
                border-radius: 24px;
                box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                color: white;
                padding: 20px 24px;
                text-align: center;
            }
            .header h1 { font-size: 28px; margin-bottom: 5px; }
            .header p { font-size: 13px; opacity: 0.95; }
            .messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: #f8fafc;
            }
            .message {
                margin-bottom: 16px;
                display: flex;
                animation: slideIn 0.3s ease;
            }
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .message.user { justify-content: flex-end; }
            .message-content {
                max-width: 75%;
                padding: 12px 18px;
                border-radius: 20px;
                line-height: 1.5;
                font-size: 14px;
            }
            .user .message-content {
                background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                color: white;
            }
            .bot .message-content {
                background: white;
                color: #0f172a;
                border: 1px solid #e2e8f0;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            }
            .input-area {
                padding: 20px;
                background: white;
                border-top: 1px solid #e2e8f0;
                display: flex;
                gap: 12px;
            }
            input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid #cbd5e1;
                border-radius: 12px;
                outline: none;
                font-size: 14px;
                font-family: inherit;
            }
            input:focus { border-color: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.1); }
            button {
                padding: 12px 28px;
                background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                color: white;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: transform 0.2s;
            }
            button:hover { transform: translateY(-2px); }
            .typing {
                display: inline-flex;
                gap: 6px;
                padding: 8px 12px;
            }
            .typing span {
                width: 8px;
                height: 8px;
                background: #94a3b8;
                border-radius: 50%;
                animation: bounce 1.4s infinite;
            }
            @keyframes bounce {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-10px); }
            }
            .suggestions {
                padding: 12px 20px;
                background: #f8fafc;
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                border-top: 1px solid #e2e8f0;
            }
            .suggestion {
                padding: 6px 14px;
                background: white;
                border: 1px solid #cbd5e1;
                border-radius: 20px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .suggestion:hover {
                background: #22c55e;
                border-color: #22c55e;
                color: white;
                transform: translateY(-1px);
            }
            .status-badge {
                display: inline-block;
                width: 10px;
                height: 10px;
                background: #22c55e;
                border-radius: 50%;
                margin-right: 8px;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        </style>
    </head>
    <body>
        <div class="chat-container">
            <div class="header">
                <h1>🌍 AI Carbon Assistant</h1>
                <p><span class="status-badge"></span>Online | Your sustainability guide</p>
            </div>
            <div class="messages" id="messages">
                <div class="message bot">
                    <div class="message-content">
                        👋 <strong>Welcome to AI Carbon Assistant!</strong><br><br>
                        I help you understand and reduce your carbon footprint.<br><br>
                        <strong>Ask me about:</strong><br>
                        • 🚗 Daily commute emissions<br>
                        • 🏠 Home energy savings<br>
                        • ♻️ Plastic waste reduction<br>
                        • 🌱 Sustainable lifestyle tips<br><br>
                        <strong>Try asking:</strong><br>
                        "What is my carbon footprint if I drive 30km daily?"
                    </div>
                </div>
            </div>
            <div class="suggestions">
                <div class="suggestion" onclick="useSuggestion('What is my carbon footprint if I drive 30km daily?')">🚗 Daily commute</div>
                <div class="suggestion" onclick="useSuggestion('How to reduce home energy consumption?')">🏠 Home energy</div>
                <div class="suggestion" onclick="useSuggestion('Compare electric vs petrol car emissions')">⚡ Car comparison</div>
                <div class="suggestion" onclick="useSuggestion('How to reduce plastic waste?')">♻️ Reduce plastic</div>
                <div class="suggestion" onclick="useSuggestion('Best sustainable diet tips')">🥗 Green diet</div>
            </div>
            <div class="input-area">
                <input type="text" id="question" placeholder="Type your question here..." onkeypress="if(event.key==='Enter') sendMessage()">
                <button onclick="sendMessage()">Send 🌱</button>
            </div>
        </div>

        <script>
            const messagesDiv = document.getElementById('messages');
            const questionInput = document.getElementById('question');
            let isLoading = false;

            function addMessage(text, isUser) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message ' + (isUser ? 'user' : 'bot');
                const contentDiv = document.createElement('div');
                contentDiv.className = 'message-content';
                contentDiv.innerHTML = text.replace(/\\n/g, '<br>').replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
                messageDiv.appendChild(contentDiv);
                messagesDiv.appendChild(messageDiv);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }

            function showTyping() {
                const typingDiv = document.createElement('div');
                typingDiv.className = 'message bot';
                typingDiv.id = 'typing';
                typingDiv.innerHTML = '<div class="message-content typing"><span></span><span></span><span></span></div>';
                messagesDiv.appendChild(typingDiv);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }

            function hideTyping() {
                const typing = document.getElementById('typing');
                if (typing) typing.remove();
            }

            function useSuggestion(text) {
                questionInput.value = text;
                sendMessage();
            }

            async function sendMessage() {
                const question = questionInput.value.trim();
                if (!question || isLoading) return;

                addMessage(question, true);
                questionInput.value = '';
                isLoading = true;
                showTyping();

                try {
                    const response = await fetch('/ask', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ q: question })
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Server error');
                    }

                    const answer = await response.text();
                    hideTyping();
                    addMessage(answer, false);
                } catch (error) {
                    hideTyping();
                    addMessage('⚠️ Sorry, something went wrong. Please try again.', false);
                } finally {
                    isLoading = false;
                    questionInput.focus();
                }
            }
        </script>
    </body>
    </html>
  `);
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    message: "Server is running perfectly!"
  });
});

app.post("/ask", async (req, res) => {
  try {
    const { q } = req.body;
    
    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Please enter a question" });
    }
    
    const question = q.trim();
    if (question.length === 0) {
      return res.status(400).json({ error: "Question cannot be empty" });
    }
    
    if (question.length > 500) {
      return res.status(400).json({ error: "Question is too long (max 500 characters)" });
    }
    
    // Check cache
    if (cache.has(question)) {
      console.log(`📦 Cache hit: ${question.substring(0, 50)}`);
      return res.send(cache.get(question));
    }
    
    console.log(`🤖 Processing: ${question.substring(0, 50)}`);
    
    // Get response
    const response = getAIResponse(question);
    
    // Cache
    cache.set(question, response);
    
    res.send(response);
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ Server is running!`);
  console.log(`🌍 Open: http://localhost:${PORT}`);
  console.log(`💡 No API key needed - using smart responses\n`);
});