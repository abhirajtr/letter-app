import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import { saveLetter } from './controllers/letterController.js';
import verifyFirebaseToken from './middlewares/veryFirebaseToken.js';


configDotenv();
const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
  })
);

// Routes
app.post('/api/save-letter', verifyFirebaseToken, saveLetter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
