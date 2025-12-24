-- Update Categories from Medical Equipment to Sauces/Food Categories
-- Run this in your Supabase SQL Editor

-- First, let's check existing categories
SELECT id, name, slug FROM categories ORDER BY sort_order;

-- Update existing categories
UPDATE categories SET 
    name = 'Sauces',
    slug = 'sauces',
    description = 'Premium quality sauces for all occasions',
    image_url = 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=400&q=80'
WHERE slug = 'anaesthesia';

UPDATE categories SET 
    name = 'Ketchup',
    slug = 'ketchup',
    description = 'Delicious tomato ketchup varieties',
    image_url = 'https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?auto=format&fit=crop&w=400&q=80'
WHERE slug = 'patient-monitors';

UPDATE categories SET 
    name = 'Far East Sauce',
    slug = 'far-east-sauce',
    description = 'Authentic Asian sauces and condiments',
    image_url = 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80'
WHERE slug = 'electrosurgical';

UPDATE categories SET 
    name = 'Toppings',
    slug = 'toppings',
    description = 'Delicious toppings for your meals',
    image_url = 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=400&q=80'
WHERE slug = 'endoscopy-laparoscopy';

UPDATE categories SET 
    name = 'Dixie Kids',
    slug = 'dixie-kids',
    description = 'Kid-friendly sauces and condiments',
    image_url = 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?auto=format&fit=crop&w=400&q=80'
WHERE slug = 'endoscopes';

UPDATE categories SET 
    name = 'Dressings',
    slug = 'dressings',
    description = 'Fresh salad dressings and vinaigrettes',
    image_url = 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?auto=format&fit=crop&w=400&q=80'
WHERE slug = 'ventilators';

-- If you need to add "Professional Sauce" as a new category, uncomment below:
/*
INSERT INTO categories (name, slug, image_url, description, sort_order)
VALUES (
    'Professional Sauce',
    'professional-sauce',
    'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?auto=format&fit=crop&w=400&q=80',
    'Professional grade sauces for restaurants and catering',
    7
);
*/

-- Update header navigation items to match new categories
UPDATE header_nav_items SET name = 'Sauces', route = '/sauces' WHERE route = '/anaesthesia';
UPDATE header_nav_items SET name = 'Ketchup', route = '/ketchup' WHERE route = '/patient-monitors';
UPDATE header_nav_items SET name = 'Far East Sauce', route = '/far-east-sauce' WHERE route = '/electrosurgical';
UPDATE header_nav_items SET name = 'Toppings', route = '/toppings' WHERE route = '/endoscopy-laparoscopy';
UPDATE header_nav_items SET name = 'Dixie Kids', route = '/dixie-kids' WHERE route = '/endoscopes';
UPDATE header_nav_items SET name = 'Dressings', route = '/dressings' WHERE route = '/ventilators';

-- Update translations for the new categories (English is default)
-- French translations
UPDATE categories_translations SET 
    name = 'Sauces',
    description = 'Sauces de qualité supérieure pour toutes les occasions'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'sauces') AND language_code = 'fr';

UPDATE categories_translations SET 
    name = 'Ketchup',
    description = 'Délicieuses variétés de ketchup aux tomates'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'ketchup') AND language_code = 'fr';

UPDATE categories_translations SET 
    name = 'Sauce Extrême-Orient',
    description = 'Sauces et condiments asiatiques authentiques'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'far-east-sauce') AND language_code = 'fr';

UPDATE categories_translations SET 
    name = 'Garnitures',
    description = 'Délicieuses garnitures pour vos repas'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'toppings') AND language_code = 'fr';

UPDATE categories_translations SET 
    name = 'Dixie Enfants',
    description = 'Sauces et condiments adaptés aux enfants'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'dixie-kids') AND language_code = 'fr';

UPDATE categories_translations SET 
    name = 'Vinaigrettes',
    description = 'Vinaigrettes fraîches pour salades'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'dressings') AND language_code = 'fr';

