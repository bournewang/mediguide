import { FormEvent, useMemo, useState } from "react";

type FormState = {
  name: string;
  contact: string;
  city: string;
  language: string;
  symptoms: string;
  urgency: string;
  serviceDate: string;
};

const defaultForm: FormState = {
  name: "",
  contact: "",
  city: "Shanghai",
  language: "English",
  symptoms: "",
  urgency: "Within 24 hours",
  serviceDate: ""
};

const cities = ["Shanghai", "Beijing", "Shenzhen", "Guangzhou", "Hangzhou"];

const highlights = [
  "Meet the patient at the hospital, hotel, or agreed location",
  "Help with registration, queues, payments, and pharmacy pickup",
  "Translate between patient and hospital staff during the visit",
  "Share a clear post-visit summary and next steps in English"
];

const steps = [
  {
    title: "Send your request",
    copy: "Tell us your city, symptoms, preferred language, and when you need support."
  },
  {
    title: "We confirm the plan",
    copy: "Our team reviews urgency, recommends the right hospital or department, and confirms pricing."
  },
  {
    title: "Meet your companion",
    copy: "An English-speaking companion helps you navigate the hospital visit from start to finish."
  },
  {
    title: "Receive follow-up notes",
    copy: "You get a plain-English recap of the visit, prescriptions, and suggested next steps."
  }
];

const useCases = [
  "Fever, cold, stomach pain, or general internal medicine",
  "Children’s hospital visits and vaccination support",
  "Dermatology, dental, eye, ENT, and women’s health visits",
  "Health checkups, second visits, and lab result follow-ups"
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

function App() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string>("");

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
      setForm(defaultForm);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setStatus(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <header className="border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="container-shell flex items-center justify-between py-4">
          <a href="#top" className="text-lg font-semibold text-slate-900">
            CareBridge China
          </a>
          <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
            <a href="#service">Service</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a
            href="#request"
                className="rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand-500/20 transition hover:from-brand-700 hover:to-accent-600"
          >
            Request support
          </a>
        </div>
      </header>

      <main id="top">
        <section className="container-shell grid gap-10 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-brand-200 bg-white/80 px-4 py-1 text-sm font-medium text-brand-800 shadow-sm">
              Hospital Companion &amp; Medical Guidance in China
            </span>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              We accompany and guide you through hospitals in China.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              We help patients navigate Chinese hospitals with in-person accompaniment,
              translation, and step-by-step support from registration to pharmacy pickup.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#request"
                className="rounded-full bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-xl shadow-brand-500/20 transition hover:from-brand-700 hover:to-accent-600"
              >
                Book an accompany request
              </a>
              <a
                href="#service"
                className="rounded-full border border-brand-200 bg-white/80 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-white"
              >
                See what’s included
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="rounded-full border border-white/80 bg-white/85 px-4 py-2 shadow-sm">
                Shanghai service coverage
              </span>
              <span className="rounded-full border border-white/80 bg-white/85 px-4 py-2 shadow-sm">
                English-speaking support
              </span>
              <span className="rounded-full border border-white/80 bg-white/85 px-4 py-2 shadow-sm">
                Next available: {nextAvailable}
              </span>
            </div>
          </div>

          <div className="card relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-brand-400 to-accent-400" />
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">
              What we help with
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-700">
              {highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Important note</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                We are a hospital navigation service, not a medical provider. In emergencies,
                seek urgent medical care immediately.
              </p>
            </div>
          </div>
        </section>

        <section id="service" className="section-tint py-16">
          <div className="container-shell">
            <h2 className="section-title">Professional hospital accompaniment</h2>
            <p className="section-copy">
              CareBridge China helps foreign patients arrange trusted, English-speaking
              hospital support with a clear, reliable service process.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
              {
                title: "Before the visit",
                copy: "Case intake, urgency check, hospital matching, and pre-visit preparation."
              },
              {
                title: "At the hospital",
                copy: "Registration help, live translation, queue navigation, and payment support."
              },
              {
                title: "After the visit",
                copy: "English summary, prescription reminders, and follow-up guidance."
              },
              {
                title: "Coordinated support",
                copy: "Each request is reviewed and arranged carefully to ensure a smooth service experience."
              }
            ].map((item) => (
              <article
                key={item.title}
                className="card border-brand-100/70 transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
              >
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
              Our service process is designed to be clear, efficient, and reassuring from the first request to follow-up.
            </p>
            <div className="mt-10 grid gap-6 lg:grid-cols-4">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="card transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <span className="text-sm font-semibold text-accent-600">Step {index + 1}</span>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-shell grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="card border-slate-200/80">
              <h2 className="text-2xl font-semibold text-slate-900">Best-fit cases</h2>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
                {useCases.map((item) => (
                  <li key={item} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50/95 via-white to-accent-50/65 p-6 shadow-soft">
              <div className="mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-brand-500 to-accent-400" />
              <h2 className="text-2xl font-semibold text-slate-900">Service coverage</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["Primary city", "Shanghai"],
                  ["Languages", "English"],
                  ["Service model", "Personal hospital companion"],
                  ["Support process", "Request intake and coordination"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-brand-100 bg-white/80 p-5 shadow-sm">
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
            <h2 className="section-title">Transparent pricing</h2>
            <p className="section-copy">
              Our service fees are presented clearly. Hospital registration, consultation, tests,
              medication, and transport are charged separately by the medical provider.
            </p>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {[
                {
                  title: "Standard accompaniment",
                  price: "¥399",
                  copy: "Up to 3 hours of weekday support for outpatient visits, including navigation, translation, and coordination."
                },
                {
                  title: "Extended accompaniment",
                  price: "¥699",
                  copy: "Up to 6 hours of support for multi-department visits, testing, or longer hospital processes."
                },
                {
                  title: "Priority arrangement",
                  price: "Custom",
                  copy: "Tailored support for early morning, weekend, urgent same-day, or special coordination requests."
                }
              ].map((item) => (
                <article
                  key={item.title}
                  className="card relative overflow-hidden border-slate-200/80 transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 to-accent-400" />
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-4 text-4xl font-semibold text-brand-700">{item.price}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="request" className="section-tint py-16">
          <div className="container-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="section-title">Request hospital accompaniment</h2>
              <p className="section-copy">
                Complete the form below and our team will review your request, confirm availability,
                and contact you with the next steps.
              </p>
              <div className="mt-8 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
                <p className="text-sm font-semibold text-amber-900">Emergency disclaimer</p>
                <p className="mt-2 text-sm leading-6 text-amber-800">
                  If the patient has severe chest pain, trouble breathing, heavy bleeding, loss of
                  consciousness, or other emergency symptoms, go to the nearest emergency department
                  immediately.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="card border-white/80 grid gap-5">
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
                className="rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:from-brand-700 hover:to-accent-600 disabled:cursor-not-allowed disabled:from-brand-300 disabled:to-brand-300"
              >
                {isSubmitting ? "Submitting..." : "Submit request"}
              </button>

              {status ? <p className="text-sm text-slate-600">{status}</p> : null}
            </form>
          </div>
        </section>

        <section id="faq" className="section-surface py-16">
          <div className="container-shell">
            <h2 className="section-title">Frequently asked questions</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {faqs.map((item) => (
                <article
                  key={item.question}
                  className="card transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-950 py-10 text-slate-300">
        <div className="container-shell flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-white">CareBridge China</p>
            <p className="mt-2 text-sm text-slate-400">
              Hospital accompaniment for foreigners navigating care in China.
            </p>
          </div>
          <div className="text-sm text-slate-400">
            <p>Contact: hello@mediguide.cn · WeChat: mediguide-service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
