import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'fidelilink',
    entities: ['src/**/*.entity.ts'],
    synchronize: true,
  });

  await ds.initialize();
  console.log('📦 Seeding database...');

  const hash = (p: string) => bcrypt.hash(p, 12);

  // Users
  await ds.query(`DELETE FROM merchant_follows; DELETE FROM registrations; DELETE FROM point_balances; DELETE FROM transactions; DELETE FROM offers; DELETE FROM events; DELETE FROM merchants; DELETE FROM users;`);

  const [admin] = await ds.query(`
    INSERT INTO users (id, email, "passwordHash", "firstName", "lastName", role, "universalPoints", "loyaltyLevel")
    VALUES
      (gen_random_uuid(), 'admin@fidelilink.fr', $1, 'Admin', 'FidéliLink', 'admin', 0, 'bronze'),
      (gen_random_uuid(), 'martin@boulangerie.fr', $2, 'Martin', 'Dupont', 'merchant', 0, 'bronze'),
      (gen_random_uuid(), 'cafe@leflore.fr', $3, 'Camille', 'Leflore', 'merchant', 0, 'bronze'),
      (gen_random_uuid(), 'lib@bleu.fr', $4, 'Lucas', 'Bleu', 'merchant', 0, 'bronze'),
      (gen_random_uuid(), 'sophie@test.fr', $5, 'Sophie', 'Martin', 'client', 428, 'argent'),
      (gen_random_uuid(), 'marc@test.fr', $6, 'Marc', 'Leroy', 'client', 150, 'bronze'),
      (gen_random_uuid(), 'julie@test.fr', $7, 'Julie', 'Moreau', 'client', 780, 'or')
    RETURNING id, email, role
  `, [
    await hash('Admin2025!'),
    await hash('Merchant2025!'),
    await hash('Merchant2025!'),
    await hash('Merchant2025!'),
    await hash('Client2025!'),
    await hash('Client2025!'),
    await hash('Client2025!'),
  ]);

  const users = await ds.query(`SELECT id, email, role FROM users ORDER BY "createdAt"`);
  const merchantUser = users.find((u: any) => u.email === 'martin@boulangerie.fr');
  const cafeUser = users.find((u: any) => u.email === 'cafe@leflore.fr');
  const libUser = users.find((u: any) => u.email === 'lib@bleu.fr');
  const sophieUser = users.find((u: any) => u.email === 'sophie@test.fr');
  const marcUser = users.find((u: any) => u.email === 'marc@test.fr');
  const julieUser = users.find((u: any) => u.email === 'julie@test.fr');

  // Merchants
  const merchants = await ds.query(`
    INSERT INTO merchants (id, name, description, category, address, city, phone, plan, status, "followerCount", "totalScans", "userId")
    VALUES
      (gen_random_uuid(), 'Boulangerie Martin', 'Pain artisanal et viennoiseries maison depuis 1987. Notre four à bois garantit une cuisson unique.', 'Boulangerie', '12 rue du Commerce', 'Paris 15e', '01 42 73 84 95', 'pro', 'active', 248, 1820, $1),
      (gen_random_uuid(), 'Café Le Flore', 'Café de quartier, brunchs le week-end, terrasse ensoleillée. Spécialités : cappuccino maison et croque-monsieur.', 'Café/Restaurant', '8 avenue Émile Zola', 'Paris 15e', '01 45 78 23 16', 'pro', 'active', 162, 940, $2),
      (gen_random_uuid(), 'Librairie Bleu', 'Librairie indépendante spécialisée en littérature française et BD. Dédicaces régulières d\'auteurs locaux.', 'Librairie', '34 boulevard Garibaldi', 'Paris 15e', '01 47 83 61 24', 'starter', 'active', 89, 320, $3)
    RETURNING id, name
  `, [merchantUser.id, cafeUser.id, libUser.id]);

  const boulangerieId = merchants[0].id;
  const cafeId = merchants[1].id;
  const libId = merchants[2].id;

  // Offers
  await ds.query(`
    INSERT INTO offers (id, "merchantId", title, description, type, value, "targetLevel", "startDate", "endDate", quota, "isActive", "isSponsored")
    VALUES
      (gen_random_uuid(), $1, 'x2 points le samedi', 'Doublez vos Points Enseigne tous les samedis !', 'multiplier', 2, null, NOW(), NOW() + INTERVAL '30 days', 0, true, false),
      (gen_random_uuid(), $1, '-10% pour les abonnés', '10% de réduction sur votre commande si vous êtes abonné à notre enseigne.', 'percent', 10, null, NOW(), NOW() + INTERVAL '14 days', 100, true, true),
      (gen_random_uuid(), $2, 'Café offert dès 15 PE', 'Dépensez vos 15 Points Enseigne et repartez avec un café.', 'fixed', 0, null, NOW(), NOW() + INTERVAL '60 days', 0, true, false),
      (gen_random_uuid(), $2, 'Brunch -20% membres Or', 'Réduction exclusive réservée aux membres niveau Or.', 'percent', 20, 'or', NOW(), NOW() + INTERVAL '30 days', 50, true, false),
      (gen_random_uuid(), $3, 'BD offerte dès 200 PE', 'Échangez 200 de vos Points Enseigne contre une BD de votre choix (valeur max 15€).', 'fixed', 0, null, NOW(), NOW() + INTERVAL '90 days', 20, true, false)
  `, [boulangerieId, cafeId, libId]);

  // Events
  await ds.query(`
    INSERT INTO events (id, "merchantId", title, description, "eventDate", location, "totalSlots", "normalPrice", "memberPrice", "isFree", "isActive")
    VALUES
      (gen_random_uuid(), $1, 'Atelier pain à la baguette', 'Apprenez à confectionner une vraie baguette française avec notre boulanger. Repartez avec vos créations !', NOW() + INTERVAL '7 days', '12 rue du Commerce, Paris 15e', 12, 35, 20, false, true),
      (gen_random_uuid(), $2, 'Soirée dégustation café du monde', 'Voyage gustatif autour de 5 cafés d\'exception. Présentation des terroirs par notre barista.', NOW() + INTERVAL '10 days', '8 avenue Émile Zola, Paris 15e', 20, 25, 15, false, true),
      (gen_random_uuid(), $2, 'Brunch dominical VIP', 'Brunch exclusif pour les porteurs de carte FidéliLink. Menu complet, jus frais, desserts maison.', NOW() + INTERVAL '14 days', '8 avenue Émile Zola, Paris 15e', 30, 0, 0, true, true),
      (gen_random_uuid(), $3, 'Séance dédicace — Mathieu Guérin', 'L\'auteur de la saga "Les Ombres de Paris" signe son nouveau roman. Entrée libre, réservation conseillée.', NOW() + INTERVAL '5 days', '34 boulevard Garibaldi, Paris 15e', 50, 0, 0, true, true)
  `, [boulangerieId, cafeId, libId]);

  // Point balances for Sophie
  await ds.query(`
    INSERT INTO point_balances (id, "userId", "merchantId", balance)
    VALUES
      (gen_random_uuid(), $1, $2, 120),
      (gen_random_uuid(), $1, $3, 64),
      (gen_random_uuid(), $1, $4, 38)
  `, [sophieUser.id, boulangerieId, cafeId, libId]);

  // Point balances for Marc
  await ds.query(`
    INSERT INTO point_balances (id, "userId", "merchantId", balance)
    VALUES
      (gen_random_uuid(), $1, $2, 45),
      (gen_random_uuid(), $1, $3, 22)
  `, [marcUser.id, boulangerieId, cafeId]);

  // Transactions history for Sophie
  await ds.query(`
    INSERT INTO transactions (id, "userId", "merchantId", amount, "totalPoints", "merchantPoints", "universalPoints", "createdAt")
    VALUES
      (gen_random_uuid(), $1, $2, 18.50, 18, 14, 4, NOW() - INTERVAL '1 day'),
      (gen_random_uuid(), $1, $2, 12.00, 12, 9, 3, NOW() - INTERVAL '3 days'),
      (gen_random_uuid(), $1, $3, 8.50, 8, 6, 2, NOW() - INTERVAL '5 days'),
      (gen_random_uuid(), $1, $2, 22.00, 22, 17, 5, NOW() - INTERVAL '8 days'),
      (gen_random_uuid(), $1, $4, 15.00, 15, 12, 3, NOW() - INTERVAL '10 days')
  `, [sophieUser.id, boulangerieId, cafeId, libId]);

  // Merchant follows
  await ds.query(`
    INSERT INTO merchant_follows (id, "userId", "merchantId", "notifEnabled")
    VALUES
      (gen_random_uuid(), $1, $2, true),
      (gen_random_uuid(), $1, $3, true),
      (gen_random_uuid(), $1, $4, false),
      (gen_random_uuid(), $5, $2, true),
      (gen_random_uuid(), $5, $3, true)
  `, [sophieUser.id, boulangerieId, cafeId, libId, marcUser.id]);

  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('📋 Test accounts:');
  console.log('  Admin   : admin@fidelilink.fr / Admin2025!');
  console.log('  Merchant: martin@boulangerie.fr / Merchant2025!');
  console.log('  Client  : sophie@test.fr / Client2025!');

  await ds.destroy();
}

seed().catch(e => { console.error(e); process.exit(1); });