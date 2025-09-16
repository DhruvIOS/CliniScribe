require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/symptom', require('./routes/symptom'));
app.use('/api/history', require('./routes/history'));
app.use('/api/maps', require('./routes/maps'));
app.use('/api/video', require('./routes/video'));
app.use('/api/email', require('./routes/email'));
app.use('/api/stt', require('./routes/stt'));

app.get('/', (req, res) => res.send('Cliniscribe 2.0 Backend API running...'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
