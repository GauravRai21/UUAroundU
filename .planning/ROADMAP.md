# Roadmap: Around You

## Overview

Migrating the legacy CampusConnect Pro (Vite/React/MongoDB) to a modern Next.js (App Router), TypeScript, and Supabase stack. This journey moves through database foundation, core social features, user profiles, and finally real-time chat refactoring.

## Phases

- [ ] **Phase 1: Foundation & Supabase Integration** - Initialize Next.js and migrate data layer to Supabase.
- [ ] **Phase 2: Social Feed & Posts** - Port core social interaction with dynamic feeds and rich posts.
- [ ] **Phase 3: User Profiles & Social Graph** - Migrate profiles and implement following system.
- [ ] **Phase 4: Real-Time Chat & Refactor** - Refactor Socket.io client and implement 1-to-1/group chat.

## Phase Details

### Phase 1: Foundation & Supabase Integration
**Goal**: Deliver a working Next.js scaffold with Supabase Auth and DB ready for data.
**Depends on**: Nothing
**Requirements**: AUTH-01, AUTH-02, AUTH-03
**Success Criteria**:
  1. User can register and log in via Supabase.
  2. Authenticated user has a valid session and community UID association.
  3. Database schema for profiles and posts is initialized in Supabase.
**Plans**: 2 plans

Plans:
- [ ] 01-01: Initialize Next.js TS project and Supabase client
- [ ] 01-02: Implement Supabase Auth flow and community UID assignment

### Phase 2: Social Feed & Posts
**Goal**: Functional social feed with post creation capabilities.
**Depends on**: Phase 1
**Requirements**: FEED-01, FEED-02, FEED-03, FEED-04
**Success Criteria**:
  1. User can view "For You", "Nearby", and "Trending" feeds.
  2. User can create text and image posts.
  3. Polls and emergency alerts are functional within the feed.
**Plans**: 2 plans

Plans:
- [ ] 02-01: Port feed logic and dynamic tab filtering
- [ ] 02-02: Implement post creation (text, image, polls, alerts) with Supabase storage

### Phase 3: User Profiles & Social Graph
**Goal**: Personalization and social connections active.
**Depends on**: Phase 2
**Requirements**: PROF-01, PROF-02
**Success Criteria**:
  1. User can update bio and avatar.
  2. User can follow/unfollow other users with immediate UI feedback.
**Plans**: 1 plan

Plans:
- [ ] 03-01: Port profile management and social graph (follow) logic

### Phase 4: Real-Time Chat & Refactor
**Goal**: High-fidelity real-time communication restored.
**Depends on**: Phase 3
**Requirements**: CHAT-01, CHAT-02
**Success Criteria**:
  1. User can send and receive 1-to-1 messages in real-time.
  2. Group chat functionality supports multiple participants with live updates.
  3. Socket.io logic is refactored to be stable within Next.js App Router boundaries.
**Plans**: 2 plans

Plans:
- [ ] 04-01: Refactor Socket.io client integration for Next.js
- [ ] 04-02: Implement 1-to-1 and group chat UI with real-time connectivity

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Not started | - |
| 2. Social Feed | 0/2 | Not started | - |
| 3. User Profiles | 0/1 | Not started | - |
| 4. Real-Time Chat | 0/2 | Not started | - |
