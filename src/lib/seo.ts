import { allServices, faqs, hours, salon } from "@/data/salonData";

const addr = {
  "@type": "PostalAddress",
  streetAddress: salon.address.street,
  addressLocality: salon.address.city,
  addressRegion: salon.address.state,
  postalCode: salon.address.zip,
  addressCountry: salon.address.country
};

const openingHours = hours
  .filter((h) => h.open && h.close)
  .map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${h.day}`,
    opens: h.open,
    closes: h.close
  }));

export function buildOrgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${salon.website}/#salon`,
    name: salon.name,
    url: salon.website,
    image: `${salon.website}${salon.photos.hero}`,
    telephone: salon.phone.display,
    email: undefined,
    priceRange: "$$",
    address: addr,
    openingHoursSpecification: openingHours,
    sameAs: [salon.instagram.url, salon.website]
  };
}

export function buildServicesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: allServices.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.name,
        category: s.categoryLabel,
        provider: { "@id": `${salon.website}/#salon` },
        offers: {
          "@type": "Offer",
          price: s.priceFrom,
          priceCurrency: "USD",
          description: `Starting at ${s.priceLabel}`
        }
      }
    }))
  };
}

export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };
}
