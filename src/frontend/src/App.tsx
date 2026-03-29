import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Calendar,
  Clock,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Phone,
  Star,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { BookingStatus } from "./backend.d";
import { BookingModal } from "./components/BookingModal";
import { LotusDecorativeDivider } from "./components/LotusDecorativeDivider";
import { ProfileSetupModal } from "./components/ProfileSetupModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useGetAllBookings,
  useGetCallerUserProfile,
  useGetCourses,
  useGetMyBookings,
  useIsAdmin,
  useUpdateBookingStatus,
} from "./hooks/useQueries";

type Page = "home" | "bookings" | "admin";

export default function App() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const [activePage, setActivePage] = useState<Page>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingModal, setBookingModal] = useState<{
    open: boolean;
    serviceType: string;
    serviceLabel: string;
  }>({ open: false, serviceType: "", serviceLabel: "" });

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsAdmin();

  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    profileFetched &&
    userProfile === null;

  const handleLogin = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.message === "User is already authenticated"
        ) {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const openBooking = (serviceType: string, serviceLabel: string) => {
    setBookingModal({ open: true, serviceType, serviceLabel });
  };

  const scrollToSection = (id: string) => {
    setActivePage("home");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    setMobileMenuOpen(false);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#F5ECD7", color: "#2C1810" }}
    >
      <Toaster position="top-right" richColors />
      <ProfileSetupModal open={showProfileSetup} />
      <BookingModal
        open={bookingModal.open}
        onOpenChange={(open) => setBookingModal((prev) => ({ ...prev, open }))}
        serviceType={bookingModal.serviceType}
        serviceLabel={bookingModal.serviceLabel}
      />

      {/* HEADER */}
      <header
        className="sticky top-0 z-50 shadow-sm"
        style={{ background: "#FDF6E9", borderBottom: "1px solid #D4870A" }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => {
              setActivePage("home");
              scrollToSection("hero");
            }}
            className="flex items-center gap-2 font-cinzel font-bold text-xl tracking-wider"
            style={{ color: "#6B1C1C" }}
            data-ocid="nav.link"
          >
            <span className="text-2xl">🌸</span>
            <span>Soulful Mind</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: "HOME", action: () => scrollToSection("hero") },
              { label: "SERVICES", action: () => scrollToSection("services") },
              { label: "ACADEMY", action: () => scrollToSection("academy") },
              { label: "ABOUT", action: () => scrollToSection("about") },
              { label: "CONTACT", action: () => scrollToSection("contact") },
            ].map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={item.action}
                className="font-cinzel text-xs tracking-widest transition-colors hover:opacity-70"
                style={{ color: "#6B1C1C" }}
                data-ocid="nav.link"
              >
                {item.label}
              </button>
            ))}
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setActivePage("bookings")}
                className="font-cinzel text-xs tracking-widest transition-colors hover:opacity-70"
                style={{
                  color: activePage === "bookings" ? "#D4870A" : "#6B1C1C",
                }}
                data-ocid="nav.link"
              >
                MY BOOKINGS
              </button>
            )}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setActivePage("admin")}
                className="font-cinzel text-xs tracking-widest transition-colors hover:opacity-70"
                style={{
                  color: activePage === "admin" ? "#D4870A" : "#6B1C1C",
                }}
                data-ocid="nav.link"
              >
                ADMIN
              </button>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated && userProfile && (
              <span
                className="hidden md:block font-crimson text-sm"
                style={{ color: "#6B1C1C" }}
              >
                {userProfile.name}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="btn-gold px-5 py-2 text-xs hidden md:flex items-center gap-1.5"
              data-ocid="nav.button"
            >
              {isLoggingIn ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : null}
              {isLoggingIn ? "..." : isAuthenticated ? "LOGOUT" : "LOGIN"}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("services")}
              className="btn-burgundy px-5 py-2 text-xs hidden md:block"
              style={{ color: "#F5ECD7" }}
              data-ocid="nav.primary_button"
            >
              BOOK NOW
            </button>
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: "#6B1C1C" }}
              data-ocid="nav.toggle"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t"
              style={{ background: "#FDF6E9", borderColor: "#D4870A" }}
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                {[
                  { label: "HOME", action: () => scrollToSection("hero") },
                  {
                    label: "SERVICES",
                    action: () => scrollToSection("services"),
                  },
                  {
                    label: "ACADEMY",
                    action: () => scrollToSection("academy"),
                  },
                  { label: "ABOUT", action: () => scrollToSection("about") },
                  {
                    label: "CONTACT",
                    action: () => scrollToSection("contact"),
                  },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.label}
                    onClick={item.action}
                    className="font-cinzel text-sm tracking-widest text-left"
                    style={{ color: "#6B1C1C" }}
                  >
                    {item.label}
                  </button>
                ))}
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      setActivePage("bookings");
                      setMobileMenuOpen(false);
                    }}
                    className="font-cinzel text-sm tracking-widest text-left"
                    style={{ color: "#D4870A" }}
                  >
                    MY BOOKINGS
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleLogin}
                  className="btn-gold py-2 text-xs"
                >
                  {isAuthenticated ? "LOGOUT" : "LOGIN"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* PAGE CONTENT */}
      <AnimatePresence mode="wait">
        {activePage === "home" && (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HomePage openBooking={openBooking} />
          </motion.main>
        )}
        {activePage === "bookings" && isAuthenticated && (
          <motion.main
            key="bookings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MyBookingsPage />
          </motion.main>
        )}
        {activePage === "admin" && isAdmin && (
          <motion.main
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AdminPage />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({
  openBooking,
}: { openBooking: (type: string, label: string) => void }) {
  return (
    <>
      <HeroSection openBooking={openBooking} />
      <LotusDecorativeDivider />
      <ServicesSection openBooking={openBooking} />
      <LotusDecorativeDivider />
      <AcademySection />
      <LotusDecorativeDivider />
      <AboutSection />
      <LotusDecorativeDivider />
      <ContactSection />
      <Footer />
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection({
  openBooking,
}: { openBooking: (type: string, label: string) => void }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-ethnic-bg.dim_1920x1080.jpg')",
        }}
      />
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(107,28,28,0.75) 0%, rgba(45,49,128,0.6) 100%)",
        }}
      />
      {/* Mandala pattern overlay */}
      <div className="absolute inset-0 mandala-bg opacity-30" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p
            className="font-cinzel text-sm tracking-[0.4em] mb-4"
            style={{ color: "#D4870A" }}
          >
            ✦ SACRED HEALING & WISDOM ✦
          </p>
          <h1
            className="font-cinzel font-bold text-4xl md:text-6xl lg:text-7xl leading-tight mb-6"
            style={{
              color: "#F5ECD7",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            AWAKEN YOUR
            <br />
            <span style={{ color: "#D4870A" }}>INNER POTENTIAL</span>
          </h1>
          <p
            className="font-crimson text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "rgba(245,236,215,0.9)" }}
          >
            Journey into the sacred realms of psychology, intuition, and
            mystical wisdom. Transform your soul through personalized healing
            sessions and ancient arts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              className="btn-gold px-8 py-3.5 text-sm font-cinzel tracking-widest"
              onClick={() =>
                openBooking("counselling", "Psychology Counselling")
              }
              data-ocid="hero.primary_button"
            >
              BOOK A SESSION
            </button>
            <button
              type="button"
              className="btn-burgundy px-8 py-3.5 text-sm font-cinzel tracking-widest"
              style={{
                background: "rgba(245,236,215,0.15)",
                border: "1px solid rgba(245,236,215,0.5)",
                color: "#F5ECD7",
              }}
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid="hero.secondary_button"
            >
              EXPLORE SERVICES
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { num: "500+", label: "Souls Guided" },
            { num: "6+", label: "Years of Practice" },
            { num: "98%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="font-cinzel font-bold text-2xl"
                style={{ color: "#D4870A" }}
              >
                {stat.num}
              </div>
              <div
                className="font-crimson text-sm"
                style={{ color: "rgba(245,236,215,0.8)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
          style={{ borderColor: "rgba(212,135,10,0.6)" }}
        >
          <div
            className="w-1 h-3 rounded-full"
            style={{ background: "#D4870A" }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
function ServicesSection({
  openBooking,
}: { openBooking: (type: string, label: string) => void }) {
  const services = [
    {
      id: "counselling",
      label: "Psychology Counselling",
      icon: <Heart className="w-8 h-8" style={{ color: "#D4870A" }} />,
      image: "/assets/generated/service-counselling.dim_600x400.jpg",
      description:
        "Embark on a transformative journey toward mental wellness and emotional balance. Our holistic counselling integrates modern psychology with ancient healing wisdom to nurture your mind, body, and spirit.",
      features: [
        "Anxiety & Stress Relief",
        "Trauma Healing",
        "Relationship Guidance",
        "Mindfulness Practices",
      ],
      price: "₹2,100 per session",
    },
    {
      id: "tarot",
      label: "Tarot Reading",
      icon: <Star className="w-8 h-8" style={{ color: "#D4870A" }} />,
      image: "/assets/generated/service-tarot.dim_600x400.jpg",
      description:
        "Illuminate your path with the sacred art of tarot. Our intuitive readings offer profound insights into your past, present, and future — guiding you toward clarity, purpose, and spiritual awakening.",
      features: [
        "Celtic Cross Spread",
        "Love & Relationships",
        "Career Guidance",
        "Spiritual Path Reading",
      ],
      price: "₹2,100 per session",
    },
  ];

  return (
    <section id="services" className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p
            className="font-cinzel text-xs tracking-[0.4em] mb-3"
            style={{ color: "#D4870A" }}
          >
            ✦ HEALING & GUIDANCE ✦
          </p>
          <h2
            className="section-heading text-3xl md:text-4xl mb-4"
            style={{ color: "#6B1C1C" }}
          >
            OUR SACRED SERVICES
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div
              className="h-px w-16"
              style={{
                background: "linear-gradient(90deg, transparent, #D4870A)",
              }}
            />
            <div
              className="w-2 h-2 rotate-45"
              style={{ background: "#D4870A" }}
            />
            <div
              className="h-px w-16"
              style={{
                background: "linear-gradient(90deg, #D4870A, transparent)",
              }}
            />
          </div>
          <p
            className="font-crimson text-lg mt-4 max-w-2xl mx-auto"
            style={{ color: "#5a3a2a" }}
          >
            Choose from our sacred healing modalities, each designed to awaken
            and restore your authentic self.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <div
                className="ethnic-card rounded-2xl overflow-hidden"
                data-ocid={`services.card.${i + 1}`}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(107,28,28,0.7) 0%, transparent 60%)",
                    }}
                  />
                  <div className="absolute bottom-4 left-4">{service.icon}</div>
                </div>
                <div className="p-6">
                  <h3
                    className="font-cinzel font-bold text-xl mb-3"
                    style={{ color: "#6B1C1C" }}
                  >
                    {service.label}
                  </h3>
                  <p
                    className="font-crimson text-base leading-relaxed mb-4"
                    style={{ color: "#5a3a2a" }}
                  >
                    {service.description}
                  </p>
                  <ul className="grid grid-cols-2 gap-2 mb-6">
                    {service.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-center gap-1.5 font-crimson text-sm"
                        style={{ color: "#5a3a2a" }}
                      >
                        <span style={{ color: "#D4870A" }}>✦</span> {feat}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <span
                      className="font-cinzel text-xs tracking-widest"
                      style={{ color: "#D4870A" }}
                    >
                      CHARGE
                    </span>
                    <span
                      className="font-cinzel font-bold text-base"
                      style={{ color: "#6B1C1C" }}
                    >
                      {service.price}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="w-full btn-gold py-3 text-xs font-cinzel tracking-widest"
                    onClick={() => openBooking(service.id, service.label)}
                    data-ocid={`services.item.${i + 1}`}
                  >
                    BOOK A SESSION
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ACADEMY ──────────────────────────────────────────────────────────────────
function AcademySection() {
  const { data: courses, isLoading } = useGetCourses();

  const fallbackCourses = [
    {
      id: 1n,
      title: "Basic Digital Marketing Course",
      description:
        "Master the art of digital storytelling and brand alchemy. Learn SEO, social media strategy, content creation, and paid advertising with an intuitive, purposeful approach that aligns with your authentic brand voice.",
      price: "₹15,000",
      duration: "8 Weeks",
      category: "Marketing",
      modules: [
        "Brand Identity & Strategy",
        "SEO & Content Alchemy",
        "Social Media Mastery",
        "Analytics & Growth",
        "Paid Advertising",
        "Email Marketing",
      ],
      image: "/assets/generated/course-digital-marketing.dim_600x400.jpg",
    },
    {
      id: 2n,
      title: "Tarot & Intuitive Arts",
      description:
        "Unlock the mystical language of the tarot. From major arcana symbolism to advanced spread techniques, this course awakens your intuitive gifts and teaches you to read the sacred cards with depth and confidence.",
      price: "₹12,000",
      duration: "6 Weeks",
      category: "Mystical Arts",
      modules: [
        "Tarot Foundations",
        "Major Arcana Deep Dive",
        "Minor Arcana Mastery",
        "Spread Techniques",
        "Intuitive Reading",
        "Professional Practice",
      ],
      image: "/assets/generated/course-tarot-arts.dim_600x400.jpg",
    },
  ];

  const displayCourses =
    courses && courses.length > 0
      ? courses.map((c, i) => ({
          ...c,
          image:
            i === 0
              ? "/assets/generated/course-digital-marketing.dim_600x400.jpg"
              : "/assets/generated/course-tarot-arts.dim_600x400.jpg",
          price: i === 1 ? "₹12,000" : c.price,
        }))
      : fallbackCourses;

  return (
    <section
      id="academy"
      className="py-20 px-4"
      style={{ background: "rgba(107,28,28,0.04)" }}
    >
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p
            className="font-cinzel text-xs tracking-[0.4em] mb-3"
            style={{ color: "#D4870A" }}
          >
            ✦ LEARN & GROW ✦
          </p>
          <h2
            className="section-heading text-3xl md:text-4xl mb-4"
            style={{ color: "#6B1C1C" }}
          >
            SACRED ACADEMY
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div
              className="h-px w-16"
              style={{
                background: "linear-gradient(90deg, transparent, #D4870A)",
              }}
            />
            <div
              className="w-2 h-2 rotate-45"
              style={{ background: "#D4870A" }}
            />
            <div
              className="h-px w-16"
              style={{
                background: "linear-gradient(90deg, #D4870A, transparent)",
              }}
            />
          </div>
          <p
            className="font-crimson text-lg mt-4 max-w-2xl mx-auto"
            style={{ color: "#5a3a2a" }}
          >
            Deepen your knowledge with our transformative courses in digital
            mastery and mystical arts.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <Skeleton
                key={i}
                className="h-96 rounded-2xl"
                data-ocid="academy.loading_state"
              />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {displayCourses.map((course, i) => (
              <motion.div
                key={String(course.id)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <div
                  className="ethnic-card rounded-2xl overflow-hidden"
                  data-ocid={`academy.item.${i + 1}`}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={(course as (typeof fallbackCourses)[0]).image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(26,74,46,0.7) 0%, transparent 60%)",
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <Badge
                        className="font-cinzel text-xs tracking-wider"
                        style={{
                          background: "#D4870A",
                          color: "#2C1810",
                          border: "none",
                        }}
                      >
                        {course.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3
                        className="font-cinzel font-bold text-xl"
                        style={{ color: "#6B1C1C" }}
                      >
                        {course.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <span
                        className="flex items-center gap-1 font-crimson text-sm"
                        style={{ color: "#1A4A2E" }}
                      >
                        <Clock className="w-3.5 h-3.5" /> {course.duration}
                      </span>
                      <span
                        className="font-cinzel font-bold text-lg"
                        style={{ color: "#D4870A" }}
                      >
                        {course.price}
                      </span>
                    </div>
                    <p
                      className="font-crimson text-base leading-relaxed mb-4"
                      style={{ color: "#5a3a2a" }}
                    >
                      {course.description}
                    </p>
                    <div className="mb-5">
                      <p
                        className="font-cinzel text-xs tracking-widest mb-2"
                        style={{ color: "#6B1C1C" }}
                      >
                        MODULES INCLUDED:
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {course.modules.slice(0, 6).map((mod) => (
                          <div
                            key={mod}
                            className="flex items-center gap-1.5 font-crimson text-sm"
                            style={{ color: "#5a3a2a" }}
                          >
                            <BookOpen
                              className="w-3 h-3 flex-shrink-0"
                              style={{ color: "#D4870A" }}
                            />
                            <span className="truncate">{mod}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-full btn-gold py-3 text-xs font-cinzel tracking-widest"
                      onClick={() =>
                        toast.success(
                          `🎓 You've enrolled in ${course.title}! Check your email for details.`,
                        )
                      }
                      data-ocid={`academy.item.${i + 1}`}
                    >
                      ENROLL NOW
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Image */}
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-3xl opacity-30"
              style={{
                background: "linear-gradient(135deg, #D4870A, #6B1C1C)",
              }}
            />
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ border: "3px solid #D4870A" }}
            >
              <img
                src="/assets/uploads/whatsapp_image_2025-10-02_at_4.35.38_pm_3-019d3913-065b-77d2-9f60-4119b11874c2-1.jpeg"
                alt="Your Guide"
                className="w-full object-cover"
                style={{ maxHeight: "500px" }}
              />
            </div>
            {/* Decorative element */}
            <div
              className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full flex items-center justify-center font-cinzel text-xs text-center leading-tight"
              style={{
                background: "#6B1C1C",
                color: "#D4870A",
                border: "2px solid #D4870A",
              }}
            >
              6+ Years
              <br />
              Practice
            </div>
          </div>

          {/* Content */}
          <div>
            <p
              className="font-cinzel text-xs tracking-[0.4em] mb-3"
              style={{ color: "#D4870A" }}
            >
              ✦ YOUR GUIDE ✦
            </p>
            <h2
              className="section-heading text-3xl md:text-4xl mb-5"
              style={{ color: "#6B1C1C" }}
            >
              MEET YOUR SACRED GUIDE
            </h2>
            <div
              className="h-px w-20 mb-6"
              style={{
                background: "linear-gradient(90deg, #D4870A, transparent)",
              }}
            />
            <p
              className="font-crimson text-lg leading-relaxed mb-4"
              style={{ color: "#5a3a2a" }}
            >
              <strong>Sonia Arora</strong> is a dedicated Psychological
              Counsellor, Tarot Reader, Healer, and Basic Digital Marketing
              Educator with over 6 years of professional experience. She is
              committed to helping individuals navigate emotional challenges,
              gain clarity, and achieve personal growth through a holistic
              approach that blends psychology with intuitive guidance.
            </p>
            <p
              className="font-crimson text-lg leading-relaxed mb-4"
              style={{ color: "#5a3a2a" }}
            >
              With a strong foundation in counselling, Sonia provides a safe and
              supportive space for clients to express themselves, heal from
              within, and develop a deeper understanding of their thoughts and
              emotions. Her expertise in tarot reading allows her to offer
              insightful guidance, helping individuals make confident decisions
              and find direction in various aspects of life.
            </p>
            <p
              className="font-crimson text-lg leading-relaxed mb-4"
              style={{ color: "#5a3a2a" }}
            >
              As a healer, she focuses on emotional well-being, energy balance,
              and inner transformation, empowering people to overcome negativity
              and lead a more fulfilled life. In addition to her work in
              counselling and healing, Sonia also shares her knowledge as a
              Basic Digital Marketing Teacher, guiding beginners to build their
              online presence and grow their skills in the digital world.
            </p>
            <p
              className="font-crimson text-lg leading-relaxed mb-6"
              style={{ color: "#5a3a2a" }}
            >
              Through her work, Sonia Arora aims to inspire, heal, and uplift
              individuals by combining practical knowledge with spiritual
              wisdom.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: <Star className="w-5 h-5" />,
                  label: "Certified Tarot Reader",
                },
                {
                  icon: <Heart className="w-5 h-5" />,
                  label: "Trauma-Informed Healer",
                },
                {
                  icon: <Calendar className="w-5 h-5" />,
                  label: "6+ Years Experience",
                },
                {
                  icon: <BookOpen className="w-5 h-5" />,
                  label: "Certified Psychological Counsellor",
                },
                {
                  icon: <Megaphone className="w-5 h-5" />,
                  label: "Digital Marketer",
                },
                {
                  icon: <Star className="w-5 h-5" />,
                  label: "Personality Development Coach",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 font-crimson text-sm"
                  style={{ color: "#5a3a2a" }}
                >
                  <span style={{ color: "#D4870A" }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <section
      id="contact"
      className="py-20 px-4"
      style={{ background: "rgba(107,28,28,0.04)" }}
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p
            className="font-cinzel text-xs tracking-[0.4em] mb-3"
            style={{ color: "#D4870A" }}
          >
            ✦ REACH OUT ✦
          </p>
          <h2
            className="section-heading text-3xl md:text-4xl mb-4"
            style={{ color: "#6B1C1C" }}
          >
            CONNECT WITH US
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div
              className="h-px w-16"
              style={{
                background: "linear-gradient(90deg, transparent, #D4870A)",
              }}
            />
            <div
              className="w-2 h-2 rotate-45"
              style={{ background: "#D4870A" }}
            />
            <div
              className="h-px w-16"
              style={{
                background: "linear-gradient(90deg, #D4870A, transparent)",
              }}
            />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Phone className="w-6 h-6" />,
              title: "Call Us",
              info: "+91 72909 80285",
              sub: "Mon–Sat: 9am–7pm IST",
            },
            {
              icon: <Mail className="w-6 h-6" />,
              title: "Email Us",
              info: "arorasonia1956@gmail.com",
              sub: "We reply within 24 hours",
            },
            {
              icon: <MapPin className="w-6 h-6" />,
              title: "Visit Us",
              info: "India",
              sub: "By appointment only",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="ethnic-card rounded-2xl p-6 text-center"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "linear-gradient(135deg, #D4870A, #b06a00)",
                  color: "#FDF6E9",
                }}
              >
                {item.icon}
              </div>
              <h3
                className="font-cinzel font-bold mb-2"
                style={{ color: "#6B1C1C" }}
              >
                {item.title}
              </h3>
              <p
                className="font-crimson text-base"
                style={{ color: "#5a3a2a" }}
              >
                {item.info}
              </p>
              <p className="font-crimson text-sm" style={{ color: "#9a7060" }}>
                {item.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── MY BOOKINGS ──────────────────────────────────────────────────────────────
function MyBookingsPage() {
  const { data: bookings, isLoading } = useGetMyBookings();

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      pending: "#D4870A",
      confirmed: "#1A4A2E",
      completed: "#2D3180",
      cancelled: "#6B1C1C",
      rejected: "#999",
    };
    return map[status] || "#999";
  };

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <p
            className="font-cinzel text-xs tracking-[0.4em] mb-3"
            style={{ color: "#D4870A" }}
          >
            ✦ YOUR JOURNEY ✦
          </p>
          <h2
            className="section-heading text-3xl mb-4"
            style={{ color: "#6B1C1C" }}
          >
            MY BOOKINGS
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div
              className="h-px w-16"
              style={{
                background: "linear-gradient(90deg, transparent, #D4870A)",
              }}
            />
            <div
              className="w-2 h-2 rotate-45"
              style={{ background: "#D4870A" }}
            />
            <div
              className="h-px w-16"
              style={{
                background: "linear-gradient(90deg, #D4870A, transparent)",
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4" data-ocid="bookings.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div
            className="text-center py-16 ethnic-card rounded-2xl"
            data-ocid="bookings.empty_state"
          >
            <div className="text-5xl mb-4">🌸</div>
            <h3
              className="font-cinzel text-xl mb-2"
              style={{ color: "#6B1C1C" }}
            >
              No bookings yet
            </h3>
            <p className="font-crimson text-base" style={{ color: "#9a7060" }}>
              Your sacred journey awaits. Book your first session today.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, i) => (
              <motion.div
                key={String(booking.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="ethnic-card rounded-xl p-5"
                data-ocid={`bookings.item.${i + 1}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3
                      className="font-cinzel font-bold"
                      style={{ color: "#6B1C1C" }}
                    >
                      {booking.serviceType}
                    </h3>
                    <p
                      className="font-crimson text-sm mt-1"
                      style={{ color: "#9a7060" }}
                    >
                      {booking.date} at {booking.time}
                    </p>
                    {booking.message && (
                      <p
                        className="font-crimson text-sm mt-1 italic"
                        style={{ color: "#5a3a2a" }}
                      >
                        "{booking.message}"
                      </p>
                    )}
                  </div>
                  <Badge
                    className="font-cinzel text-xs tracking-wider self-start sm:self-center capitalize"
                    style={{
                      background: statusColor(booking.status),
                      color: "#FDF6E9",
                      border: "none",
                    }}
                  >
                    {booking.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function AdminPage() {
  const { data: bookings, isLoading } = useGetAllBookings();
  const { mutate: updateStatus } = useUpdateBookingStatus();

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <p
            className="font-cinzel text-xs tracking-[0.4em] mb-3"
            style={{ color: "#D4870A" }}
          >
            ✦ ADMINISTRATION ✦
          </p>
          <h2
            className="section-heading text-3xl mb-4"
            style={{ color: "#6B1C1C" }}
          >
            ALL BOOKINGS
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div
              className="h-px w-16"
              style={{
                background: "linear-gradient(90deg, transparent, #D4870A)",
              }}
            />
            <div
              className="w-2 h-2 rotate-45"
              style={{ background: "#D4870A" }}
            />
            <div
              className="h-px w-16"
              style={{
                background: "linear-gradient(90deg, #D4870A, transparent)",
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div data-ocid="admin.loading_state">
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div
            className="text-center py-16 ethnic-card rounded-2xl"
            data-ocid="admin.empty_state"
          >
            <p className="font-cinzel text-xl" style={{ color: "#6B1C1C" }}>
              No bookings found
            </p>
          </div>
        ) : (
          <div className="ethnic-card rounded-2xl overflow-hidden">
            <Table data-ocid="admin.table">
              <TableHeader>
                <TableRow style={{ background: "rgba(107,28,28,0.06)" }}>
                  {[
                    "NAME",
                    "SERVICE",
                    "DATE & TIME",
                    "EMAIL",
                    "STATUS",
                    "ACTION",
                  ].map((h) => (
                    <TableHead
                      key={h}
                      className="font-cinzel text-xs tracking-widest"
                      style={{ color: "#6B1C1C" }}
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking, i) => (
                  <TableRow
                    key={String(booking.id)}
                    data-ocid={`admin.row.${i + 1}`}
                  >
                    <TableCell className="font-crimson font-semibold">
                      {booking.name}
                    </TableCell>
                    <TableCell className="font-crimson">
                      {booking.serviceType}
                    </TableCell>
                    <TableCell className="font-crimson text-sm">
                      {booking.date}
                      <br />
                      {booking.time}
                    </TableCell>
                    <TableCell className="font-crimson text-sm">
                      {booking.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="font-cinzel text-xs capitalize"
                        style={{
                          background:
                            booking.status === BookingStatus.confirmed
                              ? "#1A4A2E"
                              : booking.status === BookingStatus.pending
                                ? "#D4870A"
                                : booking.status === BookingStatus.completed
                                  ? "#2D3180"
                                  : "#6B1C1C",
                          color: "#FDF6E9",
                          border: "none",
                        }}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={booking.status}
                        onValueChange={(val) =>
                          updateStatus(
                            { id: booking.id, status: val as BookingStatus },
                            {
                              onSuccess: () => toast.success("Status updated"),
                            },
                          )
                        }
                      >
                        <SelectTrigger
                          className="w-36 font-cinzel text-xs"
                          style={{ borderColor: "#D4870A" }}
                          data-ocid={`admin.select.${i + 1}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(BookingStatus).map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              className="font-crimson capitalize"
                            >
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="py-12 px-4"
      style={{ background: "#2C1810", color: "rgba(245,236,215,0.8)" }}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div
              className="font-cinzel font-bold text-xl mb-3 flex items-center gap-2"
              style={{ color: "#D4870A" }}
            >
              <span>🌸</span> Soulful Mind
            </div>
            <p
              className="font-crimson text-base leading-relaxed"
              style={{ color: "rgba(245,236,215,0.7)" }}
            >
              A sacred space for healing, guidance, and transformation. Bridging
              ancient wisdom with modern understanding.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h4
              className="font-cinzel text-sm tracking-widest mb-4"
              style={{ color: "#D4870A" }}
            >
              QUICK LINKS
            </h4>
            <ul className="space-y-2">
              {[
                "Psychology Counselling",
                "Tarot Reading",
                "Digital Marketing Course",
                "Tarot Arts Course",
                "About Us",
              ].map((link) => (
                <li key={link}>
                  <button
                    type="button"
                    className="font-crimson text-sm transition-colors hover:text-amber-400 text-left"
                    style={{ color: "rgba(245,236,215,0.7)" }}
                  >
                    ✦ {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h4
              className="font-cinzel text-sm tracking-widest mb-4"
              style={{ color: "#D4870A" }}
            >
              GET IN TOUCH
            </h4>
            <div className="space-y-3">
              <div
                className="flex items-center gap-2 font-crimson text-sm"
                style={{ color: "rgba(245,236,215,0.7)" }}
              >
                <Phone className="w-4 h-4" style={{ color: "#D4870A" }} />
                +91 72909 80285
              </div>
              <div
                className="flex items-center gap-2 font-crimson text-sm"
                style={{ color: "rgba(245,236,215,0.7)" }}
              >
                <Mail className="w-4 h-4" style={{ color: "#D4870A" }} />
                arorasonia1956@gmail.com
              </div>
              <div
                className="flex items-center gap-2 font-crimson text-sm"
                style={{ color: "rgba(245,236,215,0.7)" }}
              >
                <MapPin className="w-4 h-4" style={{ color: "#D4870A" }} />
                India
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-6"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,135,10,0.5), transparent)",
          }}
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="font-crimson text-sm"
            style={{ color: "rgba(245,236,215,0.5)" }}
          >
            © {year} Soulful Mind. All rights reserved.
          </p>
          <p
            className="font-crimson text-sm"
            style={{ color: "rgba(245,236,215,0.5)" }}
          >
            Built with <span style={{ color: "#D4870A" }}>♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="underline hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(212,135,10,0.8)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
