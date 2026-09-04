/* ------------------------------------------------------------------ */
/*  Salon 5014 — single source of truth                                 */
/*                                                                      */
/*  Every fact below was taken from the official salon5014.com site:    */
/*  services + prices (/services), team (/reserveappointment),           */
/*  policies (/policies), hours + contact (/ and /contact).              */
/*  Nothing here is invented. The AI Front Desk reads ONLY this file.   */
/* ------------------------------------------------------------------ */

import type {
  Faq,
  Policy,
  SalonServiceGroup,
  TeamMember,
  WeekHours
} from "@/lib/types";

export const salon = {
  name: "Salon 5014",
  legalName: "Salon 5014",
  shortName: "5014",
  tagline: "Hair, color & extensions in Dallas, Texas",
  hero: "Your Hair. Your Style. Your 5014.",
  location: "Dallas, Texas",
  description:
    "Salon 5014 is an elite Dallas hair salon providing quality hair services in an inviting atmosphere — precision haircuts, lived-in color, balayage, styling and extensions.",
  address: {
    street: "5014 Miller Ave",
    city: "Dallas",
    state: "TX",
    zip: "75206",
    country: "US"
  },
  phone: {
    display: "(469) 426-4308",
    tel: "+14694264308"
  },
  /* No public email address is listed on salon5014.com — intentionally absent. */
  instagram: {
    handle: "@salon5014",
    url: "https://www.instagram.com/salon5014/"
  },
  website: "https://www.salon5014.com",
  bookingUrl: "https://www.salon5014.com/book-online",
  aboutCopy: [
    "Salon 5014 is an elite hair salon that provides quality hair services in an inviting atmosphere. Our experienced stylists have the knowledge and skills to help you achieve the look you desire.",
    "We strive to create a unique and personalized experience for each of our clients — whether you are looking for a fresh cut, color, styling or extensions, we have you covered."
  ],
  highlights: [
    "Experienced stylists & colorists",
    "Balayage, blonding & lived-in color",
    "Precision haircuts & blowouts",
    "Extensions & healthy-hair specialists",
    "Newly renovated salon in East Dallas"
  ],
  photos: {
    /* salon photography from salon5014.com, reused for this concept site */
    hero: "/images/salon/work-hero-b.jpg", // elevated view of the salon floor
    heroAlt: "/images/salon/work-hero-a.jpg", // styling chair detail
    interiorWide: "/images/salon/work-banner.jpg",
    interiorWindows: "/images/salon/work-detail-c.jpg",
    interiorWash: "/images/salon/work-detail-d.jpg",
    interiorStation: "/images/salon/extra-ff2ec9ac.jpg",
    teamGroup: "/images/salon/team-glam-haus.jpg" // official team group photo
  }
} as const;

export const hours: WeekHours[] = [
  { day: "Monday", label: "Mon", open: "10:00", close: "16:00", display: "10 AM – 4 PM" },
  { day: "Tuesday", label: "Tue", open: "10:00", close: "20:00", display: "10 AM – 8 PM" },
  { day: "Wednesday", label: "Wed", open: "10:00", close: "20:00", display: "10 AM – 8 PM" },
  { day: "Thursday", label: "Thu", open: "09:00", close: "18:00", display: "9 AM – 6 PM" },
  { day: "Friday", label: "Fri", open: "09:00", close: "18:00", display: "9 AM – 6 PM" },
  { day: "Saturday", label: "Sat", open: "09:00", close: "17:00", display: "9 AM – 5 PM" },
  { day: "Sunday", label: "Sun", open: null, close: null, display: "Closed" }
];

