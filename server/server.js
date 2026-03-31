require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { connectDB, sequelize } = require('./config/db');
const Admin = require('./models/Admin');
const Lead = require('./models/Lead');

const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.get('/', (req, res) => {
  res.send('Mini CRM API is running');
});

const PORT = process.env.PORT || 5000;

const createDefaultAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@mini-crm.com';
  const plainPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

  try {
    const existing = await Admin.findOne({ where: { email } });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);
      await Admin.create({ email, password: hashedPassword });
      console.log(`Default admin account created: ${email} / ${plainPassword}`);
    }
  } catch (error) {
    console.error('Could not create default admin:', error.message);
  }
};

const startServer = async () => {
  await connectDB();
  await sequelize.sync(); // Sync models with database
  await createDefaultAdmin();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
