const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Utility function to sign JWT
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// PUBLIC_INTERFACE
class AuthController {
  /**
   * Register a new user.
   * @route POST /auth/register
   * @returns JWT and user profile.
   */
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: 'Invalid email.' });
      }
      const existing = await User.findOne({ where: { email } });
      if (existing) return res.status(409).json({ error: 'Email already registered.' });

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, passwordHash });

      const token = generateToken(user);
      return res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Server error during registration.' });
    }
  }

  /**
   * Login with email and password.
   * @route POST /auth/login
   * @returns JWT and user profile.
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

      const user = await User.findOne({ where: { email } });
      if (!user || !(await user.validatePassword(password))) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      const token = generateToken(user);
      return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error during login.' });
    }
  }

  /**
   * Get authenticated user profile.
   * @route GET /auth/me
   * @returns Current user info.
   */
  async me(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'name', 'email']
      });
      if (!user) return res.status(404).json({ error: 'User not found.' });
      res.json({ user });
    } catch (err) {
      res.status(500).json({ error: 'Server error.' });
    }
  }
}

module.exports = new AuthController();
