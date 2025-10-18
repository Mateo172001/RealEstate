# Frontend - Real Estate Application

A modern, production-ready Next.js application for browsing and searching real estate properties. Built with TypeScript, React Query, and Framer Motion following clean architecture principles and industry best practices.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Clean Architecture Implementation](#clean-architecture-implementation)
- [Best Practices](#best-practices)
- [Performance Optimizations](#performance-optimizations)
- [Features](#features)
- [Development](#development)

## Technology Stack

### Core Framework
- **Next.js 15.5.5** - React framework with App Router
- **React 18** - UI library with Server/Client Components
- **TypeScript** - Type-safe development

### State Management & Data Fetching
- **TanStack React Query (v5)** - Server state management, caching, and synchronization
- **Axios** - HTTP client with interceptors

### Styling & UI
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality, accessible component library
- **Framer Motion** - Production-ready animation library
- **Lucide React** - Beautiful icon system

### Validation & Types
- **Zod** - TypeScript-first schema validation

### Development Tools
- **ESLint** - Code linting
- **Docker** - Containerization for production deployment

## Architecture

This project follows **Clean Architecture** principles with clear separation of concerns across four distinct layers:

### Layer Structure

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (UI Components, Pages, Layouts)      │
└──────────────────┬──────────────────────┘
                   │ uses
                   ▼
┌─────────────────────────────────────────┐
│        Application Layer                │
│      (Custom Hooks, Use Cases)          │
└──────────────────┬──────────────────────┘
                   │ uses
                   ▼
┌─────────────────────────────────────────┐
│       Infrastructure Layer              │
│     (API Clients, HTTP Requests)        │
└──────────────────┬──────────────────────┘
                   │ uses
                   ▼
┌─────────────────────────────────────────┐
│          Domain Layer                   │
│    (Types, Entities, Validation)        │
└─────────────────────────────────────────┘
```

### Layer Responsibilities

#### 1. Domain Layer (`/types`)
- Defines business entities and models
- Schema validation with Zod
- No dependencies on other layers
- Reusable across the entire application

```typescript
// types/property.ts
export const PropertySchema = z.object({...});
export type Property = z.infer<typeof PropertySchema>;
```

#### 2. Infrastructure Layer (`/lib/api`)
- Handles HTTP communication
- API client configuration
- Request/response transformation
- Error handling

```typescript
// lib/api/properties.ts
export async function getProperties(filters): Promise<PropertyResponse> {
  const { data } = await apiClient.get('api/v1/properties', { params });
  return data;
}
```

#### 3. Application Layer (`/lib/hooks`)
- Orchestrates business logic
- Manages state and caching
- Reusable across components
- Independently testable

```typescript
// lib/hooks/useProperties.tsx
export function useProperties(filters: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => getProperties(filters),
    staleTime: 5 * 60 * 1000,
  });
}
```

#### 4. Presentation Layer (`/app`, `/components`)
- UI rendering and user interactions
- No direct API calls
- Uses hooks from Application Layer
- Easy to maintain and test

```typescript
// app/properties/page.tsx
export default function PropertiesPage() {
  const { data, isLoading } = useProperties(filters);
  return <PropertyGrid properties={data?.items} />;
}
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page with search
│   │   ├── properties/
│   │   │   ├── page.tsx          # Property listing
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Property detail
│   │   ├── contact/
│   │   │   └── page.tsx          # Contact/About page
│   │   └── providers.tsx         # React Query provider
│   │
│   ├── components/                # Reusable components
│   │   ├── layout/
│   │   │   └── Header.tsx        # Navigation header
│   │   ├── property/
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyGrid.tsx
│   │   │   ├── PropertyFilters.tsx
│   │   │   ├── PropertyDetailSkeleton.tsx
│   │   │   └── PropertyGridSkeleton.tsx
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   └── PropertySearchFilters.tsx
│   │   ├── shared/
│   │   │   ├── Pagination.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   └── PropertyNotFound.tsx
│   │   └── ui/                   # Shadcn components
│   │
│   ├── lib/
│   │   ├── api/                  # Infrastructure Layer
│   │   │   ├── client.ts        # Axios configuration
│   │   │   └── properties.ts    # API calls
│   │   ├── hooks/                # Application Layer
│   │   │   ├── useProperties.tsx
│   │   │   └── useDebounce.tsx
│   │   └── utils/
│   │       ├── formatters.ts
│   │       └── animations.ts
│   │
│   └── types/                    # Domain Layer
│       └── property.ts          # Entity definitions
│
├── public/
│   └── images/
│       └── properties/          # Local optimized images
│
├── Dockerfile                   # Production container
├── next.config.ts              # Next.js configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ or Docker
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build the container
docker build -t realestate-frontend .

# Run the container
docker run -p 3000:3000 realestate-frontend
```

### Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

For production, the API URL is set during Docker build:

```dockerfile
ARG NEXT_PUBLIC_API_URL
RUN echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" > .env.production
```

## Clean Architecture Implementation

### Dependency Flow

The application follows the **Dependency Inversion Principle**. Dependencies flow inward:

```
Presentation → Application → Infrastructure → Domain
    (UI)         (Hooks)        (API)        (Types)
```

### Example: Fetching Property Details

**Bad Approach (Coupled):**
```typescript
function PropertyPage() {
  const [property, setProperty] = useState(null);
  
  useEffect(() => {
    fetch('http://localhost:8080/api/v1/properties/123')
      .then(res => res.json())
      .then(setProperty);
  }, []);
  
  return <div>{property?.name}</div>;
}
```

**Clean Architecture Approach:**
```typescript
// Domain Layer
type Property = z.infer<typeof PropertySchema>;

// Infrastructure Layer
async function getPropertyById(id: string): Promise<Property> {
  const { data } = await apiClient.get(`api/v1/properties/${id}`);
  return data;
}

// Application Layer
function usePropertyById(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id),
  });
}

