-- Update Dixie Mills Content - Convert Medical to Sauce Shop
-- Run this in your Supabase SQL Editor

-- 1. Update Site Settings
UPDATE site_settings 
SET 
  hero_title = 'Dixie Mills — Your Home for Sauces, Ketchup, and Mayonnaise!',
  hero_subtitle = 'Delicious flavors. Quality ingredients. Discover our mouth-watering sauces, rich ketchup, and creamy mayonnaise—perfect for every meal.',
  hero_image_url = 'https://images.unsplash.com/photo-1613564834361-9436948817d1?auto=format&fit=crop&w=1920&q=80',
  categories_title = 'Explore Our Products',
  categories_subtitle = 'Discover the perfect sauce for every dish—sauces, ketchup, and mayonnaise crafted with passion.',
  new_arrivals_title = 'New Arrivals',
  new_arrivals_subtitle = 'Fresh flavors just added! Be the first to taste our latest creations.',
  brands_title = 'What Our Customers Say',
  brands_subtitle = 'Real feedback from sauce lovers just like you',
  value_prop_title = 'Why Choose Dixie Mills?',
  value_prop_subtitle = 'Quality you can trust. Flavors you'll love.',
  updated_at = NOW()
WHERE id = 1;

-- 2. Delete all existing categories
DELETE FROM categories_translations;
DELETE FROM products WHERE category_id IN (SELECT id FROM categories);
DELETE FROM categories;

