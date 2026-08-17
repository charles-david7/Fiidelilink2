import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const ds = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'charles',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'fidelilink',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    synchronize: true,
    entities: ['src/**/*.entity.ts'],
  });

  await ds.initialize();
  console.log('Seeding database...');

  await ds.query(`
    INSERT INTO users (id, email, "passwordHash", "firstName", "lastName", role, "universalPoints", "loyaltyLevel")
    VALUES
      (gen_random_uuid(), 'admin@fidelilink.fr', $1, 'Admin', 'FidéliLink', 'admin', 0, 'bronze'),
      (gen_random_uuid(), 'martin@boulangerie.fr', $2, 'Martin', 'Dupont', 'merchant', 0, 'bronze'),
      (gen_random_uuid(), 'sophie@test.fr', $3, 'Sophie', 'Martin', 'client', 428, 'argent')
    ON CONFLICT (email) DO NOTHING
  `, [
    await bcrypt.hash('Admin2025!', 12),
    await bcrypt.hash('Merchant2025!', 12),
    await bcrypt.hash('Client2025!', 12),
  ]);

  const users = await ds.query(`SELECT id, email FROM users`);
  const merchant = users.find((u: any) => u.email === 'martin@boulangerie.fr');

  await ds.query(`
    INSERT INTO merchants (id, name, description, category, address, city, plan, status, "followerCount", "totalScans", "userId")
    VALUES (gen_random_uuid(), 'Boulangerie Martin', 'Pain artisanal maison', 'Boulangerie', '12 rue du Commerce', 'Paris 15e', 'pro', 'active', 248, 1820, $1)
    ON CONFLICT DO NOTHING
  `, [merchant.id]);

  console.log('Seed completed!');
  console.log('Admin   : admin@fidelilink.fr / Admin2025!');
  console.log('Merchant: martin@boulangerie.fr / Merchant2025!');
  console.log('Client  : sophie@test.fr / Client2025!');

  await ds.destroy();
}

seed().catch(e => { console.error(e); process.exit(1); });
