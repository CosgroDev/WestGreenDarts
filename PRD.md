# West Green Darts - Product Requirements Document

## 1. Executive Summary

West Green Darts is a mobile-first web application designed to manage a single darts team's fixtures, games, player profiles, and comprehensive statistics. The application provides a simple, intuitive interface for tracking 501 games, managing seasonal fixtures, and analyzing player and team performance.

## 2. Product Vision

Create a streamlined, mobile-optimized darts team management platform that enables West Green Darts team administrators to:
- Manage team fixtures across multiple seasons
- Track live game scores with intelligent finish guidance
- Maintain detailed player profiles and statistics
- Analyze team and individual performance metrics
- Export data for external analysis

## 3. Target Users

**Primary User**: West Green Darts team administrator and players (~15 team members)
**User Context**: Live game scoring during matches, post-game analysis, season planning

## 4. Core Features

### 4.1 Authentication
- **PIN-based Access**: Simple numeric PIN entry (no traditional login/registration)
- **Single Access Point**: No multi-user authentication - team-wide access
- **Session Management**: Persist session to avoid repeated PIN entry

### 4.2 Player Management
**Player Profile**:
- Player name
- Player photograph/avatar (optional)
- Darts equipment profile:
  - Dart model/type
  - Stem length
  - Flight type/design
- Registration date
- Active/inactive status

**Player Capacity**: Support for ~15 active players with ability to expand

### 4.3 Season & Fixture Management

**Season Structure**:
- Season naming: Format "YY/YY" (e.g., "25/26", "26/27")
- Multiple seasons supported
- Current season highlighting

**Fixture Management**:
- Create fixtures for a season
- Set fixture details:
  - Date and time
  - Home/Away designation
  - Opponent team name
  - Venue (optional)
  - Notes (optional)
- View fixtures in season overview
- Click into individual fixtures for game management

### 4.4 Game Management

**Game Setup** (within a fixture):
- Add multiple games per fixture
- Live game selection (drawn during match):
  - Select West Green player from dropdown
  - Enter opponent player name (free text)
- Game format: 501 (double-out)

**Live Scoring**:
- Intuitive score entry interface (inspired by n01darts.com)
- Real-time score tracking
- Automatic score calculation (remaining score)
- **Undo functionality**: Ability to revert incorrect score entries
- **Finish Guidance**:
  - When player is on a finish, display optimal checkout combinations
  - Visual guidance for best possible routes
- Leg tracking within each game
- Automatic game completion when player reaches zero

**Score Tracking Per Throw**:
- Individual dart scores
- Three-dart visit totals
- Running average calculation
- Checkout attempts and success

### 4.5 Statistics Tracking

The application must track and calculate the following statistics per player:

**Basic Statistics**:
- **Legs**: Total legs played and won
- **3 Darts Average**: Overall three-dart average across all games
- **First 9 Average**: Average of first three visits (9 darts) per leg

**Score Distribution**:
- **60+ scores**: Count of visits scoring 60 or more
- **80+ scores**: Count of visits scoring 80 or more
- **100+ scores**: Count of visits scoring 100 or more (tons)
- **120+ scores**: Count of visits scoring 120 or more
- **140+ scores**: Count of visits scoring 140 or more
- **170+ scores**: Count of visits scoring 170 or more
- **180s**: Count of maximum scores (180)

**Finish Statistics**:
- **High Finish**: Highest successful checkout
- **100+ Finishes**: Count of checkouts 100 or greater
- **Best Leg**: Fewest darts used to complete a leg
- **Worst Leg**: Most darts used to complete a leg

**Performance Metrics**:
- **Checkout %**: Percentage of checkout opportunities successfully completed
- **Checkout Prediction %**: Predicted checkout success rate based on performance
- **Keep %**: Percentage of legs won when starting (serving first)
- **Keep Prediction %**: Predicted keep percentage
- **Break %**: Percentage of legs won when opponent starts
- **Break Prediction %**: Predicted break percentage

**Team Statistics**:
- Aggregate all player statistics at team level
- Team win/loss record
- Team average statistics
- Season-by-season team performance

### 4.6 Dashboard & Analytics

**Player Dashboard**:
- Individual player statistics view
- Filterable by:
  - Season
  - Date range
  - Opponent
  - Home/Away
- Visual charts and graphs:
  - Average progression over time
  - Score distribution
  - Checkout percentage trends
  - Performance heatmaps

**Team Dashboard**:
- Team-wide aggregate statistics
- Season comparison views
- Fixture results overview
- Top performers by category

**Data Export**:
- Export player statistics (CSV/Excel)
- Export team statistics (CSV/Excel)
- Export fixture results (CSV/Excel)
- Export game-by-game data for detailed analysis

### 4.7 Mobile-First Design

**Responsive Design Principles**:
- Touch-optimized interface
- Large, easily tappable buttons
- Minimal text input (prefer dropdowns/selections)
- Portrait and landscape orientation support
- Fast load times on mobile networks

**Progressive Web App (PWA) Features**:
- Installable on mobile home screen
- Offline capability for live scoring
- Sync data when connection restored

