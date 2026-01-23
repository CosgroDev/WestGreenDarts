# West Green Darts - Deployment Guide

This guide covers deploying the West Green Darts application to Railway or Render with SQLite persistent storage.

## Prerequisites

- ✅ GitHub repository with your code
- ✅ Code merged to `main` branch
- ✅ All tests passing

## Option 1: Railway (Recommended) ⭐

Railway offers the simplest deployment experience with excellent support for SQLite.

### Step 1: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign in with GitHub

### Step 2: Create New Project

1. Click "Deploy from GitHub repo"
2. Select your repository: `CosgroDev/WestGreenDarts`
3. Railway will automatically detect it's a Next.js app

### Step 3: Configure Environment

1. Railway will auto-detect settings from `railway.json`
2. No additional configuration needed!
3. The database file will automatically persist in `/app/prisma/dev.db`

### Step 4: Deploy

1. Railway will automatically build and deploy
2. Wait for deployment to complete (~2-3 minutes)
3. Railway will provide you with a URL like: `https://westgreendarts.up.railway.app`

### Step 5: Verify Deployment

1. Visit your Railway URL
2. You should see the PIN entry page
3. Enter PIN: `1234`
4. Start using the app!

### Railway Features

- ✅ Automatic deployments on git push
- ✅ Free $5/month credit (enough for small apps)
- ✅ Persistent storage included
- ✅ Custom domains supported
- ✅ Easy rollbacks

---

## Option 2: Render

Render is another excellent option with a generous free tier.

### Step 1: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click "Get Started"
3. Sign in with GitHub

### Step 2: Create New Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `CosgroDev/WestGreenDarts`
3. Render will detect it's a Next.js app

### Step 3: Configure Service

Render will auto-detect settings from `render.yaml`, but verify:

- **Name**: `west-green-darts`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: `Free`

### Step 4: Add Persistent Disk

**IMPORTANT**: You must add a persistent disk for SQLite!

1. Scroll to "Disks" section
2. Click "Add Disk"
3. Configure:
   - **Name**: `west-green-darts-data`
   - **Mount Path**: `/opt/render/project/src/prisma`
   - **Size**: `1 GB` (free tier)
4. Click "Create Disk"

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment (~3-5 minutes)
3. Render will provide a URL like: `https://west-green-darts.onrender.com`

### Step 6: Verify Deployment

1. Visit your Render URL
2. PIN entry page should load
3. Enter PIN: `1234`
4. App is ready!

### Render Features

- ✅ 750 free hours/month
- ✅ Automatic deployments on git push
- ✅ Free SSL certificates
- ✅ Custom domains supported
- ✅ Persistent disks for database

---

## Post-Deployment Steps

### 1. Change Default PIN

**IMPORTANT**: Change the default PIN from `1234` to something secure!

Currently, you'll need to:
1. Access your app
2. Navigate to settings (when available)
3. Change PIN

### 2. Set Up Custom Domain (Optional)

**Railway**:
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

**Render**:
1. Go to your service settings
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records as instructed

### 3. Monitor Your Deployment

**Railway**:
- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts

**Render**:
- View logs in Render dashboard
- Monitor metrics
- Check disk usage

---

## Database Management

### Backup Your Data

**Important**: Regularly backup your SQLite database!

**Railway**:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Download database
railway run "cat /app/prisma/dev.db" > backup-$(date +%Y%m%d).db
```

**Render**:
- Use Render's disk snapshot feature
- Or SSH into your service to copy the database

### Restore from Backup

1. Stop your service
2. Replace the database file
3. Restart service

---

## Troubleshooting

### Database Not Persisting

**Railway**: Database should persist automatically in the project volume

**Render**: Make sure persistent disk is mounted to `/opt/render/project/src/prisma`

### Build Failures

1. Check build logs for errors
2. Verify all dependencies in `package.json`
3. Ensure Node version is >=18.0.0

### App Not Starting

1. Check start command is `npm start`
2. Verify build completed successfully
3. Check environment variables are set correctly

### Database Locked Errors

- SQLite can have issues with concurrent writes
- This is normal for serverless environments
- Better-sqlite3 handles this well in most cases

---

## Cost Estimates

### Railway
- **Free Tier**: $5/month credit
- **Estimated Usage**: $2-3/month for small team app
- **Paid Plan**: $5-10/month for more resources

### Render
- **Free Tier**: 750 hours/month (enough for always-on)
- **Disk**: 1GB free
- **Paid Plan**: $7/month for more resources

---

## Next Steps

1. ✅ Choose Railway or Render
2. ✅ Follow deployment steps above
3. ✅ Verify app is working
4. ✅ Change default PIN
5. ✅ Add your team members
6. ✅ Start tracking games!

## Support

If you encounter issues:
1. Check the platform's documentation
2. Review build/deploy logs
3. Ensure database directory is writable
4. Check disk space on persistent storage

---

**Happy Darting! 🎯**
