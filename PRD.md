# Product Requirements Document: Simple Network CRM Web App

## Project Overview

**Project Name:** Simple Network CRM Web App  
**Version:** 1.0  
**Date:** September 2025  
**Status:** Active Development  
**Platform:** Web Application (Next.js)
**Foundation:** Building incrementally on existing Simple CRM deployed to production

## Vision Statement

Create the fastest, most frictionless web application that transforms networking-avoiders into networking champions by making relationship management so simple that it becomes effortless and habitual.

## Core Philosophy: "5-Second Rule"

Every core action in the app must be completable in 5 seconds or less. If someone who has never prioritized networking can't use this app intuitively and immediately, we've failed.

## Problem Statement

**Target Problem:** Professionals who KNOW networking is important but consistently fail to do it because:
- It feels overwhelming and time-consuming
- They don't know what to say or when to reach out
- They forget about people immediately after meeting them
- Existing tools are too complex and require too much setup
- They lack a simple system to track who they've met

**Core Insight:** The biggest barrier isn't capability—it's friction. Remove all friction, and networking becomes automatic.

## Target Users

**Primary User Persona: "The Reluctant Networker"**
- Knows networking is important but avoids it
- Gets anxious about follow-up conversations
- Meets people but never stays in touch
- Wants to be better at relationships but doesn't know how to start
- Values efficiency and simplicity above all else

**Secondary Personas:**
- Busy professionals who need dead-simple tools
- Introverts who find networking draining
- People re-entering the workforce who need to rebuild networks

## Core Design Principles

### 1. Instant Capture
- Add a contact in under 5 seconds
- Simple form-based input with smart defaults
- Optional fields to reduce friction
- Quick notes for immediate thoughts

### 2. Zero Configuration
- Works perfectly out of the box with Google sign-in
- No setup wizards or complicated onboarding
- Smart defaults for everything
- Personal data isolated per user

### 3. Incremental Intelligence
- Start with basic follow-up reminders
- Simple tagging and categorization
- Gradual introduction of smart features
- Build habits first, add complexity later

### 4. Web-First Excellence
- Responsive design that works on all devices
- Fast loading and offline-capable where possible
- Uses web platform conventions users already know
- Progressive Web App features for mobile experience

## Core Features (Incremental MVP)

### Phase 1: Foundation (COMPLETED ✅)
**Goal: Multi-user contact management with Google authentication**

- **Google Sign-In:** One-click authentication with Google account
- **Personal Contact List:** Each user sees only their own contacts
- **Basic Contact Addition:** Name + Company with optional fields
- **Simple List View:** Clean, searchable list of all contacts
- **Secure Data:** User data isolated and protected

### Phase 2: Smart Follow-Ups (NEXT)
**Goal: Add basic follow-up reminder system**

- **Follow-Up Dates:** Set optional follow-up reminders for contacts
- **Simple Dashboard:** Home page showing contacts that need follow-up today
- **Quick Actions:** "Mark as contacted" and "Reschedule follow-up" buttons
- **Basic Notifications:** Email reminders for overdue follow-ups

### Phase 3: Enhanced Context (FUTURE)
**Goal: Add more context and intelligence**

- **Meeting Notes:** Simple text field for conversation context
- **Tags System:** Categorize contacts (client, mentor, peer, etc.)
- **Where Met:** Track connection source (event, introduction, etc.)
- **Last Contact:** Track when you last spoke with someone

### Phase 4: Relationship Intelligence (FUTURE)
**Goal: Add smart insights and suggestions**

- **Relationship Health:** Visual indicators based on last contact date
- **Follow-Up Suggestions:** Smart timing recommendations
- **Quick Templates:** Pre-written follow-up message ideas
- **Search & Filter:** Advanced search by tags, dates, companies

## User Experience Flow

### Onboarding (30 seconds max)
1. "Welcome! Sign in with Google to get started"
2. "Add your first contact in 5 seconds"
3. "You're ready to build better relationships!"

### Daily Use Pattern
1. **Open App:** See dashboard with follow-ups needed today
2. **Add New Contact:** Quick form after meeting someone
3. **Set Follow-Up:** Choose when you want to reconnect
4. **Get Reminded:** Simple notification when it's time to reach out
5. **Mark Complete:** One-click to record that you followed up

## Technical Requirements

