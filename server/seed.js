require('dotenv').config();
const { sequelize } = require('./config/db');
const Lead = require('./models/Lead');

const sampleLeads = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1-555-0123',
    source: 'Website',
    status: 'new',
    notes: 'Interested in our premium services',
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1-555-0124',
    source: 'LinkedIn',
    status: 'contacted',
    notes: 'Followed up via email, waiting for response',
  },
  {
    name: 'Mike Davis',
    email: 'mike.davis@example.com',
    phone: '+1-555-0125',
    source: 'Referral',
    status: 'converted',
    notes: 'Converted to paying customer, contract signed',
  },
  {
    name: 'Emily Chen',
    email: 'emily.chen@example.com',
    phone: '+1-555-0126',
    source: 'Website',
    status: 'new',
    notes: 'Requested demo for enterprise solution',
  },
  {
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    phone: '+1-555-0127',
    source: 'Other',
    status: 'contacted',
    notes: 'Called and left voicemail, need to follow up',
  },
  {
    name: 'Lisa Brown',
    email: 'lisa.brown@example.com',
    phone: '+1-555-0128',
    source: 'LinkedIn',
    status: 'new',
    notes: 'Connected on LinkedIn, expressed interest in partnership',
  },
  {
    name: 'Robert Taylor',
    email: 'robert.taylor@example.com',
    phone: '+1-555-0129',
    source: 'Referral',
    status: 'converted',
    notes: 'Referred by existing client, signed up for annual plan',
  },
  {
    name: 'Anna Martinez',
    email: 'anna.martinez@example.com',
    phone: '+1-555-0130',
    source: 'Website',
    status: 'contacted',
    notes: 'Sent proposal, awaiting feedback',
  },
  {
    name: 'Chris Anderson',
    email: 'chris.anderson@example.com',
    phone: '+1-555-0131',
    source: 'LinkedIn',
    status: 'new',
    notes: 'Posted about our services on LinkedIn',
  },
  {
    name: 'Jessica Lee',
    email: 'jessica.lee@example.com',
    phone: '+1-555-0132',
    source: 'Other',
    status: 'converted',
    notes: 'Attended webinar, purchased starter package',
  },
  {
    name: 'Tom Garcia',
    email: 'tom.garcia@example.com',
    phone: '+1-555-0133',
    source: 'Website',
    status: 'new',
    notes: 'Filled out contact form with specific requirements',
  },
  {
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@example.com',
    phone: '+1-555-0134',
    source: 'Referral',
    status: 'contacted',
    notes: 'Referred by partner company, scheduled meeting',
  },
  {
    name: 'Kevin White',
    email: 'kevin.white@example.com',
    phone: '+1-555-0135',
    source: 'LinkedIn',
    status: 'new',
    notes: 'Commented on our post, wants more information',
  },
  {
    name: 'Rachel Kim',
    email: 'rachel.kim@example.com',
    phone: '+1-555-0136',
    source: 'Website',
    status: 'converted',
    notes: 'Upgraded from trial to full subscription',
  },
  {
    name: 'Mark Thompson',
    email: 'mark.thompson@example.com',
    phone: '+1-555-0137',
    source: 'Other',
    status: 'contacted',
    notes: 'Contacted via support chat, needs technical consultation',
  },
];

const seedLeads = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Sync the database
    await sequelize.sync();

    // Check if leads already exist
    const existingLeads = await Lead.count();
    console.log(`Database currently has ${existingLeads} leads.`);

    // Always add sample leads (comment out to skip if exists)
    // if (existingLeads > 0) {
    //   console.log(`Database already has ${existingLeads} leads. Skipping seed.`);
    //   return;
    // }

    // Insert sample leads
    await Lead.bulkCreate(sampleLeads);
    console.log(`Successfully seeded ${sampleLeads.length} sample leads`);

    // Display summary
    const statusCounts = await Lead.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    console.log('\nLead Status Summary:');
    statusCounts.forEach(count => {
      console.log(`${count.dataValues.status}: ${count.dataValues.count}`);
    });

  } catch (error) {
    console.error('Error seeding leads:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the seed function
seedLeads();