-- Spanish translations
UPDATE categories_translations SET 
    name = 'Salsas',
    description = 'Salsas de calidad premium para todas las ocasiones'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'sauces') AND language_code = 'es';

UPDATE categories_translations SET 
    name = 'Ketchup',
    description = 'Deliciosas variedades de ketchup de tomate'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'ketchup') AND language_code = 'es';

UPDATE categories_translations SET 
    name = 'Salsa del Lejano Oriente',
    description = 'Salsas y condimentos asiáticos auténticos'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'far-east-sauce') AND language_code = 'es';

UPDATE categories_translations SET 
    name = 'Coberturas',
    description = 'Deliciosas coberturas para tus comidas'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'toppings') AND language_code = 'es';

UPDATE categories_translations SET 
    name = 'Dixie Niños',
    description = 'Salsas y condimentos aptos para niños'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'dixie-kids') AND language_code = 'es';

UPDATE categories_translations SET 
    name = 'Aderezos',
    description = 'Aderezos frescos para ensaladas'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'dressings') AND language_code = 'es';

-- Update header navigation translations
UPDATE header_nav_items_translations SET name = 'Sauces' 
WHERE nav_item_id = (SELECT id FROM header_nav_items WHERE route = '/sauces') AND language_code = 'fr';

UPDATE header_nav_items_translations SET name = 'Ketchup' 
WHERE nav_item_id = (SELECT id FROM header_nav_items WHERE route = '/ketchup') AND language_code = 'fr';

UPDATE header_nav_items_translations SET name = 'Sauce Extrême-Orient' 
WHERE nav_item_id = (SELECT id FROM header_nav_items WHERE route = '/far-east-sauce') AND language_code = 'fr';

UPDATE header_nav_items_translations SET name = 'Garnitures' 
WHERE nav_item_id = (SELECT id FROM header_nav_items WHERE route = '/toppings') AND language_code = 'fr';

UPDATE header_nav_items_translations SET name = 'Dixie Enfants' 
WHERE nav_item_id = (SELECT id FROM header_nav_items WHERE route = '/dixie-kids') AND language_code = 'fr';

UPDATE header_nav_items_translations SET name = 'Vinaigrettes' 
WHERE nav_item_id = (SELECT id FROM header_nav_items WHERE route = '/dressings') AND language_code = 'fr';

-- Spanish header translations
UPDATE header_nav_items_translations SET name = 'Salsas' 
WHERE nav_item_id = (SELECT id FROM header_nav_items WHERE route = '/sauces') AND language_code = 'es';

UPDATE header_nav_items_translations SET name = 'Ketchup' 
WHERE nav_item_id = (SELECT id FROM header_nav_items WHERE route = '/ketchup') AND language_code = 'es';

UPDATE header_nav_items_translations SET name = 'Salsa del Lejano Oriente' 
WHERE nav_item_id = (SELECT id FROM header_nav_items WHERE route = '/far-east-sauce') AND language_code = 'es';

UPDATE header_nav_items_translations SET name = 'Coberturas' 
WHERE nav_item_id = (SELECT id FROM header_nav_items WHERE route = '/toppings') AND language_code = 'es';

UPDATE header_nav_items_translations SET name = 'Dixie Niños' 
WHERE nav_item_id = (SELECT id FROM header_nav_items WHERE route = '/dixie-kids') AND language_code = 'es';

UPDATE header_nav_items_translations SET name = 'Aderezos' 
WHERE nav_item_id = (SELECT id FROM header_nav_items WHERE route = '/dressings') AND language_code = 'es';

-- Verify the updates
SELECT 
    c.id,
    c.name,
    c.slug,
    c.description,
    c.sort_order
FROM categories c
ORDER BY c.sort_order;

-- Check navigation items
SELECT 
    h.id,
    h.name,
    h.route,
    h.sort_order
FROM header_nav_items h
WHERE h.route LIKE '/%'
ORDER BY h.sort_order;