const groups: SalonServiceGroup[] = [
  {
    id: "cut-style",
    title: "Styling Services",
    services: [
      {
        id: "haircut",
        name: "Haircut",
        category: "cut-style",
        categoryLabel: "Styling Services",
        priceFrom: 78,
        priceLabel: "$78+",
        blurb: "A precision cut shaped to you, finished for your hair type.",
        keywords: ["haircut", "cut", "trim", "hair cut"]
      },
      {
        id: "blowout-style",
        name: "Blowout & Style",
        category: "cut-style",
        categoryLabel: "Styling Services",
        priceFrom: 60,
        priceLabel: "$60+",
        blurb: "A polished blowout and finish for any occasion.",
        keywords: ["blowout", "style", "styling", "blow dry", "updo", "event"]
      }
    ]
  },
  {
    id: "color",
    title: "Color Services",
    services: [
      {
        id: "face-frame",
        name: "Face Frame",
        category: "color",
        categoryLabel: "Color Services",
        priceFrom: 150,
        priceLabel: "$150+",
        blurb: "Lightener placed around the face for an instant brightening effect.",
        keywords: ["face frame", "face framing", "brighten", "money piece"]
      },
      {
        id: "partial-highlight",
        name: "Partial Highlight",
        category: "color",
        categoryLabel: "Color Services",
        priceFrom: 170,
        priceLabel: "$170+",
        blurb: "Highlights concentrated in the areas that frame your look.",
        keywords: ["partial highlight", "partial", "highlights", "foils"]
      },
      {
        id: "tint",
        name: "Tint",
        category: "color",
        categoryLabel: "Color Services",
        priceFrom: 70,
        priceLabel: "$70+",
        blurb: "All-over single-process color for natural depth and coverage.",
        keywords: ["tint", "single process", "all over color", "root touch up"]
      },
      {
        id: "foilayage",
        name: "Foilayage",
        category: "color",
        categoryLabel: "Color Services",
        priceFrom: 200,
        priceLabel: "$200+",
        blurb: "A hybrid of foil highlights and freehand painting for blended dimension.",
        keywords: ["foilayage", "foil", "dimensional color"]
      },
      {
        id: "full-highlight",
        name: "Full Highlight",
        category: "color",
        categoryLabel: "Color Services",
        priceFrom: 200,
        priceLabel: "$200+",
        blurb: "Full-head foil highlights for all-over lift and brightness.",
        keywords: ["full highlight", "full head highlight", "blonde", "highlights"]
      },
      {
        id: "toner-gloss",
        name: "Toner/Gloss",
        category: "color",
        categoryLabel: "Color Services",
        priceFrom: 50,
        priceLabel: "$50+",
        blurb: "A toner or gloss to refine tone, add shine and finish your color.",
        keywords: ["toner", "gloss", "tone", "shine", "glaze"]
      },
      {
        id: "balayage",
        name: "Balayage",
        category: "color",
        categoryLabel: "Color Services",
        priceFrom: 180,
        priceLabel: "$180+",
        blurb: "Freehand-painted, lived-in dimension — a Salon 5014 signature.",
        keywords: ["balayage", "lived in", "bronde", "caramel", "sun kissed"]
      }
    ]
  },
  {
    id: "specialty",
    title: "Hair Specialties",
    services: [
      {
        id: "keratin-complex",
        name: "Keratin Complex",
        category: "specialty",
        categoryLabel: "Hair Specialties",
        priceFrom: 350,
        priceLabel: "$350+",
        blurb: "Smoothing treatment that tames frizz and eases daily styling.",
        keywords: ["keratin", "keratin complex", "smooth", "frizz", "straightening"]
      },
      {
        id: "deep-conditioning",
        name: "Deep Conditioning",
        category: "specialty",
        categoryLabel: "Hair Specialties",
        priceFrom: 50,
        priceLabel: "$50+",
        blurb: "An intensive treatment to restore softness and moisture.",
        keywords: ["deep conditioning", "conditioning", "treatment", "moisture", "mask"]
      },
      {
        id: "perm",
        name: "Perm",
        category: "specialty",
        categoryLabel: "Hair Specialties",
        priceFrom: 250,
        priceLabel: "$250+",
        blurb: "Custom-wrapped curl or wave, tailored to your texture goal.",
        keywords: ["perm", "curl", "wave", "body wave", "korean perm"]
      },
      {
        id: "extensions",
        name: "Extensions",
        category: "specialty",
        categoryLabel: "Hair Specialties",
        priceFrom: 599,
        priceLabel: "$599+",
        blurb: "Hand-tied extensions for added length and fullness.",
        keywords: ["extensions", "hair extensions", "hand tied", "length", "volume", "weft"]
      },
      {
        id: "brazilian-blowout",
        name: "Brazilian Blowout",
        category: "specialty",
        categoryLabel: "Hair Specialties",
        priceFrom: 380,
        priceLabel: "$380+",
        blurb: "Smoothing service that leaves hair soft, shiny and more manageable.",
        keywords: ["brazilian blowout", "brazilian", "smoothing", "frizz"]
      },
      {
        id: "magic-sleek",
        name: "Magic Sleek",
        category: "specialty",
        categoryLabel: "Hair Specialties",
        priceFrom: 380,
        priceLabel: "$380+",
        blurb: "Advanced keratin smoothing for sleek, frizz-free hair.",
        keywords: ["magic sleek", "sleek", "keratin smoothing", "straightening"]
      }
    ]
  }
];

