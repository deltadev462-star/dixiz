const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://anfpfnlnvsjvtjjxiedk.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZnBmbmxudnNqdnRqanhpZWRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjAwMjM4MiwiZXhwIjoyMDgxNTc4MzgyfQ.e2w5XtbcigDoAyaikF2ht6BxZ-BLiWAMR2nfChc06ZQ';

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixAdminProfile() {
  const email = process.argv[2];
  
  if (!email) {
    console.log('Usage: node scripts/fix-admin-profile.js <email>');
    console.log('Example: node scripts/fix-admin-profile.js admin1@diximills.com');
    return;
  }

  console.log(`\nFixing admin profile for: ${email}\n`);

  try {
    // Step 1: Get the user ID from auth
    console.log('1. Looking up user in auth system...');
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError.message);
      return;
    }

    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.error(`❌ User not found with email: ${email}`);
      console.log('\nAvailable users:');
      users.forEach(u => console.log(`- ${u.email} (ID: ${u.id})`));
      return;
    }

    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);

    // Step 2: Check if profile exists
    console.log('\n2. Checking if profile exists...');
    const { data: existingProfile, error: selectError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.log('Profile lookup error:', selectError.message);
    }

    if (existingProfile) {
      console.log(`✅ Profile exists with is_admin = ${existingProfile.is_admin}`);
      
      if (!existingProfile.is_admin) {
        // Update to make admin
        console.log('\n3. Updating profile to set is_admin = true...');
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ is_admin: true })
          .eq('id', user.id);

        if (updateError) {
          console.error('❌ Error updating profile:', updateError.message);
        } else {
          console.log('✅ Profile updated successfully!');
        }
      }
    } else {
      // Create profile
      console.log('❌ Profile does not exist. Creating new profile...');
      
      console.log('\n3. Creating admin profile...');
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          is_admin: true,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('❌ Error creating profile:', insertError.message);
        
        // Try with upsert as fallback
        console.log('\n4. Trying upsert as fallback...');
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            is_admin: true,
            created_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (upsertError) {
          console.error('❌ Upsert also failed:', upsertError.message);
        } else {
          console.log('✅ Profile created successfully via upsert!');
        }
      } else {
        console.log('✅ Profile created successfully!');
      }
    }

    // Step 4: Verify the profile
    console.log('\n4. Verifying final profile state...');
    const { data: finalProfile, error: finalError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (finalError) {
      console.error('❌ Could not verify profile:', finalError.message);
    } else if (finalProfile) {
      console.log('✅ Profile verified:');
      console.log(`   - ID: ${finalProfile.id}`);
      console.log(`   - Is Admin: ${finalProfile.is_admin}`);
      console.log(`   - Created: ${finalProfile.created_at}`);
      console.log(`\n✅ Admin setup complete! You can now login at /admin with:`);
      console.log(`   Email: ${email}`);
      console.log(`   Password: [the password you set earlier]`);
    } else {
      console.error('❌ Profile verification failed - profile not found');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixAdminProfile();