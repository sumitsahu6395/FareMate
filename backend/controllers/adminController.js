const Admin = require("../models/Admin");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid admin email or password",
      });
    }

    if (admin.password !== password) {
      return res.status(401).json({
        message: "Invalid admin email or password",
      });
    }

    res.status(200).json({
      message: "Admin login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  adminLogin,
};