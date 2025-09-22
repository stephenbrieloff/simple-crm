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
1. "Welcome! Let's add your first contact in 5 seconds"
2. Demo the business card scanner
3. "You're ready to go!"

### Daily Use Pattern
1. **Morning Widget:** "3 people to reach out to today"
2. **Meeting Someone New:** Scan card or quick-add while shaking hands
3. **Walking Away:** Voice note with first impressions
4. **Getting Notification:** One-tap to send follow-up message
5. **Weekly Review:** 2-minute check-in on relationship health

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
```

### 1. AI-Powered Message Intelligence
**Goal: Remove the "what do I say?" barrier completely**

#### Smart Message Recommendations
- **Context-Aware Suggestions:** AI analyzes conversation history, mutual connections, recent LinkedIn activity, and industry news to suggest personalized messages
- **Relationship Stage Recognition:** Different message types for first follow-up vs. maintaining existing relationships vs. re-engaging dormant connections
- **Industry-Specific Templates:** Tech, finance, consulting, sales, etc. with appropriate language and topics
- **Tone Matching:** Professional, casual, or warm based on relationship context and previous interactions

#### Dynamic Message Generation
```swift
struct MessageRecommendation {
    let id: UUID
    let contactId: UUID
    let messageType: MessageType // followUp, checkIn, reEngagement, introduction
    let suggestedText: String
    let reasoning: String // "It's been 3 weeks since your coffee meeting about AI startups"
    let confidence: Float // AI confidence in recommendation quality
    let channels: [ContactChannel] // email, LinkedIn, text, call
    let urgency: UrgencyLevel // immediate, thisWeek, thisMonth
}
```

#### Message Types:
- **Initial Follow-Up:** "Great meeting you at [Event]. I've been thinking about your point on [Topic]..."
- **Value-Add Check-In:** "Saw this article about [Industry Trend] and thought you'd find it interesting..."
- **Introduction Facilitation:** "I'd love to introduce you to [Name] who's working on something similar..."
- **Re-Engagement:** "It's been a while since we connected. How's [Project/Company] going?"
- **Event-Based:** "Congratulations on [LinkedIn update/company news]!"

### 2. Intelligent Timing Engine
**Goal: Know exactly when to reach out for maximum impact**

#### Dynamic Follow-Up Scheduling
- **Relationship Velocity Tracking:** How quickly this person typically responds and engages
- **Industry Pattern Recognition:** When people in specific industries are most responsive
- **Personal Rhythm Analysis:** Individual contact's preferred communication cadence
- **Event-Triggered Timing:** Automatic suggestions based on LinkedIn activity, company news, job changes

#### Smart Timing Factors:
```swift
struct TimingIntelligence {
    let contactId: UUID
    let lastInteractionDate: Date
    let averageResponseTime: TimeInterval
    let preferredContactDays: [Weekday] // Based on historical data
    let industryOptimalTiming: OptimalTiming
    let relationshipStage: RelationshipStage
    let urgencyMultiplier: Float // Based on context importance
    let nextOptimalContact: Date
    let reasoning: String
}
```

#### Timing Recommendations:
- **Hot Leads:** Within 24 hours with high-priority notification
- **New Connections:** 2-3 days for initial follow-up, then 2 weeks, then monthly
- **Warm Relationships:** Every 4-6 weeks with value-add content
- **Dormant Connections:** Quarterly re-engagement with personalized context
- **Industry Events:** Immediate outreach for event-based connections

### 3. Deep Platform Integrations
**Goal: Seamless relationship building across all communication channels**

#### LinkedIn Integration
- **Activity Feed Monitoring:** Real-time tracking of connections' posts, job changes, company updates
- **Automated Engagement Suggestions:** "John just posted about AI regulation - perfect time to reconnect"
- **Profile Enrichment:** Auto-update contact details from LinkedIn changes
- **Message Sync:** Send LinkedIn messages directly from the app
- **Mutual Connection Discovery:** Identify shared connections for warm introductions
- **Company Intelligence:** Track when contacts' companies are in the news

```swift
struct LinkedInIntegration {
    let contactLinkedInURL: String
    let recentActivity: [LinkedInActivity]
    let mutualConnections: [Contact]
    let companyUpdates: [CompanyNews]
    let profileChanges: [ProfileChange]
    let engagementOpportunities: [EngagementSuggestion]
}
```

#### Calendar Integration
- **Meeting-Based Contact Creation:** Auto-create contacts for meeting attendees
- **Pre-Meeting Research:** Surface relevant context before scheduled meetings
- **Post-Meeting Follow-Up:** Automatic follow-up suggestions 24 hours after meetings
- **Meeting Context Capture:** Notes, attendees, and outcomes automatically linked to contacts
- **Recurring Meeting Intelligence:** Track relationship development over time

#### Gmail/Outlook Integration
- **Email Thread Analysis:** Understand conversation context and sentiment
- **Automatic Contact Enrichment:** Extract details from email signatures and conversations
- **Response Time Tracking:** Learn individual communication patterns
- **Email Template Integration:** Send recommended messages directly through preferred email client
- **Meeting Scheduling:** Inline calendar booking for follow-up meetings

#### Meeting Recording Integration
- **Multi-Platform Support:** Zoom, Granola, Otter.ai, Grain, Gong, and other recording tools
- **Automatic Meeting Detection:** Identify and link recordings to relevant contacts
- **AI-Powered Transcription Analysis:** Extract key topics, decisions, action items, and sentiment
- **Relationship Context Building:** Use meeting content to enhance contact profiles and conversation history
- **Follow-Up Intelligence:** Generate personalized follow-up messages based on meeting content
- **Meeting Insights Dashboard:** Track discussion themes, relationship development, and engagement patterns

```swift
struct MeetingRecording {
    let id: UUID
    let meetingId: String // External platform meeting ID
    let platform: RecordingPlatform // zoom, granola, otter, grain, etc.
    let title: String
    let date: Date
    let duration: TimeInterval
    let participants: [Contact]
    let transcript: MeetingTranscript?
    let summary: MeetingSummary
    let actionItems: [ActionItem]
    let keyTopics: [Topic]
    let decisions: [Decision]
    let followUpSuggestions: [MessageRecommendation]
    let sentimentAnalysis: SentimentScore
}

