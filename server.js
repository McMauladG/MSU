const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const enrollRoutes = require("./routes/enroll");
const dashboardRoutes = require("./routes/dashboard"); // Import dashboard routes

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/enroll", enrollRoutes);
app.use("/api/dashboard", dashboardRoutes); // Use dashboard routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});