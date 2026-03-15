import { Head } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import {
    CheckCircle2, Clock, Code2, CreditCard, Globe, Headphones, Layers,
    LayoutDashboard, Lock, Mail, Package, Rocket, Search, Server,
    Shield, ShoppingCart, Smartphone, Star, Tag, Truck, Users,
    BarChart3, Bell, Heart, MapPin, MessageSquare, Settings, Zap,
    ChevronRight, Calendar, FileText, Award, TrendingUp, Eye,
    RefreshCw, Megaphone, PieChart, Database, Cpu, GitBranch,
} from 'lucide-react';
import { ReactNode } from 'react';

// ─── Phase badge component ──────────────────────────────────
function PhaseBadge({ phase }: { phase: 'mvp' | 'growth' | 'vision' }) {
    const styles = {
        mvp: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        growth: 'bg-blue-100 text-blue-700 border-blue-200',
        vision: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    const labels = { mvp: 'MVP', growth: 'Growth', vision: 'Vision' };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${styles[phase]}`}>
            {labels[phase]}
        </span>
    );
}

// ─── Feature item component ────────────────────────────────
function Feature({ children, phase }: { children: ReactNode; phase: 'mvp' | 'growth' | 'vision' }) {
    return (
        <li className="flex items-start gap-3 py-1.5">
            <CheckCircle2 className="size-4 text-orfarm-green shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700 flex-1">{children}</span>
            <PhaseBadge phase={phase} />
        </li>
    );
}

// ─── Section card component ────────────────────────────────
function SectionCard({ icon: Icon, title, children, id }: { icon: any; title: string; children: ReactNode; id?: string }) {
    return (
        <div id={id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-orfarm-blue/5 to-orfarm-green/5 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orfarm-green/10 flex items-center justify-center">
                        <Icon className="size-5 text-orfarm-green" />
                    </div>
                    <h3 className="text-lg font-bold text-orfarm-blue">{title}</h3>
                </div>
            </div>
            <div className="px-6 py-5">
                <ul className="space-y-1">{children}</ul>
            </div>
        </div>
    );
}

// ─── Stat card ─────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-orfarm-green/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="size-6 text-orfarm-green" />
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">{label}</p>
            <p className="text-2xl font-bold text-orfarm-blue">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
    );
}

// ─── Timeline item ─────────────────────────────────────────
function TimelineItem({ month, title, desc, active }: { month: string; title: string; desc: string; active?: boolean }) {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${active ? 'bg-orfarm-green text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {month}
                </div>
                <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
            </div>
            <div className="pb-8">
                <h4 className={`font-semibold text-sm ${active ? 'text-orfarm-green' : 'text-gray-800'}`}>{title}</h4>
                <p className="text-xs text-gray-500 mt-1">{desc}</p>
            </div>
        </div>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN PROPOSAL PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function Proposal() {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const tocItems = [
        { id: 'overview', label: 'Project Overview' },
        { id: 'features', label: 'Features & Scope' },
        { id: 'timeline', label: 'Development Timeline' },
        { id: 'delivery', label: 'Deliverables & Boundaries' },
        { id: 'tech', label: 'Technology Stack' },
        { id: 'pricing', label: 'Pricing & Payment' },
        { id: 'support', label: 'Support & Maintenance' },
        { id: 'terms', label: 'Terms & Conditions' },
    ];

    return (
        <StorefrontLayout>
            <Head title="Project Proposal - Fresh Valley Shopping" />

            {/* ── Hero Banner ─────────────────────────────── */}
            <section className="relative bg-gradient-to-br from-orfarm-blue via-orfarm-blue to-[#0a0a2e] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-orfarm-green rounded-full blur-[120px]" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-[150px]" />
                </div>
                <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-3 bg-white/10 rounded-full px-6 py-2.5 text-lg font-semibold mb-6 backdrop-blur-sm">
                            <FileText className="size-5" />
                            Project Proposal
                        </div>
                        <img src="/assets/img/logo/logo.png" alt="Fresh Valley" className="h-28 md:h-36 w-auto mx-auto mb-6" />
                        <h1 className="text-2xl md:text-3xl font-bold font-heading leading-tight mb-6 text-white">
                            Fresh Valley Shopping Platform
                        </h1>
                        <p className="text-lg text-white/70 max-w-xl mx-auto mb-8">
                            A focused 8-week MVP for halal grocery ordering and local delivery across Dartford, Orpington & Sidcup, built to launch fast and expand in phases.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/60">
                            <span className="flex items-center gap-2">
                                <Calendar className="size-4" />
                                {formattedDate}
                            </span>
                            <span className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
                            <span className="flex items-center gap-2">
                                <Award className="size-4" />
                                Prepared by Unique Evolution Ltd
                            </span>
                        </div>
                    </div>
                </div>
                {/* Curved bottom edge */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 60V0c240 40 480 60 720 60s480-20 720-60v60H0z" fill="#f9fafb" />
                    </svg>
                </div>
            </section>

            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-12">
                    {/* ── From / To Cards ─────────────────────── */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12 -mt-20 relative z-20">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Prepared by</p>
                            <h3 className="text-xl font-bold text-orfarm-blue mb-2">Unique Evolution Ltd</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Web Development & Digital Solutions<br />
                                London, United Kingdom<br />
                                <a href="mailto:sales@uniqueevolution.co.uk" className="text-orfarm-green hover:underline">sales@uniqueevolution.co.uk</a>
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Prepared for</p>
                            <h3 className="text-xl font-bold text-orfarm-blue mb-2">Fresh Valley Shopping</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Halal Grocery & Meat Delivery<br />
                                Dartford, Kent, United Kingdom<br />
                                <a href="https://freshvalleyshopping.com" className="text-orfarm-green hover:underline">freshvalleyshopping.com</a>
                            </p>
                        </div>
                    </div>

                    {/* ── Key Stats ────────────────────────────── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
                        <StatCard icon={CreditCard} label="Total Investment" value="£1,500" sub="Web development cost" />
                        <StatCard icon={Rocket} label="Delivery Timeline" value="8 Weeks" sub="Launch-ready MVP" />
                        <StatCard icon={Server} label="Server Cost" value="£25/mo" sub="Hosting & maintenance" />
                        <StatCard icon={Globe} label="Free Domain" value="Included" sub="freshvalleyshopping.com" />
                    </div>

                    {/* ── Table of Contents ────────────────────── */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-orfarm-blue mb-6 flex items-center gap-3">
                                <FileText className="size-5 text-orfarm-green" />
                                Table of Contents
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-2">
                                {tocItems.map((item, i) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orfarm-green/5 transition-colors group"
                                    >
                                        <span className="w-7 h-7 rounded-lg bg-orfarm-green/10 text-orfarm-green text-xs font-bold flex items-center justify-center group-hover:bg-orfarm-green group-hover:text-white transition-colors">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-orfarm-green transition-colors">{item.label}</span>
                                        <ChevronRight className="size-3.5 text-gray-300 ml-auto group-hover:text-orfarm-green transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ━━ 1. PROJECT OVERVIEW ━━━━━━━━━━━━━━━━━━━ */}
                    <div id="overview" className="max-w-4xl mx-auto mb-16 scroll-mt-32">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-orfarm-green flex items-center justify-center text-white font-bold text-sm">1</div>
                            <h2 className="text-2xl font-bold text-orfarm-blue">Project Overview</h2>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-4">
                                <p>
                                    <strong className="text-orfarm-blue">Fresh Valley Shopping</strong> is a full-featured halal grocery and meat delivery e-commerce platform
                                    designed to serve the Muslim and halal-conscious communities across Dartford, Orpington, Sidcup and surrounding areas in Kent, UK.
                                </p>
                                <p>
                                    Phase 1 is a lean launch-focused build that will enable customers to browse and order from a curated catalogue of <strong>150+ halal products</strong>
                                    including fresh meat, fish, produce, and grocery essentials, then choose an available delivery slot and pay online.
                                </p>
                                <p>
                                    The recommendation is to keep the first release tightly scoped to the core commercial flow: catalogue, cart, checkout, payments, delivery eligibility,
                                    admin order handling, and product management. Additional growth features can be layered in after launch without slowing initial go-live.
                                </p>

                                <div className="grid sm:grid-cols-3 gap-4 pt-4 not-prose">
                                    <div className="bg-orfarm-green/5 rounded-xl p-5 text-center">
                                        <Users className="size-6 text-orfarm-green mx-auto mb-2" />
                                        <p className="font-bold text-orfarm-blue text-lg">500+</p>
                                        <p className="text-xs text-gray-500">Target Families</p>
                                    </div>
                                    <div className="bg-orfarm-green/5 rounded-xl p-5 text-center">
                                        <Package className="size-6 text-orfarm-green mx-auto mb-2" />
                                        <p className="font-bold text-orfarm-blue text-lg">150+</p>
                                        <p className="text-xs text-gray-500">Product SKUs</p>
                                    </div>
                                    <div className="bg-orfarm-green/5 rounded-xl p-5 text-center">
                                        <MapPin className="size-6 text-orfarm-green mx-auto mb-2" />
                                        <p className="font-bold text-orfarm-blue text-lg">3 Areas</p>
                                        <p className="text-xs text-gray-500">Delivery Coverage</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ━━ 2. FEATURES & SCOPE ━━━━━━━━━━━━━━━━━━ */}
                    <div id="features" className="max-w-5xl mx-auto mb-16 scroll-mt-32">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-orfarm-green flex items-center justify-center text-white font-bold text-sm">2</div>
                            <h2 className="text-2xl font-bold text-orfarm-blue">Features & Scope</h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-4 ml-[52px]">
                            Features are organised into three delivery phases, with the 8-week MVP limited to launch-critical functionality:
                        </p>
                        <div className="flex flex-wrap gap-3 mb-8 ml-[52px]">
                            <div className="flex items-center gap-2 text-xs">
                                <PhaseBadge phase="mvp" /> <span className="text-gray-500">Launch-ready features (Weeks 1-8)</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <PhaseBadge phase="growth" /> <span className="text-gray-500">Post-launch enhancements</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <PhaseBadge phase="vision" /> <span className="text-gray-500">Longer-term roadmap</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* ── User Account & Auth ────── */}
                            <SectionCard icon={Users} title="User Account & Authentication">
                                <Feature phase="mvp">User registration with email & password</Feature>
                                <Feature phase="mvp">Secure login / logout with session management</Feature>
                                <Feature phase="mvp">User profile management (name, address, phone)</Feature>
                                <Feature phase="mvp">Password reset & recovery via email</Feature>
                                <Feature phase="vision">Social login (Google, Facebook, Apple)</Feature>
                                <Feature phase="growth">Multiple delivery addresses per account</Feature>
                                <Feature phase="growth">Order history & reorder functionality</Feature>
                            </SectionCard>

                            {/* ── Product Catalogue ──────── */}
                            <SectionCard icon={Package} title="Product Catalogue & Search">
                                <Feature phase="mvp">Full product catalogue with categories & subcategories</Feature>
                                <Feature phase="mvp">Product detail pages with images, weight, pricing, and halal details</Feature>
                                <Feature phase="mvp">Category browsing with simple filtering</Feature>
                                <Feature phase="mvp">Product search with keyword matching</Feature>
                                <Feature phase="vision">Advanced filters (price range, brand, dietary)</Feature>
                                <Feature phase="vision">Product ratings & customer reviews</Feature>
                                <Feature phase="growth">Recently viewed products history</Feature>
                                <Feature phase="growth">Autocomplete search suggestions</Feature>
                                <Feature phase="vision">AI-powered product recommendations</Feature>
                                <Feature phase="vision">Visual / image-based search</Feature>
                                <Feature phase="vision">Voice search integration</Feature>
                            </SectionCard>

                            {/* ── Shopping & Cart ─────────── */}
                            <SectionCard icon={ShoppingCart} title="Shopping Cart & Wishlist">
                                <Feature phase="mvp">Add to cart with quantity selection</Feature>
                                <Feature phase="mvp">Persistent cart across sessions</Feature>
                                <Feature phase="mvp">Cart summary with subtotal, delivery charge, and order total</Feature>
                                <Feature phase="mvp">Update quantity & remove items from cart</Feature>
                                <Feature phase="vision">Save for later / wishlist functionality</Feature>
                                <Feature phase="growth">Favourites list for quick reordering</Feature>
                                <Feature phase="vision">Multi-buy discount auto-calculation</Feature>
                                <Feature phase="vision">Smart shopping lists based on purchase history</Feature>
                                <Feature phase="vision">Shared wishlists & gift registries</Feature>
                            </SectionCard>

                            {/* ── Checkout & Payments ────── */}
                            <SectionCard icon={CreditCard} title="Checkout & Payments">
                                <Feature phase="mvp">Streamlined multi-step checkout flow</Feature>
                                <Feature phase="mvp">Stripe payment integration (cards & wallets)</Feature>
                                <Feature phase="mvp">Order confirmation with email receipt</Feature>
                                <Feature phase="mvp">Guest checkout option</Feature>
                                <Feature phase="vision">Apple Pay & Google Pay support</Feature>
                                <Feature phase="growth">Promo code & voucher redemption</Feature>
                                <Feature phase="growth">Save payment method for faster checkout</Feature>
                                <Feature phase="vision">Split payment options</Feature>
                            </SectionCard>

                            {/* ── Delivery & Fulfilment ──── */}
                            <SectionCard icon={Truck} title="Delivery & Fulfilment">
                                <Feature phase="mvp">Delivery zone management (Dartford, Orpington, Sidcup)</Feature>
                                <Feature phase="mvp">Delivery scheduling with limited date and slot selection</Feature>
                                <Feature phase="mvp">Free delivery threshold (orders over £65)</Feature>
                                <Feature phase="mvp">Postcode-based delivery validation</Feature>
                                <Feature phase="mvp">Admin delivery slot capacity management</Feature>
                                <Feature phase="vision">Real-time order tracking with status updates</Feature>
                                <Feature phase="growth">Email delivery notifications</Feature>
                                <Feature phase="vision">SMS notifications</Feature>
                                <Feature phase="vision">Delivery driver assignment & routing</Feature>
                                <Feature phase="vision">Same-day & express delivery options</Feature>
                            </SectionCard>

                            {/* ── Promotions & Loyalty ────── */}
                            <SectionCard icon={Tag} title="Promotions & Loyalty">
                                <Feature phase="mvp">Featured products on homepage</Feature>
                                <Feature phase="growth">Weekly special offers & sale prices</Feature>
                                <Feature phase="growth">Bundle deals & multi-buy offers</Feature>
                                <Feature phase="vision">Loyalty points system (earn & redeem)</Feature>
                                <Feature phase="vision">Referral programme with rewards</Feature>
                                <Feature phase="vision">Flash sales & time-limited deals</Feature>
                                <Feature phase="vision">First-order discount for new customers</Feature>
                                <Feature phase="vision">Personalised offers based on shopping habits</Feature>
                            </SectionCard>

                            {/* ── Customer Service ────────── */}
                            <SectionCard icon={Headphones} title="Customer Service & Support">
                                <Feature phase="mvp">Contact form & email support</Feature>
                                <Feature phase="mvp">FAQ page with common questions</Feature>
                                <Feature phase="mvp">Order enquiry by order number</Feature>
                                <Feature phase="vision">Live chat support widget</Feature>
                                <Feature phase="growth">WhatsApp business integration</Feature>
                                <Feature phase="growth">Returns & refund management system</Feature>
                                <Feature phase="vision">Customer feedback & complaint tracking</Feature>
                                <Feature phase="vision">AI-powered chatbot for instant answers</Feature>
                            </SectionCard>

                            {/* ── Admin & Operations ──────── */}
                            <SectionCard icon={LayoutDashboard} title="Admin Dashboard & Operations">
                                <Feature phase="mvp">Admin dashboard with key metrics overview</Feature>
                                <Feature phase="mvp">Product management (CRUD, images, pricing)</Feature>
                                <Feature phase="mvp">Category & subcategory management</Feature>
                                <Feature phase="mvp">Order management with status updates</Feature>
                                <Feature phase="mvp">Basic stock tracking and low-stock visibility</Feature>
                                <Feature phase="growth">Customer management & communication</Feature>
                                <Feature phase="vision">Staff roles & permission management</Feature>
                                <Feature phase="growth">Bulk product import/export (CSV)</Feature>
                                <Feature phase="vision">Automated stock reordering from suppliers</Feature>
                                <Feature phase="vision">Multi-warehouse inventory management</Feature>
                            </SectionCard>

                            {/* ── Marketing & Growth ──────── */}
                            <SectionCard icon={Megaphone} title="Marketing & Growth">
                                <Feature phase="mvp">SEO-optimised pages with meta tags</Feature>
                                <Feature phase="growth">Newsletter subscription collection</Feature>
                                <Feature phase="mvp">Social media links & sharing</Feature>
                                <Feature phase="growth">Email marketing campaigns (Mailchimp/Brevo)</Feature>
                                <Feature phase="vision">Push notifications for offers & updates</Feature>
                                <Feature phase="vision">Blog / recipe section for content marketing</Feature>
                                <Feature phase="mvp">Google Analytics & conversion tracking</Feature>
                                <Feature phase="vision">Influencer & affiliate marketing programme</Feature>
                                <Feature phase="vision">Seasonal campaign automation</Feature>
                            </SectionCard>

                            {/* ── Analytics & BI ──────────── */}
                            <SectionCard icon={BarChart3} title="Analytics & Business Intelligence">
                                <Feature phase="mvp">Basic sales reports (daily, weekly, monthly)</Feature>
                                <Feature phase="mvp">Order & revenue dashboard</Feature>
                                <Feature phase="vision">Customer behaviour analytics</Feature>
                                <Feature phase="growth">Product performance reports (bestsellers, slow-movers)</Feature>
                                <Feature phase="growth">Delivery performance metrics</Feature>
                                <Feature phase="vision">Cart abandonment tracking & recovery</Feature>
                                <Feature phase="vision">Predictive demand forecasting</Feature>
                                <Feature phase="vision">Advanced BI dashboard with custom reports</Feature>
                                <Feature phase="vision">Revenue attribution & ROI analysis</Feature>
                            </SectionCard>
                        </div>
                    </div>

                    {/* ━━ 3. DEVELOPMENT TIMELINE ━━━━━━━━━━━━━━ */}
                    <div id="timeline" className="max-w-4xl mx-auto mb-16 scroll-mt-32">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-orfarm-green flex items-center justify-center text-white font-bold text-sm">3</div>
                            <h2 className="text-2xl font-bold text-orfarm-blue">Development Timeline</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Phase 1 */}
                            <div className="bg-white rounded-2xl shadow-sm border-2 border-emerald-200 p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <Rocket className="size-5 text-emerald-600" />
                                    <h3 className="font-bold text-emerald-700">Phase 1: MVP Launch</h3>
                                </div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-4">Weeks 1 &ndash; 8</p>
                                <div className="space-y-3">
                                    <TimelineItem month="W1" title="Discovery & Foundation" desc="Final scope, database setup, authentication, admin structure, catalogue foundation" active />
                                    <TimelineItem month="W2" title="Shopping Flow" desc="Product browsing, cart, checkout, postcode validation, delivery slots, Stripe integration" active />
                                    <TimelineItem month="W3" title="Admin Operations" desc="Product CRUD, stock visibility, order management, email confirmations, reporting basics" active />
                                    <TimelineItem month="W4" title="Testing & Launch" desc="Content upload, UAT, performance polish, bug fixes, deployment, and handover" active />
                                </div>
                            </div>

                            {/* Phase 2 */}
                            <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-200 p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <TrendingUp className="size-5 text-blue-600" />
                                    <h3 className="font-bold text-blue-700">Phase 2: Growth</h3>
                                </div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-4">Post-launch</p>
                                <div className="space-y-3">
                                    <TimelineItem month="P1" title="Enhanced Experience" desc="Reorder, favourites, offers, delivery notifications, and WhatsApp support" />
                                    <TimelineItem month="P2" title="Operations Boost" desc="Bulk import, richer reporting, and campaign tools" />
                                    <TimelineItem month="P3" title="Conversion Growth" desc="Reviews, loyalty, advanced filters, and retention features" />
                                </div>
                            </div>

                            {/* Phase 3 */}
                            <div className="bg-white rounded-2xl shadow-sm border-2 border-purple-200 p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <Star className="size-5 text-purple-600" />
                                    <h3 className="font-bold text-purple-700">Phase 3: Vision</h3>
                                </div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-4">Longer-term vision</p>
                                <div className="space-y-3">
                                    <TimelineItem month="V1" title="AI & Personalisation" desc="Recommendations, chatbot, personalised offers, and predictive analytics" />
                                    <TimelineItem month="V2" title="Platform Expansion" desc="Mobile app, subscriptions, zone expansion, and advanced fulfilment" />
                                    <TimelineItem month="V3" title="Market Leadership" desc="Affiliate programme, B2B wholesale, and ecosystem partnerships" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ━━ 4. TECHNOLOGY STACK ━━━━━━━━━━━━━━━━━━ */}
                    <div id="delivery" className="max-w-5xl mx-auto mb-16 scroll-mt-32">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-orfarm-green flex items-center justify-center text-white font-bold text-sm">4</div>
                            <h2 className="text-2xl font-bold text-orfarm-blue">Deliverables & Boundaries</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <SectionCard icon={Package} title="Launch Deliverables">
                                <Feature phase="mvp">Public storefront with homepage, category pages, product pages, cart, and checkout</Feature>
                                <Feature phase="mvp">Admin dashboard for products, categories, orders, delivery slots, and stock visibility</Feature>
                                <Feature phase="mvp">Stripe payments with email confirmation and payment status handling</Feature>
                                <Feature phase="mvp">Delivery postcode rules, slot selection, and delivery charge logic</Feature>
                                <Feature phase="mvp">Legal content pages, SEO basics, analytics setup, deployment, and launch support</Feature>
                            </SectionCard>

                            <SectionCard icon={Shield} title="Out of Scope for 4-Week MVP">
                                <Feature phase="growth">Native mobile app, subscription boxes, and multi-language support</Feature>
                                <Feature phase="growth">Driver routing, live GPS tracking, and same-day delivery logistics</Feature>
                                <Feature phase="growth">Marketplace integrations, courier APIs, and supplier automation</Feature>
                                <Feature phase="growth">Advanced loyalty, AI recommendations, and deep BI reporting</Feature>
                                <Feature phase="growth">Large-scale redesigns or brand strategy work beyond implementation</Feature>
                            </SectionCard>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <SectionCard icon={Clock} title="Assumptions & Dependencies">
                                <Feature phase="mvp">Client provides product data, pricing, images, halal details, and delivery postcode list on time</Feature>
                                <Feature phase="mvp">Fresh Valley supplies legal text, refund policy, and business contact details for launch pages</Feature>
                                <Feature phase="mvp">One feedback cycle per milestone is assumed to maintain the 8-week timeline</Feature>
                                <Feature phase="mvp">Third-party accounts for domain, hosting, Stripe, and email services will be available when required</Feature>
                            </SectionCard>

                            <SectionCard icon={CheckCircle2} title="Acceptance Criteria">
                                <Feature phase="mvp">Customers can browse products, add to cart, choose a slot, and complete payment end-to-end</Feature>
                                <Feature phase="mvp">Admin can create and update products, manage stock, review orders, and update delivery slots</Feature>
                                <Feature phase="mvp">Postcode validation, confirmation emails, and payment reconciliation work reliably</Feature>
                                <Feature phase="mvp">Site is responsive on mobile and ready for production deployment with agreed launch content</Feature>
                            </SectionCard>
                        </div>
                    </div>

                    <div id="tech" className="max-w-4xl mx-auto mb-16 scroll-mt-32">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-orfarm-green flex items-center justify-center text-white font-bold text-sm">5</div>
                            <h2 className="text-2xl font-bold text-orfarm-blue">Technology Stack</h2>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <p className="text-sm text-gray-600 mb-8">
                                Built on a modern, battle-tested technology stack chosen for performance, security, scalability, and developer productivity.
                            </p>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 border border-red-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                                            <Code2 className="size-4 text-white" />
                                        </div>
                                        <h4 className="font-bold text-gray-800">Laravel 11</h4>
                                    </div>
                                    <p className="text-xs text-gray-500">Backend framework: routing, authentication, Eloquent ORM, queues, and API layer.</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <Zap className="size-4 text-white" />
                                        </div>
                                        <h4 className="font-bold text-gray-800">React 18</h4>
                                    </div>
                                    <p className="text-xs text-gray-500">Frontend UI library: component-based architecture, hooks, and reactive state management.</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                            <GitBranch className="size-4 text-white" />
                                        </div>
                                        <h4 className="font-bold text-gray-800">Inertia.js</h4>
                                    </div>
                                    <p className="text-xs text-gray-500">SPA bridge: server-side routing with client-side rendering for seamless page transitions.</p>
                                </div>
                                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                                            <Layers className="size-4 text-white" />
                                        </div>
                                        <h4 className="font-bold text-gray-800">Tailwind CSS</h4>
                                    </div>
                                    <p className="text-xs text-gray-500">Utility-first CSS framework: rapid UI development with consistent design system.</p>
                                </div>
                                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-5 border border-indigo-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                            <CreditCard className="size-4 text-white" />
                                        </div>
                                        <h4 className="font-bold text-gray-800">Stripe</h4>
                                    </div>
                                    <p className="text-xs text-gray-500">Payment processing: secure card payments, Apple Pay, Google Pay, and PSD2 compliance.</p>
                                </div>
                                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                                            <Database className="size-4 text-white" />
                                        </div>
                                        <h4 className="font-bold text-gray-800">MySQL</h4>
                                    </div>
                                    <p className="text-xs text-gray-500">Relational database: reliable data storage with full ACID compliance and scalable performance.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ━━ 5. PRICING & PAYMENT ━━━━━━━━━━━━━━━━━ */}
                    <div id="pricing" className="max-w-4xl mx-auto mb-16 scroll-mt-32">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-orfarm-green flex items-center justify-center text-white font-bold text-sm">6</div>
                            <h2 className="text-2xl font-bold text-orfarm-blue">Pricing & Payment Plan</h2>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Pricing Hero */}
                            <div className="bg-gradient-to-r from-orfarm-blue to-[#0c1035] text-white p-10 text-center">
                                <p className="text-xs uppercase tracking-widest text-white/50 mb-2">Total Project Investment</p>
                                <p className="text-5xl font-bold mb-2">£1,500</p>
                                <p className="text-white/60 text-sm">One-time development cost &middot; No hidden fees</p>
                            </div>

                            <div className="p-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Payment Schedule */}
                                    <div>
                                        <h4 className="font-bold text-orfarm-blue mb-4 flex items-center gap-2">
                                            <Calendar className="size-4 text-orfarm-green" />
                                            Instalment Payment Plan
                                        </h4>
                                        <div className="bg-gray-50 rounded-xl p-5">
                                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                                <span className="text-sm text-gray-600">Monthly Payment</span>
                                                <span className="font-bold text-orfarm-blue">£125.00</span>
                                            </div>
                                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                                <span className="text-sm text-gray-600">Payment Duration</span>
                                                <span className="font-bold text-orfarm-blue">12 Months</span>
                                            </div>
                                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                                <span className="text-sm text-gray-600">Total Amount</span>
                                                <span className="font-bold text-orfarm-blue">£1,500.00</span>
                                            </div>
                                            <div className="flex items-center justify-between py-3">
                                                <span className="text-sm text-gray-600">Interest / Fees</span>
                                                <span className="font-bold text-emerald-600">£0.00 (0%)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Costs */}
                                    <div>
                                        <h4 className="font-bold text-orfarm-blue mb-4 flex items-center gap-2">
                                            <Server className="size-4 text-orfarm-green" />
                                            Ongoing Costs
                                        </h4>
                                        <div className="bg-gray-50 rounded-xl p-5">
                                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                                <div>
                                                    <span className="text-sm text-gray-600">Server & Hosting</span>
                                                    <p className="text-xs text-gray-400">Cloud hosting, SSL, backups</p>
                                                </div>
                                                <span className="font-bold text-orfarm-blue">£25/mo</span>
                                            </div>
                                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                                <div>
                                                    <span className="text-sm text-gray-600">Domain Name</span>
                                                    <p className="text-xs text-gray-400">freshvalleyshopping.com</p>
                                                </div>
                                                <span className="font-bold text-emerald-600">FREE</span>
                                            </div>
                                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                                <div>
                                                    <span className="text-sm text-gray-600">SSL Certificate</span>
                                                    <p className="text-xs text-gray-400">256-bit encryption</p>
                                                </div>
                                                <span className="font-bold text-emerald-600">Included</span>
                                            </div>
                                            <div className="flex items-center justify-between py-3">
                                                <div>
                                                    <span className="text-sm text-gray-600">Email Hosting</span>
                                                    <p className="text-xs text-gray-400">sales@freshvalleyshopping.com</p>
                                                </div>
                                                <span className="font-bold text-emerald-600">Included</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ━━ 6. SUPPORT & MAINTENANCE ━━━━━━━━━━━━━ */}
                    <div id="support" className="max-w-4xl mx-auto mb-16 scroll-mt-32">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-orfarm-green flex items-center justify-center text-white font-bold text-sm">7</div>
                            <h2 className="text-2xl font-bold text-orfarm-blue">Support & Maintenance</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* First 6 Months */}
                            <div className="bg-white rounded-2xl shadow-sm border-2 border-emerald-200 p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-bl-xl">
                                    Included Free
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-5">
                                    <Shield className="size-6 text-emerald-600" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-2">First 6 Months</h3>
                                <p className="text-sm text-gray-500 mb-5">Comprehensive free support & development</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                        Full technical support via email & chat
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                        Bug fixes & security patches
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                        Minor enhancements and launch support within the agreed roadmap
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                        Performance monitoring & optimisation
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                        Server management & maintenance
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                        Database backups & disaster recovery
                                    </li>
                                </ul>
                            </div>

                            {/* After 6 Months */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                                    <RefreshCw className="size-6 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-2">After 6 Months</h3>
                                <p className="text-sm text-gray-500 mb-5">Continued free maintenance + paid features</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span><strong className="text-emerald-600">Free:</strong> Technical support & guidance</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span><strong className="text-emerald-600">Free:</strong> Bug fixes & security updates</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span><strong className="text-emerald-600">Free:</strong> Server maintenance & monitoring</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span><strong className="text-emerald-600">Free:</strong> Database backups & uptime</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600 pt-3 border-t border-gray-100">
                                        <CreditCard className="size-4 text-blue-500 shrink-0 mt-0.5" />
                                        <span><strong className="text-blue-600">Quoted:</strong> New feature development</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <CreditCard className="size-4 text-blue-500 shrink-0 mt-0.5" />
                                        <span><strong className="text-blue-600">Quoted:</strong> Major UI/UX redesigns</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <CreditCard className="size-4 text-blue-500 shrink-0 mt-0.5" />
                                        <span><strong className="text-blue-600">Quoted:</strong> Third-party integrations</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ━━ 7. TERMS & CONDITIONS ━━━━━━━━━━━━━━━━ */}
                    <div id="terms" className="max-w-4xl mx-auto mb-16 scroll-mt-32">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-orfarm-green flex items-center justify-center text-white font-bold text-sm">8</div>
                            <h2 className="text-2xl font-bold text-orfarm-blue">Terms & Conditions</h2>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">1. Payment Terms</h4>
                                    <p>The total project cost of £1,500 shall be payable in 12 equal monthly instalments of £125 each. The first payment is due upon project commencement. Subsequent payments are due on the same date each calendar month. No interest or additional fees apply to the instalment plan.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">2. Server & Hosting</h4>
                                    <p>Monthly server and hosting charges of £25 are billed separately and payable from the date of deployment. This includes cloud hosting, SSL certificate, automated backups, server monitoring, and email hosting. The server cost is subject to annual review.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">3. Domain Name</h4>
                                    <p>The domain freshvalleyshopping.com is included free of charge and will be registered and managed by Unique Evolution Ltd on behalf of Fresh Valley Shopping. Ownership of the domain belongs to Fresh Valley Shopping.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">4. Support & Maintenance</h4>
                                    <p>Free technical support, bug fixes, security updates, and reasonable launch assistance are included for the first 6 months from the date of project launch. After 6 months, ongoing support and maintenance (bug fixes, security patches, server upkeep) remain free. New feature development and major enhancements will be quoted separately on a per-project basis.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">5. Intellectual Property</h4>
                                    <p>Upon full payment completion, all custom code, designs, and content created specifically for this project shall be transferred to Fresh Valley Shopping. Third-party libraries and frameworks remain under their respective licences.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">6. Project Timeline</h4>
                                    <p>Unique Evolution Ltd will make reasonable efforts to deliver the MVP within 8 weeks of project commencement. This timeline depends on timely content provision, prompt feedback, and no material scope expansion during delivery.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">7. Confidentiality</h4>
                                    <p>Both parties agree to maintain confidentiality of all business information, technical details, and trade secrets shared during the course of this engagement.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">8. Scope Control</h4>
                                    <p>This proposal covers the agreed 8-week MVP only. Features or integrations requested outside the defined MVP scope may affect delivery dates and may be quoted separately.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ━━ ACCEPTANCE / CTA ━━━━━━━━━━━━━━━━━━━━━ */}
                    <div className="max-w-4xl mx-auto mb-20">
                        <div className="bg-gradient-to-r from-orfarm-blue to-[#0c1035] rounded-2xl p-10 text-center text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-5 left-10 w-40 h-40 bg-orfarm-green rounded-full blur-[80px]" />
                                <div className="absolute bottom-5 right-10 w-60 h-60 bg-white rounded-full blur-[100px]" />
                            </div>
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
                                <p className="text-white/60 text-sm max-w-lg mx-auto mb-8">
                                    We're excited to bring Fresh Valley Shopping to life. Let's build something amazing together for your community.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <a
                                        href="mailto:sales@uniqueevolution.co.uk?subject=Fresh Valley Shopping - Proposal Acceptance"
                                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-orfarm-green text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-orfarm-green/25"
                                    >
                                        <Mail className="size-4" />
                                        Accept Proposal
                                    </a>
                                    <a
                                        href="mailto:sales@uniqueevolution.co.uk?subject=Fresh Valley Shopping - Questions"
                                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
                                    >
                                        <MessageSquare className="size-4" />
                                        Ask Questions
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Footer Note ──────────────────────── */}
                    <div className="max-w-4xl mx-auto text-center pb-12">
                        <p className="text-xs text-gray-400">
                            This proposal is valid for 30 days from the date of issue. &copy; {new Date().getFullYear()} Unique Evolution Ltd. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
