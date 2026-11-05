-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'business_owner', 'admin')),
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Profiles trigger for new auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. CATEGORIES TABLE
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  parent_id uuid references public.categories(id) on delete set null,
  created_at timestamptz default now() not null
);

-- 3. BUSINESSES TABLE
create table if not exists public.businesses (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete restrict not null,
  name text not null,
  slug text not null unique,
  tagline text,
  description text not null,
  phone text not null,
  whatsapp text,
  email text,
  website text,
  address text not null,
  locality text not null,
  city text not null,
  postal_code text not null,
  latitude double precision,
  longitude double precision,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  rejection_reason text,
  is_verified boolean not null default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_businesses_owner on public.businesses(owner_id);
create index if not exists idx_businesses_category on public.businesses(category_id);
create index if not exists idx_businesses_status on public.businesses(status);
create index if not exists idx_businesses_locality on public.businesses(city, locality);

-- 4. BUSINESS SERVICES TABLE
create table if not exists public.business_services (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  name text not null,
  description text,
  price_type text not null default 'fixed' check (price_type in ('fixed', 'range', 'contact')),
  price_min numeric(10,2),
  price_max numeric(10,2),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_services_business on public.business_services(business_id);

-- 5. BUSINESS IMAGES TABLE
create table if not exists public.business_images (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  storage_path text not null,
  url text not null,
  caption text,
  is_cover boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz default now() not null
);

create index if not exists idx_images_business on public.business_images(business_id);

-- 6. BUSINESS HOURS TABLE
create table if not exists public.business_hours (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  day_of_week integer not null check (day_of_week between 0 and 6),
  open_time time not null,
  close_time time not null,
  is_closed boolean not null default false,
  unique (business_id, day_of_week)
);

create index if not exists idx_hours_business on public.business_hours(business_id);

-- 7. ENQUIRIES TABLE
create table if not exists public.enquiries (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  customer_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  service_id uuid references public.business_services(id) on delete set null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'responded', 'closed')),
  owner_notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_enquiries_business on public.enquiries(business_id);
create index if not exists idx_enquiries_customer on public.enquiries(customer_id);
create index if not exists idx_enquiries_status on public.enquiries(status);

-- 8. REVIEWS TABLE
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  customer_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  status text not null default 'published' check (status in ('published', 'flagged', 'hidden')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (business_id, customer_id)
);

create index if not exists idx_reviews_business on public.reviews(business_id);

-- 9. FAVORITES TABLE
create table if not exists public.favorites (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  customer_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique (business_id, customer_id)
);

-- 10. REPORTS TABLE
create table if not exists public.reports (
  id uuid default uuid_generate_v4() primary key,
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  target_type text not null check (target_type in ('business', 'review')),
  target_id uuid not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
  created_at timestamptz default now() not null
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.businesses enable row level security;
alter table public.business_services enable row level security;
alter table public.business_images enable row level security;
alter table public.business_hours enable row level security;
alter table public.enquiries enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.reports enable row level security;

-- PROFILES POLICIES
create policy "Public can view basic profiles" on public.profiles
  for select using (true);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- CATEGORIES POLICIES
create policy "Anyone can read categories" on public.categories
  for select using (true);

create policy "Only admin can modify categories" on public.categories
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- BUSINESSES POLICIES
create policy "Anyone can view approved businesses" on public.businesses
  for select using (status = 'approved' or owner_id = auth.uid());

create policy "Business owners can insert their own business" on public.businesses
  for insert with check (
    auth.uid() = owner_id and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'business_owner')
  );

create policy "Business owners can update their own business" on public.businesses
  for update using (
    auth.uid() = owner_id
  );

-- BUSINESS SERVICES POLICIES
create policy "Public can view services of approved businesses" on public.business_services
  for select using (
    exists (
      select 1 from public.businesses
      where businesses.id = business_services.business_id
      and (businesses.status = 'approved' or businesses.owner_id = auth.uid())
    )
  );

create policy "Owners can manage services of their businesses" on public.business_services
  for all using (
    exists (
      select 1 from public.businesses
      where businesses.id = business_services.business_id
      and businesses.owner_id = auth.uid()
    )
  );

-- BUSINESS IMAGES POLICIES
create policy "Public can view images of approved businesses" on public.business_images
  for select using (
    exists (
      select 1 from public.businesses
      where businesses.id = business_images.business_id
      and (businesses.status = 'approved' or businesses.owner_id = auth.uid())
    )
  );

create policy "Owners can manage images of their businesses" on public.business_images
  for all using (
    exists (
      select 1 from public.businesses
      where businesses.id = business_images.business_id
      and businesses.owner_id = auth.uid()
    )
  );

-- BUSINESS HOURS POLICIES
create policy "Public can view hours of approved businesses" on public.business_hours
  for select using (
    exists (
      select 1 from public.businesses
      where businesses.id = business_hours.business_id
      and (businesses.status = 'approved' or businesses.owner_id = auth.uid())
    )
  );

create policy "Owners can manage hours of their businesses" on public.business_hours
  for all using (
    exists (
      select 1 from public.businesses
      where businesses.id = business_hours.business_id
      and businesses.owner_id = auth.uid()
    )
  );

-- ENQUIRIES POLICIES
create policy "Customers can insert enquiries" on public.enquiries
  for insert with check (true);

create policy "Customers can view their own enquiries" on public.enquiries
  for select using (auth.uid() = customer_id);

create policy "Business owners can view enquiries for their businesses" on public.enquiries
  for select using (
    exists (
      select 1 from public.businesses
      where businesses.id = enquiries.business_id
      and businesses.owner_id = auth.uid()
    )
  );

create policy "Business owners can update enquiry status" on public.enquiries
  for update using (
    exists (
      select 1 from public.businesses
      where businesses.id = enquiries.business_id
      and businesses.owner_id = auth.uid()
    )
  );

-- REVIEWS POLICIES
create policy "Public can view published reviews" on public.reviews
  for select using (status = 'published');

create policy "Customers can create reviews" on public.reviews
  for insert with check (auth.uid() = customer_id);

create policy "Customers can update their own reviews" on public.reviews
  for update using (auth.uid() = customer_id);

-- FAVORITES POLICIES
create policy "Customers can view their own favorites" on public.favorites
  for select using (auth.uid() = customer_id);

create policy "Customers can manage their favorites" on public.favorites
  for all using (auth.uid() = customer_id);

-- SEED INITIAL CATEGORIES
insert into public.categories (name, slug, description, icon) values
  ('Home Services', 'home-services', 'Plumbers, electricians, cleaners, and carpenters', 'Wrench'),
  ('Auto Services', 'auto-services', 'Car wash, mechanics, detailing, and roadside assistance', 'Car'),
  ('Health & Wellness', 'health-wellness', 'Clinics, dental, spas, gyms, and therapy', 'HeartPulse'),
  ('Education & Classes', 'education-classes', 'Tutors, music teachers, and test prep', 'GraduationCap'),
  ('Events & Weddings', 'events-weddings', 'Caterers, photographers, DJs, and venue decor', 'PartyPopper'),
  ('Professional Services', 'professional-services', 'Legal, accountants, digital marketing, and architects', 'Briefcase')
on conflict (slug) do nothing;
