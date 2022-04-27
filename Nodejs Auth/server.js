const express = require("express");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 5000;
connectDB();

app.use(express.json());
app.use("/api/auth", require("./Auth/route"));
app.use(cookieParser());

app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`));

// Handling Error
process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
