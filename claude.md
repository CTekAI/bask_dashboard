# Project overview
- Name: Bask Management Dashboard
- One‑sentence description: A real-time management dashboard for Bask that surfaces revenue, occupancy, guest behavior, and staff accountability metrics so Greg and his team can make data-driven decisions.
- Primary users: Greg (owner), Bastion (F&B manager), department heads, and selected supervisors.
- Tech stack: FILL_ME_IN (e.g. React dashboard frontend + API backend + data warehouse/DB + ETL).

# Goals and non-goals
- Optimize for: clear visibility, staff accountability, and fast, phone-friendly access to key metrics.
- This project exists to:
  - Replace gut-feel decisions with measurable, objective metrics.
  - Reduce dependence on manual reports and “asking around” for numbers.
  - Highlight underperformance early (menu items, staff, operations) so action can be taken.
- Non-goals:
  - This is not a full PMS or POS system; it consumes data from those systems.
  - Do not overcomplicate UX with BI-level drilldowns unless they serve Greg’s real use cases.

# Core metric domains

## Revenue & sales analytics
The dashboard must provide:
- Food & beverage sales by category: identify what’s selling well vs. what’s “bombing out”.
- Real-time daily and weekly revenue figures, optimized to be pulled quickly on a phone.
- Occupancy rates by time period (day/week/month), to spot trends and seasonality.
- F&B covers per day: easily answer “How many covers did we do today at Bask?”

Key expectations:
- Ability to quickly see top/bottom performing menu items and categories.
- Simple visual cues (e.g. red/green, arrows, or badges) for underperforming vs. overperforming items.

## Staff performance & accountability
The dashboard should enable objective performance management:
- Individual staff metrics aligned to their contracts and roles.
- Room cleaning timelines (via Flexkeeping or equivalent): how long each clean takes.
- Room inspection compliance: which rooms were inspected before checkout and which were not.
- Error/defect rates related to staff performance quality (e.g. missed inspections, guest complaints tied to staff or process).

Key expectations:
- Ability to see which staff are consistently hitting KPIs vs. underperforming.
- Focus on **measurable** metrics, not subjective ratings.
- Support for coaching, not just punishment: trends, not one-off incidents.

## Guest & customer intelligence
The dashboard should give insight into guest behavior and value:
- Guest segmentation:
  - By nationality.
  - By spend level.
  - By visit frequency.
  - By notable preferences or special requests.
- High-value guest identification:
  - Who is spending the most, and what they buy.
  - Their preferences and typical behaviors.
- Guest spending during events:
  - Real-time tracking of what high-value guests are buying during key events.
- Repeat guest patterns:
  - Visit frequency, length of stay, and behaviors that matter for upsell/care.

Key expectations:
- Support targeted upselling and personalized experiences.
- Quickly answer questions like “Which VIPs are on property and what do they usually order?”

## Operational tracking
The dashboard should expose operational discipline:
- Rental equipment tracking:
  - Bicycle checkouts and returns.
  - Snorkeling gear and towel rentals.
- SOP compliance:
  - Are standard procedures being followed (e.g. room checks, cleaning, F&B steps)?
- Booking/inquiry sources:
  - Breakdown of where inquiries/bookings come from (WhatsApp, ads, OTAs, direct, etc.).
- Sales leads per day and conversion rates:
  - How many leads came in, how many converted, and through which channels.

Key expectations:
- Quick overview of operational bottlenecks and leakages.
- Clear trail of responsibility for missed SOPs or lost rentals.

# Dashboard characteristics & UX principles

## Access and usability
- Must be easy to use on a phone:
  - Fast-loading.
  - Mobile-responsive views for key KPIs.
  - Minimal number of taps to reach “headline” metrics.
- Home view:
  - Present a small set of “command center” KPIs Greg cares about most (e.g. today’s revenue, covers, occupancy, alerts).
- Views for specific roles:
  - Greg: cross-business snapshot and high-level KPIs.
  - Bastion (F&B manager): deep dive into F&B sales, menu performance, and staff metrics.
  - Other leaders: tailored views for their area without overwhelming them.

## Real-time data & automation
- Real-time or near-real-time data wherever technically feasible.
- Automated reporting:
  - No expectation for staff to manually compile spreadsheets or reports.
  - Regular scheduled summaries (e.g. daily/weekly digest) surfaced inside the dashboard or via notifications.
- Goal: reduce reliance on manual updates and “Hey, can you send me the numbers?” messages.

## Notifications & alerts
- Push-style notifications/alerts when:
  - Menu items or categories are “bombing out” month after month.
  - KPIs fall below defined thresholds (e.g. low inspection compliance, repeated SOP failures).
  - High-value or VIP guests are on-site, with relevant notes.
- Alerts should be:
  - Actionable and not noisy.
  - Tunable: thresholds and alert rules configurable over time.

## AI-powered insights
- Built-in question-answering capability:
  - Example queries: “How many covers today?”, “Which items are underperforming this month?”, “Which staff are missing KPIs?”.
- Natural language interface:
  - Allow Greg and managers to type or speak simple questions and receive clear answers backed by dashboard data.
- Guardrails:
  - AI should not hallucinate; it should base answers on available data.
  - For missing/ambiguous data, it should say what’s missing rather than guessing.

# Key philosophy & decision principles

The entire system should reflect Greg’s philosophy:
- Data over opinion:
  - Prioritize metrics and trends over gut feel or subjective impressions.
- Accountability:
  - Make it easy to see who is responsible for outcomes (good or bad).
  - Support coaching by highlighting patterns, not just individual failures.
- Visibility:
  - Provide a coherent view across F&B, rooms, operations, and guest behavior.
  - Allow key people (Greg, Bastion, others) to get answers without asking multiple staff.

Design principles:
- Highlight:
  - Underperforming menu items.
  - Staff not hitting KPIs.
  - Real-time operational compliance gaps.
  - Guest behavior patterns that create upsell opportunities.
- Keep the UI focused:
  - Avoid clutter and “data dumps”.
  - Every chart or table should answer a real management question.

# Data sources & integrations (to be refined)
(Adjust and expand this section as sources are confirmed.)
- POS / F&B system: item-level sales, categories, checks, covers.
- PMS / booking engine: occupancy, room status, guest profiles, bookings.
- Flexkeeping (or similar): cleaning times, inspection logs, room status trails.
- CRM / guest database: visit history, segmentation, preferences.
- Lead/communication channels: WhatsApp, ads platforms, OTAs, direct booking system.

Guidelines:
- Clearly document each integration, its sync frequency, and its reliability.
- Tag metrics in the UI with their source system when helpful.

# Implementation preferences (for the assistant)
- Before building features:
  - Restate the feature in business terms (what question it answers for Greg).
  - Outline the data required and where it comes from.
- When proposing UI:
  - Keep mobile use in mind (small number of key widgets per screen).
  - Focus on clarity over aesthetics; aesthetics matter, but comprehension wins.
- When designing data models:
  - Align entities to real-world concepts Greg cares about (guest, staff member, cover, booking, event, menu item, rental).
  - Make it easy to compute the KPIs defined above.
- Do not:
  - Introduce unnecessary complexity or generic analytics for their own sake.
  - Implement speculative features that don’t map to a concrete management question.

# Updating this file
- Treat this file as the source of truth for:
  - What the dashboard is for.
  - What metrics matter and why.
  - How AI and automation should behave.
- Update it when:
  - New metric requirements emerge from meetings.
  - Old metrics are no longer useful.
  - Data sources change or new integrations are added.
- Keep it concise:
  - Remove outdated requirements and avoid duplicating details that live in other design docs.
