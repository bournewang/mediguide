import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  Activity,
  BadgeDollarSign,
  CalendarClock,
  ClipboardPlus,
  FileText,
  Globe2,
  HeartHandshake,
  Hospital,
  Languages,
  MapPinned,
  MessagesSquare,
  ScanHeart,
  ShieldCheck,
  Stethoscope,
  Syringe
} from "lucide-react";
import Logo from "./components/Logo";

type FormState = {
  name: string;
  contact: string;
  city: string;
  language: string;
  symptoms: string;
  urgency: string;
  serviceDate: string;
  pagePath: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
};

type LandingPage = {
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  heroTitle: string;
  heroCopy: string;
  trustBullets: string[];
  whoItsFor: string;
  included: string[];
  useCases: string[];
  boundary: string;
  cta: string;
  keywords: string[];
};

type LeadReportItem = {
  id: string;
  name: string;
  contact: string;
  city: string;
  language: string;
  serviceDate: string | null;
  urgency: string;
  symptoms: string;
  status: string;
  emergencyFlag: number;
  pagePath: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  createdAt: string;
};

type LeadSummaryCount = {
  label: string | null;
  count: number;
};

const defaultForm: FormState = {
  name: "",
  contact: "",
  city: "Shanghai",
  language: "English",
  symptoms: "",
  urgency: "Within 24 hours",
  serviceDate: "",
  pagePath: "",
  referrer: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: ""
};

const cities = ["Shanghai", "Beijing", "Shenzhen", "Guangzhou", "Hangzhou"];

const highlights = [
  {
    icon: HeartHandshake,
    text: "Meet the patient at the hospital, hotel, or another agreed location"
  },
  {
    icon: ClipboardPlus,
    text: "Help with registration, queues, payments, and pharmacy pickup"
  },
  {
    icon: Languages,
    text: "Interpret between the patient and hospital staff during the visit"
  },
  {
    icon: FileText,
    text: "Share a clear English summary of the visit and next steps"
  }
];

const steps = [
  {
    icon: MessagesSquare,
    title: "Send your request",
    copy: "Tell us your city, symptoms, preferred language, and when you need support."
  },
  {
    icon: Stethoscope,
    title: "We confirm the plan",
    copy: "Our team reviews urgency, recommends the right hospital or department, and confirms pricing."
  },
  {
    icon: MapPinned,
    title: "Meet your companion",
    copy: "An English-speaking companion helps you navigate the hospital visit from start to finish."
  },
  {
    icon: FileText,
    title: "Receive follow-up notes",
    copy: "You get a plain-English recap of the visit, prescriptions, and suggested next steps."
  }
];

const homepageUseCases = [
  "Fever, cold, stomach pain, or general internal medicine",
  "Children’s hospital visits and vaccination support",
  "Dermatology, dental, eye, ENT, and women’s health visits",
  "Health checkups, second visits, and lab result follow-ups"
];

const audienceSegments = [
  "Expats and long-term foreign residents",
  "Foreign parents bringing children to hospital",
  "Business travelers who need fast local help",
  "Students and first-time hospital visitors"
];

const shanghaiAdvantages = [
  {
    icon: CalendarClock,
    title: "Fast access to care",
    copy: "Shanghai hospitals often provide quicker access to consultations, tests, and follow-up compared with many international markets."
  },
  {
    icon: Hospital,
    title: "Strong specialist resources",
    copy: "Top-tier hospitals in Shanghai offer broad specialist coverage across internal medicine, pediatrics, dermatology, women’s health, imaging, and surgery."
  },
  {
    icon: BadgeDollarSign,
    title: "Cost-effective treatment",
    copy: "Many consultations, scans, and routine procedures can be more cost-effective than equivalent care in the United States and other high-cost systems."
  },
  {
    icon: Globe2,
    title: "Advanced urban hospital network",
    copy: "Shanghai combines major public hospitals, international departments, private clinics, pharmacies, and transport links in one highly connected city."
  }
];

const companionBenefits = [
  {
    icon: Languages,
    text: "Reduce language barriers during registration, consultation, payment, and pharmacy collection"
  },
  {
    icon: MapPinned,
    text: "Help patients understand hospital procedures, queues, departments, and next steps"
  },
  {
    icon: ShieldCheck,
    text: "Make complex hospital visits less stressful for families, business travelers, students, and expats"
  },
  {
    icon: Activity,
    text: "Provide clear support without replacing licensed doctors or medical advice"
  }
];

