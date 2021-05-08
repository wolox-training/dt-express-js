const { Pool } = require('pg');

const {
  testing: { username },
  testing: dbConfig
} = require('../../config/db');

const usersTable = 'users';
const testDbConfig = { ...dbConfig, user: username };

exports.findUserById = async id => {
  const pool = new Pool(testDbConfig);
  const { rows } = await pool.query(`SELECT * from ${usersTable} where id = ${id}`);
  await pool.end();

  return rows[0];
};
