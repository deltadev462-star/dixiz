const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://anfpfnlnvsjvtjjxiedk.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZnBmbmxudnNqdnRqanhpZWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDIzODIsImV4cCI6MjA4MTU3ODM4Mn0.-eN88Jwqu7GcIruF-sJvo4Gz14UvqdeoL-r_Hqdvm3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyAdminAccess() {
  console.log('Verifying admin access setup...\n');

  try {
    // Check if profiles table exists
    console.log('1. Checking if profiles table exists...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.log('❌ Profiles table does not exist:', profilesError.message);
      console.log('\n⚠️  The database migrations have not been applied yet!');
      console.log('\nTo fix this issue:');
      console.log('1. Go to your Supabase dashboard: https://app.supabase.com');
      console.log('2. Navigate to the SQL Editor');
      console.log('3. Open the file: scripts/combined-migrations.sql');
      console.log('4. Copy and paste the entire contents into the SQL Editor');
      console.log('5. Click "Run" to execute all migrations');
      console.log('\nAfter running the migrations, you can create an admin user again.');
      return;
    }

    console.log('✅ Profiles table exists');

    // Get the email from command line argument
    const email = process.argv[2];
    if (!email) {
      console.log('\nUsage: node scripts/verify-admin-access.js <email>');
      console.log('Example: node scripts/verify-admin-access.js admin@diximills.com');
      return;
    }

    // Check if user exists in auth
    console.log(`\n2. Checking auth user for email: ${email}`);
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.log('Note: Cannot list users with anon key. Checking profile directly...');
    }

    // Check profile directly
    console.log('\n3. Checking profile entry...');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*');

    if (profileError) {
      console.log('❌ Error fetching profiles:', profileError.message);
      return;
    }

    console.log(`Found ${profiles.length} profile(s) in the database`);
    
    if (profiles.length === 0) {
      console.log('\n⚠️  No profiles found. The admin user creation might have failed.');
      console.log('Try creating the admin user again with: npm run admin');
    } else {
      console.log('\nProfiles found:');
      profiles.forEach(profile => {
        console.log(`- User ID: ${profile.id}, Is Admin: ${profile.is_admin}`);
      });
    }

    // Test RLS policies
    console.log('\n4. Testing RLS policies...');
    console.log('Note: RLS policies might be preventing access.');
    console.log('Make sure the policies in the migration allow authenticated users to read their own profile.');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

verifyAdminAccess();