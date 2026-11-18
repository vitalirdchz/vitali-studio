import mongoose from 'mongoose';

// ── Service ──────────────────────────────────────────────────────────────────
const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    features: [{ type: String }],
    ctaLink: { type: String },
    ctaText: { type: String },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service =
  mongoose.models.Service || mongoose.model('Service', serviceSchema);

// ── PortfolioItem ────────────────────────────────────────────────────────────
const portfolioItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    clientName: { type: String },
    thumbnailUrl: { type: String },
    videoUrl: { type: String },
    category: {
      type: String,
      enum: ['portfolio', 'creation'],
    },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const PortfolioItem =
  mongoose.models.PortfolioItem ||
  mongoose.model('PortfolioItem', portfolioItemSchema);

// ── FAQ ──────────────────────────────────────────────────────────────────────
const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FAQ =
  mongoose.models.FAQ || mongoose.model('FAQ', faqSchema);

// ── Testimonial ──────────────────────────────────────────────────────────────
const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientTitle: { type: String },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    avatarUrl: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Testimonial =
  mongoose.models.Testimonial ||
  mongoose.model('Testimonial', testimonialSchema);

// ── SiteSetting ────────────────────────────────────────────────────────────
const siteSettingSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'global', unique: true },
    fiverrUrl: { type: String, default: 'https://www.fiverr.com' },
    heroTitle: { type: String, default: 'Montage Vidéo & Clipping IA Premium' },
    heroSubtitle: {
      type: String,
      default:
        'Transformez vos contenus longs en clips viraux optimisés pour TikTok, Reels & Shorts — propulsés par l’intelligence artificielle.',
    },
    contactEmail: { type: String, default: 'contact@vitalistudio.com' },
  },
  { timestamps: true }
);

export const SiteSetting =
  mongoose.models.SiteSetting ||
  mongoose.model('SiteSetting', siteSettingSchema);
