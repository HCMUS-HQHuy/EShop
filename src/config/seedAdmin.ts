import { getConnection } from './db';
import { env } from 'process';

export default async function seedAdmin() {
  const client = await getConnection();

  try {
    const checkQuery = `
      SELECT * FROM users 
      WHERE username = $1 AND role = 'Admin'
    `;
    const result = await client.query(checkQuery, [env.DB_ADMIN_USERNAME]);

    if (result.rows.length > 0) {
      console.log('WARNING: Admin user already exists. Skipping...');
      return;
    }

    const insertQuery = `
      INSERT INTO users (username, password, email, fullname, role)
      VALUES ($1, $2, $3, $4, 'Admin')
    `;
    await client.query(insertQuery, [
      env.DB_ADMIN_USERNAME,
      env.DB_ADMIN_PASSWORD,
      env.DB_ADMIN_EMAIL,
      'System Administrator',
    ]);

    console.log('Admin user created successfully.');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await client.end();
  }
}
