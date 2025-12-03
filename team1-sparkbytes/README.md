 # Team1-SparkBytes

 A full-stack Next.js application (app router) with Supabase-backed authentication and data storage. This repository implements the frontend UI components, auth flows, and backend helpers for interacting with Supabase. It was created as part of the Team 1 SparkBytes project.

 **Status**: `feature/post-form` branch (work in progress)

 ---

 **Key Features**
 - User authentication (sign up, login, password reset) via Supabase
 - Protected routes and middleware integration
 - Create/read event and post pages (forms & success pages)
 - Reusable UI components with Tailwind CSS
 - Supabase client helpers for server- and client-side usage

 **Tech stack**
 - Next.js (app router)
 - React + TypeScript
 - Tailwind CSS
 - Supabase (Auth + Database)
 - ESLint / Prettier (formatting & linting)

 ---

 **Repository layout (important files & folders)**
 - `app/` — Next.js app routes and pages (app router). Contains `auth/`, `dashboard/`, `event/`, `post/`, and protected layout.
 - `components/` — UI components and form components (auth forms, `map.tsx`, `new-event-form.tsx`, etc.).
 - `lib/supabase/` — Supabase client, server helpers, and middleware (`client.ts`, `server.ts`, `middleware.ts`).
 - `public/images/` — Static assets.
 - `tailwind.config.ts`, `postcss.config.mjs` — Tailwind setup.

 ---

 **Prerequisites**
 - Node.js (recommended v18+)
 - npm or yarn (pnpm is also fine)
 - A Supabase project (for Auth + Database)

 ---

 Getting started (local development)

 1. Clone the repo

 ```bash
 git clone <repo-url>
 cd team1-sparkbytes
 ```

 2. Install dependencies

 ```bash
 npm install
 # or
 # pnpm install
 # or
 # yarn
 ```

 3. Create a Supabase project and get keys
 - Go to https://app.supabase.com and create a project
 - Get the `SUPABASE_URL` and `SUPABASE_ANON_KEY` from the project settings
 - (Optional, for server-side operations) get the `SUPABASE_SERVICE_ROLE_KEY` from Project Settings → API

 4. Add environment variables
 Create a `.env.local` at the project root with the following variables (example):

 ```env
 NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
 NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
 # Optional server key (do NOT expose on the client)
 SUPABASE_SERVICE_ROLE_KEY=service-role-key
 # Next auth or other env vars if required
 ```

 5. Run the dev server

 ```bash
 npm run dev
 # or
 # pnpm dev
 # or
 # yarn dev
 ```
 Open `http://localhost:3000` in your browser.

 ---

 Available scripts (common)
 - `dev` — Runs the Next.js dev server
 - `build` — Builds the app for production
 - `start` — Runs the production build
 - `lint` — Lints the codebase (if configured)
 - `format` — Runs code formatter (if configured)

 Check `package.json` for exact script names.

 ---

 Supabase setup notes
 - Auth: enable Email/Password provider (and OAuth providers if needed)
 - Database: create the tables required by the app (events, posts, profiles) if not present. Check server code in `lib/supabase/server.ts` for expected table names and columns.
 - RLS & policies: if you enable Row Level Security, ensure appropriate policies exist for authenticated users to read/write their data.

 ---

 Authentication & middleware
 - Client-side Supabase is initialized in `lib/supabase/client.ts` and used by UI components and pages.
 - Server helpers are in `lib/supabase/server.ts` and `lib/supabase/middleware.ts` (used by Next middleware and server components).
 - The `app/protected/` layout demonstrates protecting routes—see `app/protected/layout.tsx` for implementation details.

 ---

 Forms & components
 - Auth forms are under `components/` (`login-form.tsx`, `sign-up-form.tsx`, `forgot-password-form.tsx`, `update-password-form.tsx`).
 - Event/post forms are under `components/` (e.g., `new-event-form.tsx`) and use the Supabase client to persist data.
 - Success pages (e.g., `components/event-post-success.tsx`) show operation results.

 ---

 Deployment
 - Vercel is recommended for Next.js deployments. Connect your GitHub repo to Vercel, set environment variables in the Vercel dashboard, and deploy.
 - Alternatively, deploy to any platform that supports Next.js and set the environment variables there.

 ---

 Troubleshooting
 - Missing env keys: the app will fail to connect to Supabase. Confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set.
 - Auth errors: check Supabase project settings and Allowed Redirect URLs (if using OAuth).
 - Server errors: see server logs and ensure `SUPABASE_SERVICE_ROLE_KEY` (if used) is set only on the server.

 ---

 Contributing
 - Fork the repo and create feature branches
 - Follow existing code style and run linters/formatters before opening a PR
 - Describe changes and any required DB migrations or env vars in the PR body

 ---

 Next steps and recommendations
 - Add a schema SQL file for the Database tables used by the app (events, posts, profiles).
 - Add automated tests for critical components and API flows.
 - Add CI for linting and deployment checks.

 ---

 Contact
 - For questions about the code, see repository owner or the Team 1 SparkBytes maintainers.

 ---

 License
 - Add a `LICENSE` file to the repository and state the chosen license (e.g., MIT).
<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

  ```env
  NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[INSERT SUPABASE PROJECT API PUBLISHABLE OR ANON KEY]
  ```
  > [!NOTE]
  > This example uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, which refers to Supabase's new **publishable** key format.
  > Both legacy **anon** keys and new **publishable** keys can be used with this variable name during the transition period. Supabase's dashboard may show `NEXT_PUBLIC_SUPABASE_ANON_KEY`; its value can be used in this example.
  > See the [full announcement](https://github.com/orgs/supabase/discussions/29260) for more information.

  Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
