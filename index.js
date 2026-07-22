const express = require('express');
const app = express()

const PORT = 8000;

app.get('/', (req, res) => {
  res.send('SERVER is running fine!')
})

app.listen(PORT, () => {
  console.log(`SERVER is running on port ${PORT}`);
})