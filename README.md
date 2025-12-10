# 🚀 SparkBytes – Team 1  
Connecting BU students through shared meals and reducing food waste 🍽️♻️

SparkBytes helps Boston University students discover and share leftover food from campus events — reducing waste and fostering community, one meal at a time.

---

## 📦 Features
- 🔍 Search & filter events by category, dietary restrictions, campus, and more  
- 📍 Toggle between Map and List views  
- ⭐ Bookmark events  
- ➕ Post new events  
- 🔐 Secure authentication via Supabase  
- 🍽️ Event details including allergens, dietary tags, and servings left  

---

## 🛠️ Getting Started (Local Development)

### 1️⃣ Clone the repository
```bash
git clone <repository-url>
cd <repository-folder>
```

### 2️⃣ Install dependencies
```bash
npm install
# or
yarn install
```

### 3️⃣ Create your .env.local file
```bash
touch .env.local
```
Add the following values:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://qhkspftmbjsinovcxpwd.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoa3NwZnRtYmpzaW5vdmN4cHdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTg2NTAsImV4cCI6MjA3NzkzNDY1MH0.bjo0ES3Z6TDEDoolHqSgzbCEOblebOMBub9WmK14BlA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoa3NwZnRtYmpzaW5vdmN4cHdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM1ODY1MCwiZXhwIjoyMDc3OTM0NjUwfQ._G31S5ZbERMb-Q9YdzTq4PCd9VW0N2oqELMQ2Jb1BT0

```

### 4️⃣ Run the development server
```bash
npm run dev
# or
yarn dev
```

---

## 🧱 Tech Stack
### Frontend
+ Next.js 14
+ React
+ Tailwind CSS
+ Ant Design

### Backend
+ Supabase
    + Postgres Database
    + Auth & RLS
 
---

## 📁 Project Structure
```bash
├── app/
│   ├── (site pages, routes, layouts)
│   ├── components/   # UI components
│   ├── api/          # Server actions & API routes
│   └── globals.css   # Global styles
├── lib/
│   └── supabase/     # Supabase client helpers
├── public/           # Images & static assets
└── README.md
```