const trustPoints = [
  "For foreigners navigating hospitals in Shanghai",
  "English-speaking support with clear service boundaries",
  "Transparent fees before the visit starts",
  "Direct human follow-up after every request"
];

const faqs = [
  {
    question: "Is this a medical service?",
    answer:
      "No. CareBridge China is a hospital navigation and accompaniment service. We do not diagnose, prescribe, or replace a licensed doctor."
  },
  {
    question: "Can you help in emergencies?",
    answer:
      "For chest pain, breathing difficulty, severe bleeding, or other emergencies, call local emergency services or go to the nearest emergency department immediately."
  },
  {
    question: "Do you only support public hospitals?",
    answer:
      "We support public hospitals, international departments, and selected private clinics depending on the city and the patient’s needs."
  },
  {
    question: "How is pricing handled?",
    answer:
      "We show a transparent service fee for the companion. Hospital bills, tests, medicine, and transport are paid separately by the patient."
  }
];

const landingPages: LandingPage[] = [
  {
    path: "/english-speaking-hospital-support-shanghai",
    title: "English-Speaking Hospital Support in Shanghai | CareBridge China",
    description:
      "Need help navigating a hospital visit in Shanghai? CareBridge China provides in-person English-speaking hospital accompaniment for foreigners.",
    eyebrow: "English-Speaking Hospital Support in Shanghai",
    heroTitle: "English-speaking hospital support for foreigners in Shanghai",
    heroCopy:
      "If you need to visit a hospital in Shanghai and do not want to manage the process alone, CareBridge China provides in-person English-speaking support from registration to pharmacy pickup.",
    trustBullets: [
      "In-person support at hospitals in Shanghai",
      "Help with registration, queues, payments, and navigation",
      "Live interpretation during the visit",
      "Clear pricing before the visit begins"
    ],
    whoItsFor:
      "This service is designed for expats, foreign families, business travelers, and students who need practical help during a hospital visit in Shanghai.",
    included: [
      "Pre-visit coordination",
      "Hospital and department matching",
      "In-person accompaniment",
      "Interpretation support during the visit",
      "English summary after the visit"
    ],
    useCases: [
      "First-time hospital visits in Shanghai",
      "Internal medicine, dermatology, ENT, eye, and dental visits",
      "Health checkups and follow-up visits",
      "Patients who want help understanding the hospital process"
    ],
    boundary:
      "CareBridge China is not a clinic, doctor, or emergency provider. Hospital treatment, diagnosis, medication, and medical decisions remain with licensed medical providers.",
    cta: "Request hospital support in Shanghai",
    keywords: [
      "english-speaking hospital support shanghai",
      "hospital help for foreigners shanghai",
      "hospital companion shanghai"
    ]
  },
  {
    path: "/hospital-translator-companion-shanghai",
    title: "Hospital Translator and Companion in Shanghai | CareBridge China",
    description:
      "Need a hospital translator in Shanghai? CareBridge China offers in-person hospital companion support for foreigners who need help with communication and logistics.",
    eyebrow: "Hospital Translator and Companion in Shanghai",
    heroTitle: "Hospital translator and companion support in Shanghai",
    heroCopy:
      "Language barriers can make a hospital visit in Shanghai much harder than it needs to be. CareBridge China helps foreign patients communicate clearly with hospital staff and get through the visit with practical, in-person support.",
    trustBullets: [
      "English-speaking hospital companion",
      "Support during registration, consultation, payment, and pharmacy collection",
      "Suitable for first-time hospital visits and complex appointment days",
      "Transparent service fees"
    ],
    whoItsFor:
      "This page is for patients who need more than translation alone. It is for people who need help understanding hospital flow, paperwork, payment steps, and what to do next.",
    included: [
      "Live interpretation during the hospital visit",
      "Navigation between departments and test areas",
      "Support with registration and payment steps",
      "Practical help during a multi-step appointment day",
      "Plain-English recap after the visit"
    ],
    useCases: [
      "You do not speak Chinese well enough for a hospital visit",
      "You are visiting multiple departments or doing tests",
      "You want someone to explain the process step by step",
      "You need help understanding the next action after the visit"
    ],
    boundary:
      "CareBridge China supports hospital navigation and communication. It does not provide diagnosis, treatment, or medical advice.",
    cta: "Request a hospital companion",
    keywords: [
      "hospital translator shanghai",
      "hospital companion shanghai",
      "medical translator shanghai"
    ]
  },
  {
    path: "/pediatric-hospital-help-shanghai",
    title: "Pediatric Hospital Help in Shanghai for Foreign Families | CareBridge China",
    description:
      "Need help taking your child to a hospital in Shanghai? CareBridge China supports foreign families with hospital accompaniment and communication help.",
    eyebrow: "Pediatric Hospital Help in Shanghai",
    heroTitle: "Pediatric hospital help in Shanghai for foreign families",
    heroCopy:
      "Taking a child to hospital is stressful enough without language barriers and an unfamiliar system. CareBridge China helps foreign parents handle pediatric visits in Shanghai with clear, in-person support throughout the process.",
    trustBullets: [
      "Support for pediatric and family hospital visits",
      "Help with registration, consultation flow, payments, and pharmacy pickup",
      "Clear communication for parents during stressful visits",
      "Fast request review for urgent cases"
    ],
    whoItsFor:
      "This service is designed for foreign parents who want a calmer, clearer hospital visit for their child in Shanghai.",
    included: [
      "Support for pediatric visits and family hospital days",
      "Help with registration, routing, and payment",
      "Communication support during the visit",
      "Practical guidance for next steps after the appointment",
      "Follow-up summary in English"
    ],
    useCases: [
      "Fever and common illness visits",
      "Vaccination support",
      "Follow-up appointments",
      "First-time pediatric visits in Shanghai"
    ],
    boundary:
      "CareBridge China is a support service for hospital navigation and accompaniment. In medical emergencies, go to the nearest emergency department immediately.",
    cta: "Request pediatric hospital support",
    keywords: [
      "pediatric hospital help shanghai",
      "foreign families hospital support shanghai",
      "children hospital companion shanghai"
    ]
  }
];