struct MeetingSummary {
    let executiveSummary: String
    let keyDiscussionPoints: [String]
    let participantInsights: [ParticipantInsight]
    let relationshipDynamics: RelationshipInsight
    let businessOpportunities: [Opportunity]
    let personalNotes: [PersonalDetail] // Family updates, interests mentioned
}
```

#### Advanced Communication Features
- **Multi-Channel Messaging:** Send via email, LinkedIn, SMS from single interface
- **Message Scheduling:** Send at optimal times based on recipient patterns
- **Response Tracking:** Monitor engagement and adjust future recommendations
- **A/B Testing:** Test different message approaches and learn what works

### 4. Meeting Recording Intelligence
**Goal: Transform meeting recordings into actionable relationship insights**

#### Core Meeting Recording Features

##### Multi-Platform Integration
- **Zoom Integration:** Direct API access to cloud recordings, transcripts, and meeting metadata
- **Granola Integration:** Advanced meeting summaries and AI-generated insights
- **Otter.ai Integration:** Real-time transcription and speaker identification
- **Grain Integration:** Video highlights and key moment extraction
- **Gong Integration:** Sales conversation intelligence and coaching insights
- **Google Meet/Teams:** Basic recording access through calendar integration
- **Manual Upload:** Support for any recording file format (MP3, MP4, WAV)

##### Intelligent Meeting Processing
```swift
struct MeetingIntelligence {
    let recordingId: UUID
    let processingStatus: ProcessingStatus // queued, processing, completed, failed
    let confidence: Float // AI confidence in analysis quality
    let languageDetection: [Language] // Multiple languages in same meeting
    let speakerIdentification: [SpeakerProfile]
    let emotionalTone: EmotionalAnalysis
    let engagementMetrics: EngagementScore
    let followUpPriority: PriorityLevel
}

