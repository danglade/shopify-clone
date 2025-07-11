# Shopify Clone Feature Roadmap: Clothing Store

This document outlines the features to be built for the Shopify clone project, with a specific focus on creating an e-commerce platform for a clothing store. The project is divided into phases to ensure a structured development process.

---

## Phase 1: Core Product Management

This phase focuses on building the foundational backend capabilities for managing products. The store owner will interact with these features through a private admin dashboard.

### Features:
- **Product Data Model**:
  - **Name**: The title of the clothing item (e.g., "Men's Classic Crewneck T-Shirt").
  - **Slug**: A unique, URL-friendly identifier for the product (e.g., `mens-classic-crewneck-t-shirt`). This will be auto-generated from the name but can be overridden.
  - **Description**: A rich-text enabled field to describe the product, including material, fit, and care instructions.
  - **Price**: The retail price of the item.
  - **Images**: Support for uploading multiple high-resolution product images.
  - **Categories**: Ability to assign products to categories (e.g., "T-Shirts", "Jeans", "Outerwear").
  - **Status**: The state of the product (`Draft`, `Published`, `Archived`).
- **Product Variants**:
  - A system to define variations of a single product. For clothing, this will primarily be:
    - **Size**: (e.g., XS, S, M, L, XL, XXL)
    - **Color**: (e.g., "White", "Black", "Navy Blue")
  - Each unique combination of variants (e.g., Medium, Navy Blue) will have its own:
    - **SKU** (Stock Keeping Unit) for inventory tracking.
    - **Inventory Level** to track stock.
    - **Product Cost**: The wholesale cost of the variant, used to calculate profit margins.
- **Admin Dashboard - Product Management**:
  - A secure, private section of the site for store administration.
  - **Product List**: A paginated and searchable table of all products.
  - **Product Creation Form**: An intuitive form to add new products, including their variants, images, and the cost per variant.
  - **Product Editor**: A form to edit all details of an existing product, including the cost per variant.
  - **Image Management**: An interface to upload, reorder, and delete product images.
  - **Product Deletion**: A button to soft-delete a product. This will set its status to "Archived" and remove it from public-facing storefronts without permanently deleting the data.
- **Admin Dashboard - Site-wide Settings**:
  - **Hero Slider Management**: A dedicated page (`/admin/hero`) to manage the homepage hero carousel.
    - Drag-and-drop reordering of slides.
    - Ability to add, edit, and remove slides.
    - Each slide has fields for an image, title, subtitle, button text, and button link.
    - Positioning controls for the text/button block (top/middle/bottom and left/center/right).
    - Global setting for the carousel's autoplay duration.
  - **Header Settings**: A page (`/admin/settings`) to manage site-wide header behavior.
    - Configurable announcement bar content (accepts HTML).
    - Toggle for making the announcement bar dismissible by users.
    - Toggle to make the entire main header sticky.

---

## Phase 2: Public Storefront

This phase covers the public-facing website that customers will visit to browse and select products.

### Features:
- **Responsive Design**: The entire storefront will be optimized for a seamless experience on both desktop and mobile devices.
- **Header Bar**:
  - An announcement bar displayed at the top of the site.
  - The content and dismissibility of this bar are editable from the admin dashboard.
- **Navigation Bar**:
  - A centered layout containing:
    - **Left**: Contact information (e.g., "QUESTIONS? (818) 206-8764").
    - **Center**: The store's logo.
    - **Right**: Icons for user account, shopping cart, and search.
  - The search icon opens a full-screen overlay with a debounced, live search input for finding products.
  - The entire navbar is "sticky" and remains at the top of the viewport on scroll.
  - **Menu**: A list of primary navigation links, such as "For Him," "For Her," "New Drop," "Collabs," and "Lookbook," which may be dropdowns.
- **Home Page**:
  - **Hero Banner**: A full-width, dynamic hero carousel managed from the admin dashboard. Features autoplay, configurable slides (image, title, subtitle, button), and text/button positioning.
  - **Featured Products Section**: A curated collection of products to highlight new arrivals or best-sellers.
  - **Shop by Category**: Visual links that navigate users to category-specific product pages.
