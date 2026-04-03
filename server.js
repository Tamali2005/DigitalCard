const express = require("express");
const app = express();
const PORT = 5500;  // তুমি চাইলে অন্য port দিতে পারো

// static files serve করা
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
