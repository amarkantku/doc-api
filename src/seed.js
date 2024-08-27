const pool = require('./db');

const seedDatabase = async () => {
  const client = await pool.connect();
  const documents = [
    {
      type: "bank-draft",
      title: "Bank Draft",
      position: 0,
      image: "https://picsum.photos/id/1/400/300",
    },
    {
      type: "bill-of-lading",
      title: "Bill of Lading",
      position: 1,
      image: "https://picsum.photos/id/2/400/300",
    },
    {
      type: "invoice",
      title: "Invoice",
      position: 2,
      image: "https://picsum.photos/id/3/400/300",
    },
    {
      type: "bank-draft-2",
      title: "Bank Draft 2",
      position: 3,
      image: "https://picsum.photos/id/4/400/300",
    },
    {
      type: "bill-of-lading-2",
      title: "Bill of Lading 2",
      position: 4,
      image: "https://picsum.photos/id/5/400/300",
    },
  ];
  
  try {
    await client.query('CREATE TABLE IF NOT EXISTS documents (type VARCHAR PRIMARY KEY, title VARCHAR, position INT, image TEXT)');  
    for (const doc of documents) {
      await client.query('INSERT INTO documents (type, title, position, image) VALUES ($1, $2, $3, $4) ON CONFLICT (type) DO NOTHING', [doc.type, doc.title, doc.position, doc.image]);
    }

    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    client.release();
  }
};

seedDatabase();
