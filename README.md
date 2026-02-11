# 🛒 ECommerce Platform - Authentication System

A complete authentication and authorization system built with Next.js 16, TypeScript, Prisma, and JWT tokens. This system provides secure user management with role-based access control for an ecommerce platform.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   Database      │
│                 │    │                 │    │                 │
│ • Auth Pages    │◄──►│ • /auth/login   │◄──►│ • PostgreSQL    │
│ • Dashboards    │    │ • /auth/register│    │ • Supabase      │
│ • Navigation    │    │ • /auth/verify  │    │ • Prisma ORM    │
│ • Middleware    │    │ • /auth/logout  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Features

### 🔐 Authentication
- ✅ JWT-based authentication
- ✅ Secure password hashing (bcrypt)
- ✅ Session management with HTTP cookies
- ✅ Auto token verification
- ✅ Logout functionality
- ✅ Profile image upload and management

### 👥 User Roles
- **👤 Customer**: Browse products, manage orders, view profile, upload profile image
- **🏪 Seller**: Manage products, view sales, seller dashboard
- **👨‍💼 Admin**: Full platform access, user management, analytics

### 🛡️ Authorization
- ✅ Role-based access control (RBAC)
- ✅ Route protection middleware
- ✅ Protected API endpoints
- ✅ Automatic redirects for unauthorized access
- ✅ Secure file upload with RLS policies

### 📱 User Interface
- ✅ Responsive design with Tailwind CSS
- ✅ Form validation with React Hook Form + Zod
- ✅ Loading states and error handling
- ✅ Role-specific navigation
- ✅ Mobile-friendly layouts
- ✅ Drag & drop image upload interface

### 📁 File Management
- ✅ Supabase Storage integration
- ✅ Profile image upload with preview
- ✅ Automatic image optimization
- ✅ Secure file access with RLS
- ✅ File type and size validation

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16 (App Router) | React framework |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Forms** | React Hook Form + Zod | Form handling & validation |
| **State** | Zustand + TanStack Query | Modern state management |
| **Backend** | Next.js API Routes | Serverless functions |
| **Database** | PostgreSQL (Supabase) | Cloud database |
| **Storage** | Supabase Storage | File storage & CDN |
| **ORM** | Prisma 5.x | Database toolkit |
| **Auth** | JWT + bcryptjs | Token-based auth |
| **Cookies** | js-cookie | Cookie management |

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone & Install
```bash
git clone <your-repo>
cd ecommercetest
npm install
```

### 2. Environment Configuration

Create `.env` and `.env.local` files:

```env
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"

# JWT Secret - Generate with: openssl rand -base64 32
JWT_SECRET="your-super-secret-jwt-key-here"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase - Required for Storage
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

### 3. Supabase Storage Setup

1. **Create Storage Bucket**:
```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true);
```

2. **Setup Storage Policies**:
```sql
-- Allow authenticated users to upload their own profile images
CREATE POLICY "Users can upload their own profile images" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to profile images
CREATE POLICY "Public can view profile images" ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');

-- Allow users to update their own profile images
CREATE POLICY "Users can update their own profile images" ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own profile images
CREATE POLICY "Users can delete their own profile images" ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 5. Start Development Server
```bash
npm run dev
# Visit: http://localhost:3000
```

## 📊 Database Schema

```prisma
enum UserRole {
  CUSTOMER
  SELLER  
  ADMIN
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  mobile        String?
  password      String    // Hashed with bcrypt
  emailVerified Boolean   @default(false)
  image         String?
  role          UserRole  @default(CUSTOMER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

## 🔄 API Endpoints

| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| `POST` | `/api/auth/register` | User registration | `{name, email, password, role?}` | `{user, token}` |
| `POST` | `/api/auth/login` | User login | `{email, password}` | `{user, token}` |
| `GET` | `/api/auth/verify` | Verify JWT token | Headers: `Authorization: Bearer <token>` | `{user, valid}` |
| `POST` | `/api/auth/logout` | Logout user | - | `{message}` |

## 🛣️ Routes & Access Control

### Public Routes (No Authentication Required)
- `/` - Home page
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/products` - Product listing

### Protected Routes (Authentication Required)

| Route | Allowed Roles | Description |
|-------|---------------|-------------|
| `/dashboard/customer` | CUSTOMER, SELLER, ADMIN | Customer dashboard |
| `/dashboard/seller` | SELLER, ADMIN | Seller management |
| `/dashboard/admin` | ADMIN | Admin panel |
| `/profile` | ALL AUTHENTICATED | User profile |
| `/orders` | ALL AUTHENTICATED | Order management |