-- 3. Insert new sauce categories
INSERT INTO categories (id, name, slug, description, image_url, color, sort_order, created_at) VALUES
(1, 'Ketchup & Tomato Sauces', 'ketchup', 'Classic and gourmet ketchup varieties', 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=400&q=80', '#D32F2F', 1, NOW()),
(2, 'Mayonnaise & Aioli', 'mayonnaise', 'Creamy mayonnaise and flavored aiolis', 'https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&w=400&q=80', '#FFF9C4', 2, NOW()),
(3, 'BBQ & Hot Sauces', 'sauces', 'Bold BBQ and spicy hot sauces', 'https://images.unsplash.com/photo-1541025317620-f74b8e1e63c9?auto=format&fit=crop&w=400&q=80', '#BF360C', 3, NOW()),
(4, 'Salad Dressings', 'dressings', 'Ranch, Italian, and specialty dressings', 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?auto=format&fit=crop&w=400&q=80', '#689F38', 4, NOW()),
(5, 'Mustards', 'condiments', 'Yellow, Dijon, and specialty mustards', 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?auto=format&fit=crop&w=400&q=80', '#FFC107', 5, NOW()),
(6, 'Private Label', 'private-label', 'Custom solutions for your brand', 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=400&q=80', '#7B1FA2', 6, NOW());

-- 4. Insert sample sauce products
INSERT INTO products (name, description, category_id, brand, image_url, price_display, is_new, sort_order, created_at) VALUES
-- Ketchup products
('Classic Tomato Ketchup', 'Traditional recipe with ripe tomatoes', 1, 'Dixie Mills', 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=600&q=80', '$3.99', false, 1, NOW()),
('Honey Sriracha Ketchup', 'Sweet and spicy fusion', 1, 'Dixie Mills Gourmet', 'https://images.unsplash.com/photo-1613564834361-9436948817d1?auto=format&fit=crop&w=600&q=80', '$4.99', true, 2, NOW()),
-- Mayonnaise products
('Classic Mayonnaise', 'Creamy and rich traditional mayo', 2, 'Dixie Mills', 'https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&w=600&q=80', '$4.49', false, 3, NOW()),
('Truffle Aioli', 'Luxurious truffle-infused aioli', 2, 'Dixie Mills Premium', 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?auto=format&fit=crop&w=600&q=80', '$7.99', true, 4, NOW()),
-- BBQ & Hot Sauces
('Smoky BBQ Sauce', 'Rich hickory smoke flavor', 3, 'Dixie Mills', 'https://images.unsplash.com/photo-1541025317620-f74b8e1e63c9?auto=format&fit=crop&w=600&q=80', '$4.99', false, 5, NOW()),
('Carolina Reaper Hot Sauce', 'Extremely hot with fruity notes', 3, 'Dixie Mills', 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=600&q=80', '$6.99', true, 6, NOW()),
-- Dressings
('Ranch Dressing', 'Classic buttermilk ranch', 4, 'Dixie Mills', 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?auto=format&fit=crop&w=600&q=80', '$3.99', false, 7, NOW()),
('Smoky Chipotle Ranch', 'Ranch with a spicy kick', 4, 'Dixie Mills Gourmet', 'https://images.unsplash.com/photo-1580013759032-c96505e24c1f?auto=format&fit=crop&w=600&q=80', '$5.99', true, 8, NOW());

-- 5. Update brands to food industry partners
DELETE FROM brands;
INSERT INTO brands (name, logo_url, sort_order, created_at) VALUES
('Walmart', 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg', 1, NOW()),
('Kroger', 'https://upload.wikimedia.org/wikipedia/commons/5/54/Kroger_logo_%282019%29.svg', 2, NOW()),
('Whole Foods', 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Whole_Foods_Market_201x_logo.svg', 3, NOW()),
('Subway', 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg', 4, NOW()),
('Target', 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Target_Corporation_logo_%28vector%29.svg', 5, NOW());

-- 6. Update About Sections
DELETE FROM about_sections_translations;
DELETE FROM about_sections;
INSERT INTO about_sections (title, content, sort_order, created_at) VALUES
('Our Story', 'Since 1947, Dixie Mills has been crafting premium sauces and condiments that bring families together. What started as a small family recipe has grown into a beloved brand trusted by millions.', 1, NOW()),
('Our Mission', 'To create exceptional sauces, ketchup, and mayonnaise that enhance every meal, using only the finest ingredients and time-tested recipes that have been passed down through generations.', 2, NOW()),
('Quality Promise', 'We use only non-GMO ingredients, no artificial preservatives, and source our tomatoes from local farms. Every batch is taste-tested to ensure it meets our high standards.', 3, NOW());

-- 7. Update Services
DELETE FROM services_translations;
DELETE FROM services;
INSERT INTO services (title, description, features, icon, sort_order, created_at) VALUES
('Private Label Solutions', 'Create your own brand of sauces with our expertise', '["Custom formulation", "Your brand packaging", "Minimum order flexibility", "Full production support"]', 'LocalShipping', 1, NOW()),
('Bulk Orders', 'Restaurant and foodservice quantities available', '["Volume discounts", "Consistent quality", "Regular delivery schedules", "Custom packaging sizes"]', 'Restaurant', 2, NOW()),
('Recipe Development', 'Work with our chefs to create unique flavors', '["Professional chef consultation", "Flavor profile matching", "Ingredient sourcing", "Market testing"]', 'Science', 3, NOW());

-- 8. Update Footer Settings
UPDATE footer_settings 
SET 
  office_address_lines = '["Dixie Mills Headquarters", "123 Sauce Boulevard", "Atlanta, GA 30301", "United States"]',
  phone = '+1 (555) SAUCE-01',
  email = 'info@dixiemills.com',
  website_url = 'https://dixiemills.com',
  about_text = 'Dixie Mills has been creating premium sauces, ketchup, and mayonnaise since 1947. Our commitment to quality and flavor has made us a household name.',
  copyright_text = '© 2024 Dixie Mills. All rights reserved.',
  facebook_url = 'https://facebook.com/dixiemills',
  instagram_url = 'https://instagram.com/dixiemills',
  youtube_url = 'https://youtube.com/dixiemills',
  updated_at = NOW()
WHERE id = 1;

-- 9. Update Collapsible Sections (Why Choose Us)
DELETE FROM collapsible_sections_translations;
DELETE FROM collapsible_sections;
INSERT INTO collapsible_sections (title, items, sort_order, created_at) VALUES
('Premium Quality Ingredients', '["Non-GMO verified ingredients", "Locally sourced tomatoes", "No artificial preservatives", "Gluten-free options available"]', 1, NOW()),
('75+ Years of Excellence', '["Family-owned since 1947", "Time-tested recipes", "Consistent quality standards", "Trusted by millions"]', 2, NOW()),
('Wide Product Range', '["Classic and gourmet varieties", "Sugar-free options", "Organic selections", "Custom flavors available"]', 3, NOW()),
('Sustainable Practices', '["Eco-friendly packaging", "Local farmer partnerships", "Reduced carbon footprint", "Recyclable containers"]', 4, NOW());

-- 10. Add Navigation Items
DELETE FROM header_nav_items_translations;
DELETE FROM header_nav_items;
INSERT INTO header_nav_items (name, slug, url, sort_order, is_active, created_at) VALUES
('Products', 'products', '/#products', 1, true, NOW()),
('About Us', 'about-us', '/about-us', 2, true, NOW()),
('Private Label', 'private-label', '/private-label', 3, true, NOW()),
('Contact', 'contact-us', '/contact-us', 4, true, NOW());

-- 11. Clear any medical-related translations
DELETE FROM translations WHERE translation_key LIKE '%medical%' OR translation_key LIKE '%patient%' OR translation_key LIKE '%hospital%';

-- Add sauce-related translations
INSERT INTO translations (language_code, translation_key, translation_value, created_at) VALUES
('en', 'nav.products', 'Products', NOW()),
('en', 'nav.sauces', 'Sauces', NOW()),
('en', 'nav.ketchup', 'Ketchup', NOW()),
('en', 'nav.mayonnaise', 'Mayonnaise', NOW()),
('en', 'button.order_now', 'Order Now', NOW()),
('en', 'label.new_flavor', 'New Flavor', NOW()),
('en', 'label.bestseller', 'Bestseller', NOW()),
('en', 'label.limited_edition', 'Limited Edition', NOW());

COMMIT;