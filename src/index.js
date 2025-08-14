import express from 'express';
import walletRoutes from './routes/walletRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();



app.use(express.json());

app.use('/api', walletRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));