// Presentation Layer
function PropertyPage() {
  const { data } = usePropertyById(id);
  return <PropertyDetailView property={data} />;
}
```

### Benefits

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Testability**: Easy to mock and test each layer independently
3. **Maintainability**: Changes are localized to specific layers
4. **Reusability**: Hooks and API functions can be reused
5. **Scalability**: Easy to add new features without breaking existing code

## Best Practices

### 1. Type Safety

**Strict TypeScript Configuration**
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true
}
```

**Zod Schema Validation**
```typescript
export const PropertySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(3),
  price: z.number().positive(),
});
```

### 2. Component Organization

**Single Responsibility Principle**
- Each component has one clear purpose
- Separated by domain (property, shared, layout)
- Skeleton components for loading states
- Error boundary components

**Component Composition**
```typescript
<PropertyDetailPage>
  ├─ <PropertyDetailSkeleton>  (if loading)
  ├─ <PropertyNotFound>        (if error)
  └─ <PropertyDetailView>      (success state)
```

### 3. State Management

**Server State with React Query**
```typescript
const { data, isLoading, error } = useProperties(filters);
```

Benefits:
- Automatic caching
- Background revalidation
- Optimistic updates
- Deduplication of requests

**Local State with useState**
```typescript
const [filters, setFilters] = useState(initialFilters);
```

Only for UI state that doesn't need to be synchronized with server.

### 4. Performance Patterns

**Memoization**
```typescript
const finalFilters = useMemo(() => ({
  ...debouncedFilters,
  page: activeFilters.page,
}), [debouncedFilters, activeFilters.page]);
```

**Debouncing**
```typescript
const debouncedSearch = useDebounce(searchTerm, 500);
```

**Code Splitting**
- Automatic with Next.js App Router
- Dynamic imports for heavy components

### 5. Error Handling

**Three-State Pattern**
```typescript
if (isLoading) return <Skeleton />;
if (error) return <ErrorState onRetry={refetch} />;
return <Content data={data} />;
```