## 5. Technical Requirements

### 5.1 Technology Stack

**Frontend**:
- React with TypeScript
- Mobile-first responsive design
- Modern UI component library (shadcn/ui or Material-UI)
- PWA capabilities

**Backend**:
- Node.js/Express API or Next.js API routes
- RESTful API design

**Database**:
- SQLite (for simplicity) or PostgreSQL (for scalability)
- Local storage for offline capability

**Hosting**:
- Vercel, Netlify, or similar platform
- HTTPS required
- Custom domain support

### 5.2 Data Persistence

- All game data must be persistently stored
- Automatic backup mechanism
- Data integrity validation
- Migration support for schema updates

### 5.3 Performance Requirements

- Page load time: < 2 seconds on 4G
- Score entry responsiveness: < 100ms
- Support for offline scoring with background sync
- Concurrent game tracking (multiple games in parallel)

## 6. User Flows

### 6.1 Initial Access
1. User navigates to application URL
2. PIN entry screen displayed
3. User enters PIN
4. Dashboard displayed on successful authentication

### 6.2 Creating a Season & Fixtures
1. Navigate to "Seasons" section
2. Create new season (e.g., "25/26")
3. Within season, create fixtures
4. Set fixture details (date, opponent, home/away)
5. Save fixture

### 6.3 Live Game Scoring
1. Navigate to specific fixture
2. Add new game within fixture
3. Select West Green player from dropdown
4. Enter opponent player name
5. Begin scoring:
   - Enter score for each visit (3 darts)
   - View finish guidance when on a checkout
   - Use undo if incorrect score entered
   - System tracks all statistics automatically
6. Complete game when player reaches zero
7. View game summary and statistics

### 6.4 Viewing Statistics
1. Navigate to Dashboard
2. Select player or team view
3. Apply filters (season, date range, etc.)
4. View statistics and charts
5. Export data if needed

## 7. Non-Functional Requirements

### 7.1 Usability
- Intuitive navigation requiring minimal training
- Clear visual hierarchy
- Consistent UI patterns throughout
- Accessibility compliance (WCAG 2.1 AA)

### 7.2 Reliability
- 99.5% uptime target
- Automatic error recovery
- Data backup and recovery mechanisms

### 7.3 Security
- PIN stored securely (hashed)
- HTTPS only
- Protection against common web vulnerabilities
- Regular security updates

### 7.4 Maintainability
- Clean, documented code
- Modular architecture
- Automated testing (unit and integration)
- Clear deployment documentation

## 8. Future Enhancements (Out of Scope for v1)

- Multi-team support
- Player-to-player messaging
- Tournament bracket management
- Practice mode with AI opponents
- Social sharing of achievements
- Integration with dart scoring hardware
- Video recording integration
- Advanced analytics (ML-based predictions)
- Multi-language support

## 9. Success Metrics

- Application adoption by all 15 team members
- 100% of fixtures tracked digitally
- Average game scoring time < 15 minutes
- User satisfaction score > 4/5
- Zero data loss incidents
- Export feature used at least monthly

## 10. Timeline & Milestones

**Phase 1: Foundation (Weeks 1-2)**
- Project setup and infrastructure
- PIN authentication
- Player management
- Basic navigation

**Phase 2: Core Functionality (Weeks 3-4)**
- Season and fixture management
- Live 501 game scoring
- Basic statistics calculation
- Undo functionality

**Phase 3: Advanced Features (Weeks 5-6)**
- Finish guidance system
- Comprehensive statistics tracking
- Dashboard and visualizations
- Data export

**Phase 4: Polish & Launch (Week 7)**
- Mobile optimization
- Performance tuning
- User acceptance testing
- Deployment

## 11. Appendix

### 11.1 Glossary

- **501**: Standard darts game starting at 501 points, counting down to zero with double-out requirement
- **Leg**: A single game of 501
- **Visit**: A turn consisting of three dart throws
- **Checkout**: The final throw(s) to reach exactly zero and win the leg
- **Ton**: Score of 100 or more in a single visit
- **Keep**: Winning a leg when starting first
- **Break**: Winning a leg when opponent starts first
- **First 9**: The first three visits (9 darts) of a leg

### 11.2 Finish Guidance Reference

The application should provide optimal checkout suggestions for scores from 2-170, including:
- Common finishes (e.g., 170: T20-T20-Bull)
- Alternative routes for missed darts
- Probability-weighted suggestions based on player skill

### 11.3 Calculation Formulas

**3 Darts Average**: Total points scored ÷ Total visits × 3

**First 9 Average**: Sum of first 3 visits per leg ÷ Number of legs × 3

**Checkout %**: Successful checkouts ÷ Total checkout opportunities × 100

**Keep %**: Legs won when starting ÷ Total legs started × 100

**Break %**: Legs won when not starting ÷ Total legs not started × 100

---

**Document Version**: 1.0
**Last Updated**: 2026-01-22
**Author**: West Green Darts Team
**Status**: Approved for Development
