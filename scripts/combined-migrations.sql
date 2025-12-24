-- Combined Supabase Migrations
-- Generated on 2025-12-18T03:27:33.735Z
-- Run this file in your Supabase SQL Editor


CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



-- ================================================================
-- Migration: 0001_init.sql
-- ================================================================

-- 0001_init.sql
-- Supabase schema, RLS policies, and seed data for WiMed

-- Extensions
create extension if not exists pgcrypto;

-- Profiles: link to auth.users to mark admins
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Site settings (singleton row pattern)
create table if not exists public.site_settings (
  id int primary key default 1,
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  contact_email text,
  phone text,
  address_lines jsonb default '[]'::jsonb,
  map_embed_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Brands
create table if not exists public.brands (
  id bigserial primary key,
  name text not null,
  logo_url text,
  fallback_logo_url text,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Categories
create table if not exists public.categories (
  id bigserial primary key,
  name text not null,
  slug text not null unique,
  image_url text,
  description text,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id bigserial primary key,
  category_id bigint not null references public.categories(id) on delete cascade,
  name text not null,
  image_url text,
  brand text,
  condition text,
  price_display text,
  is_new boolean not null default false,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Services
create table if not exists public.services (
  id bigserial primary key,
  title text not null,
  description text,
  features jsonb not null default '[]'::jsonb,
  gradient text,
  icon_key text,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- About sections
create table if not exists public.about_sections (
  id bigserial primary key,
  key text not null unique,
  title text not null,
  content text,
  media_url text,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Team members
create table if not exists public.team_members (
  id bigserial primary key,
  name text not null,
  position text,
  image_url text,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contact blocks
create table if not exists public.contact_blocks (
  id bigserial primary key,
  key text not null unique,
  title text not null,
  content_lines jsonb not null default '[]'::jsonb,
  icon_key text,
  gradient text,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Collapsible sections (landing accordion)
create table if not exists public.collapsible_sections (
  id bigserial primary key,
  title text not null,
  items jsonb not null default '[]'::jsonb,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated triggers (simple updated_at auto update)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'brands_set_updated_at') then
    create trigger brands_set_updated_at before update on public.brands
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'categories_set_updated_at') then
    create trigger categories_set_updated_at before update on public.categories
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'products_set_updated_at') then
    create trigger products_set_updated_at before update on public.products
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'services_set_updated_at') then
    create trigger services_set_updated_at before update on public.services
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'about_sections_set_updated_at') then
    create trigger about_sections_set_updated_at before update on public.about_sections
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'team_members_set_updated_at') then
    create trigger team_members_set_updated_at before update on public.team_members
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'contact_blocks_set_updated_at') then
    create trigger contact_blocks_set_updated_at before update on public.contact_blocks
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'collapsible_sections_set_updated_at') then
    create trigger collapsible_sections_set_updated_at before update on public.collapsible_sections
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'site_settings_set_updated_at') then
    create trigger site_settings_set_updated_at before update on public.site_settings
    for each row execute function public.set_updated_at();
  end if;
end$$;

-- RLS: enable on all tables
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.services enable row level security;
alter table public.about_sections enable row level security;
alter table public.team_members enable row level security;
alter table public.contact_blocks enable row level security;
alter table public.collapsible_sections enable row level security;

-- Helper clause for admin check
-- Use in policies with: exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
-- Note: Cannot define SQL functions that call auth.uid() in stable contexts for policy reuse; inline EXISTS is recommended.

-- Profiles policies
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
on public.profiles
for all
to authenticated
using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- Public read policies for content tables
-- site_settings (singleton)
drop policy if exists "Public read site_settings" on public.site_settings;
create policy "Public read site_settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Admins write site_settings" on public.site_settings;
create policy "Admins write site_settings"
on public.site_settings
for all
to authenticated
using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- brands
drop policy if exists "Public read brands" on public.brands;
create policy "Public read brands"
on public.brands
for select
to anon, authenticated
using (true);

drop policy if exists "Admins write brands" on public.brands;
create policy "Admins write brands"
on public.brands
for all
to authenticated
using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- categories
drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
on public.categories
for select
to anon, authenticated
using (true);

drop policy if exists "Admins write categories" on public.categories;
create policy "Admins write categories"
on public.categories
for all
to authenticated
using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- products
drop policy if exists "Public read products" on public.products;
create policy "Public read products"
on public.products
for select
to anon, authenticated
using (true);

drop policy if exists "Admins write products" on public.products;
create policy "Admins write products"
on public.products
for all
to authenticated
using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- services
drop policy if exists "Public read services" on public.services;
create policy "Public read services"
on public.services
for select
to anon, authenticated
using (true);

drop policy if exists "Admins write services" on public.services;
create policy "Admins write services"
on public.services
for all
to authenticated
using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- about_sections
drop policy if exists "Public read about" on public.about_sections;
create policy "Public read about"
on public.about_sections
for select
to anon, authenticated
using (true);

drop policy if exists "Admins write about" on public.about_sections;
create policy "Admins write about"
on public.about_sections
for all
to authenticated
using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- team_members
drop policy if exists "Public read team" on public.team_members;
create policy "Public read team"
on public.team_members
for select
to anon, authenticated
using (true);

drop policy if exists "Admins write team" on public.team_members;
create policy "Admins write team"
on public.team_members
for all
to authenticated
using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- contact_blocks
drop policy if exists "Public read contact" on public.contact_blocks;
create policy "Public read contact"
on public.contact_blocks
for select
to anon, authenticated
using (true);

drop policy if exists "Admins write contact" on public.contact_blocks;
create policy "Admins write contact"
on public.contact_blocks
for all
to authenticated
using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- collapsible_sections
drop policy if exists "Public read collapsible" on public.collapsible_sections;
create policy "Public read collapsible"
on public.collapsible_sections
for select
to anon, authenticated
using (true);

drop policy if exists "Admins write collapsible" on public.collapsible_sections;
create policy "Admins write collapsible"
on public.collapsible_sections
for all
to authenticated
using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- Seed site settings (singleton)
insert into public.site_settings (id, hero_title, hero_subtitle, hero_image_url, contact_email, phone, address_lines, map_embed_url)
values (
  1,
  'Quality Medical Equipment for Healthcare Excellence',
  'WiMed believes that facilitating access to medical equipment enhances healthcare, saves lives, and improves quality of life.',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
  'info@wimedcenter.com',
  '+33 1 60 00 00 00',
  '["67 Rue Aristide Briand", "77124 Villenoy", "France"]',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2616.5484651859!2d2.8690709999999997!3d48.94871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e8a0e139489213%3A0xe13ac8259c7406f!2s67%20Rue%20Aristide%20Briand%2C%2077124%20Villenoy%2C%20France!5e1!3m2!1sen!2sfr!4v1690000000000!5m2!1sen!2sfr&maptype=satellite'
)
on conflict (id) do nothing;

