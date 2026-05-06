# Requirements

## v1 Requirements

### Authentication & Database (Supabase)
- [ ] **AUTH-01**: User can register and log in using Supabase Authentication.
- [ ] **AUTH-02**: User is assigned to a specific community based on a Unique ID.
- [ ] **AUTH-03**: Application data (posts, profiles, etc.) is stored and retrieved securely using Supabase.

### Social Feed
- [ ] **FEED-01**: User can view a dynamic feed separated by "For You", "Nearby", and "Trending" tabs.
- [ ] **FEED-02**: User can create standard text and image posts.
- [ ] **FEED-03**: User can create and participate in community polls.
- [ ] **FEED-04**: User can broadcast emergency alerts to their community.

### User Profiles
- [ ] **PROF-01**: User can set up and edit a profile with a bio and avatar.
- [ ] **PROF-02**: User can follow and unfollow other users within their community.

### Real-Time Chat (Socket.io separate server)
- [ ] **CHAT-01**: User can engage in 1-to-1 live chat with other users.
- [ ] **CHAT-02**: User can participate in live group chats.

## v2 Requirements (Deferred)

### Events System
- Create community events, view the calendar, and RSVP (Going/Interested).

### Marketplace
- Buy/sell items with category filters and price tags.

## Out of Scope

- **MongoDB** — We are migrating data storage to Supabase instead of keeping the legacy MongoDB setup.
- **WebSockets on Next.js API Routes** — Next.js serverless architecture does not natively support long-polling, so the WebSocket layer will remain in a separate Express + Socket.io repository.

## Traceability

| ID | Category | Phase | Status |
|----|----------|-------|--------|
| **AUTH-01** | Authentication | Phase 1 | [ ] |
| **AUTH-02** | Authentication | Phase 1 | [ ] |
| **AUTH-03** | Database | Phase 1 | [ ] |
| **FEED-01** | Social Feed | Phase 2 | [ ] |
| **FEED-02** | Social Feed | Phase 2 | [ ] |
| **FEED-03** | Social Feed | Phase 2 | [ ] |
| **FEED-04** | Social Feed | Phase 2 | [ ] |
| **PROF-01** | User Profiles | Phase 3 | [ ] |
| **PROF-02** | User Profiles | Phase 3 | [ ] |
| **CHAT-01** | Real-Time Chat | Phase 4 | [ ] |
| **CHAT-02** | Real-Time Chat | Phase 4 | [ ] |

