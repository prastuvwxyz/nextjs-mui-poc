# Electrum Frontend Monorepo

A comprehensive monorepo containing multiple frontend applications and shared packages for the Electrum platform. Built with modern tools and best practices for scalable enterprise applications.

[![Built with Turborepo](https://img.shields.io/badge/Built%20with-Turborepo-blue?logo=turborepo)](https://turbo.build/repo)
[![Package Manager](https://img.shields.io/badge/Package%20Manager-pnpm-orange?logo=pnpm)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)

## 📁 Project Structure

This monorepo is organized using a workspace-based architecture with clear separation of concerns:

```
electrum-frontend/
├── 📱 apps/                           # Applications
│   ├── asset-management-portal/       # Asset tracking & management system
│   └── rental-fleet-portal/           # Fleet rental management system
├── 📦 packages/                       # Shared packages
│   ├── ui/                            # Reusable UI components
│   ├── shared/                        # Common utilities & types
│   └── auth/                          # Authentication logic
├── 🛠️ tools/                          # Development tools & configs
├── 📚 docs/                           # Documentation
├── 🔧 Configuration Files
│   ├── package.json                   # Root dependencies
│   ├── pnpm-workspace.yaml           # Workspace configuration
│   ├── turbo.json                     # Build pipeline configuration
│   └── .gitignore                     # Version control exclusions
└── 📄 README.md                      # This file
```

### 🏗️ Monorepo Architecture

Our monorepo follows these principles:

- **📱 Applications (`apps/`)**: Standalone deployable applications
- **📦 Shared Packages (`packages/`)**: Reusable code shared across applications
- **🛠️ Tools (`tools/`)**: Development utilities and build tools
- **⚡ Build Optimization**: Turborepo for fast, cached builds
- **📋 Consistent Tooling**: Unified linting, formatting, and type checking

### 📱 Applications

#### Asset Management Portal (`apps/asset-management-portal/`)
- **Purpose**: Comprehensive asset tracking and management system
- **Tech Stack**: Next.js 14, Material-UI, TypeScript
- **Features**: Asset tracking, QR code scanning, inventory management
- **Port**: `8000` (development)
- **URL**: `http://localhost:8000`

#### Rental Fleet Portal (`apps/rental-fleet-portal/`)
- **Purpose**: Fleet rental management system
- **Tech Stack**: Next.js 14, Material-UI, TypeScript
- **Features**: Vehicle management, rental tracking, customer management
- **Port**: `8001` (development)
- **URL**: `http://localhost:8001`

### 📦 Shared Packages

#### UI Package (`packages/ui/`)
- **Purpose**: Reusable UI components and design system
- **Exports**: Components, themes, styles, Material-UI configurations
- **Usage**: `import { Button, Sidebar } from '@electrum/ui'`

#### Shared Package (`packages/shared/`)
- **Purpose**: Common utilities, types, and business logic
- **Exports**: Utils, types, constants, helpers
- **Usage**: `import { formatCurrency } from '@electrum/shared'`

#### Auth Package (`packages/auth/`)
- **Purpose**: Authentication and authorization logic
- **Exports**: Auth providers, hooks, guards, types
- **Usage**: `import { useAuth } from '@electrum/auth'`

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: `>=18.0.0` ([Download](https://nodejs.org/))
- **pnpm**: `>=8.0.0` ([Install Guide](https://pnpm.io/installation))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd electrum-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # For Asset Management Portal
   cd apps/asset-management-portal
   cp .env.example .env.local
   # Edit .env.local with your configuration

   # For Rental Fleet Portal
   cd ../rental-fleet-portal
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

### 🏃‍♂️ Running Locally

#### Development Mode

**Start all applications:**
```bash
pnpm dev
```

**Start specific application:**
```bash
# Asset Management Portal
pnpm --filter asset-management-portal dev

# Rental Fleet Portal
pnpm --filter rental-fleet-portal dev
```

**Start with specific package:**
```bash
# Start app with its dependencies
pnpm --filter asset-management-portal... dev
```

#### Available URLs
- **Asset Management Portal**: http://localhost:8000
- **Rental Fleet Portal**: http://localhost:8001

### 🔧 Development Commands

#### Building
```bash
# Build all apps and packages
pnpm build

# Build specific app
pnpm --filter asset-management-portal build
```

#### Code Quality
```bash
# Lint all packages
pnpm lint

# Type check all packages
pnpm type-check

# Clean all build artifacts
pnpm clean
```

#### Package Management
```bash
# Add dependency to specific app
pnpm --filter asset-management-portal add package-name

# Add dev dependency to root
pnpm add -D package-name -w

# Add shared package to app
pnpm --filter asset-management-portal add @electrum/ui
```

## 🚀 Deployment & CI/CD

### AWS S3 Static Hosting Strategy

Our deployment strategy uses AWS S3 for static hosting with CloudFront CDN for optimal performance:

#### Architecture Overview
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Developer     │───▶│   GitHub Actions │───▶│   AWS S3 Bucket │
│   Push to Main  │    │   CI/CD Pipeline │    │   Static Hosting│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Build & Test   │    │  CloudFront CDN │
                       │   Quality Gates  │    │  Global Delivery│
                       └──────────────────┘    └─────────────────┘
```

### CI/CD Pipeline Configuration

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS S3

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  PNPM_VERSION: '8'

jobs:
  # Quality Gates
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm type-check

      - name: Lint
        run: pnpm lint

      - name: Run tests
        run: pnpm test

  # Build and Deploy
  deploy:
    needs: quality-check
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/staging'

    strategy:
      matrix:
        app: [asset-management-portal, rental-fleet-portal]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build application
        run: pnpm --filter ${{ matrix.app }} build
        env:
          NODE_ENV: production

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Deploy to S3
        run: |
          aws s3 sync apps/${{ matrix.app }}/out/ s3://${{ secrets.S3_BUCKET_NAME }}/${{ matrix.app }}/ --delete --cache-control max-age=31536000

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/${{ matrix.app }}/*"
```

### Required AWS Resources

#### 1. S3 Buckets
```bash
# Production bucket
aws s3 mb s3://electrum-frontend-prod --region ap-southeast-1

# Staging bucket
aws s3 mb s3://electrum-frontend-staging --region ap-southeast-1
```

#### 2. S3 Bucket Configuration
```bash
# Enable static website hosting
aws s3 website s3://electrum-frontend-prod --index-document index.html --error-document 404.html

# Set bucket policy for public read access
aws s3api put-bucket-policy --bucket electrum-frontend-prod --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::electrum-frontend-prod/*"
    }
  ]
}'
```

#### 3. CloudFront Distribution
```bash
# Create CloudFront distribution for global CDN
aws cloudfront create-distribution --distribution-config '{
  "CallerReference": "electrum-frontend-'$(date +%s)'",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-electrum-frontend-prod",
        "DomainName": "electrum-frontend-prod.s3-website-ap-southeast-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-electrum-frontend-prod",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    }
  },
  "Enabled": true
}'
```

### Required GitHub Secrets

Add these secrets to your GitHub repository:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM Access Key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Secret Key | `wJalrXUtn...` |
| `AWS_REGION` | AWS Region | `ap-southeast-1` |
| `S3_BUCKET_NAME` | S3 Bucket Name | `electrum-frontend-prod` |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront Distribution ID | `E1PA6795UKMFR9` |

### Deployment Strategy

#### Environment Strategy
- **`main` branch** → Production environment (`electrum-frontend-prod`)
- **`staging` branch** → Staging environment (`electrum-frontend-staging`)
- **Feature branches** → Preview deployments (optional)

#### Application Routing
- **Asset Management Portal**: `https://your-domain.com/asset-management-portal/`
- **Rental Fleet Portal**: `https://your-domain.com/rental-fleet-portal/`

### Custom Domain Setup (Optional)

1. **Register domain in Route 53**
2. **Create SSL certificate in ACM**
3. **Configure CloudFront with custom domain**
4. **Update DNS records**

```bash
# Example CloudFront custom domain configuration
aws cloudfront update-distribution --id E1PA6795UKMFR9 --distribution-config '{
  "Aliases": {
    "Quantity": 1,
    "Items": ["electrum.yourcompany.com"]
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012",
    "SSLSupportMethod": "sni-only"
  }
}'
```

## 🛠️ Development Workflow

### Branch Strategy
```
main (production)
├── staging (pre-production)
├── develop (integration)
└── feature/* (feature branches)
```

### Commit Convention
```
feat: add new asset tracking feature
fix: resolve mobile responsive issue
docs: update deployment guide
style: fix linting issues
refactor: optimize component structure
test: add unit tests for auth package
chore: update dependencies
```

### Pull Request Process
1. Create feature branch from `develop`
2. Implement changes with tests
3. Run quality checks locally: `pnpm lint && pnpm type-check`
4. Create PR to `develop`
5. Code review and approval
6. Merge to `develop` → auto-deploy to staging
7. Merge `develop` to `main` → auto-deploy to production

## 📚 Additional Resources

- **[Turborepo Documentation](https://turbo.build/repo/docs)**
- **[pnpm Workspaces](https://pnpm.io/workspaces)**
- **[Next.js Documentation](https://nextjs.org/docs)**
- **[Material-UI Documentation](https://mui.com/)**
- **[AWS S3 Static Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)**

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by the Electrum Team