enum ProcessingStatus {
    case queued
    case transcribing
    case analyzing
    case generatingInsights
    case completed
    case failed(Error)
}
```

##### Advanced Content Analysis
- **Topic Extraction:** Identify main discussion themes and subject areas
- **Decision Tracking:** Capture commitments, agreements, and next steps
- **Action Item Generation:** Automatically create follow-up tasks with ownership
- **Sentiment Analysis:** Understand meeting tone and participant engagement
- **Key Quote Extraction:** Highlight important statements and insights
- **Business Opportunity Detection:** Identify potential deals, partnerships, or collaborations

##### Relationship Context Enhancement
- **Speaker Profiling:** Build detailed profiles of how each contact communicates
- **Communication Style Analysis:** Understand preferences for data vs. stories, detail vs. big picture
- **Interest Mapping:** Track topics that generate engagement from specific contacts
- **Influence Patterns:** Identify who drives decisions and influences outcomes
- **Relationship Dynamics:** Understand power structures and communication flows

##### Intelligent Follow-Up Generation
- **Context-Aware Messages:** Reference specific meeting moments and discussions
- **Action-Based Follow-Ups:** Tie messages to commitments made during meetings
- **Personalized Tone Matching:** Adapt message style to match meeting participants' communication preferences
- **Multi-Stakeholder Messaging:** Different follow-up messages for different meeting participants
- **Timeline-Aware Scheduling:** Suggest follow-up timing based on commitments made

#### Meeting-Enhanced Contact Profiles

##### Dynamic Contact Intelligence
```swift
struct ContactMeetingProfile {
    let contactId: UUID
    let meetingHistory: [MeetingParticipation]
    let communicationStyle: CommunicationProfile
    let topicInterests: [TopicEngagement]
    let decisionMakingPattern: DecisionStyle
    let relationshipEvolution: [RelationshipMilestone]
    let businessContext: BusinessProfile
    let personalInsights: PersonalProfile
}

