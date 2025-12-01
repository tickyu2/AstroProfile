# 🔐 SECURITY CHECKLIST - AstroProfile/GENESIS

**Created:** November 24, 2025  
**Status:** Development Mode (Phase 1)  
**Review Before:** Production Launch

---

## Current Status: Development ⚠️

We're using simplified security for fast iteration. 
Before going live, complete this checklist!

---

## 🔑 API Key Security

### Google Maps API Key

| Task | Status | Notes |
|------|--------|-------|
| API key created | ✅ Done | AIzaSyCI9... |
| HTTP referrer restrictions | ✅ Done | localhost + github.io |
| API restrictions (Places only) | ✅ Done | Places API, Places API (New) |
| Move to environment variable | ⬜ TODO | Create .env file |
| Add .env to .gitignore | ⬜ TODO | Prevent accidental commit |
| Set up production env vars | ⬜ TODO | Netlify/Vercel/Firebase hosting |
| Enable billing alerts | ⬜ TODO | Prevent surprise charges |
| Set usage quotas | ⬜ TODO | Daily/monthly limits |

---

## 📁 Environment Variables Migration

### Step 1: Create .env file (local only)
```bash
# .env (in project root - NEVER commit this!)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyCI9YogTKdkbgBMrN_wLH4eFwc-ma5mcQU
```

### Step 2: Update .gitignore
```bash
# Add to .gitignore
.env
.env.local
.env.production
```

### Step 3: Update keys.js
```javascript
// src/config/keys.js (after migration)
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
```

### Step 4: Set in hosting provider
- **Firebase Hosting:** Use Firebase environment config
- **Netlify:** Site settings → Environment variables
- **Vercel:** Project settings → Environment variables

---

## 🔥 Firebase Security

| Task | Status | Notes |
|------|--------|-------|
| Firestore rules restrict to authenticated users | ✅ Done | |
| Users can only read/write their own profiles | ⬜ Check | Review rules |
| Admin-only operations protected | ⬜ TODO | |
| Rate limiting configured | ⬜ TODO | Prevent abuse |
| Backup strategy in place | ⬜ TODO | Automated backups |

---

## 🌐 Production Hardening

| Task | Status | Notes |
|------|--------|-------|
| HTTPS enforced | ⬜ TODO | SSL certificate |
| Content Security Policy headers | ⬜ TODO | Prevent XSS |
| Remove console.log statements | ⬜ TODO | Clean production code |
| Error handling doesn't expose internals | ⬜ TODO | Generic error messages |
| API key not visible in browser source | ⬜ TODO | After env var migration |

---

## 💰 Cost Protection

### Google Cloud
| Task | Status | Notes |
|------|--------|-------|
| Billing account linked | ⬜ Check | Required for API usage |
| Budget alerts set ($10, $50, $100) | ⬜ TODO | Email warnings |
| Monthly quota limits | ⬜ TODO | Hard stop at limit |

### Firebase
| Task | Status | Notes |
|------|--------|-------|
| Spark (free) vs Blaze (paid) plan | ⬜ Check | Know your plan |
| Usage alerts configured | ⬜ TODO | |
| Spending limits if Blaze | ⬜ TODO | |

---

## 🚀 Pre-Launch Checklist

Before announcing publicly:

- [ ] All TODO items above completed
- [ ] API keys in environment variables (not in code)
- [ ] .env files in .gitignore
- [ ] Production environment variables set
- [ ] Billing alerts active
- [ ] Usage quotas set
- [ ] Security rules reviewed
- [ ] HTTPS working
- [ ] Error handling tested
- [ ] Load testing done

---

## 📞 If Something Goes Wrong

### API Key Compromised?
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Delete compromised key
4. Create new key
5. Update environment variables
6. Redeploy

### Unexpected Charges?
1. Check Google Cloud billing
2. Identify which API caused charges
3. Reduce quotas
4. Contact Google Cloud support if needed

---

## 📅 Review Schedule

| Review | Frequency | Last Done |
|--------|-----------|-----------|
| API usage check | Weekly | - |
| Security rules audit | Monthly | - |
| Full checklist review | Before major release | - |

---

*"Build fast, secure later - but ALWAYS secure before launch!"*

💜 Co-Founders: Ticky & AI SoulPartner
