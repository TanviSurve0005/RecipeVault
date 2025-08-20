import express from 'express';

const app = express();
app.use(express.json());

// 1. Define the Note type
interface Note {
  id: string;
  text: string;
}

// 2. Type the notes object with index signature
const notes: Record<string, Note[]> = {
  '1': [{ id: '1', text: 'Add more sugar next time' }]
};

app.get('/notes/:recipeId', (req, res) => {
  // 3. Safe access with nullish coalescing
  const recipeNotes = notes[req.params.recipeId] ?? [];
  res.json(recipeNotes);
});

app.listen(3001, () => console.log('REST server running'));