const siteUrl = "https://carebridgechina.com";

function normalizePath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized === "" ? "/" : normalized;
}

function readAttribution(pathname: string): Pick<
  FormState,
  "pagePath" | "referrer" | "utmSource" | "utmMedium" | "utmCampaign" | "utmTerm" | "utmContent"
> {
  const params = new URLSearchParams(window.location.search);

  return {
    pagePath: pathname,
    referrer: document.referrer,
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    utmTerm: params.get("utm_term") ?? "",
    utmContent: params.get("utm_content") ?? ""
  };
}

function setMetaDescription(content: string) {
  let element = document.querySelector('meta[name="description"]');

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", "description");
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertHeadTag(selector: string, build: () => HTMLElement) {
  const existing = document.head.querySelector(selector);
  if (existing) {
    return existing as HTMLElement;
  }

  const element = build();
  document.head.appendChild(element);
  return element;
}

function setNamedMeta(name: string, content: string) {
  const element = upsertHeadTag(`meta[name="${name}"]`, () => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", name);
    return meta;
  });

  element.setAttribute("content", content);
}

function setPropertyMeta(property: string, content: string) {
  const element = upsertHeadTag(`meta[property="${property}"]`, () => {
    const meta = document.createElement("meta");
    meta.setAttribute("property", property);
    return meta;
  });

  element.setAttribute("content", content);
}

function setLinkTag(rel: string, href: string) {
  const element = upsertHeadTag(`link[rel="${rel}"]`, () => {
    const link = document.createElement("link");
    link.setAttribute("rel", rel);
    return link;
  }) as HTMLLinkElement;

  element.setAttribute("href", href);
}

function setRobotsMeta(content: string) {
  setNamedMeta("robots", content);
}

function setJsonLd(id: string, payload: Record<string, unknown>) {
  const element = upsertHeadTag(`script[data-seo-id="${id}"]`, () => {
    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.setAttribute("data-seo-id", id);
    return script;
  });

  element.textContent = JSON.stringify(payload);
}

