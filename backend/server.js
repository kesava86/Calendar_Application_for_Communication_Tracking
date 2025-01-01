const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection string (use environment variable for security)
const dbURI = process.env.MONGODB_URI || "mongodb+srv://kkesava493:oCiKlIqzqRmEjTRK@calendarapplication.yjbd0.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// --- SCHEMA AND MODEL DEFINITIONS ---

// Company Schema
const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  location: { type: String, required: true },
  linkedin: { type: String },
  emails: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
  },
  phoneNumbers: { type: String },
  comments: { type: String },
  periodicity: { type: String },
});

// Method Schema
const methodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  sequence: { type: Number, required: true },
  mandatory: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Communication Schema
const communicationSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  companyName: { type: String, required: true }, // Store companyName directly
  communicationType: { type: String, required: true },
  communicationDate: { type: Date, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Models
const Company = mongoose.model("Company", companySchema);
const Method = mongoose.model("Method", methodSchema);
const Communication = mongoose.model("Communication", communicationSchema);

// --- ROUTES ---

// --- Company Routes ---
app.post("/api/companies", async (req, res) => {
  try {
    const company = new Company(req.body);
    const savedCompany = await company.save();
    res.status(201).json({
      success: true,
      message: "Company added successfully!",
      data: savedCompany,
    });
  } catch (error) {
    console.error("Error adding company:", error.message);
    res.status(500).json({
      success: false,
      message: "Error adding company.",
      error: error.message,
    });
  }
});

app.get("/api/companies", async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error("Error fetching companies:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching companies.",
      error: error.message,
    });
  }
});

app.put("/api/companies/:id", async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Company updated successfully!",
      data: updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating company.",
      error: error.message,
    });
  }
});

app.delete("/api/companies/:id", async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Company deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting company:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting company.",
      error: error.message,
    });
  }
});

// --- Method Routes ---
app.post("/api/methods", async (req, res) => {
  try {
    const { name, description, sequence, mandatory } = req.body;

    if (!name || !description || !sequence || mandatory === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, description, sequence, mandatory) are required.",
      });
    }

    const method = new Method(req.body);
    const savedMethod = await method.save();
    res.status(201).json({
      success: true,
      message: "Method added successfully!",
      data: savedMethod,
    });
  } catch (error) {
    console.error("Error adding method:", error.message);
    res.status(500).json({
      success: false,
      message: "Error adding method.",
      error: error.message,
    });
  }
});

app.get("/api/methods", async (req, res) => {
  try {
    const methods = await Method.find().sort({ sequence: 1 });
    res.status(200).json({
      success: true,
      data: methods,
    });
  } catch (error) {
    console.error("Error fetching methods:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching methods.",
      error: error.message,
    });
  }
});

app.put("/api/methods/:id", async (req, res) => {
  try {
    const updatedMethod = await Method.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMethod) {
      return res.status(404).json({
        success: false,
        message: "Method not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Method updated successfully!",
      data: updatedMethod,
    });
  } catch (error) {
    console.error("Error updating method:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating method.",
      error: error.message,
    });
  }
});

app.delete("/api/methods/:id", async (req, res) => {
  try {
    const deletedMethod = await Method.findByIdAndDelete(req.params.id);
    if (!deletedMethod) {
      return res.status(404).json({
        success: false,
        message: "Method not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Method deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting method:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting method.",
      error: error.message,
    });
  }
});

// --- Communication Routes ---
app.post("/api/communications", async (req, res) => {
  try {
    const { communicationType, communicationDate, notes, companyId } = req.body;

    // Validate companyId
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid companyId.",
      });
    }

    // Ensure company exists and get companyName
    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    // Create and save new communication, storing companyName as well
    const newCommunication = new Communication({
      communicationType,
      communicationDate: new Date(communicationDate),
      notes,
      companyId,
      companyName: companyExists.companyName, // Store the companyName directly
    });

    const savedCommunication = await newCommunication.save();

    res.status(201).json({
      success: true,
      message: "Communication logged successfully!",
      data: { ...savedCommunication.toObject() }, // Send the saved communication data
    });
  } catch (error) {
    console.error("Error logging communication:", error.message);
    res.status(500).json({
      success: false,
      message: "Error logging communication. Please try again.",
      error: error.message,
    });
  }
});


// GET: Retrieve all communications
// GET: Retrieve all communications
app.get("/api/communications", async (req, res) => {
  try {
    const communications = await Communication.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: communications });
  } catch (error) {
    console.error("Error retrieving communications:", error.message);
    res.status(500).json({ success: false, message: "Error retrieving communications.", error: error.message });
  }
});




app.put("/api/communications/:id", async (req, res) => {
  try {
    const updatedCommunication = await Communication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCommunication) {
      return res.status(404).json({
        success: false,
        message: "Communication not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Communication updated successfully!",
      data: updatedCommunication,
    });
  } catch (error) {
    console.error("Error updating communication:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating communication.",
      error: error.message,
    });
  }
});

app.delete("/api/communications/:id", async (req, res) => {
  try {
    const deletedCommunication = await Communication.findByIdAndDelete(req.params.id);
    if (!deletedCommunication) {
      return res.status(404).json({
        success: false,
        message: "Communication not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Communication deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting communication:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting communication.",
      error: error.message,
    });
  }
});


// --- SERVER STARTUP ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