export const serviceGroups: SalonServiceGroup[] = groups;

export const allServices = groups.flatMap((g) => g.services);

export const servicesByCategory = Object.fromEntries(
  groups.map((g) => [g.id, g.services])
) as Record<string, (typeof allServices)[number][]>;

export const team: TeamMember[] = [
  {
    id: "angel-dickholtz",
    name: "Angel Dickholtz",
    role: "Stylist + Colorist",
    photo: "/images/salon/team-angel-dickholtz.jpg",
    booksOnline: true
  },
  {
    id: "brianna-adame",
    name: "Brianna Adame",
    role: "Team Leader",
    photo: "/images/salon/team-brianna-adame.jpg",
    booksOnline: false
  },
  {
    id: "carlos-gomez",
    name: "Carlos Gomez",
    role: "Stylist",
    photo: "/images/salon/team-carlos-gomez.jpg",
    booksOnline: true
  },
  {
    id: "chandler-tolbert",
    name: "Chandler Tolbert",
    role: "Salon Coordinator",
    photo: "/images/salon/team-chandler-tolbert.jpg",
    booksOnline: false
  },
  {
    id: "cheryl-tolbert",
    name: "Cheryl Tolbert",
    role: "Colorist",
    photo: "/images/salon/team-cheryl-tolbert.jpg",
    booksOnline: true
  },
  {
    id: "dani-herrera",
    name: "Dani Herrera",
    role: "Stylist + Colorist",
    photo: "/images/salon/team-dani-herrera.jpg",
    booksOnline: true
  },
  {
    id: "dylan-stamas",
    name: "Dylan Stamas",
    role: "Stylist + Colorist",
    photo: "/images/salon/team-dylan-stamas.jpg",
    booksOnline: true
  },
  {
    id: "fatema-antaki",
    name: "Fatema Antaki",
    role: "Stylist + Colorist",
    photo: "/images/salon/team-fatema-antaki.jpg",
    booksOnline: true
  },
  {
    id: "glam-haus-collective",
    name: "Glam Haus Collective",
    role: "Our Makeup Team",
    photo: "",
    booksOnline: false
  },
  {
    id: "jeka-peraza",
    name: "Jeka Peraza",
    role: "Stylist + Colorist",
    photo: "/images/salon/team-jeka-peraza.jpg",
    booksOnline: true
  },
  {
    id: "jeremiah-garcia",
    name: "Jeremiah Garcia",
    role: "Stylist + Colorist",
    photo: "/images/salon/team-jeremiah-garcia.jpg",
    booksOnline: true
  },
  {
    id: "joan-maduro",
    name: "Joan Maduro",
    role: "Stylist + Colorist",
    photo: "/images/salon/team-joan-maduro.jpg",
    booksOnline: true
  },
  {
    id: "jose-moreno",
    name: "Jose Moreno",
    role: "Stylist + Colorist",
    photo: "/images/salon/team-jose-moreno.jpg",
    booksOnline: true
  },
  {
    id: "lali-torres",
    name: "Lali Torres",
    role: "Stylist + Colorist",
    photo: "/images/salon/team-lali-torres.jpg",
    booksOnline: true
  },
  {
    id: "monica-mayfield",
    name: "Monica Mayfield",
    role: "Stylist + Colorist",
    photo: "/images/salon/team-monica-mayfield.jpg",
    booksOnline: true
  },
  {
    id: "olivia-rose",
    name: "Olivia Rose",
    role: "Stylist + Colorist",
    photo: "/images/salon/team-olivia-rose.jpg",
    booksOnline: true
  },
  {
    id: "renee",
    name: "Renee",
    role: "Stylist + Colorist",
    photo: "/images/salon/team-renee.jpg",
    booksOnline: true
  },
  {
    id: "stephanie-boccabella",
    name: "Stephanie Boccabella",
    role: "Stylist + Colorist",
    photo: "/images/salon/team-stephanie-boccabella.jpg",
    booksOnline: true
  },
  {
    id: "tiffany-jackson",
    name: "Tiffany Jackson",
    role: "Stylist + Colorist",
    photo: "/images/salon/team-tiffany-jackson.jpg",
    booksOnline: true
  },
  {
    id: "william-peck",
    name: "William Peck",
    role: "Stylist + Colorist",
    photo: "/images/salon/team-william-peck.jpg",
    booksOnline: true
  },
  {
    id: "zoek",
    name: "Zoey K",
    role: "Colorist",
    photo: "/images/salon/team-zoek.jpg",
    booksOnline: true
  }
];

