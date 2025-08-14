import express from 'express';

const app = express();

// HARUS dipasang sebelum route
app.use(express.json());

app.post('/test', (req, res) => {
    console.log('Request body:', req.body);  // lihat apa yang masuk
    res.json({ received: req.body });
});

app.listen(5001, () => console.log('Test server running on port 5001'));