### Middleware Protection

The system uses Next.js middleware (`middleware.ts`) for:
- ✅ Route protection
- ✅ Role-based access control  
- ✅ Automatic redirects
- ✅ Token validation

## 🧩 Component Structure

```
app/
├── auth/
│   ├── login/page.tsx          # Login form
│   └── register/page.tsx       # Registration form
├── dashboard/
│   ├── admin/page.tsx          # Admin dashboard
│   ├── seller/page.tsx         # Seller dashboard
│   └── customer/page.tsx       # Customer dashboard
├── api/
│   ├── auth/
│   │   ├── login/route.ts      # Login API
│   │   ├── register/route.ts   # Register API
│   │   ├── verify/route.ts     # Verify API
│   │   └── logout/route.ts     # Logout API
│   └── user/
│       └── profile/route.ts    # Profile update API
└── unauthorized/page.tsx       # Access denied page

components/
├── navigation.tsx              # Main navigation
├── auth-guard.tsx              # Route protection component
├── auth-initializer.tsx        # Auth state initialization
├── auth-refresher.tsx          # Token refresh component
├── profile/
│   └── profile-image-upload.tsx # Profile image upload
└── ui/                         # Reusable UI components

lib/
├── auth-store.ts               # Zustand auth state
├── auth-token.ts               # JWT utilities
├── password-utils.ts           # Password hashing
├── use-profile-image-upload.ts # Image upload hook
├── supabase-storage.ts         # Storage utilities
├── query-provider.tsx          # TanStack Query provider
└── prisma.ts                   # Database client

types/
└── auth.ts                     # TypeScript types

middleware.ts                   # Route protection
```

## 🔧 Usage Examples

### Registration
```typescript
// POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "SecurePass123!",
  "role": "CUSTOMER" // Optional, defaults to CUSTOMER
}
```

### Login
```typescript
// POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Using Zustand Auth Store
```tsx
import { useAuthStore } from '../lib/auth-store';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.name}!</p>
        {user?.profileImage && (
          <img 
            src={user.profileImage} 
            alt="Profile" 
            className="w-10 h-10 rounded-full" 
          />
        )}
        {user?.role === 'ADMIN' && <AdminPanel />}
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <LoginForm />;
}
```

### Profile Image Upload
```tsx
import { ProfileImageUpload } from '@/components/profile/profile-image-upload';

function UserProfile() {
  return (
    <div className="space-y-6">
      <h2>Profile Settings</h2>
      
      {/* Profile Image Upload Component */}
      <ProfileImageUpload 
        showTitle={true}
        size="lg"
        className="max-w-md"
      />
      
      {/* Other profile fields */}
      <div>
        {/* Name, email, etc. */}
      </div>
    </div>
  );
}
```

### Role-Based Rendering
```tsx
import { useAuthStore } from '../lib/auth-store';

function Navigation() {
  const { user } = useAuthStore();
  
  const hasRole = (role: string) => user?.role === role;

  return (
    <nav>
      {hasRole('CUSTOMER') && <Link href="/orders">My Orders</Link>}
      {hasRole('SELLER') && <Link href="/dashboard/seller">Seller</Link>}
      {hasRole('ADMIN') && <Link href="/dashboard/admin">Admin</Link>}
    </nav>
  );
}
```

## 🧪 Testing the System

### 1. Registration Flow
1. Visit: http://localhost:3000
2. Click "Get Started"
3. Fill registration form:
   - Name: "Test User"
   - Email: "test@example.com"  
   - Password: "TestPass123!"
   - Role: "Customer"
4. Submit and verify auto-login

### 2. Login Flow  
1. Click "Sign In"
2. Enter credentials
3. Verify role-based redirect

### 3. Role Testing
```bash
# Create different user types for testing
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "AdminPass123!",
    "role": "ADMIN"
  }'
```

### 4. Access Control Testing
- Try accessing `/dashboard/admin` as CUSTOMER (should redirect)
- Try accessing protected routes without login
- Test middleware redirects

## 🔒 Security Features

### Password Security
- ✅ Minimum 8 characters
- ✅ Requires uppercase, lowercase, number, special char
- ✅ bcrypt hashing (12 salt rounds)
- ✅ No plain text storage

### Token Security  
- ✅ JWT with HMAC-SHA256 signature
- ✅ 7-day expiration
- ✅ Secure cookie storage
- ✅ HTTP-only cookies (production)

### Input Validation
- ✅ Zod schema validation
- ✅ Email format validation
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection

### Route Protection
- ✅ Middleware-level protection
- ✅ API endpoint authentication  
- ✅ Role-based authorization
- ✅ Automatic redirects

## 🚀 Deployment

### Environment Variables for Production
```env
# Use strong JWT secret
JWT_SECRET="super-long-random-production-secret"