export const policies: Policy[] = [
  {
    id: "booking-new-guests",
    title: "Booking — New Guests",
    paragraphs: [
      "When booking your first appointment we encourage you to do so over the phone or in person. This allows us to hear your hair story and match you with your dream stylist.",
      "New guests are required to submit a credit card to reserve their appointment. No charges will be made to your credit card unless you no show or cancel your appointment outside of our 24 hour cancellation policy.",
      "New guests are required to submit a 50% deposit to reserve their appointment.",
      "All appointments are reserved online or via phone."
    ]
  },
  {
    id: "cancellation",
    title: "Cancellation Policy",
    paragraphs: [
      "Our appointments are confirmed 24 hours in advance because we know how easy it is to forget an appointment you booked months ago. If you fail to cancel within 24 hours of your appointment there will be a 50% charge of the scheduled service.",
      "If an appointment is not attended, 50% of the missed service will be posted to the account. A no-show constitutes either being 15 minutes late or not arriving the day of your appointment.",
      "Failing to show up to multiple or combo appointments will require making partial payment for future appointments."
    ]
  },
  {
    id: "revisions",
    title: "Revisions",
    paragraphs: [
      "In the event that you are not satisfied with your service, we ask that you please contact your stylist within 7 days of that service. While we do offer the first adjustment free of charge, each stylist is independent and has their own service satisfaction policy.",
      "We would like the opportunity to meet and exceed your expectations as we value you as a guest."
    ]
  },
  {
    id: "deposits",
    title: "Deposits",
    paragraphs: [
      "Specific stylists might require a deposit be given at the time of booking in order to ensure the appointment is held. All deposits are non-refundable.",
      "Failure to cancel or modify your appointment less than 24 hours in advance or if you no show your appointment results in forfeit of the deposit."
    ]
  },
  {
    id: "returns",
    title: "Returns",
    paragraphs: [
      "If you find yourself unsatisfied with the products you have purchased, you may bring them back within 14 days to exchange for another product of equal or lesser value.",
      "We do not offer refunds for products purchased."
    ]
  }
];

export const faqs: Faq[] = [
  {
    q: "Where is Salon 5014 located?",
    a: "Salon 5014 is at 5014 Miller Ave, Dallas, TX 75206. Find us on Instagram at @salon5014 for hair inspiration."
  },
  {
    q: "What are the salon hours?",
    a: "We are open Monday 10–4, Tuesday–Wednesday 10–8, Thursday–Friday 9–6 and Saturday 9–5. We are closed Sundays."
  },
  {
    q: "How do I book an appointment?",
    a: "You can book online at salon5014.com/book-online or by phone at (469) 426-4308. For your first appointment we encourage booking over the phone or in person so we can match you with the right stylist."
  },
  {
    q: "Do you require a deposit for new guests?",
    a: "New guests are required to submit a credit card to reserve their appointment, and a 50% deposit is required to hold it. Cards are only charged for cancellations outside the 24-hour policy or no-shows. Some stylists also require a deposit at booking; all deposits are non-refundable."
  },
  {
    q: "What is the cancellation policy?",
    a: "Appointments are confirmed 24 hours in advance. Cancelling less than 24 hours before your appointment results in a 50% charge of the scheduled service, and a no-show (including arriving 15 minutes late) is charged 50% of the missed service."
  },
  {
    q: "Do you offer extensions?",
    a: "Yes — Salon 5014 offers extensions starting at $599+. Ask about hand-tied extensions at your consultation."
  },
  {
    q: "What does balayage start at?",
    a: "Balayage at Salon 5014 starts at $180+. Your colorist will confirm exact pricing for your hair at booking or consultation."
  }
];

export const serviceFinderSteps = [
  {
    title: "What are you looking for?",
    options: [
      "Cut",
      "Color",
      "Highlights",
      "Balayage",
      "Styling",
      "Extensions",
      "Smoothing",
      "Treatment",
      "I'm not sure"
    ]
  },
  {
    title: "How much change are you looking for?",
    options: ["Refresh", "Noticeable change", "Major transformation", "Not sure"]
  },
  {
    title: "When would you like to visit?",
    options: ["This week", "Next 2 weeks", "This month", "Just exploring"]
  }
] as const;
