import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, extname } from "node:path";

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@demo.com";
const dataFile = resolve("data.json");
const uploadDir = resolve("uploads");

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required. Set it before starting the server.");
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${suffix}${extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.static("."));
app.use("/uploads", express.static(uploadDir));

async function loadData() {
  const text = await readFile(dataFile, "utf-8");
  return JSON.parse(text);
}

async function saveData(data) {
  await writeFile(dataFile, JSON.stringify(data, null, 2), "utf-8");
}

function nextId(items) {
  if (!items.length) return 1;
  return Math.max(...items.map((item) => item.id)) + 1;
}

function auth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Auth token missing." });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

function optionalAuth(req, _res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch {
    req.user = null;
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
}

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  const data = await loadData();
  const exists = data.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(409).json({ message: "User already exists with this email." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "user";
  const user = { id: nextId(data.users), name, email, passwordHash, role };
  data.users.push(user);
  await saveData(data);

  const token = jwt.sign(
    { userId: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
  res
    .status(201)
    .json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const data = await loadData();
  const user = data.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = jwt.sign(
    { userId: user.id, name: user.name, email: user.email, role: user.role || "user" },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role || "user" },
  });
});

app.get("/api/profiles", optionalAuth, async (req, res) => {
  const data = await loadData();
  data.profiles.forEach((profile) => {
    if (!profile.status) profile.status = "approved";
    if (!profile.imageUrl) profile.imageUrl = "";
  });
  const visibleProfiles = data.profiles.filter((profile) => {
    if (profile.status === "approved") return true;
    if (!req.user) return false;
    if (req.user.role === "admin") return true;
    return profile.ownerUserId === req.user.userId;
  });
  res.json(visibleProfiles);
});

app.post("/api/profiles", auth, upload.single("image"), async (req, res) => {
  const { name, role, age, city, vibe, language, pricePerHour, about } = req.body;
  const interests = String(req.body.interests || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (!name || !role || !city || !pricePerHour) {
    return res.status(400).json({ message: "Name, role, city, and price are required." });
  }

  const data = await loadData();
  const profile = {
    id: nextId(data.profiles),
    name,
    role,
    age: Number(age) || 22,
    city,
    vibe: vibe || "Friendly and kind",
    language: language || "English",
    pricePerHour: Number(pricePerHour),
    about: about || "A new companion profile.",
    interests,
    ownerUserId: req.user.userId,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
    status: "pending",
  };

  data.profiles.push(profile);
  await saveData(data);
  res.status(201).json(profile);
});

app.post("/api/bookings", auth, async (req, res) => {
  const { profileId, bookingType, date, hours, note, paymentMethod } = req.body;
  const profileIdNum = Number(profileId);
  const hoursNum = Number(hours);
  if (!profileIdNum || !date || !hoursNum || hoursNum < 1 || hoursNum > 12) {
    return res.status(400).json({ message: "Valid profile, date, and hours (1-12) are required." });
  }

  const data = await loadData();
  const profile = data.profiles.find((item) => item.id === profileIdNum);
  if (!profile) {
    return res.status(404).json({ message: "Selected profile was not found." });
  }
  if (profile.status && profile.status !== "approved") {
    return res.status(403).json({ message: "This profile is not available for booking." });
  }

  const booking = {
    id: nextId(data.bookings),
    userId: req.user.userId,
    profileId: profile.id,
    profileName: profile.name,
    bookingType: bookingType || "Book a Companion",
    date,
    hours: hoursNum,
    total: hoursNum * profile.pricePerHour,
    note: note || "",
    paymentMethod: paymentMethod || "cash",
    paymentStatus: "pending",
    bookingStatus: "pending",
    createdAt: new Date().toISOString(),
  };

  data.bookings.push(booking);
  await saveData(data);
  res.status(201).json(booking);
});

app.get("/api/bookings/mine", auth, async (req, res) => {
  const data = await loadData();
  const myBookings = data.bookings
    .filter((booking) => booking.userId === req.user.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(myBookings);
});

app.get("/api/admin/bookings", auth, requireAdmin, async (_req, res) => {
  const data = await loadData();
  const result = [...data.bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(result);
});

app.patch("/api/admin/bookings/:bookingId", auth, requireAdmin, async (req, res) => {
  const { bookingId } = req.params;
  const { bookingStatus, paymentStatus } = req.body;
  const data = await loadData();
  const booking = data.bookings.find((item) => item.id === Number(bookingId));
  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }
  if (bookingStatus) booking.bookingStatus = bookingStatus;
  if (paymentStatus) booking.paymentStatus = paymentStatus;
  await saveData(data);
  res.json(booking);
});

app.get("/api/admin/profiles/pending", auth, requireAdmin, async (_req, res) => {
  const data = await loadData();
  const pending = data.profiles.filter((profile) => profile.status === "pending");
  res.json(pending);
});

app.patch("/api/admin/profiles/:profileId", auth, requireAdmin, async (req, res) => {
  const { profileId } = req.params;
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid profile status." });
  }
  const data = await loadData();
  const profile = data.profiles.find((item) => item.id === Number(profileId));
  if (!profile) {
    return res.status(404).json({ message: "Profile not found." });
  }
  profile.status = status;
  await saveData(data);
  res.json(profile);
});

await mkdir(uploadDir, { recursive: true });

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