struct CommunicationProfile {
    let preferredMeetingLength: TimeInterval
    let engagementPatterns: [EngagementPattern]
    let questioningStyle: QuestioningType
    let decisionSpeed: DecisionVelocity
    let informationPreference: InformationType // data-driven, story-driven, visual
}
```

##### Conversation Memory System
- **Meeting-to-Meeting Continuity:** Track discussion threads across multiple meetings
- **Promise Tracking:** Monitor follow-through on commitments made
- **Topic Evolution:** See how discussions on specific topics develop over time
- **Relationship Milestones:** Identify key moments that strengthened or changed relationships
- **Business Development Pipeline:** Track how relationships translate to business outcomes

#### Meeting Analytics & Insights

##### Relationship Health Indicators
- **Engagement Scores:** Measure active participation vs. passive listening
- **Response Patterns:** Track how contacts respond to different topics or approaches
- **Meeting Frequency Optimization:** Suggest optimal cadence based on relationship stage
- **Quality Metrics:** Assess meeting productivity and relationship development

##### Predictive Intelligence
- **Follow-Up Success Prediction:** Likelihood of positive response based on meeting analysis
- **Deal Progression Signals:** Early indicators of business opportunities
- **Relationship Risk Assessment:** Detect potential issues or declining engagement
- **Optimal Next Meeting Timing:** Suggest best times for follow-up meetings

##### Business Intelligence Dashboard
- **Meeting ROI Analysis:** Track which meetings lead to valuable outcomes
- **Network Effect Mapping:** Understand how introductions and referrals develop
- **Industry Intelligence:** Aggregate insights across similar roles or industries
- **Personal Performance Metrics:** Improve your own meeting effectiveness

### 5. Relationship Intelligence Dashboard
**Goal: Proactive relationship management with predictive insights**

#### AI-Powered Insights
- **Relationship Health Score:** Algorithm combining recency, frequency, and engagement quality
- **Networking ROI Tracking:** Which connections lead to opportunities, introductions, or value
- **Attention Alerts:** "Sarah hasn't heard from you in 6 weeks - she typically expects monthly check-ins"
- **Opportunity Identification:** "3 of your contacts are hiring - perfect time for introductions"
- **Network Growth Suggestions:** "You have strong tech connections but weak finance network"

#### Predictive Features
- **Churn Risk Detection:** Identify relationships likely to go dormant
- **Introduction Opportunities:** Suggest valuable connections between contacts
- **Career Move Prediction:** Early signals of job changes or company moves
- **Event Attendance Suggestions:** Which networking events your contacts might attend

### 5. Enhanced User Experience

#### Conversation Memory
- **Topic Tracking:** Remember what you discussed and suggest follow-up topics
- **Interest Mapping:** Build profiles of contacts' professional interests and goals
- **Project Tracking:** Follow up on mentioned projects, initiatives, or challenges
- **Personal Details:** Remember family, hobbies, and personal interests for warmer conversations

#### Smart Notifications
- **Priority-Based Alerts:** Only interrupt for high-value opportunities
- **Batched Suggestions:** Daily digest of networking actions rather than constant pings
- **Context-Aware Timing:** Deliver suggestions when you're most likely to act
- **Success Feedback Loop:** Learn from which suggestions you act on

### 6. Integration Architecture

#### API Integrations Required:
- **LinkedIn API:** Profile data, activity feed, messaging
- **Google Calendar/Outlook:** Meeting data, scheduling
- **Gmail/Outlook APIs:** Email analysis, sending
- **OpenAI/Claude:** Message generation and timing intelligence
- **Company databases:** Crunchbase, LinkedIn Company Pages for business context

##### Meeting Recording Platform APIs:
- **Zoom API:** Cloud recordings, transcripts, meeting metadata, participant data
- **Granola API:** AI-generated meeting summaries and insights
- **Otter.ai API:** Real-time transcription, speaker identification, highlights
- **Grain API:** Video clips, key moments, conversation intelligence
- **Gong API:** Sales conversation analytics and coaching insights
- **Google Meet API:** Basic meeting data through Workspace integration
- **Microsoft Teams API:** Meeting recordings through Graph API
- **Whisper API:** For local transcription of uploaded recordings
- **Assembly AI:** Advanced audio intelligence for uploaded files

#### Data Privacy & Security:
- **Local-First Architecture:** Sensitive data stays on device
- **Encrypted Sync:** End-to-end encryption for cloud backup
- **Minimal Data Collection:** Only store what's necessary for functionality
- **User Control:** Granular privacy settings for each integration

## API Integration Requirements

### 1. Meeting Recording Platform APIs

#### Zoom API Integration
**Endpoint:** `https://api.zoom.us/v2/`
- **Authentication:** OAuth 2.0 with PKCE for mobile apps
- **Required Scopes:**
  - `meeting:read` - Access meeting details
  - `recording:read` - Access cloud recordings
  - `user:read` - Basic user information
- **Key Endpoints:**
  - `GET /users/{userId}/recordings` - List recordings
  - `GET /meetings/{meetingId}/recordings` - Get meeting recordings
  - `GET /meetings/{meetingId}` - Meeting details and participants
- **Rate Limits:** 2,000 requests/day (can request increase)
- **Webhook Support:** Real-time notifications for new recordings
- **Cost:** Free tier available, paid plans for higher limits
- **Data Format:** MP4 video, M4A audio, VTT transcripts

#### Granola API Integration  
**Endpoint:** `https://api.granola.ai/v1/`
- **Authentication:** API Key-based authentication
- **Required Permissions:**
  - Meeting summaries access
  - AI insights and analysis
  - Action item extraction
- **Key Endpoints:**
  - `POST /meetings/upload` - Upload meeting recording
  - `GET /meetings/{id}/summary` - Get AI-generated summary
  - `GET /meetings/{id}/insights` - Get meeting insights
  - `GET /meetings/{id}/action-items` - Extract action items
- **Rate Limits:** 100 requests/hour (varies by plan)
- **Processing Time:** 2-5 minutes for analysis
- **Cost:** Usage-based pricing per meeting processed
- **Data Format:** JSON responses with structured insights

#### Otter.ai API Integration
**Endpoint:** `https://otter.ai/forward/api/v1/`
- **Authentication:** OAuth 2.0 or API Key
- **Required Scopes:**
  - `read:transcripts` - Access transcriptions
  - `read:summaries` - Access AI summaries
- **Key Endpoints:**
  - `GET /speeches` - List all transcripts
  - `GET /speeches/{id}` - Get specific transcript
  - `GET /speeches/{id}/summary` - Get summary
