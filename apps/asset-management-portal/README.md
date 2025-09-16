# Asset Management Portal

Portal manajemen aset yang dibangun dengan Next.js 14 untuk mengelola fleet kendaraan, stock opname, dan aset lainnya.

## 🚀 Features

- **Fleet Management**: Kelola data kendaraan bermotor dengan sistem CRUD lengkap
- **Stock Opname**: Sistem inventarisasi aset dengan progress tracking
- **Responsive Design**: Optimized untuk desktop dan mobile dengan card-based layout
- **Authentication**: Sistem login terintegrasi dengan Google OAuth
- **Real-time Updates**: Data management dengan live updates
- **Modern UI/UX**: Menggunakan Material-UI dengan consistent design system

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **Data Grid**: MUI X Data Grid
- **Styling**: Emotion (CSS-in-JS)
- **Package Manager**: pnpm
- **Monorepo**: Part of Electrum monorepo architecture

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── fleet-motorcycles/  # Fleet management pages
│   ├── stock-opname/       # Inventory management pages
│   ├── sign-in/           # Authentication pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   └── icons/            # Custom icon components
├── config/               # Configuration files
│   └── menuItems.ts      # Navigation menu configuration
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── constants/        # Application constants
│   ├── utils/           # Helper functions
│   └── validations/     # Zod validation schemas
├── store/               # Zustand store configurations
└── types/               # TypeScript type definitions
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Access to Electrum monorepo

### Installation

1. **Clone the monorepo** (if not already done):
```bash
git clone <electrum-monorepo-url>
cd electrum-frontend
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Start development server**:
```bash
# From monorepo root
pnpm --filter asset-management-portal dev

# Or from app directory
cd apps/asset-management-portal
pnpm dev
```

4. **Open browser**:
```
http://localhost:8000
```

### Environment Variables

Create `.env.local` file:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:8000

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:8000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 📱 Features Overview

### Fleet Motorcycles
- **Desktop**: Advanced DataGrid dengan filtering, sorting, dan pagination
- **Mobile**: Card-based layout dengan responsive design
- **CRUD Operations**: Create, Read, Update, Delete kendaraan
- **Status Management**: Track status kendaraan (Available, Rented, Maintenance, etc.)

### Stock Opname
- **Progress Tracking**: Real-time progress bars untuk inventarisasi
- **Asset Categories**: Support multiple asset types (Motorcycle, Battery, Spare Parts, BSS)
- **Scanner Integration**: QR/Barcode scanning untuk asset verification
- **Location-based**: Multi-warehouse support

### Authentication
- **Google OAuth**: Single sign-on dengan Google
- **Session Management**: Secure session handling
- **Role-based Access**: User permission system

## 🎨 Design System

### Card Shadows
Consistent shadow system across all components:
- **Base**: `'0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)'`
- **Elevated**: `'0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)'`
- **Hover**: `'0 8px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.05)'`

### Responsive Breakpoints
- **xs**: 0px+ (Mobile)
- **sm**: 600px+ (Small tablets)
- **md**: 900px+ (Tablets/Small desktops)
- **lg**: 1200px+ (Desktops)
- **xl**: 1536px+ (Large desktops)

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 🔧 Development Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript checks
pnpm clean            # Clean build artifacts
```

## 📦 Build & Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Docker Deployment
```bash
# Build image
docker build -t asset-management-portal .

# Run container
docker run -p 8000:8000 asset-management-portal
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open Pull Request**

### Code Style
- Follow ESLint and Prettier configurations
- Use TypeScript strict mode
- Write meaningful commit messages
- Add tests for new features

## 📝 API Integration

### Endpoints
```typescript
// Fleet Motorcycles
GET    /api/motorcycles       # Get all motorcycles
POST   /api/motorcycles       # Create motorcycle
PUT    /api/motorcycles/:id   # Update motorcycle
DELETE /api/motorcycles/:id   # Delete motorcycle

// Stock Opname
GET    /api/stock-opname      # Get all stock opname
POST   /api/stock-opname      # Create new opname
GET    /api/stock-opname/:id  # Get opname details
PUT    /api/stock-opname/:id  # Update opname progress
```

### Data Models
```typescript
interface Motorcycle {
  licensePlate: string;
  model: string;
  sku: string;
  productionYear: number;
  color: string;
  location: string;
  ownerName: string;
  stockStatus: MotorcycleStatus;
}

interface StockOpname {
  id: string;
  assetType: string;
  createdAt: string;
  type: string;
  location: string;
  totalAssets: number;
  completedAssets: number;
  status: OpnameStatus;
}
```

## 🔒 Security

- **Input Validation**: Zod schema validation
- **Authentication**: Secure session management
- **API Security**: Request/response validation
- **XSS Protection**: Sanitized user inputs

## 📊 Performance

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: `pnpm analyze` for bundle inspection
- **Caching**: Optimized caching strategies

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
lsof -ti:8000 | xargs kill -9
```

**Dependencies issue:**
```bash
rm -rf node_modules .next
pnpm install
```

**TypeScript errors:**
```bash
pnpm type-check
```

## 📞 Support

- **Documentation**: Check this README
- **Issues**: Create GitHub issue
- **Team Contact**: Contact development team

## 📄 License

Part of Electrum ecosystem - See license terms in monorepo root.

---

**Built with ❤️ by Electrum Team**