- **Category/Product Listing Page**:
  - A grid view of all products within a specific category.
  - Each product card in the grid will display:
    - **Interactive Image Carousel**: An image carousel showing all product images, with hover-activated navigation arrows.
    - **Product Title**
    - **Price**
    - **Interactive Color Swatches**: Small clickable swatches representing available colors, which control the image carousel.
    - **Average Rating**: A visual star rating (e.g., 4.5 out of 5 stars).
  - **Sorting**: Allow customers to sort products by `Newest`, `Price: Low to High`, and `Price: High to Low`.
  - **Filtering**: Allow customers to filter products by `Size`, `Color`, and `Price Range`.
- **Product Detail Page (URL: `/product/{slug}`)**:
  - The page will be accessible via a URL like `/product/mens-classic-crewneck-t-shirt`.
  - **Image Gallery**: A carousel or gallery to view all images of a product.
  - **Product Information**: Displays the product name, price, and full description.
  - **Variant Selectors**: User-friendly dropdowns or swatches for selecting `Size` and `Color`. The UI should update to show the image for the selected color.
  - **Stock Status**: The "Add to Cart" button will be disabled and an "Out of Stock" message will appear if the selected variant has no inventory.
  - **"Add to Cart" Button**: Adds the selected product variant to the customer's shopping cart.
  - **Reviews & Ratings Section**:
    - Displays the average star rating and total number of reviews.
    - A list of individual customer reviews, including their rating, comment, and date.
    - A form for customers to submit their own review and rating.
  - **"You May Also Like" Section**: At the bottom of the page, a section will display a collection of related or recommended products to encourage further browsing.
- **Footer**: A standard site footer containing links for customer service, company info, and social media.

---

## Phase 3: Shopping Cart & Checkout

This phase focuses on the crucial functionality that allows customers to make a purchase.

### Features:
- **Shopping Cart**:
  - A slide-out panel that summarizes the cart's contents.
  - **Cart Items**: Displays each item with its image, name, selected variants (size/color), quantity, and price.
  - **Modify Cart**: Ability for users to change the quantity of an item or remove it completely.
  - **Order Summary**: A clear breakdown of the subtotal.
  - **Persistent State**: The cart's contents will be saved in the browser's local storage, so it persists even if the user closes the tab.
- **Checkout Process**:
  - A custom, two-column checkout page (`/checkout`) that visually separates the order summary from the customer information form.
  - **Express Checkout**: Visual buttons for express payment options like ShopPay, PayPal, etc.
  - **Customer Information Form**: Collects detailed contact and shipping address information (name, email, address, city, state, postal code, country, phone).
  - **Stripe Checkout Integration**: For the final payment step, we will use Stripe's hosted checkout page to ensure security and simplify development.
  - **Order Creation**: Upon successful payment via Stripe, an order is automatically created in our database with the collected customer and shipping details.
- **Order Confirmation**:
  - **"Thank You" Page**: A confirmation page shown to the customer after a successful purchase, displaying a summary of their order.
  - **Email Confirmation**: An automated email will be sent to the customer confirming their order details.

---

## Phase 4: Order Management

This phase involves building the tools for the store owner to manage and fulfill customer orders.

### Features:
- **Order Data Model**:
  - Captures all information related to a purchase, including customer details, shipping address, items purchased (with their variants and price at the time of sale), and total amount paid.
  - **Order Status**: The state of the order (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **Admin Dashboard - Order Management**:
  - **Order List**: A paginated and searchable list of all customer orders.
  - **Order Detail View**: A page that shows all information for a single order.
  - **Status Updates**: The ability for the store owner to update an order's status (e.g., from "Processing" to "Shipped").
  - **Review Management**: A section to view and moderate customer-submitted product reviews.

---

## Phase 5: Analytics Dashboard

This phase focuses on creating a dashboard to provide key insights into the store's performance.

### Features:
- **Dashboard UI**: A simple dashboard at `/admin` to display key all-time metrics.
- **Key Metric Cards**:
  - **Total Sales**: Sum of all order totals.
  - **Total Orders**: Count of all completed orders.
  - **Average Order Value (AOV)**: `Total Sales` / `Total Orders`.
  - **Top Selling Product**: The name of the product with the most units sold. 