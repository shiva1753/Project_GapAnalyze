require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// --- CORS Setup for Vercel/Render ---
const allowedOrigins = [
  'http://localhost:5173', 
  'https://your-gapanalyze-app.vercel.app' // REPLACE this with your actual Vercel URL
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/analyze', upload.single('resumeFile'), async (req, res) => {
  try {
    const jobDescription = (req.body.jobDescription || '').trim();
    let resumeText = (req.body.resumeText || '').trim();

    // --- File extraction ---
    if (req.file) {
      const { mimetype, buffer } = req.file;

      if (mimetype === 'application/pdf') {
        const pdfData = await pdfParse(buffer);
        resumeText = pdfData.text.trim();
      } else if (
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimetype === 'application/msword'
      ) {
        const docxData = await mammoth.extractRawText({ buffer });
        resumeText = docxData.value.trim();
      } else {
        return res.status(400).json({
          error: 'Unsupported file type. Upload PDF, DOC, or DOCX.',
        });
      }
    }

    // --- Validation ---
    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required.' });
    }

    if (!resumeText) {
      return res.status(400).json({
        error: 'Resume text missing. Paste it or upload file.',
      });
    }

    // --- Prompt ---
    const prompt = `
You are an expert, highly literal ATS (Applicant Tracking System) software. Your job is to compare the following Resume to the Job Description.

STRICT RULES FOR KEYWORDS & ANALYSIS:
1. EXACT MATCHES ONLY: Only count exact words/phrases or close synonyms present in resume.
2. NO BLIND SPOTS: Do not mark something missing if it exists.
3. CONTEXT AWARENESS: Do not suggest things already present.

Job Description:
${jobDescription}

Resume:
${resumeText}
`.trim();

    // --- OpenAI API Call with Structured Outputs ---
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS analysis assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'resume_analysis_schema',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              matchScore: { type: 'number' },
              scoreFooter: { type: 'string' },
              summaryQuote: { type: 'string' },
              highRelevanceTag: { type: 'string' },
              opportunityTag: { type: 'string' },
              matchedKeywords: { type: 'array', items: { type: 'string' } },
              missingKeywords: { type: 'array', items: { type: 'string' } },
              bulletOptimizations: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    original: { type: 'string' },
                    optimized: { type: 'string' }
                  },
                  required: ['original', 'optimized'],
                  additionalProperties: false
                }
              },
              improvements: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' }
                  },
                  required: ['title', 'description'],
                  additionalProperties: false
                }
              },
              roadmapTarget: { type: 'string' },
              roadmapSteps: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    step: { type: 'number' },
                    title: { type: 'string' },
                    description: { type: 'string' }
                  },
                  required: ['step', 'title', 'description'],
                  additionalProperties: false
                }
              }
            },
            required: [
              'matchScore', 'scoreFooter', 'summaryQuote', 'highRelevanceTag',
              'opportunityTag', 'matchedKeywords', 'missingKeywords',
              'bulletOptimizations', 'improvements', 'roadmapTarget', 'roadmapSteps'
            ],
            additionalProperties: false
          }
        }
      },
      max_tokens: 1400,
      temperature: 0.2,
    });

    const result = completion.choices[0].message.content;
    const analysisData = JSON.parse(result);

    res.json(analysisData);
  } catch (error) {
    console.error('Backend Error:', error);
    res.status(500).json({
      error: 'Failed to analyze resume.',
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);