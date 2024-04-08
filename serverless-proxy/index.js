const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(cors({ origin: "http://localhost:3000/PlantPass" })); // Set to your GitHub Pages URL
app.use(express.json());

app.post("/proxy", async (req, res) => {
  try {
    const response = await axios({
      method: "post",
      url: "https://script.google.com/macros/s/AKfycbw37Bi5UcBDcE7jxQBJMupvRhOa30CDlRPnljxaKbPSDi-4CvaIXPkYxREa-OI4754/exec",
      data: req.body,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => console.log("Server started on port 3000"));
