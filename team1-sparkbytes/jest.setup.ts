import dotenv from 'dotenv';
dotenv.config({ path: './.env.test'}); // Specifies a .env file for tests when needed

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    // ... other router properties as needed
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));