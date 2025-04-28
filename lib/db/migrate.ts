import mongoose from 'mongoose';
import dbConnect from './index';


const runMigration = async (filename: string, direction: 'up' | 'down') => {

  try {
    await dbConnect()

    const migration = await import(`./migrations/${filename}`);

    if (typeof migration[direction] !== 'function') {
      throw new Error(`❌ The migration '${filename}' does not have a '${direction}' function.`);
    }

    await migration[direction]();
    console.log(`✨ Migration ${direction} completed successfully`);
  } catch (err) {
    console.error('❌ Migration error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

const [filename, direction] = process.argv.slice(2);

if (!filename || !['up', 'down'].includes(direction)) {
  console.error("❌ Usage: tsx migrate.ts <filename> <up|down>");
  process.exit(1);
}

runMigration(filename, direction as 'up' | 'down');
