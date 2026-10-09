/**
 * Cognifyz Web Development Internship - Level 3, Task 6
 * Server Application: Database Integration & User Authentication Engine
 * Express.js + EJS + Persistent DB + bcryptjs + JWT Authorization
 */

const express = require("express");
const path = require("path");
const DatabaseService = require("./services/db");
const { generateToken, authenticateToken } = require("./middleware/auth");

const app = express();

// View Engine (EJS) setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static asset serving
app.use(express.static(path.join(__dirname, "public")));

// Initialize Database Storage on Server Startup
DatabaseService.init().then(() => {
  console.log("Task 6 Persistent Database Initialized.");
});

/* ==========================================================================
   1. USER AUTHENTICATION API ENDPOINTS (/api/auth)
   ========================================================================== */

/**
 * POST /api/auth/register - User Registration & Hashed Password Account Creation
 */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Full name must be at least 2 characters long." });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
    }

    // Check if email already registered
    const existingUser = await DatabaseService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: "An account with this email address already exists." });
    }

    // Create user (password hashed securely inside DatabaseService with bcryptjs)
    const newUser = await DatabaseService.createUser({ name, email, password, role: 'user' });

    // Generate JWT Auth Token
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: "Account registered successfully!",
      token: token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error("POST /api/auth/register error:", err);
    return res.status(500).json({ success: false, message: "Server error during account registration." });
  }
});

/**
 * POST /api/auth/login - User Login & JWT Token Generation
 */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide both email and password." });
    }

    const user = await DatabaseService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email address or password." });
    }

    // Verify hashed password
    const isMatch = await DatabaseService.verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email address or password." });
    }

    // Generate JWT Auth Token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("POST /api/auth/login error:", err);
    return res.status(500).json({ success: false, message: "Server error during user login." });
  }
});

/**
 * GET /api/auth/me - Retrieve current authenticated user profile
 */
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  const user = await DatabaseService.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }
  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/* ==========================================================================
   2. PROTECTED REGISTRATION CRUD API ENDPOINTS (/api/registrations)
   ========================================================================== */

function validateRegistrationPayload(data) {
  const errors = [];
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push("Full name must be at least 2 characters long.");
  } else if (/^\d+$/.test(data.name.trim())) {
    errors.push("Name cannot contain numbers only.");
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.push("Please provide a valid email address.");
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!data.phone || !phoneRegex.test(data.phone.trim())) {
    errors.push("Phone number must be a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
  }

  const ageNum = parseInt(data.age, 10);
  if (isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
    errors.push("Age must be a valid number between 16 and 100.");
  }

  if (!data.course || typeof data.course !== 'string' || data.course.trim() === '') {
    errors.push("Please select an engineering course.");
  }

  return errors;
}

// GET /api/registrations - Retrieve all registration records
app.get("/api/registrations", async (req, res) => {
  try {
    const registrations = await DatabaseService.getAllRegistrations();
    return res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (err) {
    console.error("GET /api/registrations error:", err);
    return res.status(500).json({ success: false, message: "Internal server error fetching registrations." });
  }
});

// GET /api/registrations/:id - Retrieve single registration by ID
app.get("/api/registrations/:id", async (req, res) => {
  try {
    const record = await DatabaseService.getRegistrationById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: `Registration not found with ID: ${req.params.id}` });
    }
    return res.status(200).json({ success: true, data: record });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error fetching registration." });
  }
});

// POST /api/registrations - Create a new registration record (Protected by JWT Authorization)
app.post("/api/registrations", authenticateToken, async (req, res) => {
  try {
    const errors = validateRegistrationPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: errors });
    }

    const createdRecord = await DatabaseService.createRegistration(req.body, req.user.id);
    return res.status(201).json({
      success: true,
      message: "Registration created successfully",
      data: createdRecord
    });
  } catch (err) {
    console.error("POST /api/registrations error:", err);
    return res.status(500).json({ success: false, message: "Server error creating registration." });
  }
});

// PUT /api/registrations/:id - Update registration record (Protected by JWT Authorization)
app.put("/api/registrations/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await DatabaseService.getRegistrationById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: `Registration not found with ID: ${id}` });
    }

    const errors = validateRegistrationPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: errors });
    }

    const updatedRecord = await DatabaseService.updateRegistration(id, req.body);
    return res.status(200).json({
      success: true,
      message: "Registration updated successfully",
      data: updatedRecord
    });
  } catch (err) {
    console.error(`PUT /api/registrations/${req.params.id} error:`, err);
    return res.status(500).json({ success: false, message: "Server error updating registration." });
  }
});

// DELETE /api/registrations/:id - Delete registration record (Protected by JWT Authorization)
app.delete("/api/registrations/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DatabaseService.deleteRegistration(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Registration not found with ID: ${id}` });
    }

    return res.status(200).json({
      success: true,
      message: "Registration deleted successfully",
      id: id
    });
  } catch (err) {
    console.error(`DELETE /api/registrations/${req.params.id} error:`, err);
    return res.status(500).json({ success: false, message: "Server error deleting registration." });
  }
});

/* ==========================================================================
   3. PAGE ROUTES & SERVING VIEWS
   ========================================================================== */

app.get("/", (req, res) => {
  res.render("index", { error: null, successMessage: null, contactSuccess: null, formData: {} });
});

app.post("/submit", async (req, res) => {
  const { name, email, phone, age, course } = req.body;
  if (!name || !email || !age || !course || name.trim() === "" || email.trim() === "") {
    return res.status(400).render("index", {
      error: "All registration fields are required.",
      successMessage: null,
      contactSuccess: null,
      formData: { name, email, phone, age, course }
    });
  }

  const record = await DatabaseService.createRegistration({ name, email, phone: phone || '9876543210', age, course }, "anonymous");
  res.render("result", { name: record.name, email: record.email, age: record.age.toString(), course: record.course });
});

app.post("/contact", (req, res) => {
  const { contactName, contactEmail, subject } = req.body;
  res.render("index", {
    error: null,
    successMessage: null,
    contactSuccess: `Thank you, ${contactName || 'Student'}! Your inquiry regarding "${subject || 'General Admission'}" has been received.`,
    formData: {}
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Task 6 Authenticated Server running on http://localhost:${PORT}`);
});
