const express = require("express");
const Invoice = require("../models/Invoice"); // Adjust path as needed
const People = require("../models/People")
const {
  authenticateToken,
  isAdminOrOwnerOrUser,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.post(
  "/add",
  authenticateToken,
  isAdminOrOwnerOrUser,
  async (req, res) => {
    const {
      clientId: client, // renamed from client to clientId
      productCategoryId: productCategory, // renamed from productCategory to productCategoryId
      productId: product, // renamed from product to productId
      taxRateId: taxRate, // renamed from taxRate to taxRateId
      price,
      subtotal,
      total,
      date,
      expireDate,
      status,
      invoiceNumber,
      currency,
      quantity,
      note,
      description,
    } = req.body;

    try {
      const createdByAdmin = req.user.userId;

      // Check if all required fields are provided
      if (
        !client ||
        !productCategory ||
        !product ||
        !taxRate ||
        !price ||
        !quantity ||
        !status ||
        !currency ||
        !date ||
        !expireDate ||
        !invoiceNumber // Check invoiceNumber
      ) {
        return res.status(400).send("Please provide all required fields.ssss");
      }

      const newInvoice = new Invoice({
        client,
        productCategory,
        product,
        taxRate,
        price,
        subtotal,
        total,
        date: date || new Date(),
        expireDate,
        status,
        invoiceNumber,
        currency,
        quantity,
        note,
        description,
        createdByAdmin,
      });

      await newInvoice.save();
      res.status(201).json(newInvoice);
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  }
);

// Fetch an invoice by ID and populate related information
router.get(
  "/invoices/:id",
  authenticateToken,
  isAdminOrOwnerOrUser,
  async (req, res) => {
    try {
      const invoice = await Invoice.findById(req.params.id)
        .populate("client")
        .populate("productCategory")
        .populate("product")
        .populate("taxRate")
        .populate({
          path: "createdByAdmin",
          select: "username email", // Adjust according to what admin details you want to show
        });

      if (!invoice) {
        return res.status(404).send("Invoice not found");
      }

      // Optionally, fetch and include client's detailed information if needed
      // For example, if `client` references a People or Company model with additional details
      let clientDetails = {};
      if (invoice.client.type === "People") {
        clientDetails = await People.findById(invoice.client.reference); // Adjust model and logic as needed
      } else if (invoice.client.type === "Company") {
        clientDetails = await Company.findById(invoice.client.reference); // Adjust model and logic as needed
      }

      // Combine the invoice with client details for the response
      const response = {
        ...invoice.toObject(), // Convert document to a plain JavaScript object
        clientDetails, // Include clientDetails in the response
      };

      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }
);

// Existing imports and router setup

// Fetch all invoices and populate related information
router.get(
  "/getall",
  authenticateToken,
  isAdminOrOwnerOrUser,
  async (req, res) => {
    try {
      const invoices = await Invoice.find({})
        .populate("client")
        .populate("productCategory")
        .populate("product")
        .populate("taxRate")
        .populate({
          path: "createdByAdmin",
          select: "username email", // Adjust according to what admin details you want to show
        });

      // Optionally, you can loop through each invoice to fetch and include additional client details
      // This is similar to what you have in the route for fetching a single invoice by ID
      // Note: This might not be the most efficient way if you have a large number of invoices
      // Consider optimizing or limiting this feature based on your application's requirements

      const response = await Promise.all(
        invoices.map(async (invoice) => {
          let clientDetails = {};
          // Assume client.type and client.reference exist and adjust according to your schema
          if (invoice.client && invoice.client.type === "People") {
            clientDetails = await People.findById(invoice.client.reference); // Adjust model and logic as needed
          } else if (invoice.client && invoice.client.type === "Company") {
            clientDetails = await Company.findById(invoice.client.reference); // Adjust model and logic as needed
          }

          return {
            ...invoice.toObject(), // Convert document to a plain JavaScript object
            clientDetails, // Include clientDetails in the response
          };
        })
      );

      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }
);

// Existing routes and module.exports

module.exports = router;
