const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Вказуємо шлях до папки зі статичними файлами
app.use(express.static(path.join(__dirname, '../src')));

// 🔹 Повертаємо index.html для будь-якого GET-запиту (для SPA, наприклад React)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../src', 'App.js'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
