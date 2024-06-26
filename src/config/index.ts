export const PRODUCT_CATEGORIES = [
  {
    label: "All categories",
    value: "all_categories" as const,
    featured: [
      {
        name: "clothes",
        href: "#",
        imgSrc: "/nav/categories/clothes.jpg",
      },
      {
        name: "shoes",
        href: "#",
        imgSrc: "/nav/categories/sneakers.jpg",
      },
      {
        name: "electronics",
        href: "#",
        imgSrc: "/nav/categories/electronics.jpg",
      },
    ],
  },
  {
    label: "Featured selection",
    value: "featured_selection" as const,
    featured: [
      {
        name: "Top Ranking",
        href: "#",
        imgSrc: "/nav/featured/topRanking.jpg",
      },
      {
        name: "New Arrivals",
        href: "#",
        imgSrc: "/nav/featured/newArrivals.jpg",
      },
      {
        name: "savings spotlight",
        href: "#",
        imgSrc: "/nav/featured/spotlight.png",
      },
    ],
  },
];