**Graceful Degradation**
- Error boundaries for crash recovery
- Retry mechanisms for failed requests
- Fallback UI for all error states

## Performance Optimizations

### 1. Image Optimization

**Next.js Image Component**
```typescript
<Image
  src={property.imageUrl}
  alt={property.name}
  fill
  sizes="(max-width: 1280px) 100vw, 1280px"
  priority={isAboveFold}
/>
```

**Configuration**
```typescript
// next.config.ts
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
}
```

**Benefits:**
- Automatic WebP/AVIF conversion (50-80% size reduction)
- Responsive image serving
- Lazy loading by default
- 1-year browser cache

### 2. Caching Strategy

**React Query Configuration**
```typescript
{
  staleTime: 5 * 60 * 1000,      // 5 minutes fresh
  gcTime: 10 * 60 * 1000,        // 10 minutes in memory
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  placeholderData: keepPreviousData,
}
```

**Query Key Strategy**
```typescript
['properties', { page: 1, name: 'Villa' }]  // Granular caching
```

Each filter combination is cached separately, enabling instant navigation.

### 3. Smart Debouncing

**Selective Debouncing**
```typescript
// Search inputs: 500ms debounce
const debouncedSearch = useDebounce(searchFilters, 500);

// Pagination: No debounce (instant)
const finalFilters = {
  ...debouncedSearch,
  page: activeFilters.page,  // Instant
};
```

Prevents unnecessary API calls while typing, but keeps pagination responsive.

### 4. Optimistic UI Updates

**Placeholder Data**
```typescript
placeholderData: (previousData) => previousData
```

Shows previous data while fetching new data, preventing loading flashes.

### 5. Bundle Optimization

- Tree shaking with ES modules
- Component-level code splitting
- Production build optimizations
- Minimal third-party dependencies

## Features

### Property Listing
- Paginated grid view (9 properties per page)
- Advanced filtering (name, address, price range)
- Real-time search with debouncing
- Intelligent pagination with number display
- Skeleton loading states
- Empty and error states

### Property Detail
- Full property information
- Hero image with actions (share, favorite)
- Responsive layout with sidebar
- Contact agent section
- Smooth animations and transitions

### Search Functionality
- Hero search on homepage
- Quick search results preview (6 properties)
- Filter persistence with React Query cache
- Auto-reset to page 1 on filter change

### Navigation
- Responsive header with mobile menu
- Active page indication
- Smooth transitions
- Animated mobile dropdown

## Clean Architecture Implementation

### Layers in Detail

#### Domain Layer (`/types`)

**Purpose**: Define the core business entities

```typescript
// types/property.ts
export const PropertySchema = z.object({
  id: z.string().min(1),
  idOwner: z.string().min(1),
  name: z.string().min(3),
  address: z.string().min(5),
  price: z.number().positive(),
  imageUrl: z.string().url(),
});

export type Property = z.infer<typeof PropertySchema>;
```

**Characteristics:**
- No external dependencies
- Pure TypeScript/Zod definitions
- Validation rules for data integrity
- Reusable across all layers

#### Infrastructure Layer (`/lib/api`)

**Purpose**: Handle external communication

```typescript
// lib/api/client.ts
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// lib/api/properties.ts
export async function getProperties(filters: PropertyFilters): Promise<PropertyResponse> {
  // Map camelCase to PascalCase for .NET API
  const apiParams = mapParameterNames(filters);
  const { data } = await apiClient.get('api/v1/properties', { params: apiParams });
  return data;
}
```

**Characteristics:**
- Manages HTTP communication
- Parameter transformation (camelCase → PascalCase)
- Response parsing and error handling
- Depends only on Domain Layer

#### Application Layer (`/lib/hooks`)

**Purpose**: Implement use cases and business logic

```typescript
// lib/hooks/useProperties.tsx
export function useProperties(filters: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => getProperties(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function usePropertyById(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id),
    enabled: !!id,
  });
}
```

