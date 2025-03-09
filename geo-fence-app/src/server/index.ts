import express from 'express';
import cors from 'cors';
import silentModeRouter from './silentMode';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Use the silent mode router
app.use(silentModeRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 