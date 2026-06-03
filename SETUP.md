# EmiliaB Hairstylist — Setup Guide

## 1. Database

Your `.env` already has the database connection filled in. Just run the migration:

```
cd emiliab-hairstylist
npx prisma migrate dev --name init
```

If the migration fails with a connection error, try changing `sslmode=disable` to
`sslmode=require` (or vice versa) in `DATABASE_URL` inside `.env`.

---

## 2. Admin password

In `.env`, set a strong password before deploying:

```
ADMIN_PASSWORD="YourChosenPassword"
ADMIN_JWT_SECRET="any-long-random-string"
```

Generate a secure secret:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Login URL after deploy: `https://your-site.vercel.app/admin`

---

## 3. Gmail email setup (5 minutes)

1. Open the Gmail account you want to use for sending
2. Go to **myaccount.google.com → Security**
3. Enable **2-Step Verification** (required for App Passwords)
4. Go back to Security → scroll down → **App Passwords**
5. Click "Create app password" → name it "EmiliaB Website" → click Create
6. Copy the 16-character code shown
7. In `.env`:
   ```
   GMAIL_USER="her-email@gmail.com"
   GMAIL_APP_PASSWORD="abcd efgh ijkl mnop"   ← paste here (keep spaces or remove them)
   OWNER_EMAIL="her-email@gmail.com"
   ```

When a customer submits the form:
- Emilia gets a notification email with all the details
- The customer gets a confirmation email automatically

---

## 4. Instagram (live feed — optional)

The site works without this. Without it, the portfolio section shows a
"Follow on Instagram" button. To enable the live photo grid:

### Step A — Prepare Instagram (Emilia does this once)
1. Instagram → Profile → Settings → Account → Switch to Professional Account → Creator
2. Settings → Linked Accounts → Facebook → log in → link a Facebook Page
   (if no Page exists: facebook.com/pages/create, takes 2 min)

### Step B — Get an access token (10 min)
1. Go to https://developers.facebook.com → My Apps → Create App → Other → Business
2. Dashboard → Add Product → Instagram Graph API
3. Tools → Graph API Explorer:
   - Select your App
   - Select her Instagram account
   - Generate Access Token (needs `instagram_basic` permission)
4. Exchange for Long-Lived Token (valid 60 days):
   ```
   GET https://graph.instagram.com/access_token
     ?grant_type=ig_exchange_token
     &client_id={APP_ID}
     &client_secret={APP_SECRET}
     &access_token={SHORT_LIVED_TOKEN}
   ```
5. Add the token to `.env`:
   ```
   INSTAGRAM_ACCESS_TOKEN="IGQ..."
   ```

---

## 5. Run locally

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Site: http://localhost:3000  
Admin: http://localhost:3000/admin  
Default local password: `admin123` (change before deploying!)

---

## 6. Deploy to Vercel (free)

1. Go to https://vercel.com → sign up with GitHub
2. Push this folder to GitHub (use GitHub Desktop or drag-and-drop)
3. Vercel → New Project → Import your repo
4. Add all variables from `.env` in Vercel's **Environment Variables** section
5. Deploy

Your site will be live at `https://emiliab-hairstylist.vercel.app` (or similar).
Connect a custom domain later from the Vercel dashboard.

---

## Password security reminder

After everything works, change the database password on your hosting panel
and update `DATABASE_URL` in `.env` and in Vercel. Credentials shared during
setup should not stay as the permanent password.
