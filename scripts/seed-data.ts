// ================================================================
// ENARM Pro - Database Seeder
// ================================================================

import { createClient } from '@supabase/supabase-js';
import { GPC_DATABASE } from '../lib/data/gpc-dgmoss';
import { FLASHCARDS_DATABASE } from '../lib/data/flashcards';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedAchievementDefinitions() {
  console.log('📊 Seeding achievement definitions...');
  
  // Las definiciones ya están en el SQL migration
  console.log('✓ Achievement definitions ready');
}

async function seedTestUsers() {
  console.log('👤 Creating test users...');

  const testUsers = [
    {
      email: 'test@enarmpro.com',
      password: 'TestPassword123!',
      full_name: 'Usuario de Prueba',
      subscription_tier: 'pro',
    },
    {
      email: 'elite@enarmpro.com',
      password: 'ElitePassword123!',
      full_name: 'Usuario Elite',
      subscription_tier: 'elite',
    },
  ];

  for (const user of testUsers) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        full_name: user.full_name,
      },
    });

    if (error) {
      console.error(`Error creating user ${user.email}:`, error);
    } else {
      console.log(`✓ Created user: ${user.email}`);

      // Update subscription tier
      await supabase
        .from('profiles')
        .update({ subscription_tier: user.subscription_tier })
        .eq('id', data.user.id);
    }
  }
}

async function main() {
  console.log('🌱 Starting database seeding...\n');

  await seedAchievementDefinitions();
  await seedTestUsers();

  console.log('\n✓ Seeding completed!');
  console.log('\nTest credentials:');
  console.log('  Pro user: test@enarmpro.com / TestPassword123!');
  console.log('  Elite user: elite@enarmpro.com / ElitePassword123!');
}

main().catch(console.error);
