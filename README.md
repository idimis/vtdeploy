# Event Management Platform - VibeTribe

## Objective
The main goal of this project is to develop an MVP (Minimum Viable Product) for an Event Management Platform that allows event organizers to create and promote events, while attendees can browse and register for those events. The platform will also feature an event review and rating system, as well as a referral program to encourage user engagement.

## Core Features

### 1. Event Discovery and Event Details
- Landing Page: A simple and responsive landing page showcasing a list of upcoming events.
- Event Browsing: Attendees can browse through a list of events, filter events based on categories (e.g., music, arts, food) or location, and view event details.
- Search & Pagination: Implement a search bar with debounce functionality, event filters, and pagination to enhance user experience when browsing events.
- Ticket Purchase: Attendees can buy tickets for events directly from the event detail page.

### 2. Event Creation and Promotion
- Event Details: Organizers can create events by providing details like event name, price, date, time, location, description, available seats, and ticket types.
- Free & Paid Events: Events can be defined as free or paid. For paid events, attendees are charged according to the price set in the event's terms.
- Promotions & Discounts: Organizers can create promotions that include discount vouchers for a limited number of attendees. These promotions can be tied to a referral system or specific dates leading up to the event.
- Currency: All prices will be in IDR (Indonesian Rupiah).

### 3. Event Reviews and Ratings
- Review System: After attending an event, attendees can leave reviews and rate the event on a 5-star scale.
- Feedback: Attendees can provide written feedback regarding their overall experience, event quality, and suggestions for improvement.
- Public Display: Reviews and ratings will be publicly displayed on the event detail page for other users to view.

### 4. User Authentication and Authorization
- User Registration: Users must create an account to attend events. There are two types of user roles:
  - Customers/Participants: Users who can browse events, view event details, and purchase tickets.
  - Event Organizers/Promoters: Users who can create events and sell tickets.
- Referral Program: New users can register with a referral number provided by another user to receive a discount coupon.
  - Each time someone uses a referral number, the referrer earns points.
  - Referral points can be redeemed for discounts on ticket purchases.
- Role Protection: Pages are protected to ensure that users can only access content relevant to their role.

### 5. Referral Number, Points, and Prizes
- Referral System: When a user registers using a referral number, the referrer receives 10,000 points.
- Points Expiry: Points expire after 3 months. For example, if points are earned on December 28, 2023, they will expire on March 28, 2024.
- Points Redemption: Points can be redeemed to reduce the price of event tickets. For instance, if the ticket price is IDR 300,000 and the user has 20,000 points, they pay IDR 280,000.
- Discounts: Users who register using someone else's referral number get a 10% discount, valid for 3 months after registration.

### 6. Event Management Dashboard for Organizers
- Event Dashboard: Organizers can access a dashboard to view all their events, attendee registrations, and transaction history.
- Statistics & Reports: The dashboard will feature data visualizations (e.g., graphs, charts) showing event statistics, such as total attendees, revenue, and ticket sales.
  - Statistics should be available for various time ranges: daily, monthly, and yearly.
  - Reports can be downloaded for different time ranges (per year, per month, per day).

## Notes
- Protected Routes: All user roles (customers and event organizers) should have protected routes to ensure appropriate access control.
- Responsive Design: The platform must be fully responsive and work well on all device types (mobile, tablet, desktop).
- Search & Filter Debounce: Implement debounce functionality for the search bar to optimize performance when filtering events.
- Popup Confirmation: Implement popup dialogs to confirm actions, such as data modifications or event creation.
- Error Handling: Properly handle cases when no items are found based on search or filter criteria.
- SQL Transactions: Ensure that actions involving multiple database modifications (such as event creation and ticket sales) are handled using SQL transactions.
- Unit Testing: Create unit tests for all critical flows to ensure reliability and correctness of the platform.


