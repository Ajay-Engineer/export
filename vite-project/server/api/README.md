# Product Management API

Express.js REST API for managing products and categories with PostgreSQL database.

## Features

- **Products API**: Full CRUD operations for products
- **Categories API**: Predefined categories with product filtering
- **Database**: PostgreSQL with JSON fields support
- **CORS**: Configured for frontend integration
- **Error Handling**: Comprehensive error responses
- **Validation**: Input validation and sanitization

## API Endpoints

### Products

- `GET /api/products` - List all products (with optional category filter)
- `GET /api/products/:id` - Get single product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product by ID
- `DELETE /api/products/:id` - Delete product by ID

### Categories

- `GET /api/categories` - List all available categories
- `GET /api/categories/:id/products` - Get products by category

### Health Check

- `GET /api/health` - Server health status

## Setup

1. **Install dependencies:**
   ```bash
   cd api
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database setup:**
   - Ensure your PostgreSQL database is running
   - Apply the migrations from the `supabase/migrations` folder
   - Update `DATABASE_URL` in `.env`

4. **Start the server:**
   ```bash
   # Development (with auto-reload)
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |

## Database Schema

The API works with the existing database schema:

- **products**: Main products table with JSONB fields
- **companies**: Company information
- **certificates**: Company certificates

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Product Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Product title (required) |
| `slug` | string | URL-friendly identifier |
| `category` | string | Product category |
| `short_description` | string | Brief description |
| `description` | string | Full description |
| `video_url` | string | Product video URL |
| `datasheet_url` | string | Datasheet PDF URL |
| `images` | array | Array of image URLs |
| `specifications` | object | Technical specifications |
| `benefits` | array | Product benefits |
| `packaging` | array | Packaging information |
| `certifications` | array | Product certifications |
| `faqs` | array | Frequently asked questions |
| `related` | array | Related products |

## Categories

Predefined categories with constraint validation:
- `herbal` - Herbal Extract Products
- `palm-jaggery` - Palm Jaggery Products  
- `coir` - Coir Products
- `tea` - Tea Varieties
- `health-mix` - Health Mix
- `handicraft` - Handicrafts
- `egg` - Egg Products

## Error Handling

The API includes comprehensive error handling for:
- Database connection errors
- Validation errors
- Duplicate entries (23505)
- Foreign key violations (23503)
- Check constraint violations (23514)
- 404 Not Found
- 500 Internal Server Error

## CORS Configuration

CORS is configured to allow requests from your frontend application. Update `FRONTEND_URL` in your environment variables to match your frontend URL.