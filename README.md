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
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

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