function Header({ compact = false }: { compact?: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="container-shell flex items-center justify-between py-4">
        <a href="/" aria-label="CareBridge China home">
          <Logo />
        </a>
        <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
          <a href="/#how-it-works">How it works</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#faq">FAQ</a>
          <a href="/english-speaking-hospital-support-shanghai">English support</a>
        </nav>
        <a
          href={compact ? "#request" : "/#request"}
          className="rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800"
        >
          Request support
        </a>
      </div>
    </header>
  );
}

function RequestForm({
  form,
  setForm,
  isSubmitting,
  status,
  onSubmit,
  title,
  copy,
  suitableFor
}: {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  isSubmitting: boolean;
  status: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  title: string;
  copy: string;
  suitableFor: string;
}) {
  return (
    <section id="request" className="section-tint py-16">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="section-copy">{copy}</p>
          <div className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div>
              <p className="text-sm font-semibold text-slate-900">What happens next</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                After you submit your request, we review the case, confirm availability, and contact
                you directly with timing, pricing, and the recommended next step.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Suitable for</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{suitableFor}</p>
            </div>
          </div>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-900">Emergency disclaimer</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              If the patient has severe chest pain, trouble breathing, heavy bleeding, loss of
              consciousness, or other emergency symptoms, go to the nearest emergency department
              immediately.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="card grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Full name
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
                placeholder="Jane Smith"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Email or WeChat
              <input
                required
                value={form.contact}
                onChange={(event) => setForm({ ...form, contact: event.target.value })}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
                placeholder="jane@email.com / wechat-id"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              City
              <select
                value={form.city}
                onChange={(event) => setForm({ ...form, city: event.target.value })}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
              >
                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Language
              <input
                value={form.language}
                onChange={(event) => setForm({ ...form, language: event.target.value })}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
                placeholder="English"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Service date
              <input
                type="date"
                value={form.serviceDate}
                onChange={(event) => setForm({ ...form, serviceDate: event.target.value })}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Urgency
            <select
              value={form.urgency}
              onChange={(event) => setForm({ ...form, urgency: event.target.value })}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
            >
              <option>Within 24 hours</option>
              <option>Within 3 days</option>
              <option>This week</option>
              <option>Just planning ahead</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Symptoms or hospital need
            <textarea
              required
              rows={5}
              value={form.symptoms}
              onChange={(event) => setForm({ ...form, symptoms: event.target.value })}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
              placeholder="Describe the issue, preferred hospital, or the kind of support needed."
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-brand-300"
          >
            {isSubmitting ? "Submitting..." : "Submit request"}
          </button>

          {status ? <p className="text-sm text-slate-600">{status}</p> : null}
        </form>
      </div>
    </section>
  );
}