### Web Application Stack (Current)
- **Frontend:** Next.js 14 with TypeScript
- **Styling:** Tailwind CSS for responsive design
- **Database:** Supabase (PostgreSQL) with Row Level Security
- **Authentication:** NextAuth.js with Google OAuth
- **Deployment:** Vercel for frontend, Supabase for backend
- **State Management:** React hooks and server-side state

### Key Web Integrations
- **Google OAuth:** Seamless sign-in with Google account
- **Email Notifications:** Future integration for follow-up reminders
- **Progressive Web App:** Mobile-friendly experience
- **Search:** Client-side filtering and search functionality
- **Responsive Design:** Works on desktop, tablet, and mobile

### Performance Requirements
- **Page Load:** Under 2 seconds on fast connection
- **Contact Addition:** Under 5 seconds end-to-end
- **Search Results:** Instant filtering as you type
- **Authentication:** One-click Google sign-in
- **Data Security:** User isolation with RLS policies

## Data Model

### Current Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    google_id TEXT UNIQUE,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### People Table (Enhanced)
```sql
CREATE TABLE people (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT,
    phone TEXT,
    notes TEXT,
    follow_up_date DATE,
    last_contact_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security Policies
```sql
-- Users can only see their own contacts
CREATE POLICY "Users can view own people" ON people
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own contacts
CREATE POLICY "Users can insert own people" ON people
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Development Priorities

### Incremental Development Approach
**Philosophy: Ship small, useful improvements weekly**

### Current Status: Phase 1 Foundation ✅ COMPLETED
- ✅ Basic contact addition and list view
- ✅ Next.js + TypeScript + Tailwind setup
- ✅ Supabase database integration
- ✅ Responsive design
- ✅ Production deployment on Vercel

### Phase 2: Authentication & Multi-User (CURRENT - Week 1)
**Goal: Enable multiple users with Google sign-in**
1. **Day 1-2: Setup Authentication**
   - Install and configure NextAuth.js
   - Add Google OAuth provider
   - Create user authentication UI

2. **Day 3-4: Database Schema Updates**
   - Add users table to Supabase
   - Update people table with user_id foreign key
   - Implement Row Level Security policies

3. **Day 5: Frontend Integration**
   - Add login/logout buttons to UI
   - Show user-specific data only
   - Update API routes for authenticated users

4. **Day 6-7: Testing & Deployment**
   - Test authentication flow in development
   - Configure Vercel with authentication secrets
   - Deploy and verify in production

### Phase 3: Follow-Up System (Week 2)
**Goal: Add basic follow-up reminder functionality**
1. **Days 1-2: Database & API Updates**
   - Add follow_up_date field to people table
   - Create API endpoints for follow-up management

2. **Days 3-4: UI Enhancements**
   - Add follow-up date picker to contact form
   - Create dashboard showing overdue follow-ups
   - Add "mark as contacted" functionality

3. **Days 5-7: Polish & Deploy**
   - Style follow-up indicators
   - Test user workflows
   - Deploy to production

### Phase 4: Enhanced Context (Week 3)
**Goal: Add notes and contact tracking**
1. **Days 1-3: Notes & Context**
   - Add notes field to contact forms
   - Add last_contact_date tracking
   - Simple search functionality

2. **Days 4-7: UI Polish**
   - Improve contact detail views
   - Add quick actions for common tasks
   - Mobile responsiveness improvements

## Success Definition

**The app succeeds when someone who has never prioritized networking:**
1. Signs up with Google in under 10 seconds
2. Adds their first contact within 60 seconds
3. Sets a follow-up reminder and actually follows through
4. Continues using it weekly for 4+ weeks
5. Tells others it "made networking finally manageable"

## Current Success Metrics

### Phase 1 Metrics (Achieved ✅)
- ✅ App loads in under 2 seconds
- ✅ Contact addition works in under 30 seconds
- ✅ Responsive design works on all devices
- ✅ Production deployment successful

### Phase 2 Target Metrics
- Google sign-in completes in under 10 seconds
- Users can add contacts immediately after sign-in
- Zero authentication-related errors in production
- User data properly isolated and secure

---

**Key Mantra:** "If it takes more than 10 seconds, it's too complex."

---

*This PRD prioritizes incremental improvement and web-first simplicity to solve the networking problem for people who have historically avoided it.*