# Production database URL  
DATABASE_URL="your-production-database-url"

# Production app URL
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Security Checklist for Production
- [ ] Use HTTPS
- [ ] Set secure cookie flags
- [ ] Enable CORS properly
- [ ] Use environment-specific secrets
- [ ] Enable database SSL
- [ ] Set up monitoring

## 🔮 Future Enhancements

### Planned Features
- 📧 Email verification workflow
- 🔄 Password reset functionality
- 📱 SMS/OTP authentication  
- 🌐 OAuth (Google, GitHub)
- 👥 Admin user management UI
- 📊 Authentication analytics
- 🔐 Two-factor authentication
- 🕒 Session management dashboard

### API Extensions
- Rate limiting
- Refresh tokens
- Password policy enforcement
- Account lockout protection
- Login attempt logging

## � Supabase Storage Integration

### Features

- ✅ **Profile Image Upload**: Secure file upload for user profile pictures
- ✅ **File Type Validation**: Support for PNG, JPG, WebP formats
- ✅ **Size Limits**: Maximum 5MB file size with client-side validation
- ✅ **RLS Security**: Row Level Security policies for secure access
- ✅ **Automatic Optimization**: Next.js Image component integration
- ✅ **Preview & Management**: Real-time preview and delete functionality

### Storage Structure

```
supabase-storage/
└── profile-images/           # Public bucket
    └── {userId}/            # User-specific folder
        └── {timestamp}.{ext} # Unique filename
```

### Implementation Details

**Upload Process:**
1. User selects image via drag-drop or file picker
2. Client-side validation (type, size, dimensions)
3. File uploaded to Supabase Storage with user ID prefix
4. Database updated with new image URL
5. Auth store updated with new profile data
6. UI refreshes to show new image

**Security Policies:**
```sql
-- Users can only upload to their own folder
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images' AND 
           auth.uid()::text = (storage.foldername(name))[1]);

-- Public read access for profile images
CREATE POLICY "Public can view profile images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-images');
```

### Usage Examples

**Basic Upload Component:**
```tsx
import { ProfileImageUpload } from '@/components/profile/profile-image-upload';

function ProfilePage() {
  return (
    <div>
      <h1>My Profile</h1>
      <ProfileImageUpload 
        size="lg" 
        showTitle={true}
      />
    </div>
  );
}
```

**Custom Upload Hook:**
```tsx
import { useProfileImageUpload } from '@/lib/use-profile-image-upload';

function CustomUploadComponent() {
  const { uploadState, uploadImage, removeImage } = useProfileImageUpload();
  
  const handleFileSelect = async (file: File) => {
    try {
      await uploadImage(file);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
      {uploadState.isUploading && <p>Uploading...</p>}
      {uploadState.error && <p>Error: {uploadState.error}</p>}
      {/* File input component */}
    </div>
  );
}
```

**Environment Variables Required:**
```env
# Required for Storage
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Bucket Configuration

1. **Create Bucket:**
   ```sql
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('profile-images', 'profile-images', true);
   ```

2. **Enable RLS:**
   ```sql
   ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
   ```

3. **Set Policies:**
   - Upload: Users can upload to their own folder
   - Read: Public access for viewing
   - Update/Delete: Users can manage their own files

## �🐛 Troubleshooting

### Common Issues

**1. Database Connection Errors**
```bash
# Check environment variables
echo $DATABASE_URL

# Test connection
npx prisma db push
```

**2. JWT Secret Missing**
```bash
# Generate new secret
openssl rand -base64 32
```

**3. Module Not Found Errors**  
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. Prisma Client Issues**
```bash
# Regenerate client
npx prisma generate
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/auth-enhancement`
3. Commit changes: `git commit -am 'Add new auth feature'`
4. Push branch: `git push origin feature/auth-enhancement`
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

## 📧 Support

For questions and support:
- 📧 Email: your-email@example.com
- 💬 Discord: Your Discord Server
- 🐛 Issues: GitHub Issues

---

## 📈 System Status

- ✅ **Authentication**: Fully implemented
- ✅ **Authorization**: Role-based access control
- ✅ **Database**: PostgreSQL with Prisma
- ✅ **Frontend**: Responsive UI with Tailwind
- ✅ **Security**: JWT + bcrypt + validation
- ✅ **Testing**: Ready for user testing

**🎉 Your authentication system is production-ready!**