-- Seed brands (subset matching UI)
insert into public.brands (name, logo_url, fallback_logo_url, sort_order) values
('Erbe', 'https://cdn.worldvectorlogo.com/logos/erbe.svg', 'https://elsasociety.org/wp-content/uploads/2020/08/ErbeLogo.png', 1),
('Fujinon', 'https://cdn.worldvectorlogo.com/logos/fujifilm-2.svg', 'https://www.chromos.ch/wp-content/uploads/2024/11/logo-fujinon.jpg', 2),
('Olympus', 'https://cdn.worldvectorlogo.com/logos/olympus-1.svg', 'https://logos-world.net/wp-content/uploads/2023/03/Olympus-Logo.png', 3),
('Karl Storz', 'https://res.cloudinary.com/medical-device-logos/image/upload/v1/karl-storz-logo', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Karl_Storz_Endoskope_logo.svg/2560px-Karl_Storz_Endoskope_logo.svg.png', 4),
('Stryker', 'https://cdn.worldvectorlogo.com/logos/stryker-1.svg', 'https://download.logo.wine/logo/Stryker_Corporation/Stryker_Corporation-Logo.wine.png', 5),
('Medtronic', 'https://cdn.worldvectorlogo.com/logos/medtronic.svg', 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Medtronic_logo.svg', 6),
('GE Healthcare', 'https://cdn.worldvectorlogo.com/logos/ge-healthcare.svg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/GE_Healthcare_logo.svg/320px-GE_Healthcare_logo.svg.png', 7),
('Draeger', 'https://cdn.worldvectorlogo.com/logos/drager.svg', 'https://images.seeklogo.com/logo-png/4/1/drager-logo-png_seeklogo-43548.png', 8),
('Getinge', 'https://cdn.worldvectorlogo.com/logos/getinge.svg', 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Getinge_logo.svg', 9),
('Philips', 'https://cdn.worldvectorlogo.com/logos/philips-6.svg', 'https://upload.wikimedia.org/wikipedia/commons/5/52/Philips_logo_new.svg', 10)
on conflict do nothing;

-- Seed categories
insert into public.categories (name, slug, image_url, description, sort_order) values
('Anaesthesia', 'anaesthesia', 'https://medgill.co.uk/cdn/shop/collections/image_d428c745-7b12-4c6b-bc3d-3ac49ec57673.jpg?v=1722875051&width=535', 'Anaesthesia equipment', 1),
('Endoscopy & Laparoscopy', 'endoscopy-laparoscopy', 'https://medgill.co.uk/cdn/shop/collections/image_6561bd44-fb80-4942-b0bc-fabda7037e47.jpg?v=1722874926&width=535', 'Endoscopy and laparoscopy systems', 2),
('Electrosurgical', 'electrosurgical', 'https://medgill.co.uk/cdn/shop/collections/image.jpg?v=1705420045&width=535', 'Electrosurgical devices', 3),
('Ventilators', 'ventilators', 'https://medgill.co.uk/cdn/shop/collections/image_4236e781-f5f2-47c2-b3cd-ddc147d82eb4.jpg?v=1705433533&width=535', 'Ventilators and respiratory', 4),
('Endoscopes', 'endoscopes', 'https://medgill.co.uk/cdn/shop/collections/endoscopes.jpg?v=1714763081&width=535', 'Flexible endoscopes', 5),
('Patient Monitors', 'patient-monitors', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80', 'Monitoring systems', 6)
on conflict (slug) do nothing;

-- Minimal seed products (subset; UI will work with any count)
insert into public.products (category_id, name, image_url, brand, condition, price_display, is_new, sort_order)
select c.id, p.name, p.image_url, p.brand, p.condition, p.price_display, p.is_new, p.sort_order
from (
  values
  -- Anaesthesia
  ('anaesthesia','Anaesthesia Machine AX-400','https://medgill.co.uk/cdn/shop/collections/image_d428c745-7b12-4c6b-bc3d-3ac49ec57673.jpg?v=1722875051&width=535','GE Healthcare','Refurbished','$18,000', true, 1),
  ('anaesthesia','Anaesthesia Workstation','https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=400&q=80','Mindray','Used','$12,500', false, 2),
  -- Endoscopy & Laparoscopy
  ('endoscopy-laparoscopy','HD Endoscope Camera','https://medgill.co.uk/cdn/shop/collections/image_6561bd44-fb80-4942-b0bc-fabda7037e47.jpg?v=1722874926&width=535','Olympus','Refurbished','$9,800', true, 1),
  ('endoscopy-laparoscopy','Laparoscopic Tower','https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80','Karl Storz','Used','$7,500', false, 2),
  -- Electrosurgical
  ('electrosurgical','Electrosurgical Unit','https://medgill.co.uk/cdn/shop/collections/image.jpg?v=1705420045&width=535','Erbe','Refurbished','$5,500', true, 1),
  ('electrosurgical','Bipolar Forceps','https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=400&q=80','Stryker','Used','$650', false, 2),
  -- Ventilators
  ('ventilators','ICU Ventilator','https://medgill.co.uk/cdn/shop/collections/image_4236e781-f5f2-47c2-b3cd-ddc147d82eb4.jpg?v=1705433533&width=535','Dräger','Used','$15,000', true, 1),
  ('ventilators','Transport Ventilator','https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=400&q=80','GE Healthcare','Refurbished','$11,500', false, 2),
  -- Endoscopes
  ('endoscopes','Flexible Gastroscope','https://medgill.co.uk/cdn/shop/collections/endoscopes.jpg?v=1714763081&width=535','Olympus','Refurbished','$6,800', true, 1),
  ('endoscopes','Colonoscope','https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=400&q=80','Fujinon','Used','$5,900', false, 2),
  -- Patient Monitors
  ('patient-monitors','Patient Monitor PM-300','https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80','Philips','Used','$3,200', true, 1),
  ('patient-monitors','ECG Machine','https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=400&q=80','Mindray','Refurbished','$2,800', false, 2)
) as p(slug,name,image_url,brand,condition,price_display,is_new,sort_order)
join public.categories c on c.slug = p.slug
on conflict do nothing;

-- Seed services (matching UI structure)
insert into public.services (title, description, features, gradient, icon_key, sort_order) values
('Equipment Maintenance & Repair','Professional maintenance and repair services',
  '["Preventive maintenance programs","Emergency repair services","Certified technicians","Original spare parts","Performance optimization"]',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)','build',1),
('Logistics & Delivery','Reliable logistics and delivery services',
  '["Same-day delivery available","International shipping","Secure packaging","Real-time tracking","Installation coordination"]',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)','local_shipping',2),
('Installation & Training','Complete installation services with comprehensive staff training',
  '["Professional installation","Equipment commissioning","Staff training programs","Operating procedures guidance","Safety protocol implementation"]',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)','verified',3),
('Technical Support','24/7 technical support to ensure your equipment operates at peak performance',
  '["24/7 helpdesk support","Remote diagnostics","On-site support available","Technical documentation","Warranty support"]',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)','support_agent',4)
on conflict do nothing;

-- Seed about sections
insert into public.about_sections(key, title, content, media_url, sort_order) values
('mission','Our Mission','To provide healthcare facilities with cutting-edge medical equipment and comprehensive support services that enhance patient care quality and operational efficiency.','',1),
('vision','Our Vision','To be recognized as the premier medical equipment supplier in the UK, known for our commitment to quality, innovation, and customer satisfaction.','',2),
('story','Our Story','Founded in 2005, WiMed began as a small medical equipment distributor with a vision to transform healthcare delivery through quality products and exceptional service.','',3)
on conflict (key) do nothing;

-- Seed team members
insert into public.team_members(name, position, image_url, sort_order) values
('Dr. James Mitchell','Chief Executive Officer','https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80',1),
('Sarah Thompson','Chief Operating Officer','https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&q=80',2),
('Michael Chen','Head of Technical Services','https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=200&q=80',3),
('Emma Williams','Customer Relations Director','https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',4)
on conflict do nothing;

-- Seed contact blocks
insert into public.contact_blocks(key, title, content_lines, icon_key, gradient, sort_order) values
('address','Address','["123 Medical Street","London, UK","SW1A 1AA"]','location_on','linear-gradient(135deg, #667eea 0%, #764ba2 100%)',1),
('phone','Phone','["+44 740 445 6671"]','phone','linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',2),
('whatsapp','WhatsApp','["+44 740 445 6671"]','whatsapp','linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',3),
('email','Email','["info@medgill.co.uk"]','email','linear-gradient(135deg, #fa709a 0%, #fee140 100%)',4),
('hours','Business Hours','["Monday - Friday: 9:00 AM - 6:00 PM","Saturday: 10:00 AM - 4:00 PM","Sunday: Closed"]','access_time','linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',5)
on conflict (key) do nothing;

-- Seed collapsible sections
insert into public.collapsible_sections(title, items, sort_order) values
('OUR MISSION','[
  "Committed to provide affordable medical equipment on a global scale while understanding diverse budget allowances.",
  "To share our expertise and knowledge to facilitate the use of medical equipment for patient care.",
  "Ensure medical professionals possess adequate and dependable equipment to prioritise patient care over logistical concerns.",
  "Empower doctors to better care for their patients."
]', 1),
('QUALITY','[
  "Cultivating long-term customer relationships is at core of our values. WiMed has established a loyal customer base over the years, showcasing trust in our offerings.",
  "From first enquiry to shipping, we prioritise care to address all customer needs.",
  "All equipment undergoes functional testing by our experienced and qualified Biomedical Engineers",
  "Customers can rely on our products for high-quality performance and functionality."
]', 2),
('SHIPPING','[
  "We ship by Air, Sea, Road transport worldwide",
  "We also provide onsite installation, demonstration and estimates (UK only).",
  "Our team is skilled in managing fragile medical equipment to ensure secure and safe transit.",
  "We know the importance of receiving items in good condition so we advise the best packaging with respect to customer location and mode of transport."
]', 3)
on conflict do nothing;

-- Done

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0001_init.sql') ON CONFLICT DO NOTHING;


-- ================================================================
-- Migration: 0002_header_footer.sql
-- ================================================================

-- Header navigation items table
CREATE TABLE IF NOT EXISTS header_nav_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  route VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Footer settings table
CREATE TABLE IF NOT EXISTS footer_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Singleton pattern
  office_address_lines JSONB DEFAULT '[]'::jsonb,
  about_text TEXT,
  facebook_url VARCHAR(500),
  instagram_url VARCHAR(500),
  youtube_url VARCHAR(500),
  website_url VARCHAR(500),
  copyright_text VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Footer links table
CREATE TABLE IF NOT EXISTS footer_links (
  id SERIAL PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default header navigation items
INSERT INTO header_nav_items (name, route, sort_order) VALUES
  ('Home', '/', 0),
  ('Anaesthesia', '/anaesthesia', 1),
  ('Patient Monitoring', '/patient-monitors', 2),
  ('Electrosurgical', '/electrosurgical', 3),
  ('Endoscopy & Laparoscopy', '/endoscopy-laparoscopy', 4),
  ('Flexible Endoscopes', '/endoscopes', 5),
  ('Ventilators', '/ventilators', 6),
  ('Services', '/services', 7),
  ('About Us', '/about-us', 8),
  ('Contact Us', '/contact-us', 9);

-- Insert default footer settings
INSERT INTO footer_settings (
  office_address_lines,
  about_text,
  facebook_url,
  instagram_url,
  youtube_url,
  website_url,
  copyright_text
) VALUES (
  '["1 Nestle''s Avenue", "Hayes, UB3 4UZ", "UK"]'::jsonb,
  'Over 25 years of experience in medical equipment sales and services, with more than 2,000 products. We offer products, services and solutions to public and private hospitals, medical centres and private practices.',
  '#',
  '#',
  '#',
  '#',
  '© {year}, WiMed ┃ ALL RIGHTS RESERVED ┃'
);

-- Insert default footer links
INSERT INTO footer_links (label, url, sort_order) VALUES
  ('Refund policy', '#', 0),
  ('Privacy policy', '#', 1),
  ('Terms of service', '#', 2),
  ('Shipping policy', '#', 3),
  ('Contact information', '#', 4);

-- Add RLS policies
ALTER TABLE header_nav_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON header_nav_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON footer_settings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON footer_links FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admin write access" ON header_nav_items FOR ALL USING (
  EXISTS(SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin)
);
CREATE POLICY "Admin write access" ON footer_settings FOR ALL USING (
  EXISTS(SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin)
);
CREATE POLICY "Admin write access" ON footer_links FOR ALL USING (
  EXISTS(SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin)
);

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0002_header_footer.sql') ON CONFLICT DO NOTHING;


-- ================================================================
-- Migration: 0003_storage_bucket.sql
-- ================================================================

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the images bucket
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to update their own images
CREATE POLICY "Authenticated users can update images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to delete their own images
CREATE POLICY "Authenticated users can delete images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images');

-- Allow public to view images
CREATE POLICY "Public can view images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'images');

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0003_storage_bucket.sql') ON CONFLICT DO NOTHING;


-- ================================================================
-- Migration: 0004_remove_address_lines.sql
-- ================================================================

-- 0004_remove_address_lines.sql
-- Remove the redundant address_lines field from site_settings table
-- Address information is now managed through contact_blocks table

-- Drop the address_lines column from site_settings table
ALTER TABLE public.site_settings 
DROP COLUMN IF EXISTS address_lines;

-- Add a comment explaining the change
COMMENT ON TABLE public.site_settings IS 'Site-wide settings. Address information is now managed through contact_blocks table with key=address';

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0004_remove_address_lines.sql') ON CONFLICT DO NOTHING;


-- ================================================================
-- Migration: 0005_language_management.sql
-- ================================================================

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  native_name VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create translations table for general content
CREATE TABLE IF NOT EXISTS translations (
  id SERIAL PRIMARY KEY,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  translation_key VARCHAR(255) NOT NULL,
  translation_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(language_code, translation_key)
);

-- Create header_nav_items_translations table
CREATE TABLE IF NOT EXISTS header_nav_items_translations (
  id SERIAL PRIMARY KEY,
  nav_item_id INTEGER NOT NULL REFERENCES header_nav_items(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(nav_item_id, language_code)
);

-- Create site_settings_translations table
CREATE TABLE IF NOT EXISTS site_settings_translations (
  id SERIAL PRIMARY KEY,
  setting_id INTEGER NOT NULL REFERENCES site_settings(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  hero_title TEXT,
  hero_subtitle TEXT,
  value_prop_title TEXT,
  value_prop_subtitle TEXT,
  categories_title TEXT,
  categories_subtitle TEXT,
  new_arrivals_title TEXT,
  new_arrivals_subtitle TEXT,
  brands_title TEXT,
  brands_subtitle TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(setting_id, language_code)
);

-- Create categories_translations table
CREATE TABLE IF NOT EXISTS categories_translations (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category_id, language_code)
);

-- Create products_translations table
CREATE TABLE IF NOT EXISTS products_translations (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, language_code)
);

-- Create services_translations table
CREATE TABLE IF NOT EXISTS services_translations (
  id SERIAL PRIMARY KEY,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(service_id, language_code)
);

-- Create about_sections_translations table
CREATE TABLE IF NOT EXISTS about_sections_translations (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES about_sections(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(section_id, language_code)
);

-- Create team_members_translations table
CREATE TABLE IF NOT EXISTS team_members_translations (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(member_id, language_code)
);

-- Create contact_blocks_translations table
CREATE TABLE IF NOT EXISTS contact_blocks_translations (
  id SERIAL PRIMARY KEY,
  block_id INTEGER NOT NULL REFERENCES contact_blocks(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(block_id, language_code)
);

-- Create collapsible_sections_translations table
CREATE TABLE IF NOT EXISTS collapsible_sections_translations (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES collapsible_sections(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(section_id, language_code)
);

-- Create footer_settings_translations table
CREATE TABLE IF NOT EXISTS footer_settings_translations (
  id SERIAL PRIMARY KEY,
  setting_id INTEGER NOT NULL REFERENCES footer_settings(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  company_description TEXT,
  copyright_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(setting_id, language_code)
);

-- Create footer_links_translations table
CREATE TABLE IF NOT EXISTS footer_links_translations (
  id SERIAL PRIMARY KEY,
  link_id INTEGER NOT NULL REFERENCES footer_links(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(link_id, language_code)
);

-- Insert default languages
INSERT INTO languages (code, name, native_name, is_active, is_default, sort_order) VALUES
  ('en', 'English', 'English', true, true, 1),
  ('es', 'Spanish', 'Español', true, false, 2),
  ('fr', 'French', 'Français', true, false, 3),
  ('de', 'German', 'Deutsch', false, false, 4),
  ('it', 'Italian', 'Italiano', false, false, 5),
  ('pt', 'Portuguese', 'Português', false, false, 6),
  ('ar', 'Arabic', 'العربية', false, false, 7),
  ('zh', 'Chinese', '中文', false, false, 8),
  ('ja', 'Japanese', '日本語', false, false, 9),
  ('ru', 'Russian', 'Русский', false, false, 10);

-- Create indexes for better performance
CREATE INDEX idx_translations_language_code ON translations(language_code);
CREATE INDEX idx_translations_key ON translations(translation_key);
CREATE INDEX idx_header_nav_translations_language ON header_nav_items_translations(language_code);
CREATE INDEX idx_site_settings_translations_language ON site_settings_translations(language_code);
CREATE INDEX idx_categories_translations_language ON categories_translations(language_code);
CREATE INDEX idx_products_translations_language ON products_translations(language_code);
CREATE INDEX idx_services_translations_language ON services_translations(language_code);
CREATE INDEX idx_about_translations_language ON about_sections_translations(language_code);
CREATE INDEX idx_team_translations_language ON team_members_translations(language_code);
CREATE INDEX idx_contact_translations_language ON contact_blocks_translations(language_code);
CREATE INDEX idx_collapsible_translations_language ON collapsible_sections_translations(language_code);
CREATE INDEX idx_footer_settings_translations_language ON footer_settings_translations(language_code);
CREATE INDEX idx_footer_links_translations_language ON footer_links_translations(language_code);

-- Create updated_at triggers for all translation tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_languages_updated_at BEFORE UPDATE ON languages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_header_nav_translations_updated_at BEFORE UPDATE ON header_nav_items_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_translations_updated_at BEFORE UPDATE ON site_settings_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_translations_updated_at BEFORE UPDATE ON categories_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_translations_updated_at BEFORE UPDATE ON products_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_translations_updated_at BEFORE UPDATE ON services_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_translations_updated_at BEFORE UPDATE ON about_sections_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_translations_updated_at BEFORE UPDATE ON team_members_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_translations_updated_at BEFORE UPDATE ON contact_blocks_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collapsible_translations_updated_at BEFORE UPDATE ON collapsible_sections_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_footer_settings_translations_updated_at BEFORE UPDATE ON footer_settings_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_footer_links_translations_updated_at BEFORE UPDATE ON footer_links_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0005_language_management.sql') ON CONFLICT DO NOTHING;


-- ================================================================
-- Migration: 0006_sample_translations.sql
-- ================================================================

-- Sample translation data for French and Spanish

-- Site Settings Translations
INSERT INTO site_settings_translations (setting_id, language_code, hero_title, hero_subtitle, value_prop_title, value_prop_subtitle, categories_title, categories_subtitle, new_arrivals_title, new_arrivals_subtitle, brands_title, brands_subtitle) VALUES
-- French
(1, 'fr', 
 'Équipement Médical de Qualité pour l''Excellence des Soins',
 'WiMed croit que faciliter l''accès aux équipements médicaux améliore les soins de santé, sauve des vies et améliore la qualité de vie.',
 'Pourquoi Choisir WiMed',
 'Votre partenaire de confiance pour les équipements médicaux',
 'Notre Gamme d''Équipements Médicaux',
 'Découvrez notre sélection complète d''équipements médicaux de qualité',
 'Nouveautés',
 'Découvrez nos dernières arrivées d''équipements médicaux, soigneusement testés et prêts à l''emploi',
 'Travaillant avec des noms de confiance et leaders dans le domaine de la santé',
 'Nos partenaires de confiance'
),
-- Spanish
(1, 'es',
 'Equipos Médicos de Calidad para la Excelencia en Salud',
 'WiMed cree que facilitar el acceso a equipos médicos mejora la atención médica, salva vidas y mejora la calidad de vida.',
 'Por Qué Elegir WiMed',
 'Su socio de confianza para equipos médicos',
 'Nuestra Gama de Equipos Médicos',
 'Explore nuestra selección completa de equipos médicos de calidad',
 'Nuevas Llegadas',
 'Vea nuestras últimas llegadas de equipos médicos, completamente probados y listos para usar',
 'Trabajando con nombres confiables y líderes en el cuidado de la salud',
 'Nuestros socios de confianza'
);

-- Header Navigation Translations
INSERT INTO header_nav_items_translations (nav_item_id, language_code, name) 
SELECT id, 'fr', 
  CASE name
    WHEN 'Home' THEN 'Accueil'
    WHEN 'Anaesthesia' THEN 'Anesthésie'
    WHEN 'Patient Monitoring' THEN 'Surveillance des Patients'
    WHEN 'Electrosurgical' THEN 'Électrochirurgie'
    WHEN 'Endoscopy & Laparoscopy' THEN 'Endoscopie et Laparoscopie'
    WHEN 'Flexible Endoscopes' THEN 'Endoscopes Flexibles'
    WHEN 'Ventilators' THEN 'Ventilateurs'
    WHEN 'Services' THEN 'Services'
    WHEN 'About Us' THEN 'À Propos'
    WHEN 'Contact Us' THEN 'Contactez-nous'
    ELSE name
  END
FROM header_nav_items;

INSERT INTO header_nav_items_translations (nav_item_id, language_code, name) 
SELECT id, 'es', 
  CASE name
    WHEN 'Home' THEN 'Inicio'
    WHEN 'Anaesthesia' THEN 'Anestesia'
    WHEN 'Patient Monitoring' THEN 'Monitoreo de Pacientes'
    WHEN 'Electrosurgical' THEN 'Electrocirugía'
    WHEN 'Endoscopy & Laparoscopy' THEN 'Endoscopia y Laparoscopia'
    WHEN 'Flexible Endoscopes' THEN 'Endoscopios Flexibles'
    WHEN 'Ventilators' THEN 'Ventiladores'
    WHEN 'Services' THEN 'Servicios'
    WHEN 'About Us' THEN 'Acerca de Nosotros'
    WHEN 'Contact Us' THEN 'Contáctenos'
    ELSE name
  END
FROM header_nav_items;

-- Categories Translations
INSERT INTO categories_translations (category_id, language_code, name, description) VALUES
-- French
((SELECT id FROM categories WHERE slug = 'anaesthesia'), 'fr', 'Anesthésie', 'Équipement d''anesthésie'),
((SELECT id FROM categories WHERE slug = 'endoscopy-laparoscopy'), 'fr', 'Endoscopie et Laparoscopie', 'Systèmes d''endoscopie et de laparoscopie'),
((SELECT id FROM categories WHERE slug = 'electrosurgical'), 'fr', 'Électrochirurgie', 'Dispositifs électrochirurgicaux'),
((SELECT id FROM categories WHERE slug = 'ventilators'), 'fr', 'Ventilateurs', 'Ventilateurs et équipements respiratoires'),
((SELECT id FROM categories WHERE slug = 'endoscopes'), 'fr', 'Endoscopes', 'Endoscopes flexibles'),
((SELECT id FROM categories WHERE slug = 'patient-monitors'), 'fr', 'Moniteurs de Patients', 'Systèmes de surveillance'),
-- Spanish
((SELECT id FROM categories WHERE slug = 'anaesthesia'), 'es', 'Anestesia', 'Equipos de anestesia'),
((SELECT id FROM categories WHERE slug = 'endoscopy-laparoscopy'), 'es', 'Endoscopia y Laparoscopia', 'Sistemas de endoscopia y laparoscopia'),
((SELECT id FROM categories WHERE slug = 'electrosurgical'), 'es', 'Electrocirugía', 'Dispositivos electroquirúrgicos'),
((SELECT id FROM categories WHERE slug = 'ventilators'), 'es', 'Ventiladores', 'Ventiladores y equipos respiratorios'),
((SELECT id FROM categories WHERE slug = 'endoscopes'), 'es', 'Endoscopios', 'Endoscopios flexibles'),
((SELECT id FROM categories WHERE slug = 'patient-monitors'), 'es', 'Monitores de Pacientes', 'Sistemas de monitoreo');

-- Products Translations (sample for new products)
INSERT INTO products_translations (product_id, language_code, name, description) 
SELECT p.id, 'fr',
  CASE 
    WHEN p.name LIKE '%Anaesthesia Machine%' THEN 'Machine d''Anesthésie AX-400'
    WHEN p.name LIKE '%HD Endoscope Camera%' THEN 'Caméra Endoscope HD'
    WHEN p.name LIKE '%Electrosurgical Unit%' THEN 'Unité Électrochirurgicale'
    WHEN p.name LIKE '%ICU Ventilator%' THEN 'Ventilateur de Soins Intensifs'
    WHEN p.name LIKE '%Flexible Gastroscope%' THEN 'Gastroscope Flexible'
    WHEN p.name LIKE '%Patient Monitor%' THEN 'Moniteur Patient PM-300'
    ELSE p.name
  END,
  CASE 
    WHEN p.name LIKE '%Anaesthesia%' THEN 'Équipement d''anesthésie de haute qualité'
    WHEN p.name LIKE '%Endoscope%' THEN 'Système d''imagerie endoscopique avancé'
    WHEN p.name LIKE '%Electrosurgical%' THEN 'Unité électrochirurgicale moderne'
    WHEN p.name LIKE '%Ventilator%' THEN 'Ventilateur médical professionnel'
    WHEN p.name LIKE '%Monitor%' THEN 'Système de surveillance patient'
    ELSE NULL
  END
FROM products p
WHERE p.is_new = true;

INSERT INTO products_translations (product_id, language_code, name, description) 
SELECT p.id, 'es',
  CASE 
    WHEN p.name LIKE '%Anaesthesia Machine%' THEN 'Máquina de Anestesia AX-400'
    WHEN p.name LIKE '%HD Endoscope Camera%' THEN 'Cámara Endoscópica HD'
    WHEN p.name LIKE '%Electrosurgical Unit%' THEN 'Unidad Electroquirúrgica'
    WHEN p.name LIKE '%ICU Ventilator%' THEN 'Ventilador de UCI'
    WHEN p.name LIKE '%Flexible Gastroscope%' THEN 'Gastroscopio Flexible'
    WHEN p.name LIKE '%Patient Monitor%' THEN 'Monitor de Pacientes PM-300'
    ELSE p.name
  END,
  CASE 
    WHEN p.name LIKE '%Anaesthesia%' THEN 'Equipo de anestesia de alta calidad'
    WHEN p.name LIKE '%Endoscope%' THEN 'Sistema de imagen endoscópica avanzado'
    WHEN p.name LIKE '%Electrosurgical%' THEN 'Unidad electroquirúrgica moderna'
    WHEN p.name LIKE '%Ventilator%' THEN 'Ventilador médico profesional'
    WHEN p.name LIKE '%Monitor%' THEN 'Sistema de monitoreo de pacientes'
    ELSE NULL
  END
FROM products p
WHERE p.is_new = true;

-- Services Translations
INSERT INTO services_translations (service_id, language_code, title, description) VALUES
-- French
((SELECT id FROM services WHERE icon_key = 'build'), 'fr', 
 'Maintenance et Réparation d''Équipements',
 'Services professionnels de maintenance et de réparation'),
((SELECT id FROM services WHERE icon_key = 'local_shipping'), 'fr',
 'Logistique et Livraison',
 'Services de logistique et de livraison fiables'),
((SELECT id FROM services WHERE icon_key = 'verified'), 'fr',
 'Installation et Formation',
 'Services d''installation complets avec formation complète du personnel'),
((SELECT id FROM services WHERE icon_key = 'support_agent'), 'fr',
 'Support Technique',
 'Support technique 24/7 pour garantir le fonctionnement optimal de vos équipements'),
-- Spanish
((SELECT id FROM services WHERE icon_key = 'build'), 'es',
 'Mantenimiento y Reparación de Equipos',
 'Servicios profesionales de mantenimiento y reparación'),
((SELECT id FROM services WHERE icon_key = 'local_shipping'), 'es',
 'Logística y Entrega',
 'Servicios confiables de logística y entrega'),
((SELECT id FROM services WHERE icon_key = 'verified'), 'es',
 'Instalación y Capacitación',
 'Servicios completos de instalación con capacitación integral del personal'),
((SELECT id FROM services WHERE icon_key = 'support_agent'), 'es',
 'Soporte Técnico',
 'Soporte técnico 24/7 para garantizar que su equipo funcione al máximo rendimiento');

-- About Sections Translations
INSERT INTO about_sections_translations (section_id, language_code, title, content) VALUES
-- French
((SELECT id FROM about_sections WHERE key = 'mission'), 'fr',
 'Notre Mission',
 'Fournir aux établissements de santé des équipements médicaux de pointe et des services de support complets qui améliorent la qualité des soins aux patients et l''efficacité opérationnelle.'),
((SELECT id FROM about_sections WHERE key = 'vision'), 'fr',
 'Notre Vision',
 'Être reconnu comme le premier fournisseur d''équipements médicaux au Royaume-Uni, connu pour notre engagement envers la qualité, l''innovation et la satisfaction client.'),
((SELECT id FROM about_sections WHERE key = 'story'), 'fr',
 'Notre Histoire',
 'Fondée en 2005, WiMed a commencé comme un petit distributeur d''équipements médicaux avec une vision de transformer la prestation de soins de santé grâce à des produits de qualité et un service exceptionnel.'),
-- Spanish
((SELECT id FROM about_sections WHERE key = 'mission'), 'es',
 'Nuestra Misión',
 'Proporcionar a las instalaciones de salud equipos médicos de vanguardia y servicios de soporte integral que mejoren la calidad de la atención al paciente y la eficiencia operativa.'),
((SELECT id FROM about_sections WHERE key = 'vision'), 'es',
 'Nuestra Visión',
 'Ser reconocidos como el principal proveedor de equipos médicos en el Reino Unido, conocidos por nuestro compromiso con la calidad, la innovación y la satisfacción del cliente.'),
((SELECT id FROM about_sections WHERE key = 'story'), 'es',
 'Nuestra Historia',
 'Fundada en 2005, WiMed comenzó como un pequeño distribuidor de equipos médicos con la visión de transformar la prestación de atención médica a través de productos de calidad y un servicio excepcional.');

-- Team Members Translations
INSERT INTO team_members_translations (member_id, language_code, name, position, bio) VALUES
-- French
((SELECT id FROM team_members WHERE position = 'Chief Executive Officer'), 'fr',
 'Dr. James Mitchell', 'Directeur Général', 
 'Leader visionnaire avec plus de 20 ans d''expérience dans l''industrie des équipements médicaux.'),
((SELECT id FROM team_members WHERE position = 'Chief Operating Officer'), 'fr',
 'Sarah Thompson', 'Directrice des Opérations',
 'Experte en optimisation des processus et en gestion de la chaîne d''approvisionnement.'),
((SELECT id FROM team_members WHERE position = 'Head of Technical Services'), 'fr',
 'Michael Chen', 'Responsable des Services Techniques',
 'Ingénieur biomédical certifié avec une expertise en maintenance d''équipements complexes.'),
((SELECT id FROM team_members WHERE position = 'Customer Relations Director'), 'fr',
 'Emma Williams', 'Directrice des Relations Clients',
 'Passionnée par l''excellence du service client et la construction de relations durables.'),
-- Spanish
((SELECT id FROM team_members WHERE position = 'Chief Executive Officer'), 'es',
 'Dr. James Mitchell', 'Director Ejecutivo',
 'Líder visionario con más de 20 años de experiencia en la industria de equipos médicos.'),
((SELECT id FROM team_members WHERE position = 'Chief Operating Officer'), 'es',
 'Sarah Thompson', 'Directora de Operaciones',
 'Experta en optimización de procesos y gestión de la cadena de suministro.'),
((SELECT id FROM team_members WHERE position = 'Head of Technical Services'), 'es',
 'Michael Chen', 'Jefe de Servicios Técnicos',
 'Ingeniero biomédico certificado con experiencia en mantenimiento de equipos complejos.'),
((SELECT id FROM team_members WHERE position = 'Customer Relations Director'), 'es',
 'Emma Williams', 'Directora de Relaciones con Clientes',
 'Apasionada por la excelencia en el servicio al cliente y la construcción de relaciones duraderas.');

-- Contact Blocks Translations
INSERT INTO contact_blocks_translations (block_id, language_code, title, content) VALUES
-- French
((SELECT id FROM contact_blocks WHERE key = 'address'), 'fr', 'Adresse', '["123 Rue Médicale","Londres, Royaume-Uni","SW1A 1AA"]'),
((SELECT id FROM contact_blocks WHERE key = 'phone'), 'fr', 'Téléphone', '["+44 740 445 6671"]'),
((SELECT id FROM contact_blocks WHERE key = 'whatsapp'), 'fr', 'WhatsApp', '["+44 740 445 6671"]'),
((SELECT id FROM contact_blocks WHERE key = 'email'), 'fr', 'Email', '["info@medgill.co.uk"]'),
((SELECT id FROM contact_blocks WHERE key = 'hours'), 'fr', 'Heures d''Ouverture', '["Lundi - Vendredi: 9h00 - 18h00","Samedi: 10h00 - 16h00","Dimanche: Fermé"]'),
-- Spanish
((SELECT id FROM contact_blocks WHERE key = 'address'), 'es', 'Dirección', '["123 Calle Médica","Londres, Reino Unido","SW1A 1AA"]'),
((SELECT id FROM contact_blocks WHERE key = 'phone'), 'es', 'Teléfono', '["+44 740 445 6671"]'),
((SELECT id FROM contact_blocks WHERE key = 'whatsapp'), 'es', 'WhatsApp', '["+44 740 445 6671"]'),
((SELECT id FROM contact_blocks WHERE key = 'email'), 'es', 'Correo Electrónico', '["info@medgill.co.uk"]'),
((SELECT id FROM contact_blocks WHERE key = 'hours'), 'es', 'Horario de Atención', '["Lunes - Viernes: 9:00 AM - 6:00 PM","Sábado: 10:00 AM - 4:00 PM","Domingo: Cerrado"]');

-- Collapsible Sections Translations
INSERT INTO collapsible_sections_translations (section_id, language_code, title, content) VALUES
-- French
((SELECT id FROM collapsible_sections WHERE title = 'OUR MISSION'), 'fr',
 'NOTRE MISSION',
 '[
   "Engagés à fournir des équipements médicaux abordables à l''échelle mondiale tout en comprenant les diverses allocations budgétaires.",
   "Partager notre expertise et nos connaissances pour faciliter l''utilisation des équipements médicaux pour les soins aux patients.",
   "Veiller à ce que les professionnels de la santé disposent d''équipements adéquats et fiables pour privilégier les soins aux patients plutôt que les préoccupations logistiques.",
   "Permettre aux médecins de mieux prendre soin de leurs patients."
 ]'),
((SELECT id FROM collapsible_sections WHERE title = 'QUALITY'), 'fr',
 'QUALITÉ',
 '[
   "Cultiver des relations clients à long terme est au cœur de nos valeurs. WiMed a établi une base de clients fidèles au fil des ans, démontrant la confiance dans nos offres.",
   "De la première demande à l''expédition, nous accordons la priorité aux soins pour répondre à tous les besoins des clients.",
   "Tous les équipements subissent des tests fonctionnels par nos ingénieurs biomédicaux expérimentés et qualifiés",
   "Les clients peuvent compter sur nos produits pour des performances et une fonctionnalité de haute qualité."
 ]'),
((SELECT id FROM collapsible_sections WHERE title = 'SHIPPING'), 'fr',
 'EXPÉDITION',
 '[
   "Nous expédions par avion, mer, transport routier dans le monde entier",
   "Nous fournissons également l''installation sur site, la démonstration et les devis (Royaume-Uni uniquement).",
   "Notre équipe est qualifiée dans la gestion d''équipements médicaux fragiles pour assurer un transit sûr et sécurisé.",
   "Nous connaissons l''importance de recevoir des articles en bon état, nous conseillons donc le meilleur emballage en fonction de l''emplacement du client et du mode de transport."
 ]'),
-- Spanish
((SELECT id FROM collapsible_sections WHERE title = 'OUR MISSION'), 'es',
 'NUESTRA MISIÓN',
 '[
   "Comprometidos a proporcionar equipos médicos asequibles a escala global mientras comprendemos las diversas asignaciones presupuestarias.",
   "Compartir nuestra experiencia y conocimiento para facilitar el uso de equipos médicos para el cuidado del paciente.",
   "Asegurar que los profesionales médicos posean equipos adecuados y confiables para priorizar la atención al paciente sobre las preocupaciones logísticas.",
   "Empoderar a los médicos para cuidar mejor a sus pacientes."
 ]'),
((SELECT id FROM collapsible_sections WHERE title = 'QUALITY'), 'es',
 'CALIDAD',
 '[
   "Cultivar relaciones a largo plazo con los clientes está en el centro de nuestros valores. WiMed ha establecido una base de clientes leales a lo largo de los años, mostrando confianza en nuestras ofertas.",
   "Desde la primera consulta hasta el envío, priorizamos la atención para abordar todas las necesidades del cliente.",
   "Todo el equipo se somete a pruebas funcionales por parte de nuestros ingenieros biomédicos experimentados y calificados",
   "Los clientes pueden confiar en nuestros productos para un rendimiento y funcionalidad de alta calidad."
 ]'),
((SELECT id FROM collapsible_sections WHERE title = 'SHIPPING'), 'es',
 'ENVÍO',
 '[
   "Enviamos por aire, mar, transporte terrestre en todo el mundo",
   "También proporcionamos instalación en el sitio, demostración y presupuestos (solo Reino Unido).",
   "Nuestro equipo está capacitado en el manejo de equipos médicos frágiles para garantizar un tránsito seguro.",
   "Conocemos la importancia de recibir artículos en buenas condiciones, por lo que aconsejamos el mejor embalaje con respecto a la ubicación del cliente y el modo de transporte."
 ]');

-- Footer Settings Translations
INSERT INTO footer_settings_translations (setting_id, language_code, company_description, copyright_text) VALUES
-- French
(1, 'fr',
 'WiMed est un fournisseur leader d''équipements médicaux, offrant des solutions de qualité aux établissements de santé à travers le Royaume-Uni et au-delà.',
 '© 2024 WiMed. Tous droits réservés.'),
-- Spanish
(1, 'es',
 'WiMed es un proveedor líder de equipos médicos, ofreciendo soluciones de calidad a instalaciones de salud en todo el Reino Unido y más allá.',
 '© 2024 WiMed. Todos los derechos reservados.');

-- Footer Links Translations
INSERT INTO footer_links_translations (link_id, language_code, title)
SELECT fl.id, 'fr',
  CASE fl.label
    WHEN 'Refund policy' THEN 'Politique de remboursement'
    WHEN 'Privacy policy' THEN 'Politique de confidentialité'
    WHEN 'Terms of service' THEN 'Conditions d''utilisation'
    WHEN 'Shipping policy' THEN 'Politique d''expédition'
    WHEN 'Contact information' THEN 'Informations de contact'
    ELSE fl.label
  END
FROM footer_links fl;

INSERT INTO footer_links_translations (link_id, language_code, title)
SELECT fl.id, 'es',
  CASE fl.label
    WHEN 'Refund policy' THEN 'Política de reembolso'
    WHEN 'Privacy policy' THEN 'Política de privacidad'
    WHEN 'Terms of service' THEN 'Términos de servicio'
    WHEN 'Shipping policy' THEN 'Política de envío'
    WHEN 'Contact information' THEN 'Información de contacto'
    ELSE fl.label
  END
FROM footer_links fl;

-- General UI Translations
INSERT INTO translations (language_code, translation_key, translation_value) VALUES
-- French UI
('fr', 'button.details', 'Détails'),
('fr', 'button.inquire', 'Demander'),
('fr', 'button.add_to_cart', 'Ajouter au Panier'),
('fr', 'button.view_more', 'Voir Plus'),
('fr', 'button.contact_us', 'Contactez-nous'),
('fr', 'button.submit', 'Soumettre'),
('fr', 'button.cancel', 'Annuler'),
('fr', 'button.save', 'Enregistrer'),
('fr', 'button.edit', 'Modifier'),
('fr', 'button.delete', 'Supprimer'),
('fr', 'label.new', 'NOUVEAU'),
('fr', 'label.refurbished', 'Reconditionné'),
('fr', 'label.used', 'Utilisé'),
('fr', 'nav.home', 'Accueil'),
('fr', 'nav.about', 'À Propos'),
('fr', 'nav.services', 'Services'),
('fr', 'nav.contact', 'Contact'),
('fr', 'search.placeholder', 'Rechercher...'),
('fr', 'footer.rights', 'Tous droits réservés'),
('fr', 'footer.privacy', 'Politique de Confidentialité'),
('fr', 'footer.terms', 'Conditions d''Utilisation'),
-- Spanish UI
('es', 'button.details', 'Detalles'),
('es', 'button.inquire', 'Consultar'),
('es', 'button.add_to_cart', 'Añadir al Carrito'),
('es', 'button.view_more', 'Ver Más'),
('es', 'button.contact_us', 'Contáctanos'),
('es', 'button.submit', 'Enviar'),
('es', 'button.cancel', 'Cancelar'),
('es', 'button.save', 'Guardar'),
('es', 'button.edit', 'Editar'),
('es', 'button.delete', 'Eliminar'),
('es', 'label.new', 'NUEVO'),
('es', 'label.refurbished', 'Reacondicionado'),
('es', 'label.used', 'Usado'),
('es', 'nav.home', 'Inicio'),
('es', 'nav.about', 'Acerca de'),
('es', 'nav.services', 'Servicios'),
('es', 'nav.contact', 'Contacto'),
('es', 'search.placeholder', 'Buscar...'),
('es', 'footer.rights', 'Todos los derechos reservados'),
('es', 'footer.privacy', 'Política de Privacidad'),
('es', 'footer.terms', 'Términos de Servicio');

-- Add more section titles for landing page
UPDATE site_settings_translations
SET value_prop_title = 'Pourquoi Choisir WiMed',
    value_prop_subtitle = 'Votre partenaire de confiance pour les équipements médicaux de qualité'
WHERE setting_id = 1 AND language_code = 'fr';

UPDATE site_settings_translations
SET value_prop_title = 'Por Qué Elegir WiMed',
    value_prop_subtitle = 'Su socio de confianza para equipos médicos de calidad'
WHERE setting_id = 1 AND language_code = 'es';

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0006_sample_translations.sql') ON CONFLICT DO NOTHING;


-- ================================================================
-- Migration: 0007_add_missing_translations.sql
-- ================================================================

-- Add missing translations for updated components

-- ValueProposition component (add column to site_settings_translations)
ALTER TABLE site_settings_translations 
ADD COLUMN IF NOT EXISTS value_proposition_text TEXT;

-- Update existing translations
UPDATE site_settings_translations 
SET value_proposition_text = 'Avec une expérience de plus de 25 ans et une gamme diversifiée de produits. Nous sommes un fournisseur de services mondial spécialisé dans les équipements médicaux d''occasion et remis à neuf et les services.'
WHERE language_code = 'fr';

UPDATE site_settings_translations 
SET value_proposition_text = 'Con experiencia de más de 25 años y una amplia gama de productos. Somos un proveedor de servicios global especializado en equipos médicos usados y reacondicionados y servicios.'
WHERE language_code = 'es';

-- Add missing general UI translations
INSERT INTO translations (language_code, translation_key, translation_value) VALUES
-- Header translations
('en', 'contact.phone_whatsapp', 'Phone/Whatsapp'),
('fr', 'contact.phone_whatsapp', 'Téléphone/WhatsApp'),
('es', 'contact.phone_whatsapp', 'Teléfono/WhatsApp'),
('en', 'contact.email_us', 'Email us'),
('fr', 'contact.email_us', 'Envoyez-nous un email'),
('es', 'contact.email_us', 'Envíanos un correo'),

-- Footer translations
('en', 'footer.head_office', 'Head Office'),
('fr', 'footer.head_office', 'Siège Social'),
('es', 'footer.head_office', 'Oficina Central'),
('en', 'footer.about_us', 'About Us'),
('fr', 'footer.about_us', 'À Propos de Nous'),
('es', 'footer.about_us', 'Acerca de Nosotros'),
('en', 'footer.follow_us', 'Follow Us'),
('fr', 'footer.follow_us', 'Suivez-nous'),
('es', 'footer.follow_us', 'Síguenos'),

-- About page translations
('en', 'about.title', 'About WiMed'),
('fr', 'about.title', 'À Propos de WiMed'),
('es', 'about.title', 'Acerca de WiMed'),
('en', 'about.subtitle', 'Leading supplier of medical equipment in the UK, dedicated to improving healthcare delivery through innovative solutions and exceptional service'),
('fr', 'about.subtitle', 'Fournisseur leader d''équipements médicaux au Royaume-Uni, dédié à l''amélioration de la prestation de soins de santé grâce à des solutions innovantes et un service exceptionnel'),
('es', 'about.subtitle', 'Proveedor líder de equipos médicos en el Reino Unido, dedicado a mejorar la prestación de atención médica a través de soluciones innovadoras y un servicio excepcional'),
('en', 'about.story_title', 'Our Story'),
('fr', 'about.story_title', 'Notre Histoire'),
('es', 'about.story_title', 'Nuestra Historia'),
('en', 'about.team_title', 'Our Leadership Team'),
('fr', 'about.team_title', 'Notre Équipe de Direction'),
('es', 'about.team_title', 'Nuestro Equipo de Liderazgo'),
('en', 'about.cta_title', 'Partner with WiMed Today'),
('fr', 'about.cta_title', 'Devenez Partenaire de WiMed Aujourd''hui'),
('es', 'about.cta_title', 'Asóciese con WiMed Hoy'),
('en', 'about.cta_subtitle', 'Your Trusted Medical Equipment Partner'),
('fr', 'about.cta_subtitle', 'Votre Partenaire de Confiance en Équipement Médical'),
('es', 'about.cta_subtitle', 'Su Socio de Confianza en Equipos Médicos'),
('en', 'about.cta_description', 'Discover how our medical equipment solutions can enhance your healthcare facility. Contact us at: info@wimed.fr | +44 740 445 6671'),
('fr', 'about.cta_description', 'Découvrez comment nos solutions d''équipements médicaux peuvent améliorer votre établissement de santé. Contactez-nous : info@wimed.fr | +44 740 445 6671'),
('es', 'about.cta_description', 'Descubra cómo nuestras soluciones de equipos médicos pueden mejorar su instalación de salud. Contáctenos: info@wimed.fr | +44 740 445 6671'),

-- Services page translations
('en', 'services.title', 'Our Services'),
('fr', 'services.title', 'Nos Services'),
('es', 'services.title', 'Nuestros Servicios'),
('en', 'services.subtitle', 'Comprehensive medical equipment services to support healthcare providers with installation, maintenance, training, and technical support'),
('fr', 'services.subtitle', 'Services complets d''équipements médicaux pour soutenir les prestataires de soins de santé avec installation, maintenance, formation et support technique'),
('es', 'services.subtitle', 'Servicios integrales de equipos médicos para apoyar a los proveedores de atención médica con instalación, mantenimiento, capacitación y soporte técnico'),
('en', 'services.why_choose_title', 'Why Choose Our Services?'),
('fr', 'services.why_choose_title', 'Pourquoi Choisir Nos Services?'),
('es', 'services.why_choose_title', '¿Por Qué Elegir Nuestros Servicios?'),
('en', 'services.expertise_title', 'Expertise & Experience'),
('fr', 'services.expertise_title', 'Expertise et Expérience'),
('es', 'services.expertise_title', 'Experiencia y Conocimientos'),
('en', 'services.expertise_description', 'Over 20 years of experience in medical equipment services with certified technicians trained on the latest technologies.'),
('fr', 'services.expertise_description', 'Plus de 20 ans d''expérience dans les services d''équipements médicaux avec des techniciens certifiés formés aux dernières technologies.'),
('es', 'services.expertise_description', 'Más de 20 años de experiencia en servicios de equipos médicos con técnicos certificados capacitados en las últimas tecnologías.'),
('en', 'services.quality_title', 'Quality Assurance'),
('fr', 'services.quality_title', 'Assurance Qualité'),
('es', 'services.quality_title', 'Garantía de Calidad'),
('en', 'services.quality_description', 'ISO certified processes ensuring the highest standards of service quality and equipment performance.'),
('fr', 'services.quality_description', 'Processus certifiés ISO garantissant les normes les plus élevées de qualité de service et de performance des équipements.'),
('es', 'services.quality_description', 'Procesos certificados ISO que garantizan los más altos estándares de calidad de servicio y rendimiento de equipos.'),
('en', 'services.satisfaction_title', 'Customer Satisfaction'),
('fr', 'services.satisfaction_title', 'Satisfaction Client'),
('es', 'services.satisfaction_title', 'Satisfacción del Cliente'),
('en', 'services.satisfaction_description', 'Dedicated to exceeding customer expectations with responsive support and tailored service solutions.'),
('fr', 'services.satisfaction_description', 'Dédiés à dépasser les attentes des clients avec un support réactif et des solutions de service sur mesure.'),
('es', 'services.satisfaction_description', 'Dedicados a superar las expectativas del cliente con soporte receptivo y soluciones de servicio personalizadas.'),

-- Contact page translations
('en', 'contact.address_title', 'Address'),
('fr', 'contact.address_title', 'Adresse'),
('es', 'contact.address_title', 'Dirección'),
('en', 'contact.phone_title', 'Phone'),
('fr', 'contact.phone_title', 'Téléphone'),
('es', 'contact.phone_title', 'Teléfono'),
('en', 'contact.whatsapp_title', 'WhatsApp'),
('fr', 'contact.whatsapp_title', 'WhatsApp'),
('es', 'contact.whatsapp_title', 'WhatsApp'),
('en', 'contact.email_title', 'Email'),
('fr', 'contact.email_title', 'Email'),
('es', 'contact.email_title', 'Correo Electrónico'),
('en', 'contact.hours_title', 'Business Hours'),
('fr', 'contact.hours_title', 'Heures d''Ouverture'),
('es', 'contact.hours_title', 'Horario de Atención'),
('en', 'contact.hours_weekdays', 'Monday - Friday: 9:00 AM - 6:00 PM'),
('fr', 'contact.hours_weekdays', 'Lundi - Vendredi: 9h00 - 18h00'),
('es', 'contact.hours_weekdays', 'Lunes - Viernes: 9:00 AM - 6:00 PM'),
('en', 'contact.hours_saturday', 'Saturday: 10:00 AM - 4:00 PM'),
('fr', 'contact.hours_saturday', 'Samedi: 10h00 - 16h00'),
('es', 'contact.hours_saturday', 'Sábado: 10:00 AM - 4:00 PM'),
('en', 'contact.hours_sunday', 'Sunday: Closed'),
('fr', 'contact.hours_sunday', 'Dimanche: Fermé'),
('es', 'contact.hours_sunday', 'Domingo: Cerrado'),
('en', 'contact.title', 'Contact Us'),
('fr', 'contact.title', 'Contactez-nous'),
('es', 'contact.title', 'Contáctenos'),
('en', 'contact.subtitle', 'Get in touch with our team for inquiries, support, or to discuss your medical equipment needs'),
('fr', 'contact.subtitle', 'Contactez notre équipe pour des demandes de renseignements, du support ou pour discuter de vos besoins en équipements médicaux'),
('es', 'contact.subtitle', 'Póngase en contacto con nuestro equipo para consultas, soporte o para discutir sus necesidades de equipos médicos'),
('en', 'contact.cta_title', 'Get in Touch Today'),
('fr', 'contact.cta_title', 'Contactez-nous Aujourd''hui'),
('es', 'contact.cta_title', 'Contáctenos Hoy'),
('en', 'contact.cta_subtitle', 'Quick Response Guarantee'),
('fr', 'contact.cta_subtitle', 'Garantie de Réponse Rapide'),
('es', 'contact.cta_subtitle', 'Garantía de Respuesta Rápida'),
('en', 'contact.cta_description', 'We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly and we''ll assist you immediately.'),
('fr', 'contact.cta_description', 'Nous nous efforçons de répondre à toutes les demandes dans les 24 heures pendant les jours ouvrables. Pour les questions urgentes, veuillez nous appeler directement et nous vous aiderons immédiatement.'),
('es', 'contact.cta_description', 'Nuestro objetivo es responder a todas las consultas dentro de las 24 horas durante los días hábiles. Para asuntos urgentes, llámenos directamente y lo asistiremos de inmediato.'),
('en', 'contact.success_message', 'Thank you for your message! We''ll get back to you soon.'),
('fr', 'contact.success_message', 'Merci pour votre message! Nous vous répondrons bientôt.'),
('es', 'contact.success_message', 'Gracias por su mensaje! Nos pondremos en contacto con usted pronto.'),

-- Category page translations
('en', 'category.anaesthesia.title', 'Anaesthesia Equipment'),
('fr', 'category.anaesthesia.title', 'Équipement d''Anesthésie'),
('es', 'category.anaesthesia.title', 'Equipos de Anestesia'),
('en', 'category.patient_monitors.title', 'Patient Monitoring Equipment'),
('fr', 'category.patient_monitors.title', 'Équipement de Surveillance des Patients'),
('es', 'category.patient_monitors.title', 'Equipos de Monitoreo de Pacientes'),
('en', 'category.electrosurgical.title', 'Electrosurgical Equipment'),
('fr', 'category.electrosurgical.title', 'Équipement Électrochirurgical'),
('es', 'category.electrosurgical.title', 'Equipos Electroquirúrgicos'),
('en', 'category.endoscopes.title', 'Flexible Endoscopes'),
('fr', 'category.endoscopes.title', 'Endoscopes Flexibles'),
('es', 'category.endoscopes.title', 'Endoscopios Flexibles'),
('en', 'category.endoscopy_laparoscopy.title', 'Endoscopy & Laparoscopy Equipment'),
('fr', 'category.endoscopy_laparoscopy.title', 'Équipement d''Endoscopie et de Laparoscopie'),
('es', 'category.endoscopy_laparoscopy.title', 'Equipos de Endoscopia y Laparoscopia'),
('en', 'category.ventilators.title', 'Ventilators & Respiratory Equipment'),
('fr', 'category.ventilators.title', 'Ventilateurs et Équipements Respiratoires'),
('es', 'category.ventilators.title', 'Ventiladores y Equipos Respiratorios')
ON CONFLICT (language_code, translation_key) DO UPDATE 
SET translation_value = EXCLUDED.translation_value;

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0007_add_missing_translations.sql') ON CONFLICT DO NOTHING;


-- ================================================================
-- Migration: 0008_products_translations.sql
-- ================================================================

-- Create products_translations table
CREATE TABLE IF NOT EXISTS products_translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
    name TEXT,
    brand TEXT,
    price_display TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, language_code)
);

-- Add index for better performance
CREATE INDEX idx_products_translations_product_language ON products_translations(product_id, language_code);

-- Add RLS policies
ALTER TABLE products_translations ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated users to read products translations" ON products_translations
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert products translations" ON products_translations
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update products translations" ON products_translations
    FOR UPDATE
    TO authenticated
    USING (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete products translations" ON products_translations
    FOR DELETE
    TO authenticated
    USING (true);

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0008_products_translations.sql') ON CONFLICT DO NOTHING;


-- ================================================================
-- Migration: 0009_categories_translations.sql
-- ================================================================

-- Create categories_translations table
CREATE TABLE IF NOT EXISTS categories_translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
    name TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, language_code)
);

-- Add index for better performance
CREATE INDEX idx_categories_translations_category_language ON categories_translations(category_id, language_code);

-- Add RLS policies
ALTER TABLE categories_translations ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated users to read categories translations" ON categories_translations
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert categories translations" ON categories_translations
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update categories translations" ON categories_translations
    FOR UPDATE
    TO authenticated
    USING (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete categories translations" ON categories_translations
    FOR DELETE
    TO authenticated
    USING (true);

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0009_categories_translations.sql') ON CONFLICT DO NOTHING;


-- ================================================================
-- Migration: 0010_contact_blocks_translations.sql
-- ================================================================

-- Create contact_blocks_translations table
CREATE TABLE IF NOT EXISTS contact_blocks_translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    block_id UUID NOT NULL REFERENCES contact_blocks(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
    title TEXT,
    content_lines TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(block_id, language_code)
);

-- Add index for better performance
CREATE INDEX idx_contact_blocks_translations_block_language ON contact_blocks_translations(block_id, language_code);

-- Add RLS policies
ALTER TABLE contact_blocks_translations ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated users to read contact blocks translations" ON contact_blocks_translations
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert contact blocks translations" ON contact_blocks_translations
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update contact blocks translations" ON contact_blocks_translations
    FOR UPDATE
    TO authenticated
    USING (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete contact blocks translations" ON contact_blocks_translations
    FOR DELETE
    TO authenticated
    USING (true);

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0010_contact_blocks_translations.sql') ON CONFLICT DO NOTHING;


-- ================================================================
-- Migration: 0011_footer_translations.sql
-- ================================================================

-- Create footer_settings_translations table
CREATE TABLE IF NOT EXISTS footer_settings_translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_id INTEGER NOT NULL REFERENCES footer_settings(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
    office_address_lines TEXT[],
    about_text TEXT,
    copyright_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(setting_id, language_code)
);

-- Create footer_links_translations table
CREATE TABLE IF NOT EXISTS footer_links_translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    link_id UUID NOT NULL REFERENCES footer_links(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
    label TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(link_id, language_code)
);

-- Add indexes for better performance
CREATE INDEX idx_footer_settings_translations_setting_language ON footer_settings_translations(setting_id, language_code);
CREATE INDEX idx_footer_links_translations_link_language ON footer_links_translations(link_id, language_code);

-- Add RLS policies for footer_settings_translations
ALTER TABLE footer_settings_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read footer settings translations" ON footer_settings_translations
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert footer settings translations" ON footer_settings_translations
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update footer settings translations" ON footer_settings_translations
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to delete footer settings translations" ON footer_settings_translations
    FOR DELETE
    TO authenticated
    USING (true);

-- Add RLS policies for footer_links_translations
ALTER TABLE footer_links_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read footer links translations" ON footer_links_translations
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert footer links translations" ON footer_links_translations
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update footer links translations" ON footer_links_translations
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to delete footer links translations" ON footer_links_translations
    FOR DELETE
    TO authenticated
    USING (true);

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0011_footer_translations.sql') ON CONFLICT DO NOTHING;


-- ================================================================
-- Migration: 0012_brands_translations.sql
-- ================================================================

-- Create brands_translations table
CREATE TABLE IF NOT EXISTS brands_translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand_id BIGINT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(brand_id, language_code)
);

-- Add index for better performance
CREATE INDEX idx_brands_translations_brand_language ON brands_translations(brand_id, language_code);

-- Add RLS policies
ALTER TABLE brands_translations ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated users to read brands translations" ON brands_translations
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert brands translations" ON brands_translations
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update brands translations" ON brands_translations
    FOR UPDATE
    TO authenticated
    USING (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete brands translations" ON brands_translations
    FOR DELETE
    TO authenticated
    USING (true);

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0012_brands_translations.sql') ON CONFLICT DO NOTHING;


-- ================================================================
-- Migration: 0013_collapsible_sections_translations.sql
-- ================================================================

-- Add collapsible sections translations for Spanish and French

-- Spanish translations
INSERT INTO collapsible_sections_translations (section_id, language_code, title, content) VALUES
-- OUR MISSION
(1, 'es', 'NUESTRA MISIÓN', '[
  "Comprometidos a proporcionar equipos médicos asequibles a escala global, entendiendo las diversas asignaciones presupuestarias.",
  "Compartir nuestra experiencia y conocimiento para facilitar el uso de equipos médicos para el cuidado del paciente.",
  "Asegurar que los profesionales médicos posean equipos adecuados y confiables para priorizar la atención al paciente sobre las preocupaciones logísticas.",
  "Empoderar a los médicos para cuidar mejor a sus pacientes."
]'),
-- QUALITY
(2, 'es', 'CALIDAD', '[
  "Cultivar relaciones a largo plazo con los clientes está en el centro de nuestros valores. WiMed ha establecido una base de clientes leales a lo largo de los años, mostrando confianza en nuestras ofertas.",
  "Desde la primera consulta hasta el envío, priorizamos la atención para abordar todas las necesidades del cliente.",
  "Todo el equipo se somete a pruebas funcionales por parte de nuestros ingenieros biomédicos experimentados y calificados",
  "Los clientes pueden confiar en nuestros productos para un rendimiento y funcionalidad de alta calidad."
]'),
-- SHIPPING
(3, 'es', 'ENVÍO', '[
  "Enviamos por aire, mar y transporte terrestre a todo el mundo",
  "También proporcionamos instalación en el sitio, demostración y presupuestos (solo Reino Unido).",
  "Nuestro equipo está capacitado en el manejo de equipos médicos frágiles para garantizar un tránsito seguro y protegido.",
  "Sabemos la importancia de recibir artículos en buenas condiciones, por lo que aconsejamos el mejor embalaje con respecto a la ubicación del cliente y el modo de transporte."
]'),

-- French translations
-- OUR MISSION
(1, 'fr', 'NOTRE MISSION', '[
  "Engagés à fournir des équipements médicaux abordables à l''échelle mondiale tout en comprenant les diverses allocations budgétaires.",
  "Partager notre expertise et nos connaissances pour faciliter l''utilisation des équipements médicaux pour les soins aux patients.",
  "Assurer que les professionnels de la santé possèdent des équipements adéquats et fiables pour prioriser les soins aux patients plutôt que les préoccupations logistiques.",
  "Permettre aux médecins de mieux prendre soin de leurs patients."
]'),
-- QUALITY
(2, 'fr', 'QUALITÉ', '[
  "Cultiver des relations à long terme avec les clients est au cœur de nos valeurs. WiMed a établi une base de clients fidèles au fil des ans, témoignant de la confiance dans nos offres.",
  "De la première demande à l''expédition, nous priorisons les soins pour répondre à tous les besoins des clients.",
  "Tous les équipements subissent des tests fonctionnels par nos ingénieurs biomédicaux expérimentés et qualifiés",
  "Les clients peuvent compter sur nos produits pour des performances et une fonctionnalité de haute qualité."
]'),
-- SHIPPING
(3, 'fr', 'EXPÉDITION', '[
  "Nous expédions par avion, mer et transport routier dans le monde entier",
  "Nous fournissons également l''installation sur site, la démonstration et les devis (Royaume-Uni uniquement).",
  "Notre équipe est compétente dans la gestion des équipements médicaux fragiles pour assurer un transit sécurisé et sûr.",
  "Nous connaissons l''importance de recevoir des articles en bon état, nous conseillons donc le meilleur emballage en fonction de l''emplacement du client et du mode de transport."
]')
ON CONFLICT (section_id, language_code) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0013_collapsible_sections_translations.sql') ON CONFLICT DO NOTHING;


-- ================================================================
-- Migration: 0014_services_features_translations.sql
-- ================================================================

-- Add features column to services_translations table to support translating the features array
ALTER TABLE services_translations
ADD COLUMN IF NOT EXISTS features JSONB;

-- Add sample translations for services features
-- Spanish translations
UPDATE services_translations SET features = 
'["Programas de mantenimiento preventivo","Servicios de reparación de emergencia","Técnicos certificados","Repuestos originales","Optimización del rendimiento"]'::jsonb
WHERE service_id = 1 AND language_code = 'es';

UPDATE services_translations SET features = 
'["Entrega el mismo día disponible","Envío internacional","Embalaje seguro","Seguimiento en tiempo real","Coordinación de instalación"]'::jsonb
WHERE service_id = 2 AND language_code = 'es';

UPDATE services_translations SET features = 
'["Instalación profesional","Puesta en marcha de equipos","Programas de formación del personal","Orientación sobre procedimientos operativos","Implementación de protocolos de seguridad"]'::jsonb
WHERE service_id = 3 AND language_code = 'es';

UPDATE services_translations SET features = 
'["Soporte telefónico 24/7","Diagnóstico remoto","Soporte en sitio disponible","Documentación técnica","Soporte de garantía"]'::jsonb
WHERE service_id = 4 AND language_code = 'es';

-- French translations
UPDATE services_translations SET features = 
'["Programmes de maintenance préventive","Services de réparation d''urgence","Techniciens certifiés","Pièces de rechange d''origine","Optimisation des performances"]'::jsonb
WHERE service_id = 1 AND language_code = 'fr';

UPDATE services_translations SET features = 
'["Livraison le jour même disponible","Expédition internationale","Emballage sécurisé","Suivi en temps réel","Coordination de l''installation"]'::jsonb
WHERE service_id = 2 AND language_code = 'fr';

UPDATE services_translations SET features = 
'["Installation professionnelle","Mise en service des équipements","Programmes de formation du personnel","Orientation sur les procédures opérationnelles","Mise en œuvre des protocoles de sécurité"]'::jsonb
WHERE service_id = 3 AND language_code = 'fr';

UPDATE services_translations SET features = 
'["Support téléphonique 24/7","Diagnostic à distance","Support sur site disponible","Documentation technique","Support de garantie"]'::jsonb
WHERE service_id = 4 AND language_code = 'fr';

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0014_services_features_translations.sql') ON CONFLICT DO NOTHING;


-- ================================================================
-- Migration: 0015_all_products_translations.sql
-- ================================================================

-- Add translations for ALL products (not just new ones)
-- This migration ensures every product has translations

-- First, let's insert French translations for all products
INSERT INTO products_translations (product_id, language_code, name, description)
SELECT 
    p.id, 
    'fr',
    CASE 
        -- Anaesthesia products
        WHEN p.name LIKE '%Anaesthesia Machine%' THEN REPLACE(p.name, 'Anaesthesia Machine', 'Machine d''Anesthésie')
        WHEN p.name LIKE '%Anaesthesia%' THEN REPLACE(p.name, 'Anaesthesia', 'Anesthésie')
        WHEN p.name LIKE '%Anesthesia%' THEN REPLACE(p.name, 'Anesthesia', 'Anesthésie')
        
        -- Patient Monitor products
        WHEN p.name LIKE '%Patient Monitor%' THEN REPLACE(p.name, 'Patient Monitor', 'Moniteur Patient')
        WHEN p.name LIKE '%Monitor%' THEN REPLACE(p.name, 'Monitor', 'Moniteur')
        WHEN p.name LIKE '%Vital Signs%' THEN REPLACE(p.name, 'Vital Signs', 'Signes Vitaux')
        
        -- Electrosurgical products
        WHEN p.name LIKE '%Electrosurgical Unit%' THEN REPLACE(p.name, 'Electrosurgical Unit', 'Unité Électrochirurgicale')
        WHEN p.name LIKE '%Electrosurgical%' THEN REPLACE(p.name, 'Electrosurgical', 'Électrochirurgical')
        WHEN p.name LIKE '%Diathermy%' THEN REPLACE(p.name, 'Diathermy', 'Diathermie')
        
        -- Endoscope products
        WHEN p.name LIKE '%Endoscope Camera%' THEN REPLACE(p.name, 'Endoscope Camera', 'Caméra Endoscope')
        WHEN p.name LIKE '%Endoscope%' THEN REPLACE(p.name, 'Endoscope', 'Endoscope')
        WHEN p.name LIKE '%Gastroscope%' THEN REPLACE(p.name, 'Gastroscope', 'Gastroscope')
        WHEN p.name LIKE '%Colonoscope%' THEN REPLACE(p.name, 'Colonoscope', 'Colonoscope')
        WHEN p.name LIKE '%Bronchoscope%' THEN REPLACE(p.name, 'Bronchoscope', 'Bronchoscope')
        WHEN p.name LIKE '%Flexible%' THEN REPLACE(p.name, 'Flexible', 'Flexible')
        
        -- Laparoscopy products
        WHEN p.name LIKE '%Laparoscopy%' THEN REPLACE(p.name, 'Laparoscopy', 'Laparoscopie')
        WHEN p.name LIKE '%Laparoscopic%' THEN REPLACE(p.name, 'Laparoscopic', 'Laparoscopique')
        WHEN p.name LIKE '%Insufflator%' THEN REPLACE(p.name, 'Insufflator', 'Insufflateur')
        
        -- Ventilator products
        WHEN p.name LIKE '%Ventilator%' THEN REPLACE(p.name, 'Ventilator', 'Ventilateur')
        WHEN p.name LIKE '%ICU%' THEN REPLACE(p.name, 'ICU', 'USI')
        WHEN p.name LIKE '%Respiratory%' THEN REPLACE(p.name, 'Respiratory', 'Respiratoire')
        WHEN p.name LIKE '%CPAP%' THEN p.name -- Keep CPAP as is
        WHEN p.name LIKE '%BiPAP%' THEN p.name -- Keep BiPAP as is
        
        -- General medical terms
        WHEN p.name LIKE '%Machine%' THEN REPLACE(p.name, 'Machine', 'Machine')
        WHEN p.name LIKE '%System%' THEN REPLACE(p.name, 'System', 'Système')
        WHEN p.name LIKE '%Unit%' THEN REPLACE(p.name, 'Unit', 'Unité')
        WHEN p.name LIKE '%Device%' THEN REPLACE(p.name, 'Device', 'Dispositif')
        WHEN p.name LIKE '%Equipment%' THEN REPLACE(p.name, 'Equipment', 'Équipement')
        WHEN p.name LIKE '%Portable%' THEN REPLACE(p.name, 'Portable', 'Portable')
        WHEN p.name LIKE '%Mobile%' THEN REPLACE(p.name, 'Mobile', 'Mobile')
        WHEN p.name LIKE '%Digital%' THEN REPLACE(p.name, 'Digital', 'Numérique')
        WHEN p.name LIKE '%HD%' THEN p.name -- Keep HD as is
        WHEN p.name LIKE '%LED%' THEN p.name -- Keep LED as is
        
        ELSE p.name
    END,
    CASE 
        WHEN c.slug = 'anaesthesia' THEN 'Équipement d''anesthésie professionnel'
        WHEN c.slug = 'patient-monitors' THEN 'Système de surveillance des patients'
        WHEN c.slug = 'electrosurgical' THEN 'Équipement électrochirurgical moderne'
        WHEN c.slug = 'endoscopes' THEN 'Endoscope médical de haute qualité'
        WHEN c.slug = 'endoscopy-laparoscopy' THEN 'Équipement d''endoscopie et laparoscopie'
        WHEN c.slug = 'ventilators' THEN 'Équipement de ventilation médicale'
        ELSE 'Équipement médical professionnel'
    END
FROM products p
JOIN categories c ON p.category_id = c.id
ON CONFLICT (product_id, language_code) 
DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = CURRENT_TIMESTAMP;

-- Now insert Spanish translations for all products
INSERT INTO products_translations (product_id, language_code, name, description)
SELECT 
    p.id, 
    'es',
    CASE 
        -- Anaesthesia products
        WHEN p.name LIKE '%Anaesthesia Machine%' THEN REPLACE(p.name, 'Anaesthesia Machine', 'Máquina de Anestesia')
        WHEN p.name LIKE '%Anaesthesia%' THEN REPLACE(p.name, 'Anaesthesia', 'Anestesia')
        WHEN p.name LIKE '%Anesthesia%' THEN REPLACE(p.name, 'Anesthesia', 'Anestesia')
        
        -- Patient Monitor products
        WHEN p.name LIKE '%Patient Monitor%' THEN REPLACE(p.name, 'Patient Monitor', 'Monitor de Pacientes')
        WHEN p.name LIKE '%Monitor%' THEN REPLACE(p.name, 'Monitor', 'Monitor')
        WHEN p.name LIKE '%Vital Signs%' THEN REPLACE(p.name, 'Vital Signs', 'Signos Vitales')
        
        -- Electrosurgical products
        WHEN p.name LIKE '%Electrosurgical Unit%' THEN REPLACE(p.name, 'Electrosurgical Unit', 'Unidad Electroquirúrgica')
        WHEN p.name LIKE '%Electrosurgical%' THEN REPLACE(p.name, 'Electrosurgical', 'Electroquirúrgico')
        WHEN p.name LIKE '%Diathermy%' THEN REPLACE(p.name, 'Diathermy', 'Diatermia')
        
        -- Endoscope products
        WHEN p.name LIKE '%Endoscope Camera%' THEN REPLACE(p.name, 'Endoscope Camera', 'Cámara Endoscópica')
        WHEN p.name LIKE '%Endoscope%' THEN REPLACE(p.name, 'Endoscope', 'Endoscopio')
        WHEN p.name LIKE '%Gastroscope%' THEN REPLACE(p.name, 'Gastroscope', 'Gastroscopio')
        WHEN p.name LIKE '%Colonoscope%' THEN REPLACE(p.name, 'Colonoscope', 'Colonoscopio')
        WHEN p.name LIKE '%Bronchoscope%' THEN REPLACE(p.name, 'Bronchoscope', 'Broncoscopio')
        WHEN p.name LIKE '%Flexible%' THEN REPLACE(p.name, 'Flexible', 'Flexible')
        
        -- Laparoscopy products
        WHEN p.name LIKE '%Laparoscopy%' THEN REPLACE(p.name, 'Laparoscopy', 'Laparoscopia')
        WHEN p.name LIKE '%Laparoscopic%' THEN REPLACE(p.name, 'Laparoscopic', 'Laparoscópico')
        WHEN p.name LIKE '%Insufflator%' THEN REPLACE(p.name, 'Insufflator', 'Insuflador')
        
        -- Ventilator products
        WHEN p.name LIKE '%Ventilator%' THEN REPLACE(p.name, 'Ventilator', 'Ventilador')
        WHEN p.name LIKE '%ICU%' THEN REPLACE(p.name, 'ICU', 'UCI')
        WHEN p.name LIKE '%Respiratory%' THEN REPLACE(p.name, 'Respiratory', 'Respiratorio')
        WHEN p.name LIKE '%CPAP%' THEN p.name -- Keep CPAP as is
        WHEN p.name LIKE '%BiPAP%' THEN p.name -- Keep BiPAP as is
        
        -- General medical terms
        WHEN p.name LIKE '%Machine%' THEN REPLACE(p.name, 'Machine', 'Máquina')
        WHEN p.name LIKE '%System%' THEN REPLACE(p.name, 'System', 'Sistema')
        WHEN p.name LIKE '%Unit%' THEN REPLACE(p.name, 'Unit', 'Unidad')
        WHEN p.name LIKE '%Device%' THEN REPLACE(p.name, 'Device', 'Dispositivo')
        WHEN p.name LIKE '%Equipment%' THEN REPLACE(p.name, 'Equipment', 'Equipo')
        WHEN p.name LIKE '%Portable%' THEN REPLACE(p.name, 'Portable', 'Portátil')
        WHEN p.name LIKE '%Mobile%' THEN REPLACE(p.name, 'Mobile', 'Móvil')
        WHEN p.name LIKE '%Digital%' THEN REPLACE(p.name, 'Digital', 'Digital')
        WHEN p.name LIKE '%HD%' THEN p.name -- Keep HD as is
        WHEN p.name LIKE '%LED%' THEN p.name -- Keep LED as is
        
        ELSE p.name
    END,
    CASE 
        WHEN c.slug = 'anaesthesia' THEN 'Equipo de anestesia profesional'
        WHEN c.slug = 'patient-monitors' THEN 'Sistema de monitoreo de pacientes'
        WHEN c.slug = 'electrosurgical' THEN 'Equipo electroquirúrgico moderno'
        WHEN c.slug = 'endoscopes' THEN 'Endoscopio médico de alta calidad'
        WHEN c.slug = 'endoscopy-laparoscopy' THEN 'Equipo de endoscopia y laparoscopia'
        WHEN c.slug = 'ventilators' THEN 'Equipo de ventilación médica'
        ELSE 'Equipo médico profesional'
    END
FROM products p
JOIN categories c ON p.category_id = c.id
ON CONFLICT (product_id, language_code) 
DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = CURRENT_TIMESTAMP;

-- Add an update trigger to maintain updated_at timestamp
CREATE OR REPLACE FUNCTION update_products_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_translations_updated_at_trigger
    BEFORE UPDATE ON products_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_products_translations_updated_at();

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0015_all_products_translations.sql') ON CONFLICT DO NOTHING;


-- ================================================================
-- Migration: 0016_orders_and_product_details.sql
-- ================================================================

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    phone_number VARCHAR(50),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create product_images table for multiple images per product
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add detailed description columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
ADD COLUMN IF NOT EXISTS specifications JSONB,
ADD COLUMN IF NOT EXISTS features JSONB;

-- Add translations for product details
ALTER TABLE products_translations
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
ADD COLUMN IF NOT EXISTS specifications JSONB,
ADD COLUMN IF NOT EXISTS features JSONB;

-- Create indexes for better performance
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_sort_order ON product_images(sort_order);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('0016_orders_and_product_details.sql') ON CONFLICT DO NOTHING;