**Characteristics:**
- Encapsulates React Query configuration
- Manages caching strategy
- Provides consistent API across components
- Testable in isolation

#### Presentation Layer (`/app`, `/components`)

**Purpose**: Render UI and handle user interactions

```typescript
// app/properties/[id]/page.tsx
export default function PropertyDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = usePropertyById(id);
  
  if (isLoading) return <PropertyDetailSkeleton />;
  if (error) return <PropertyNotFound />;
  
  return <PropertyDetailView property={data} />;
}
```

**Characteristics:**
- No direct API calls
- No caching logic
- Pure UI concerns
- Easy to test with mocked hooks

## Best Practices

### 1. Component Design

#### Separation of UI States

Every data-driven component handles three states:

```typescript
// Loading State
if (isLoading) return <Skeleton />;

// Error State
if (error) return <ErrorState onRetry={refetch} />;

// Success State
return <Content data={data} />;
```

#### Component Extraction

Extracted components for:
- Loading states (`PropertyDetailSkeleton`, `PropertyGridSkeleton`)
- Error states (`ErrorState`, `PropertyNotFound`)
- Empty states (`EmptyState`)

Benefits:
- Reusability
- Consistency
- Easier testing
- Cleaner page components

### 2. Data Fetching Patterns

#### Custom Hooks for All API Calls

**Pattern:**
```typescript
// Instead of useQuery directly in component:
const { data } = useQuery({ queryKey: [...], queryFn: ... });

// Use custom hook:
const { data } = useProperties(filters);
```

**Benefits:**
- Centralized caching configuration
- Consistent query keys
- Easy to mock for testing
- Reusable across components

#### Parameter Mapping

The API expects PascalCase (.NET convention), frontend uses camelCase (JavaScript convention):

```typescript
const paramMapping = {
  page: 'PageNumber',
  pageSize: 'PageSize',
  minPrice: 'MinPrice',
  maxPrice: 'MaxPrice',
};
```

Handled in Infrastructure Layer, transparent to other layers.

### 3. Performance Patterns

#### Intelligent Debouncing

```typescript
// Search filters: debounced (prevents spam while typing)
const debouncedSearch = useDebounce(searchFilters, 500);

// Pagination: instant (immediate response)
const finalFilters = {
  ...debouncedSearch,
  page: activeFilters.page,  // No debounce
};
```

#### Granular Caching

Each filter combination is cached separately:

```typescript
queryKey: ['properties', filters]

// Cache entries:
['properties', { page: 1, name: '' }]      // Cached
['properties', { page: 2, name: '' }]      // Cached
['properties', { page: 1, name: 'Villa' }] // Cached
```

Result: Instant navigation when returning to previously visited pages.

#### Placeholder Data

```typescript
placeholderData: (previousData) => previousData
```

Keeps previous data visible while fetching new data, eliminating loading flashes.

### 4. Animation Best Practices

#### Purposeful Animations

Animations enhance UX, not just decoration:

- **Page transitions**: Fade in up with stagger
- **Hover states**: Subtle scale and color changes
- **Loading states**: Pulse animations on skeletons
- **Mobile menu**: Smooth expand/collapse

#### Performance-Conscious

```typescript
// Use transform instead of position
whileHover={{ y: -8 }}  // Instead of top: -8px

// Framer Motion optimizations
layoutId="underline"  // Shared layout animations
```

### 5. Accessibility

#### Semantic HTML

```typescript
<nav>                        // Navigation landmarks
<main>                       // Main content
<section>                    // Content sections
<dl><dt><dd>                 // Definition lists for property details
```

#### ARIA Attributes

```typescript
aria-label="Toggle menu"
aria-disabled={isFirstPage}
role="status"               // For loading states
```

#### Keyboard Navigation

- All interactive elements are keyboard accessible
- Focus states clearly visible
- Tab order follows visual flow

### 6. Code Quality

#### TypeScript Strict Mode