- **Rate Limits:** 600 requests/hour
- **Real-time:** WebSocket support for live transcription
- **Cost:** Tiered pricing based on transcription hours
- **Data Format:** JSON with timestamps and speaker identification

#### Grain API Integration
**Endpoint:** `https://api.grain.co/v1/`
- **Authentication:** OAuth 2.0
- **Required Scopes:**
  - `recordings:read` - Access meeting recordings
  - `highlights:read` - Access video highlights
- **Key Endpoints:**
  - `GET /recordings` - List recordings
  - `GET /recordings/{id}/highlights` - Get key moments
  - `GET /recordings/{id}/transcript` - Get transcript
- **Rate Limits:** 1,000 requests/hour
- **Features:** Video clip generation, moment detection
- **Cost:** Per-seat pricing model
- **Data Format:** Video clips (MP4) and JSON metadata

#### Gong API Integration
**Endpoint:** `https://api.gong.io/v2/`
- **Authentication:** OAuth 2.0 (Enterprise requirement)
- **Required Scopes:**
  - `api:calls:read:basic` - Basic call information
  - `api:calls:read:extensive` - Detailed call analytics
- **Key Endpoints:**
  - `GET /calls` - List calls/meetings
  - `GET /calls/{id}` - Get call details and insights
  - `GET /calls/{id}/transcript` - Get transcript
- **Rate Limits:** 3,000 requests/day
- **Features:** Sales conversation intelligence
- **Cost:** Enterprise-level pricing
- **Data Format:** Comprehensive JSON analytics

### 2. Communication Platform APIs

#### LinkedIn API Integration
**Endpoint:** `https://api.linkedin.com/v2/`
- **Authentication:** OAuth 2.0 with LinkedIn Login
- **Required Scopes:**
  - `r_liteprofile` - Basic profile information
  - `r_emailaddress` - Email address
  - `w_member_social` - Share content and send messages
- **Key Endpoints:**
  - `GET /people/~` - Current user profile
  - `GET /people/{person-id}` - Contact profiles
  - `POST /messaging/conversations` - Send messages
  - `GET /shares` - Activity feed (limited)
- **Rate Limits:** Varies by endpoint (100-500/day typical)
- **Limitations:** Restricted API access, requires partnership for full features
- **Cost:** Free for basic use, partner fees for advanced access
- **Data Format:** JSON with LinkedIn-specific schemas

#### Gmail API Integration
**Endpoint:** `https://gmail.googleapis.com/gmail/v1/`
- **Authentication:** OAuth 2.0 with Google Sign-In
- **Required Scopes:**
  - `gmail.readonly` - Read emails
  - `gmail.send` - Send emails
  - `gmail.compose` - Create drafts
- **Key Endpoints:**
  - `GET /users/{userId}/messages` - List messages
  - `GET /users/{userId}/messages/{id}` - Get message
  - `POST /users/{userId}/messages/send` - Send message
- **Rate Limits:** 1 billion quota units/day (varies by operation)
- **Features:** Thread analysis, attachment handling
- **Cost:** Free with Google account
- **Data Format:** RFC 2822 email format in JSON

#### Outlook API Integration
**Endpoint:** `https://graph.microsoft.com/v1.0/`
- **Authentication:** OAuth 2.0 with Microsoft identity platform
- **Required Scopes:**
  - `Mail.Read` - Read user mail
  - `Mail.Send` - Send mail as user
  - `Contacts.Read` - Read contacts
- **Key Endpoints:**
  - `GET /me/messages` - List messages
  - `POST /me/sendMail` - Send message
  - `GET /me/contacts` - Get contacts
- **Rate Limits:** 10,000 requests/10 minutes
- **Features:** Advanced query capabilities
- **Cost:** Free with Microsoft account
- **Data Format:** OData JSON responses

### 3. Calendar Platform APIs

#### Google Calendar API
**Endpoint:** `https://www.googleapis.com/calendar/v3/`
- **Authentication:** OAuth 2.0 with Google Sign-In
- **Required Scopes:**
  - `calendar.readonly` - Read calendar events
  - `calendar.events` - Manage events