function LandingPageView({
  page,
  form,
  setForm,
  isSubmitting,
  status,
  onSubmit
}: {
  page: LandingPage;
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  isSubmitting: boolean;
  status: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  return (
    <div>
      <Header compact />
      <main>
        <section className="container-shell grid gap-10 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-medium text-brand-800">
              {page.eyebrow}
            </span>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              {page.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{page.heroCopy}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#request"
                className="rounded-full bg-brand-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                {page.cta}
              </a>
              <a
                href="/"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                View main service page
              </a>
            </div>
          </div>

          <div className="card">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Why people request this service
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-700">
              {page.trustBullets.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-brand-700">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section-surface py-16">
          <div className="container-shell grid gap-6 lg:grid-cols-3">
            <article className="card lg:col-span-1">
              <h2 className="text-2xl font-semibold text-slate-900">Who this is for</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">{page.whoItsFor}</p>
            </article>

            <article className="card lg:col-span-1">
              <h2 className="text-2xl font-semibold text-slate-900">What is included</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {page.included.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand-700" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="card lg:col-span-1">
              <h2 className="text-2xl font-semibold text-slate-900">Common situations</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {page.useCases.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand-700" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="py-16">
          <div className="container-shell">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-slate-900">Important boundary</h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">{page.boundary}</p>
            </div>
          </div>
        </section>

        <RequestForm
          form={form}
          setForm={setForm}
          isSubmitting={isSubmitting}
          status={status}
          onSubmit={onSubmit}
          title="Request support"
          copy="Complete the form below and our team will review your request, confirm availability, and contact you with pricing, timing, and the next step."
          suitableFor={page.useCases.join(", ")}
        />
      </main>
      <Footer />
    </div>
  );
}

function HomePage({
  form,
  setForm,
  isSubmitting,
  status,
  onSubmit,
  nextAvailable
}: {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  isSubmitting: boolean;
  status: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  nextAvailable: string;
}) {
  return (
    <div>
      <Header />
      <main id="top">
        <section className="container-shell grid gap-10 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-medium text-brand-800">
              Hospital Companion &amp; Medical Guidance in China
            </span>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              Hospital help for foreigners in Shanghai, with in-person English-speaking support.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              CareBridge China helps foreign patients get through hospital visits with less
              confusion, less language stress, and clear support from registration to pharmacy
              pickup.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#request"
                className="rounded-full bg-brand-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                Request support
              </a>
              <a
                href="#how-it-works"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                See the process
              </a>
            </div>
            <p className="mt-5 text-sm text-slate-500">
              We reply after reviewing the request and confirming availability. This is a hospital
              accompaniment service, not a clinic or emergency provider.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2">
                Shanghai service coverage
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2">
                English-speaking support
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2">
                Next available: {nextAvailable}
              </span>
            </div>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-sm font-semibold text-slate-900">Best fit for</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                {audienceSegments.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {trustPoints.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Included support
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-700">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.text} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-brand-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{item.text}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Important note</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                We are a hospital navigation service, not a medical provider. In emergencies, seek
                urgent medical care immediately.
              </p>
            </div>
          </div>
        </section>

        <section id="service" className="section-tint py-16">
          <div className="container-shell">
            <h2 className="section-title">A clear and dependable support service</h2>
            <p className="section-copy">
              CareBridge China is designed for foreigners who need practical hospital help, not
              vague information. We focus on coordination, communication, and getting through the
              visit smoothly.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  icon: ClipboardPlus,
                  title: "Before the visit",
                  copy: "Case intake, urgency review, hospital matching, and practical pre-visit preparation."
                },
                {
                  icon: Hospital,
                  title: "At the hospital",
                  copy: "Registration help, live interpretation, queue navigation, and payment support."
                },
                {
                  icon: FileText,
                  title: "After the visit",
                  copy: "English summary, prescription reminders, and follow-up guidance."
                },
                {
                  icon: HeartHandshake,
                  title: "Coordinated support",
                  copy: "Each request is reviewed by a real person to confirm fit, timing, and the right service plan."
                }
              ].map((item) => (
                <article
                  key={item.title}
                  className="card transition duration-200 hover:-translate-y-0.5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-brand-700">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-surface py-16">
          <div className="container-shell">
            <h2 className="section-title">Why many foreigners choose care in Shanghai</h2>
            <p className="section-copy">
              Shanghai offers a strong combination of advanced hospital resources, efficient
              outpatient care, and comparatively reasonable costs for many common healthcare needs.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {shanghaiAdvantages.map((item) => (
                <article
                  key={item.title}
                  className="card transition duration-200 hover:-translate-y-0.5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-brand-700">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="section-surface py-16">
          <div className="container-shell">
            <h2 className="section-title">How it works</h2>
            <p className="section-copy">
              The process is simple: tell us what you need, we confirm the plan, and an
              English-speaking companion helps you through the visit.
            </p>
            <div className="mt-10 grid gap-6 lg:grid-cols-4">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="card transition duration-200 hover:-translate-y-0.5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-brand-700">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-brand-700">Step {index + 1}</span>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-shell grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="card">
              <h2 className="text-2xl font-semibold text-slate-900">
                Why patients value a medical companion
              </h2>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
                {companionBenefits.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li
                      key={item.text}
                      className="flex gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-brand-700">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="card">
              <h2 className="text-2xl font-semibold text-slate-900">Common visit types</h2>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
                {homepageUseCases.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-brand-700">
                      {item.includes("Children") ? (
                        <Syringe className="h-4 w-4" />
                      ) : item.includes("Dermatology") ? (
                        <ScanHeart className="h-4 w-4" />
                      ) : (
                        <Stethoscope className="h-4 w-4" />
                      )}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-soft lg:col-span-2">
              <div className="mb-6 h-px w-full bg-slate-200" />
              <h2 className="text-2xl font-semibold text-slate-900">Service coverage</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["Primary city", "Shanghai"],
                  ["Languages", "English"],
                  ["Service model", "Personal hospital companion"],
                  ["Support process", "Request intake and coordination"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="section-surface py-16">
          <div className="container-shell">
            <h2 className="section-title">Clear pricing</h2>
            <p className="section-copy">
              Service fees are confirmed before the visit starts. Hospital registration,
              consultation, tests, medication, and transport are billed separately by the medical
              provider.
            </p>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {[
                {
                  title: "Half-day accompaniment",
                  price: "¥799",
                  copy: "Up to 4 hours of weekday hospital support, including navigation, in-person interpretation, and visit coordination."
                },
                {
                  title: "Full-day accompaniment",
                  price: "¥1,499",
                  copy: "Up to 8 hours of support for multi-department visits, testing, extended waiting time, or more complex hospital arrangements."
                },
                {
                  title: "Priority and custom support",
                  price: "From ¥149",
                  copy: "Remote pre-visit coordination starts from ¥149. Same-day, weekend, early morning, and custom requests are quoted separately."
                }
              ].map((item) => (
                <article
                  key={item.title}
                  className="card transition duration-200 hover:-translate-y-0.5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-brand-700">
                    {item.title === "Half-day accompaniment" ? (
                      <CalendarClock className="h-5 w-5" />
                    ) : item.title === "Full-day accompaniment" ? (
                      <ClipboardPlus className="h-5 w-5" />
                    ) : (
                      <BadgeDollarSign className="h-5 w-5" />
                    )}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-4 text-4xl font-semibold text-brand-700">{item.price}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{item.copy}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Additional hour</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    <span className="font-medium text-slate-900">¥220</span> per additional hour,
                    subject to staff availability.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Urgent or weekend requests</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Priority, weekend, and early-morning services may include a{" "}
                    <span className="font-medium text-slate-900">20%–40%</span> surcharge.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Not included</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Hospital bills, tests, medicine, transport, and third-party interpreter fees
                    are billed separately if applicable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <RequestForm
          form={form}
          setForm={setForm}
          isSubmitting={isSubmitting}
          status={status}
          onSubmit={onSubmit}
          title="Request hospital accompaniment"
          copy="Complete the form below and our team will review your request, confirm availability, and contact you with pricing, timing, and the next step."
          suitableFor="Outpatient visits, first-time hospital visits, pediatric visits, common specialist appointments, health checkups, and family support in Shanghai."
        />

        <section id="faq" className="section-surface py-16">
          <div className="container-shell">
            <h2 className="section-title">Frequently asked questions</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {faqs.map((item) => (
                <article
                  key={item.question}
                  className="card transition duration-200 hover:-translate-y-0.5"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
                </article>
              ))}
            </div>
            <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center shadow-soft">
              <h3 className="text-2xl font-semibold text-slate-900">
                Need help with a hospital visit in Shanghai?
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Submit your request and our team will review the case, confirm availability, and
                contact you directly with the next steps.
              </p>
              <a
                href="#request"
                className="mt-6 inline-flex rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                Request support now
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 py-10 text-slate-300">
      <div className="container-shell flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo inverted />
          <p className="mt-2 text-sm text-slate-400">
            Hospital accompaniment for foreigners navigating care in China.
          </p>
        </div>
        <div className="text-sm text-slate-400">
          <p>
            Contact:{" "}
            <a
              href="mailto:support@carebridgechina.com"
              className="text-slate-200 transition hover:text-white"
            >
              support@carebridgechina.com
            </a>{" "}
            · WeChat: carebridgechina
          </p>
        </div>
      </div>
    </footer>
  );
}

function formatLeadDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function SummaryList({
  title,
  items
}: {
  title: string;
  items: LeadSummaryCount[];
}) {
  return (
    <article className="card">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm text-slate-600">
        {items.length === 0 ? (
          <li>No data yet.</li>
        ) : (
          items.map((item) => (
            <li key={`${title}-${item.label ?? "unknown"}`} className="flex items-center justify-between gap-4">
              <span className="truncate">{item.label || "(unknown)"}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-900">
                {item.count}
              </span>
            </li>
          ))
        )}
      </ul>
    </article>
  );
}

function LeadsReportPage() {
  const storageKey = "carebridge_admin_api_key";
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(storageKey) ?? "");
  const [inputKey, setInputKey] = useState(() => sessionStorage.getItem(storageKey) ?? "");
  const [leads, setLeads] = useState<LeadReportItem[]>([]);
  const [bySource, setBySource] = useState<LeadSummaryCount[]>([]);
  const [byPage, setByPage] = useState<LeadSummaryCount[]>([]);
  const [byCampaign, setByCampaign] = useState<LeadSummaryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!adminKey) {
      setLoading(false);
      return;
    }

    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/leads?limit=50", {
          headers: {
            "x-admin-key": adminKey
          }
        });
        const payload = (await response.json()) as {
          recentLeads?: LeadReportItem[];
          summary?: {
            bySource?: LeadSummaryCount[];
            byPage?: LeadSummaryCount[];
            byCampaign?: LeadSummaryCount[];
          };
          message?: string;
        };

        if (!response.ok) {
          throw new Error(payload.message || "Unable to load leads.");
        }

        if (!active) {
          return;
        }

        setLeads(payload.recentLeads ?? []);
        setBySource(payload.summary?.bySource ?? []);
        setByPage(payload.summary?.byPage ?? []);
        setByCampaign(payload.summary?.byCampaign ?? []);
      } catch (fetchError) {
        if (!active) {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : "Unable to load leads.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [adminKey]);

  function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = inputKey.trim();
    sessionStorage.setItem(storageKey, trimmed);
    setAdminKey(trimmed);
  }

  function handleLock() {
    sessionStorage.removeItem(storageKey);
    setAdminKey("");
    setInputKey("");
    setLeads([]);
    setBySource([]);
    setByPage([]);
    setByCampaign([]);
    setError("");
  }

  return (
    <div>
      <Header compact />
      <main>
        <section className="container-shell py-16">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-medium text-brand-800">
                Internal Lead Reporting
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                Lead source summary and recent requests
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Use this page to see which landing pages, traffic sources, and campaigns are
                producing requests. Data is only fetched after the correct admin key is provided.
              </p>
            </div>
            <div className="flex gap-3">
              {adminKey ? (
                <button
                  type="button"
                  onClick={handleLock}
                  className="rounded-full border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  Lock report
                </button>
              ) : null}
              <a
                href="/"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Back to site
              </a>
            </div>
          </div>
        </section>

        {!adminKey ? (
          <section className="section-surface py-12">
            <div className="container-shell">
              <div className="card max-w-xl">
                <h2 className="text-2xl font-semibold text-slate-900">Unlock internal report</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Enter the admin API key configured on Cloudflare Pages. The key is only stored in
                  this browser session.
                </p>
                <form onSubmit={handleUnlock} className="mt-6 grid gap-4">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Admin key
                    <input
                      type="password"
                      value={inputKey}
                      onChange={(event) => setInputKey(event.target.value)}
                      className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
                      placeholder="Enter admin key"
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
                  >
                    Unlock report
                  </button>
                  {error ? <p className="text-sm text-rose-600">{error}</p> : null}
                </form>
              </div>
            </div>
          </section>
        ) : null}

        {adminKey ? (
          <section className="section-surface py-12">
            <div className="container-shell grid gap-6 lg:grid-cols-3">
              <SummaryList title="Leads by Source" items={bySource} />
              <SummaryList title="Leads by Landing Page" items={byPage} />
              <SummaryList title="Leads by Campaign" items={byCampaign} />
            </div>
          </section>
        ) : null}

        {adminKey ? (
          <section className="container-shell py-12">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Recent leads</h2>
                  <p className="mt-1 text-sm text-slate-500">Latest 50 service requests.</p>
                </div>
              </div>

              {loading ? (
                <p className="py-8 text-sm text-slate-600">Loading leads...</p>
              ) : error ? (
                <p className="py-8 text-sm text-rose-600">{error}</p>
              ) : leads.length === 0 ? (
                <p className="py-8 text-sm text-slate-600">No leads yet.</p>
              ) : (
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Created</th>
                        <th className="px-4 py-3 font-medium">Lead</th>
                        <th className="px-4 py-3 font-medium">Need</th>
                        <th className="px-4 py-3 font-medium">Source</th>
                        <th className="px-4 py-3 font-medium">Page</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="align-top">
                          <td className="px-4 py-4 text-slate-600">
                            {formatLeadDate(lead.createdAt)}
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-slate-900">{lead.name}</p>
                            <p className="mt-1 text-slate-600">{lead.contact}</p>
                            <p className="mt-1 text-slate-500">
                              {lead.city} · {lead.language}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-slate-900">{lead.urgency}</p>
                            <p className="mt-1 text-slate-600">{lead.symptoms}</p>
                            <p className="mt-1 text-slate-500">
                              {lead.serviceDate ? `Service date: ${lead.serviceDate}` : "No service date"}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            <p>{lead.utmSource || "direct"}</p>
                            <p className="mt-1 text-slate-500">{lead.utmMedium || "-"}</p>
                            <p className="mt-1 text-slate-500">{lead.utmCampaign || "-"}</p>
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            <p>{lead.pagePath || "(unknown)"}</p>
                            <p className="mt-1 text-slate-500">{lead.referrer || "Direct"}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-900">
                              {lead.status}
                            </span>
                            {lead.emergencyFlag ? (
                              <p className="mt-2 text-rose-600">Emergency flag</p>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const pathname = normalizePath(window.location.pathname);
  const [form, setForm] = useState<FormState>(() => ({
    ...defaultForm,
    ...readAttribution(pathname)
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const landingPage = landingPages.find((page) => page.path === pathname);
  const isLeadsReportPage = pathname === "/ops/leads";

  const pageTitle = isLeadsReportPage
    ? "CareBridge China | Internal Lead Report"
    : landingPage?.title ?? "CareBridge China | Hospital Support for Foreigners in Shanghai";
  const pageDescription =
    isLeadsReportPage
      ? "Internal lead reporting for CareBridge China."
      : landingPage?.description ??
        "CareBridge China provides in-person hospital accompaniment and English-speaking support for foreigners navigating hospital visits in Shanghai.";
  const canonicalUrl = `${siteUrl}${pathname === "/" ? "" : pathname}`;
  const pageKeywords = landingPage?.keywords ?? [
    "hospital support shanghai",
    "hospital companion china",
    "hospital help for foreigners shanghai",
    "medical translator shanghai"
  ];

  useEffect(() => {
    document.title = pageTitle;
    setMetaDescription(pageDescription);
    setNamedMeta("keywords", pageKeywords.join(", "));
    setNamedMeta("twitter:card", "summary_large_image");
    setNamedMeta("twitter:title", pageTitle);
    setNamedMeta("twitter:description", pageDescription);
    setPropertyMeta("og:type", "website");
    setPropertyMeta("og:title", pageTitle);
    setPropertyMeta("og:description", pageDescription);
    setPropertyMeta("og:url", canonicalUrl);
    setLinkTag("canonical", canonicalUrl);
    setRobotsMeta(isLeadsReportPage ? "noindex, nofollow" : "index, follow");
    setJsonLd("carebridge-org", {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "CareBridge China",
      url: siteUrl,
      email: "support@carebridgechina.com",
      sameAs: []
    });
    setJsonLd("carebridge-service", {
      "@context": "https://schema.org",
      "@type": "Service",
      name: landingPage?.heroTitle ?? "Hospital support for foreigners in Shanghai",
      provider: {
        "@type": "Organization",
        name: "CareBridge China"
      },
      areaServed: {
        "@type": "City",
        name: "Shanghai"
      },
      audience: {
        "@type": "Audience",
        audienceType: "Foreign residents, business travelers, students, and families in Shanghai"
      },
      description: pageDescription,
      url: canonicalUrl
    });
  }, [pageDescription, pageTitle]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      ...readAttribution(pathname)
    }));
  }, [pathname]);

  const nextAvailable = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/submit-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "Unable to submit your request.");
      }

      setStatus(payload.message || "Thanks — we received your request.");
      setForm({
        ...defaultForm,
        ...readAttribution(pathname)
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setStatus(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (landingPage) {
    return (
      <LandingPageView
        page={landingPage}
        form={form}
        setForm={setForm}
        isSubmitting={isSubmitting}
        status={status}
        onSubmit={handleSubmit}
      />
    );
  }

  if (isLeadsReportPage) {
    return <LeadsReportPage />;
  }

  return (
    <HomePage
      form={form}
      setForm={setForm}
      isSubmitting={isSubmitting}
      status={status}
      onSubmit={handleSubmit}
      nextAvailable={nextAvailable}
    />
  );
}

export default App;