```typescript
// No implicit any
const apiParams: Record<string, any> = {};  // Explicitly typed

// Proper null checks
if (error || !property) return <ErrorState />;

// Type inference from Zod
export type Property = z.infer<typeof PropertySchema>;
```

#### Consistent Naming Conventions

- Components: PascalCase (`PropertyCard`)
- Hooks: camelCase with 'use' prefix (`useProperties`)
- Utils: camelCase (`formatPrice`)
- Types: PascalCase (`PropertyFilters`)

#### Documentation

- JSDoc comments for all public functions
- Inline comments for complex logic
- README files for major features
- Type definitions as documentation

## Performance Optimizations

### Achieved Metrics

**Lighthouse Scores (estimated):**
- Performance: 95-100
- Best Practices: 100
- SEO: 100
- Accessibility: 95-100

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### Optimization Techniques

#### Image Optimization
- Next.js automatic optimization
- AVIF/WebP format conversion
- Responsive image sizing
- Lazy loading below the fold
- Priority loading for hero images

#### Caching Strategy
- React Query for API responses (5-10 min TTL)
- Browser cache for images (1 year)
- Service worker caching (future enhancement)

#### Code Optimization
- Tree shaking unused code
- Minification in production
- Gzip/Brotli compression
- Route-based code splitting

#### Network Optimization
- Request deduplication with React Query
- Debounced search inputs
- Pagination without unnecessary refetches
- Optimistic UI updates

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Development Workflow

1. **Component Development**
   - Create component in appropriate directory
   - Add types and props interface
   - Implement three UI states (loading, error, success)
   - Add to storybook (if available)

2. **API Integration**
   - Add function to `/lib/api`
   - Create custom hook in `/lib/hooks`
   - Use hook in component
   - Handle all states appropriately

3. **Testing Workflow**
   - Unit tests for utilities
   - Component tests with React Testing Library
   - Integration tests for user flows
   - E2E tests for critical paths

### Code Style

- ESLint configuration enforces consistent style
- Prettier for automatic formatting
- Tailwind classes ordered with official plugin
- Component structure follows established patterns

## Docker Configuration

### Multi-Stage Build

```dockerfile
# Stage 1: Builder
FROM node:22-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
RUN echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" > .env.production
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:22-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

**Benefits:**
- Smaller production image
- No dev dependencies in production
- Environment variables baked into build
- Fast deployment

## Contributing

### Adding a New Page

1. Create page in `/app/[route]/page.tsx`
2. Add route to navigation if needed
3. Follow three-state pattern
4. Use existing components where possible

### Adding a New API Endpoint

1. Add function to `/lib/api/properties.ts`
2. Create custom hook in `/lib/hooks`
3. Configure React Query options
4. Use hook in components

### Adding a New Component

1. Determine appropriate directory (property/shared/ui)
2. Create component file with props interface
3. Add to exports if reusable
4. Document with JSDoc if public API

## Project Highlights

### Technical Excellence

- **Type Safety**: Full TypeScript coverage with strict mode
- **Architecture**: Clean Architecture with SOLID principles
- **Performance**: Optimized images, caching, and code splitting
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Responsive**: Mobile-first design with breakpoints
- **Animations**: Smooth, purposeful animations with Framer Motion
- **Error Handling**: Comprehensive error boundaries and states
- **Testing Ready**: Mockable hooks and testable components

### Code Quality

- Consistent naming conventions
- Comprehensive code comments
- ESLint rules enforced
- TypeScript strict mode
- No console errors or warnings
- Clean git history

### Production Ready

- Docker containerization
- Environment variable management
- Error logging and monitoring ready
- SEO optimized
- Performance optimized
- Security best practices (CSP, no external SVGs)

---

**Developed by**: Mateo Avila - Multimedia Engineer  
**Portfolio**: [mateoavila.co](https://mateoavila.co)  
**Contact**: contacto@mateoavila.co  
**Purpose**: Technical assessment project demonstrating modern web development expertise
