# Middleware Documentation

## Middleware yang Sudah Ditambahkan untuk REST API

### 1. Security Middleware

#### Helmet
- **Fungsi**: Mengatur security headers HTTP
- **Contoh**: Content-Security-Policy, X-Frame-Options, dll
- **Konfigurasi**: Otomatis dengan default settings

#### Security Headers (Custom)
- **Fungsi**: Menambahkan security headers tambahan
- **Headers**: CSP, X-Content-Type-Options, X-XSS-Protection, dll
- **File**: `src/middleware/security.ts`

### 2. CORS (Cross-Origin Resource Sharing)
- **Fungsi**: Mengatur akses dari domain lain
- **Konfigurasi**: Mendukung multiple origins dari environment variable
- **Environment**: `ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001`

### 3. Rate Limiting
- **Fungsi**: Membatasi jumlah request per IP
- **Default**: 100 requests per 15 menit
- **CRUD Limiter**: 10 write operations per menit
- **File**: `src/middleware/rateLimiting.ts`

### 4. Logging Middleware

#### Morgan
- **Fungsi**: HTTP request logging
- **Format**: Combined (Apache combined log format)

#### Custom Request Logger dengan Chalk
- **Fungsi**: Colorful logging dengan timing
- **Features**:
  - Color coding berdasarkan HTTP method (GET=blue, POST=green, PUT=yellow, DELETE=red)
  - Color coding berdasarkan status code (2xx=green, 3xx=cyan, 4xx=yellow, 5xx=red)
  - Format: `[timestamp] METHOD path STATUS duration IP`
- **File**: `src/middleware/response.ts`

#### Logger Utility
- **Library**: Chalk untuk colorful console output
- **Features**:
  - Multiple log levels: info, success, warn, error, debug
  - Specialized loggers: server, database, middleware
  - Timestamp pada setiap log
  - Color coding untuk visibility
- **File**: `src/utils/logger.ts`

### 5. Compression
- **Fungsi**: GZIP compression untuk response
- **Manfaat**: Mengurangi ukuran response, mempercepat transfer

### 6. Validation Middleware
- **Library**: express-validator
- **Fungsi**: Validasi input request
- **Contoh**: validateId, validatePagination, validateManga
- **File**: `src/middleware/validation.ts`

### 7. Response Formatting
- **Fungsi**: Standarisasi format response API
- **Format**:
  ```json
  {
    "success": true,
    "data": {...},
    "message": "...",
    "timestamp": "2025-07-15T...",
    "pagination": {...}
  }
  ```
- **File**: `src/middleware/response.ts`

### 8. Error Handling
- **Fungsi**: Centralized error handling
- **Features**: 
  - Error categorization
  - Development vs Production responses
  - Structured error format
- **File**: `src/middleware/response.ts`

### 9. Request Timeout
- **Fungsi**: Timeout untuk request yang terlalu lama
- **Default**: 30 detik
- **File**: `src/middleware/rateLimiting.ts`

### 10. API Versioning
- **Fungsi**: Mendukung versioning API
- **Header**: `API-Version: v1`
- **File**: `src/middleware/security.ts`

## Cara Penggunaan

### Di Routes
```typescript
import { validateId, crudLimiter, validateManga } from '../middleware';

router.get('/:id', validateId, getMangaById);
router.post('/', crudLimiter, validateManga, createManga);
```

### Environment Variables
Buat file `.env` berdasarkan `.env.example`:
```bash
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Testing Endpoints

### GET /
- Response: Welcome message dengan info API

### GET /api/v1/mangas
- Query params: `?page=1&limit=10`
- Response: Paginated manga list

### GET /api/v1/mangas/:id
- Params: `id` (number)
- Response: Single manga object

### POST /api/v1/mangas
- Body: `{ "title": "...", "author": "...", "status": "..." }`
- Response: Created manga object

### PUT /api/v1/mangas/:id
- Params: `id` (number)
- Body: Manga data to update
- Response: Updated manga object

### DELETE /api/v1/mangas/:id
- Params: `id` (number)
- Response: 204 No Content

## Logger Usage Examples

### Dalam Controller
```typescript
import { Logger } from '../utils/logger';

export const createManga = async (req, res, next) => {
  try {
    Logger.info(`Creating new manga: ${title} by ${author}`);
    // ... logic
    Logger.success(`Manga created successfully: ${title} (ID: ${newManga.id})`);
  } catch (error) {
    Logger.error(`Failed to create manga: ${error}`);
    next(error);
  }
};
```

### Dalam Middleware
```typescript
Logger.middleware("CORS", "Cross-origin resource sharing configured");
Logger.middleware("RATE-LIMIT", "Rate limiting configured (100 req/15min)");
```

### Server Startup
```typescript
Logger.server(`Komik Crawler API started successfully`, port);
Logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
```

### Request Logging Output
```
[12:40:31 AM] GET   /                         200  5ms     ::1
[12:40:52 AM] POST  /api/v1/mangas           201  12ms    ::1
[12:42:24 AM] GET   /nonexistent             404  1ms     ::1
```

## Packages yang Diinstall

```bash
# Core middleware packages
npm install cors helmet morgan compression express-rate-limit express-validator

# TypeScript types
npm install --save-dev @types/cors @types/morgan @types/compression

# Logging utility
npm install chalk
npm install --save-dev @types/chalk
```

## Next Steps

1. **Authentication**: Tambahkan JWT middleware untuk protected routes
2. **Caching**: Implementasi Redis untuk caching
3. **Database**: Integrasi dengan Prisma ORM
4. **Monitoring**: Tambahkan health check endpoints
5. **Documentation**: Setup Swagger/OpenAPI documentation
