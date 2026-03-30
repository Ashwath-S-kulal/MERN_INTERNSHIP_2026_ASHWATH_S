
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js"
import serviceProviderRoute  from "./routes/serviceproviderRoute.js"
import bookingRoutes from "./routes/bookingRoutes.js"
import MemberRoutes from "./routes/memberRoute.js"


import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());


app.use(cors({
  origin: process.env.FRONTEND_URI,
  credentials: true,
}
));

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/serviceprovider", serviceProviderRoute);
app.use("/api/booking", bookingRoutes);
app.use("/api/member", MemberRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

