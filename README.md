# Dixie Mills - Premium Sauces & Condiments E-commerce Platform

A modern React-based e-commerce platform for premium sauces, condiments, and food products, featuring a dynamic admin panel and Supabase backend integration.

## Features

- **Product Catalog**: Browse our extensive range of sauces, ketchups, mayonnaise, dressings, and condiments
- **Dynamic Content**: All content managed through Supabase database
- **Admin Dashboard**: Full CRUD operations for all content types
- **Responsive Design**: Mobile-first approach with Material-UI
- **Real-time Updates**: Changes in admin panel reflect immediately on the public site
- **Secure Authentication**: Supabase Auth with Row Level Security
- **Private Label Solutions**: Custom manufacturing and branding services

## Tech Stack

- **Frontend**: React 19, Material-UI 7
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Routing**: React Router v7
- **Styling**: Material-UI with custom theming
- **Deployment**: Static site compatible (Netlify, Vercel, etc.)

## Project Structure

```
dixie-mills/
├── public/              # Static assets
├── src/
│   ├── admin/          # Admin panel components
│   │   ├── pages/      # Admin CRUD pages
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   └── ProtectedRoute.js
│   ├── api/            # API integration
│   │   ├── content.js  # Content fetching functions
│   │   └── supabaseClient.js
│   ├── components/     # Reusable components
│   ├── pages/          # Public pages
│   │   ├── Sauces.js
│   │   ├── Ketchup.js
│   │   ├── Mayonnaise.js
│   │   ├── Dressings.js
│   │   ├── Condiments.js
│   │   └── PrivateLabel.js
│   └── App.js          # Main app component
├── scripts/            # Utility scripts
│   └── admin-create-user.js
├── supabase/           # Database schema
│   └── migrations/
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/dixie-mills.git
   cd dixie-mills
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the migration from `supabase/migrations/0001_init.sql`
   - Copy your project URL and anon key

4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Create an admin user:
   
   **Option 1: Using the CLI tool (requires service role key)**
   ```bash
   # Get your service role key from Supabase dashboard > Settings > API
   SUPABASE_SERVICE_ROLE="your-service-role-key" npm run admin
   ```
   
   **Option 2: Manual creation in Supabase dashboard**
   - Go to Authentication > Users
   - Click "Add user" > "Create new user"
   - Enter email and password
   - After creation, go to Table Editor > profiles
   - Find the user and set `is_admin = true`

6. Start the development server:
   ```bash
   npm start
   ```

## Admin Panel

Access the admin panel at `/admin/login`. Use the credentials created with `npm run admin`.

### Admin Features

- **Landing Settings**: Hero section, featured products, promotional banners
- **Brands**: Manage partner brands and retailers
- **Categories**: Product categories (Sauces, Ketchup, Mayonnaise, etc.)
- **Products**: Full product catalog management with variants and pricing
- **Services**: Private label and custom manufacturing services
- **About**: Company history, certifications, and team
- **Contact**: Contact information and locations
- **Blog**: Recipe ideas and cooking tips
- **Orders**: Customer order management

## Product Categories

- **Sauces**: BBQ, Hot Sauces, Specialty Sauces
- **Ketchup**: Classic, Organic, Flavored Varieties
- **Mayonnaise**: Traditional, Light, Gourmet Aiolis
- **Dressings**: Ranch, Italian, Caesar, Vinaigrettes
- **Condiments**: Mustards, Relishes, Specialty Items
- **Private Label**: Custom formulations and packaging

## Database Schema

The application uses the following main tables:

- `profiles`: User profiles with admin flag
- `site_settings`: Global site configuration
- `brands`: Partner brands and retailers
- `categories`: Product categories
- `products`: Product catalog with variants
- `services`: Service offerings
- `about_sections`: About page content
- `team_members`: Team member profiles
- `contact_blocks`: Contact information
- `blog_posts`: Recipes and tips
- `orders`: Customer orders

All tables include RLS policies for security.

## Development

### Available Scripts

- `npm start`: Run development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm run admin`: Create admin user CLI

### Code Style

- ES6+ JavaScript
- React Hooks
- Material-UI components
- Async/await for API calls

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to your preferred platform:
   - **Netlify**: `netlify deploy --prod --dir=build`
   - **Vercel**: `vercel --prod`
   - **GitHub Pages**: `npm run deploy`

3. Configure environment variables on your hosting platform

4. Add production URL to Supabase Auth settings

## Features

### Product Management
- Multiple product variants (sizes, flavors)
- Inventory tracking
- Bulk pricing options
- Nutritional information
- Allergen warnings

### Customer Features
- Product search and filtering
- Recipe suggestions
- Bulk order inquiries
- Private label requests
- Newsletter subscription

### Business Features
- Order management
- Customer analytics
- Inventory reports
- Sales tracking
- SEO optimization

## Performance Optimization

- Lazy loading for images
- Code splitting by route
- Material-UI tree shaking
- Efficient Supabase queries with proper indexing
- CDN integration for static assets

## Security

- Row Level Security (RLS) on all tables
- Admin operations require authentication
- Environment variables for sensitive data
- HTTPS required for production
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For issues and questions:
- Check the browser console for errors
- Review Supabase logs
- Ensure environment variables are set correctly
- Verify Supabase project is active

## About Dixie Mills

Since 1947, Dixie Mills has been crafting premium sauces and condiments for the food service industry. Our commitment to quality ingredients and authentic flavors has made us a trusted partner for restaurants, retailers, and food manufacturers across the nation.

### Certifications
- FDA Approved Facility
- SQF Certified
- Non-GMO Options Available
- Kosher Certified Products

## Acknowledgments

- Material-UI for the component library
- Supabase for the backend infrastructure
- React team for the framework
- Our loyal customers and partners