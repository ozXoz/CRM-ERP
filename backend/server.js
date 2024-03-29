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
const clientRoutes = require("./routes/clients"); // Import the clients routes
const expenseCategoriesRoutes = require("./routes/expenseCategories");
const expensesRoutes = require("./routes/expenses");
const productCategoriesRoutes = require("./routes/productCategories");
const productsRoutes = require("./routes/products");
const taxRatesRoutes = require("./routes/taxRates"); // Import the tax rates routes
const invoiceRoutes = require('./routes/invoice'); // Make sure the path matches where you've saved your invoice routes

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
app.use("/clients", clientRoutes); // Use the clients routes with the /clients prefix
app.use("/api/expense-categories", expenseCategoriesRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/product-categories", productCategoriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/tax-rates", taxRatesRoutes); // Use the tax rates routes with the /api/tax-rates prefix
app.use('/api/invoices', invoiceRoutes); // Use your invoice routes with a specific prefix

app.use("/admin", addUserRoutes);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
