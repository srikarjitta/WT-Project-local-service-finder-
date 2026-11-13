# Local Service Finder (LSF) Platform

A modern, responsive frontend user interface for discovering, comparing, and contacting local businesses and service professionals. Inspired by the discovery experience of Justdial with a modern blue-and-white visual identity.

---

## 🎨 Design Theme — Blue and White

| Element | Hex Code | Purpose |
|---|---|---|
| **Main Background** | `#EFF6FF` | Soft, clean canvas tint |
| **Secondary Background** | `#DBEAFE` | Subtle contrast containers |
| **Primary Blue** | `#2563EB` | Royal blue for buttons and primary CTAs |
| **Dark Navy** | `#1E3A8A` | High-contrast headers and navigation banners |
| **Sky Blue** | `#38BDF8` | Accent highlights, active badges, and icons |
| **Cards** | `#FFFFFF` | Clean white cards with gentle shadows |
| **Main Text** | `#0F172A` | Deep slate for crystal-clear readability |
| **Secondary Text** | `#64748B` | Subtle metadata and labels |
| **Borders** | `#DBEAFE` | Consistent, gentle dividers |

---

## 🚀 Technology Stack

- **Next.js 14 (App Router)**
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui Design System & Custom Components**
- **Lucide React Icons**

---

## 📁 Key Pages & Features

### 1. Main Navigation Bar (`src/components/layout/Navbar.tsx`)
- Platform logo and branding (`LSF - Local Service Finder`).
- Interactive **Location Selector** (Khammam, Hyderabad, Bengaluru, Mumbai, Pune, Vijayawada).
- Integrated search bar for instant keyword queries.
- **Categories Mega Dropdown** linking to all 12 primary categories.
- **Auth Modals & Guest/Customer Switch**: Toggle between guest view and logged-in customer view.
- **Profile Menu**: Direct access to Dashboard, Enquiries, Favourites, and Profile.
- Fully responsive mobile drawer.

### 2. Homepage (`src/app/page.tsx`)
- **Hero Section**:
  - Heading: *"Find the Right Service Near You"*
  - Description: *"Discover trusted local businesses and professionals for your everyday needs."*
  - Dual-input search bar (City selector + Service keyword input).
  - Trending search pill tags & trust badges.
- **Popular Categories (12 Categories)**:
  1. Home Services
  2. Repairs & Maintenance
  3. Beauty & Wellness
  4. Automotive
  5. Healthcare
  6. Education
  7. Wedding & Events
  8. Real Estate
  9. Daily Needs
  10. Professional Services
  11. Travel
  12. Accommodation
- **Trending Services**: High-demand service cards with starting prices and provider counts.
- **Top-Rated Businesses**: Verified listings with 4.8★+ ratings, reviews, tags, and direct actions.
- **Recently Added Businesses**: New service providers and agencies.
- **How It Works**: 3-step interactive journey (Search, Explore, Contact).

### 3. Dedicated Search Results Page (`src/app/search/page.tsx`)
- Keyword search bar + quick category filter tags.
- Result counter & current location banner.
- **Filter Sidebar**:
  - Verified businesses toggle.
  - Category selector.
  - Minimum star rating radio filters (4.8★, 4.5★, 4.0★).
  - Price level selector (`$`, `$$`, `$$$`, `$$$$`).
  - Availability (All Hours vs Open Now).
  - Location/City dropdown.
- **Sorting Options**: Highest Rated, Most Reviewed, Name (A-Z).
- **View Modes**: Grid view & List view toggle.
- **Interactive Map View Modal**: Visual simulated city map with business markers and preview drawer.
- **Mobile Filter Drawer**: Full filter capabilities on smaller screens.

### 4. Business Details Page (`src/app/business/[id]/page.tsx`)
- Breadcrumb navigation.
- High-res cover image and verified partner badges.
- **Three Prominent Actions**:
  - **Call Now**: Interactive dial modal with click-to-call and number copy.
  - **WhatsApp**: Direct chat launch with pre-filled enquiry message.
  - **Send Enquiry**: Instant quote request modal with service selector, preferred date, and callback notes.
- Tabbed interface:
  - **Services & Pricing**: Rate cards with estimated duration and single-click quote triggers.
  - **About & Overview**: Company history, key statistics, verified contact information.
  - **Photo Gallery**: Full-screen lightbox gallery.
  - **Customer Reviews**: Rating breakdown, verified buyer reviews, and interactive **Write a Review** modal.
- Operating hours card with real-time "Open Now" / "Closed" status and today indicator.
- Address card with directions link.
- Mobile sticky bottom action bar.

### 5. Customer Dashboard (`src/app/dashboard/page.tsx`)
- Clean sidebar navigation:
  - **Dashboard Overview**: 4 KPI metric cards, recent enquiries status table, quick favourite cards.
  - **My Profile**: Editable customer profile (Name, Email, Phone, City, Address, Avatar).
  - **My Favourites**: Saved businesses grid with quick remove and direct call.
  - **My Enquiries**: Full status tracking (`Pending`, `Responded`, `Completed`) with provider response notes.
  - **My Reviews**: User-submitted reviews with edit/delete triggers.
  - **Settings**: WhatsApp updates, SMS notifications, email preferences, and password security.

---

## 🛠️ How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

