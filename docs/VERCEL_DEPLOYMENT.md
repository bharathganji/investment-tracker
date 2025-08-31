# Vercel Deployment Guide

This document provides instructions for deploying the Investment Tracker application to Vercel.

## Prerequisites

1. A Vercel account (free at [vercel.com](https://vercel.com))
2. A Supabase account (free at [supabase.com](https://supabase.com))
3. This repository forked/cloned locally

## Deployment Steps

### 1. Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project
3. Note down your project's:
   - Project URL (e.g., `https://your-project.supabase.co`)
   - Anonymous API key (found in Settings > API)

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your repository (GitHub, GitLab, or Bitbucket)
4. Configure the project:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 3. Set Environment Variables

In your Vercel project settings, add the following environment variables:

| Variable Name                   | Value                       | Description                                  |
| ------------------------------- | --------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL   | The URL of your Supabase project             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | The public API key for your Supabase project |
| `NODE_ENV`                      | `production`                | Environment mode                             |

### 4. Configure Supabase Authentication

In your Supabase project dashboard:

1. Go to Authentication > URL Configuration
2. Add your Vercel deployment URL to the "Redirect URLs" (e.g., `https://your-app.vercel.app/*`)
3. Also add `http://localhost:3000/*` for local development

### 5. Set up Supabase Database (Optional)

If you're using the Supabase database:

1. Create the necessary tables using the SQL editor in Supabase
2. Set up Row Level Security (RLS) policies as needed
3. Create service roles if your application needs to access data server-side

### 4. Configure Supabase Authentication

In your Supabase project dashboard:

1. Go to Authentication > URL Configuration
2. Add your Vercel deployment URL to the "Redirect URLs" (e.g., `https://your-app.vercel.app/*`)

### 5. Redeploy

After setting environment variables, trigger a new deployment in Vercel.

## Custom Domain (Optional)

1. In your Vercel project dashboard, go to Settings > Domains
2. Add your custom domain
3. Follow the DNS configuration instructions
4. Update your Supabase redirect URLs to include your custom domain

## Environment-Specific Configurations

### Production Environment

For production deployments, ensure the following environment variables are set:

```bash
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

### Preview Environments

Vercel automatically creates preview deployments for pull requests. You can set environment variables specifically for preview environments in the Vercel project settings.

## Performance Optimization

The Vercel configuration includes several optimizations:

1. Static file caching for improved load times
2. Automatic routing configuration
3. Region selection for better performance
4. Clean URLs without `.html` extensions

## Deployment Process

### Automated Deployments

This project is configured for automated deployments:

1. Connect your GitHub repository to Vercel
2. Configure the project settings as described above
3. Every push to the `main` branch will trigger a new production deployment
4. Every pull request will create a preview deployment

### Manual Deployments

To manually deploy from your local machine:

1. Install Vercel CLI: `npm install -g vercel`
2. Log in to your Vercel account: `vercel login`
3. Deploy the project: `vercel --prod`

### Monitoring Deployments

1. View deployment logs in the Vercel dashboard
2. Set up notifications for deployment status
3. Monitor performance metrics in the Analytics tab
4. Check for errors in the Functions tab if using serverless functions

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**: Ensure all environment variables are set in Vercel project settings
2. **Authentication Issues**: Verify Supabase configuration and redirect URLs
3. **Build Failures**: Check dependencies and build commands
4. **Performance Issues**: Review caching settings and region selection

### Getting Help

If you encounter issues:

1. Check the Vercel documentation
2. Review the deployment logs
3. Verify all configuration steps were completed
4. Contact Vercel support if needed

## Troubleshooting

### Environment Variables Not Loading

Ensure all environment variables are set in Vercel project settings, not just in a local `.env` file.

### Authentication Issues

1. Check that your Supabase project URL and anon key are correct
2. Verify that your Vercel deployment URL is added to Supabase redirect URLs
3. Make sure you're using the correct credentials for login/signup

### Build Failures

1. Check that all dependencies are correctly listed in `package.json`
2. Ensure the build command in Vercel settings is `next build`
3. Check the build logs in Vercel for specific error messages

## Local Development vs Production

When developing locally, create a `.env` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=development
```

Never commit this file to version control. The `.env.example` file shows the required variables.
