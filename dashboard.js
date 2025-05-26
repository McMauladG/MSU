const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const db = require("../config/db"); // MySQL connection
const admin = require("../config/firebase"); // Firebase connection

// Route 1: Get logged-in student’s enrollment details
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const sql = "SELECT fullName, gradeLevel, status FROM enrollments WHERE userId = ?";
        db.query(sql, [userId], (err, result) => {
            if (err) return res.status(500).json({ message: "Database error" });
            if (result.length === 0) return res.status(404).json({ message: "No enrollment found" });
            res.json(result[0]);
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Route 2: Get all enrolled students (Admin only)
router.get("/all", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
    }

    try {
        const sql = "SELECT fullName, gradeLevel, status FROM enrollments";
        db.query(sql, (err, result) => {
            if (err) return res.status(500).json({ message: "Database error" });
            res.json(result);
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;



//fuffffifiggiggffifif

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const db = require("../config/db");

// Route 1: Get all enrollments with filtering
router.get("/all", authMiddleware, (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });

    const statusFilter = req.query.status;
    let sql = "SELECT id, fullName, gradeLevel, status FROM enrollments";

    if (statusFilter && statusFilter !== "all") {
        sql += " WHERE status = ?";
        db.query(sql, [statusFilter], (err, result) => {
            if (err) return res.status(500).json({ message: "Database error" });
            res.json(result);
        });
    } else {
        db.query(sql, (err, result) => {
            if (err) return res.status(500).json({ message: "Database error" });
            res.json(result);
        });
    }
});

// Route 2: Approve or Reject Enrollment
router.put("/update/:id", authMiddleware, (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });

    const { status } = req.body;
    const enrollmentId = req.params.id;

    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status update" });
    }

    const sql = "UPDATE enrollments SET status = ? WHERE id = ?";
    db.query(sql, [status, enrollmentId], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Status updated successfully" });
    });
});

module.exports = router;