- **Key Endpoints:**
  - `GET /calendars/{calendarId}/events` - List events
  - `GET /calendars/{calendarId}/events/{eventId}` - Get event
  - `POST /calendars/{calendarId}/events` - Create event
- **Rate Limits:** 1,000,000 queries/day
- **Features:** Meeting participant extraction, location data
- **Cost:** Free with Google account
- **Data Format:** JSON with RFC 3339 timestamps

#### Outlook Calendar API
**Endpoint:** `https://graph.microsoft.com/v1.0/`
- **Authentication:** OAuth 2.0 with Microsoft identity platform
- **Required Scopes:**
  - `Calendars.Read` - Read calendars
  - `Calendars.ReadWrite` - Modify calendars
- **Key Endpoints:**
  - `GET /me/events` - List events
  - `GET /me/events/{id}` - Get event details
  - `POST /me/events` - Create event
- **Rate Limits:** 10,000 requests/10 minutes
- **Features:** Teams meeting integration
- **Cost:** Free with Microsoft account
- **Data Format:** OData JSON with ISO 8601 timestamps

### 4. AI and Intelligence APIs

#### OpenAI API Integration
**Endpoint:** `https://api.openai.com/v1/`
- **Authentication:** Bearer token (API Key)
- **Key Endpoints:**
  - `POST /chat/completions` - GPT-4 conversations
  - `POST /audio/transcriptions` - Whisper transcription
  - `POST /embeddings` - Text embeddings for similarity
- **Rate Limits:** Varies by model and tier
- **Features:** Message generation, meeting analysis, sentiment analysis
- **Cost:** Token-based pricing ($0.03/1K tokens for GPT-4)
- **Data Format:** JSON with structured responses

#### Claude API Integration (Anthropic)
**Endpoint:** `https://api.anthropic.com/v1/`
- **Authentication:** x-api-key header
- **Key Endpoints:**
  - `POST /messages` - Claude conversations
  - `POST /complete` - Text completions
- **Rate Limits:** 1,000 requests/minute (varies by tier)
- **Features:** Long-context analysis, nuanced relationship insights
- **Cost:** Input/output token pricing
- **Data Format:** JSON responses

#### Assembly AI Integration
**Endpoint:** `https://api.assemblyai.com/v2/`
- **Authentication:** API Key in authorization header
- **Key Endpoints:**
  - `POST /upload` - Upload audio file
  - `POST /transcript` - Start transcription
  - `GET /transcript/{id}` - Get results
- **Rate Limits:** Concurrent processing limits
- **Features:** Speaker diarization, sentiment analysis, topic detection
- **Cost:** Per-hour transcription pricing
- **Data Format:** JSON with detailed audio intelligence

### 5. Business Intelligence APIs

#### Crunchbase API
**Endpoint:** `https://api.crunchbase.com/api/v4/`
- **Authentication:** User Key parameter
- **Key Endpoints:**
  - `GET /entities/organizations/{permalink}` - Company data
  - `GET /entities/people/{permalink}` - Person data
  - `GET /searches/organizations` - Search companies
- **Rate Limits:** 200 requests/minute
- **Features:** Company funding, news, key people
- **Cost:** Tiered API access pricing
- **Data Format:** JSON with comprehensive business data

### 6. Implementation Architecture

#### API Management Strategy
```swift
protocol APIIntegration {
    var baseURL: String { get }
    var authenticationMethod: AuthMethod { get }
    var rateLimits: RateLimit { get }
    var requiredScopes: [String] { get }
    
    func authenticate() async throws -> AuthToken
    func makeRequest<T: Codable>(_ endpoint: Endpoint) async throws -> T
    func handleRateLimit(_ error: RateLimitError) async throws
}

enum AuthMethod {
    case oauth2(clientId: String, scopes: [String])
    case apiKey(String)
    case bearerToken(String)
}

struct RateLimit {
    let requestsPerHour: Int
    let requestsPerDay: Int
    let burstLimit: Int?
    let resetWindow: TimeInterval
}
```

#### Error Handling & Resilience
- **Retry Logic:** Exponential backoff for transient failures
- **Circuit Breakers:** Prevent cascade failures across integrations
- **Fallback Strategies:** Graceful degradation when APIs unavailable
- **Offline Support:** Cache critical data for offline functionality
- **Rate Limit Management:** Intelligent queuing and request spacing

