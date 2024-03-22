require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS
const authRoutes = require("./routes/auth");
const peopleRoutes = require("./routes/people");
const companyRoutes = require("./routes/companies"); // The path to your companies route file
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const addUserRoutes = require("./routes/addUserRoutes"); // Adjust the path according to your project structure
const clientRoutes = require('./routes/clients'); // Import the clients routes
const app = express();
app.use(cors()); // Enable CORS for all requests
app.use(express.json());

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.error(error));

app.use("/auth", authRoutes);
app.use("/people", peopleRoutes);
app.use("/companies", companyRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/webhooks/stripe", webhookRoutes);
app.use('/clients', clientRoutes); // Use the clients routes with the /clients prefix
app.use("/admin", addUserRoutes);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
