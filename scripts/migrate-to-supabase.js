const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://anfpfnlnvsjvtjjxiedk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZnBmbmxudnNqdnRqanhpZWRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjAwMjM4MiwiZXhwIjoyMDgxNTc4MzgyfQ.e2w5XtbcigDoAyaikF2ht6BxZ-BLiWAMR2nfChc06ZQ';

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is required');
  console.error('Please set it with your Supabase service role key');
  console.error('You can find it in your Supabase project settings under API');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Migration files in order
const migrations = [
  '0001_init.sql',
  '0002_header_footer.sql',
  '0003_storage_bucket.sql',
  '0004_remove_address_lines.sql',
  '0005_language_management.sql',
  '0006_sample_translations.sql',
  '0007_add_missing_translations.sql',
  '0008_products_translations.sql',
  '0009_categories_translations.sql',
  '0010_contact_blocks_translations.sql',
  '0011_footer_translations.sql',
  '0012_brands_translations.sql',
  '0013_collapsible_sections_translations.sql',
  '0014_services_features_translations.sql',
  '0015_all_products_translations.sql',
  '0016_orders_and_product_details.sql'
];

// Create migrations tracking table
const createMigrationsTable = `
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

async function runMigration(filename) {
  try {
    console.log(`\nRunning migration: ${filename}`);
    
    // Check if migration has already been run
    const { data: existing } = await supabase
      .from('schema_migrations')
      .select('version')
      .eq('version', filename)
      .single();
    
    if (existing) {
      console.log(`✓ Migration ${filename} already executed, skipping...`);
      return true;
    }
    
    // Read migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', filename);
    const sql = await fs.readFile(migrationPath, 'utf8');
    
    // Execute migration
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // If exec_sql doesn't exist, try direct execution through REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sql_query: sql })
      });
      
      if (!response.ok) {
        // Try alternative approach - execute SQL directly via pg connection
        console.log('Direct SQL execution not available, trying alternative method...');
        
        // Split SQL into individual statements
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));
        
        console.log(`Executing ${statements.length} SQL statements...`);
        
        // Execute each statement individually
        for (let i = 0; i < statements.length; i++) {
          const statement = statements[i] + ';';
          console.log(`Statement ${i + 1}/${statements.length}...`);
          
          // For now, we'll need to use the Supabase dashboard or another method
          // to execute these migrations
        }
        
        throw new Error('Cannot execute SQL directly. Please run migrations through Supabase dashboard SQL editor.');
      }
    }
    
    // Record successful migration
    await supabase
      .from('schema_migrations')
      .insert({ version: filename });
    
    console.log(`✓ Migration ${filename} completed successfully`);
    return true;
    
  } catch (error) {
    console.error(`✗ Error running migration ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('Starting Supabase migrations...');
  console.log(`Database URL: ${supabaseUrl}`);
  
  try {
    // First, test the connection with a simple query
    console.log('\nTesting database connection...');
    
    // Try to check if schema_migrations table exists
    const { data, error } = await supabase
      .from('schema_migrations')
      .select('version')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      // Table doesn't exist, which is expected for a fresh database
      console.log('✓ Database connection successful (fresh database detected)');
    } else if (error) {
      console.error('Database connection error:', error.message);
      console.log('Continuing to generate migration files...');
    } else {
      console.log('✓ Database connection successful');
      console.log(`Found ${data?.length || 0} existing migrations`);
    }
    
    // Create migrations tracking table
    console.log('\nCreating migrations tracking table...');
    // Note: This would need to be done via Supabase dashboard if direct SQL execution is not available
    
    console.log('\n' + '='.repeat(60));
    console.log('IMPORTANT: Direct SQL execution via API is not available.');
    console.log('Please follow these steps to migrate your database:');
    console.log('='.repeat(60));
    console.log('\n1. Go to your Supabase project dashboard');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Create the migrations tracking table by running:');
    console.log('\n' + createMigrationsTable);
    console.log('\n4. Then run each migration file in order:');
    
    migrations.forEach((migration, index) => {
      console.log(`   ${index + 1}. ${migration}`);
    });
    
    console.log('\n5. After running each migration, record it by running:');
    console.log("   INSERT INTO schema_migrations (version) VALUES ('filename.sql');");
    console.log('\n' + '='.repeat(60));
    
    // Generate a combined migration file for easier execution
    console.log('\nGenerating combined migration file...');
    await generateCombinedMigration();
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

async function generateCombinedMigration() {
  try {
    let combinedSql = `-- Combined Supabase Migrations
-- Generated on ${new Date().toISOString()}
-- Run this file in your Supabase SQL Editor

${createMigrationsTable}

`;
    
    for (const filename of migrations) {
      const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', filename);
      const sql = await fs.readFile(migrationPath, 'utf8');
      
      combinedSql += `
-- ================================================================
-- Migration: ${filename}
-- ================================================================

${sql}

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('${filename}') ON CONFLICT DO NOTHING;

`;
    }
    
    const outputPath = path.join(__dirname, 'combined-migrations.sql');
    await fs.writeFile(outputPath, combinedSql);
    
    console.log(`\n✓ Combined migration file created: ${outputPath}`);
    console.log('\nYou can copy and paste the contents of this file into your Supabase SQL Editor');
    console.log('to run all migrations at once.');
    
  } catch (error) {
    console.error('Error generating combined migration:', error);
  }
}

// Run migrations
main().catch(console.error);