#### Security Considerations
- **Token Storage:** Secure Keychain storage for all API credentials
- **Token Refresh:** Automatic OAuth token renewal
- **Scope Minimization:** Request only necessary permissions
- **Data Encryption:** End-to-end encryption for sensitive API responses
- **API Key Rotation:** Support for regular credential rotation

#### Monitoring & Analytics
- **API Health Monitoring:** Track success rates and response times
- **Usage Analytics:** Monitor API quota consumption
- **Error Tracking:** Detailed logging for integration failures
- **Performance Metrics:** Latency and throughput monitoring
- **Cost Tracking:** Monitor API usage costs across all integrations

### 7. Success Metrics for MLP

#### Behavioral Impact:
- **Message Send Rate:** Increase from current baseline
- **Response Rates:** Higher engagement from AI-recommended messages
- **Relationship Maintenance:** Reduced relationship churn rate
- **Follow-Up Completion:** % of AI suggestions that result in actual outreach
- **Time to Action:** Reduced friction in reaching out to contacts

#### Intelligence Effectiveness:
- **Message Relevance Score:** User ratings of AI suggestions
- **Timing Accuracy:** Success rate of optimal timing predictions
- **Integration Usage:** Adoption of LinkedIn, calendar, email features
- **Relationship Health:** Improved scores over time with AI guidance

#### Meeting Intelligence Metrics:
- **Meeting Processing Accuracy:** Quality of transcripts, summaries and extracted insights
- **Action Item Completion Rate:** % of meeting-generated action items completed
- **Follow-Up Impact:** Response rates to meeting-based follow-up messages
- **Meeting Context Utilization:** How often meeting insights are leveraged in future interactions
- **Meeting Platform Integration:** % of meetings successfully captured and processed
- **Relationship Development Velocity:** Speed of relationship progression with meeting intelligence

## Additional MLP Suggestions

### 8. Voice-First Interactions
- **Voice Message Composition:** Speak messages, AI converts to polished text
- **Siri Integration:** "Remind me to follow up with John about the startup discussion"
- **Voice Notes Processing:** AI extracts action items and contact updates from voice memos

### 9. Team/Organization Features
- **Relationship Handoffs:** Transfer contact context when changing roles
- **Team Introductions:** Help colleagues connect with your network appropriately
- **Shared Contact Intelligence:** Aggregate insights across team members (with permission)

### 10. Advanced Automation
- **Auto-Introduction Facilitation:** AI identifies and suggests valuable connections
- **Event-Based Automation:** Automatic outreach triggers based on news, LinkedIn activity, job changes
- **Content Sharing Engine:** Share relevant articles/resources with appropriate contacts automatically

### 11. Analytics & Insights
- **Networking ROI Dashboard:** Track career opportunities, partnerships, referrals from network
- **Influence Mapping:** Identify key connectors and influencers in your network
- **Geographic/Industry Analysis:** Visualize network distribution and gaps
- **Relationship Lifecycle Analytics:** Understand patterns in your networking effectiveness

## Future Enhancements (v3+)

### Advanced Intelligence Layer
- **Personality Analysis:** Adapt communication style to individual preferences
- **Industry Trend Integration:** Leverage current events for conversation starters
- **Network Effect Optimization:** Maximize introductions and referrals
- **Predictive Networking:** Suggest new connections before you need them

### Enterprise Features
- **CRM Integration:** Bidirectional sync with Salesforce, HubSpot, etc.
- **Team Networking Insights:** Collective relationship intelligence
- **Compliance Features:** Industry-specific communication guidelines
- **Advanced Analytics:** Custom reporting and relationship ROI tracking

## Risk Mitigation

### User Adoption Risks
- **Risk:** Users abandon after initial download
- **Mitigation:** Obsessive focus on first-time user experience

### Privacy Concerns
- **Risk:** Users worry about contact data privacy
- **Mitigation:** Local-first storage, clear privacy messaging, no data sharing

### Habit Formation Risks
- **Risk:** Users don't develop consistent usage
- **Mitigation:** Smart notifications, gamification, minimal friction

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
