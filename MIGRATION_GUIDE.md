i
# Supabase Database Migration Guide

This guide will help you migrate the SQL schema to your online Supabase database and set up admin access.

## Prerequisites

- Access to your Supabase project dashboard
- The service role key (found in Settings > API)

## Step 1: Apply Database Migrations

1. Go to your Supabase dashboard: https://app.supabase.com
2. Navigate to the **SQL Editor**
3. Open the file `scripts/combined-migrations.sql` from this project
4. Copy the entire contents of the file
5. Paste it into the SQL Editor
6. Click **Run** to execute all migrations

**Note:** The migrations include:
- Database schema creation
- RLS policies setup
- Sample data insertion
- Multi-language support tables

## Step 2: Fix RLS Policies for Admin Access

After running the main migrations, you need to ensure the RLS policies allow authenticated users to read their own profiles. Run this additional SQL in the SQL Editor:

```sql
