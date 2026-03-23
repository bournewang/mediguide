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
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

type ArticlePage = {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  eyebrow: string;
  heading: string;
  intro: string;
  sections: Array<{
    title: string;
    paragraphs?: string[];
    bullets?: string[];
  }>;
  references?: Array<{
    label: string;
    url: string;
  }>;
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
    ],
    faqs: [
      {
        question: "Can foreigners go to hospitals in Shanghai without speaking Chinese?",
        answer:
          "Yes, but the process can still be difficult without language support or familiarity with the hospital system. Many foreigners prefer help with registration, communication, and payment steps."
      },
      {
        question: "Does CareBridge China choose the hospital for the patient?",
        answer:
          "CareBridge China can help review the case and recommend a practical hospital or department option, but it is not a medical provider and does not replace licensed clinical judgment."
      },
      {
        question: "What does English-speaking hospital support include?",
        answer:
          "Support can include intake review, hospital coordination, in-person accompaniment, live interpretation during the visit, and a clear English summary afterward."
      }
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
    ],
    faqs: [
      {
        question: "Is hospital translation the same as hospital accompaniment?",
        answer:
          "Not always. Translation focuses on communication, while accompaniment also helps with hospital flow, registration, queues, payments, and next steps after the visit."
      },
      {
        question: "Can a hospital companion help during specialist visits?",
        answer:
          "Yes. Specialist visits, testing days, and multi-step appointments are some of the situations where accompaniment is most useful for foreign patients."
      },
      {
        question: "Does CareBridge China provide medical advice?",
        answer:
          "No. CareBridge China supports navigation and communication during the hospital visit. Diagnosis and treatment remain with licensed medical providers."
      }
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
    ],
    faqs: [
      {
        question: "Can CareBridge China help foreign parents during pediatric hospital visits?",
        answer:
          "Yes. The service is designed to reduce confusion for foreign parents by helping with registration, communication, hospital flow, and practical next steps."
      },
      {
        question: "Is this useful for common child illness visits?",
        answer:
          "Yes. Families often request support for fever, follow-up visits, vaccinations, and other pediatric appointments where clear communication matters."
      },
      {
        question: "What should parents do in a pediatric emergency?",
        answer:
          "In emergencies, parents should go directly to the nearest emergency department immediately. CareBridge China is not an emergency medical provider."
      }
    ]
  }
];

const siteUrl = "https://carebridgechina.com";

const articlePages: ArticlePage[] = [
  {
    path: "/foreigner-friendly-hospitals-shanghai",
    title: "Top 10 Foreigner-Friendly Hospitals in Shanghai for Expats | CareBridge China",
    description:
      "Looking for foreigner-friendly hospitals in Shanghai? Explore 10 top hospitals with international departments, English-speaking services, and expat-friendly care, plus how CareBridge China helps.",
    keywords: [
      "foreigner-friendly hospitals in shanghai",
      "international hospitals in shanghai",
      "english-speaking hospitals in shanghai",
      "expat healthcare in shanghai",
      "hospital companion service in shanghai"
    ],
    eyebrow: "Shanghai Hospital Guide for Foreigners",
    heading: "Top 10 foreigner-friendly hospitals in Shanghai",
    intro:
      "Finding the right hospital in Shanghai can be difficult if you are dealing with language barriers, unfamiliar registration systems, insurance questions, or urgent health concerns. For expats, international students, business travelers, and foreign families, the best hospital is often the one that combines strong care with a smoother patient experience.",
    sections: [
      {
        title: "What makes a hospital foreigner-friendly in Shanghai",
        paragraphs: [
          "The most foreigner-friendly hospitals in Shanghai usually offer a mix of English-speaking support, international medical departments, easier appointment systems, and a patient journey that is easier to understand when you are already stressed.",
          "Some are private international hospitals built around expat demand. Others are major public hospitals with international clinics or special service channels for foreign patients who want stronger specialist resources."
        ],
        bullets: [
          "English-speaking doctors, nurses, or patient coordinators",
          "International departments or VIP clinics",
          "Experience serving expats and overseas patients",
          "More practical support for booking, payment, and navigation",
          "Better fit for foreigners who do not want to manage the process alone"
        ]
      },
      {
        title: "Top 10 hospitals in Shanghai for foreign patients",
        bullets: [
          "Shanghai Jiahui International Hospital",
          "Shanghai United Family Hospital",
          "Raffles Hospital Shanghai",
          "Shanghai East International Medical Center",
          "Parkway Shanghai Hospital",
          "Shanghai DeltaHealth Hospital",
          "Huadong Hospital Affiliated to Fudan University",
          "Huashan Hospital Affiliated to Fudan University",
          "Zhongshan Hospital Affiliated to Fudan University",
          "Shanghai First Maternity and Infant Hospital"
        ]
      },
      {
        title: "How to choose the right hospital",
        paragraphs: [
          "The best option depends on what you need. If you want a familiar private-hospital experience with stronger English-language support, international private hospitals are often the easiest starting point. If you need advanced specialist care, major public hospitals with international departments may be the better fit.",
          "For maternity, pediatrics, fertility, or women’s health, specialist hospitals such as Shanghai First Maternity and Infant Hospital and International Peace Maternity and Child Health Hospital may also be worth considering depending on the case."
        ],
        bullets: [
          "Choose private international hospitals for convenience and built-in language support",
          "Choose top public hospitals for stronger specialist depth",
          "Check whether your case needs general medicine, maternity, pediatrics, or a specialist",
          "Think about whether you need direct billing, translation, or in-person guidance"
        ]
      },
      {
        title: "Why hospital visits can still feel difficult",
        paragraphs: [
          "Even at a foreigner-friendly hospital, the process may still include registration counters, multiple waiting areas, payment steps, pharmacy collection, and follow-up instructions that are hard to manage when you are sick or anxious.",
          "Many foreign patients are not just looking for a doctor. They need help deciding where to go, understanding what to bring, communicating clearly during the visit, and making sure nothing gets lost between departments."
        ]
      },
      {
        title: "How our hospital companion service in Shanghai helps",
        paragraphs: [
          "CareBridge China supports foreigners before, during, and after hospital visits in Shanghai. We help clients choose a practical hospital option, prepare for the visit, and get through the process with less confusion.",
          "Our service is designed for expats, international families, students, and visitors who want practical bilingual support without trying to navigate the hospital system alone."
        ],
        bullets: [
          "Hospital and department matching based on your situation",
          "Appointment coordination and pre-visit preparation",
          "In-person hospital accompaniment when needed",
          "Bilingual support during registration, consultation, payment, and pharmacy pickup",
          "Clear follow-up guidance after the visit"
        ]
      },
      {
        title: "Final takeaway",
        paragraphs: [
          "Shanghai has many excellent hospitals for foreigners, but the right choice depends on your medical needs, language preferences, and comfort level with the local system. Choosing the right hospital is the first step. Getting the right support can make the whole experience much easier.",
          "If you are looking for foreigner-friendly hospitals in Shanghai and want help deciding where to go or how to manage the visit, CareBridge China can help you move through the process with more clarity and less stress."
        ]
      }
    ],
    references: [
      {
        label: "Shanghai official English directory: Hospitals",
        url: "https://english.shanghai.gov.cn/en-Hospitals/index.html"
      },
      {
        label: "Shanghai Jiahui International Hospital listing",
        url: "https://english.shanghai.gov.cn/en-Hospitals/20241015/0713301b57674e95b6f7e8b91420258a.html"
      },
      {
        label: "Shanghai United Family Hospital listing",
        url: "https://english.shanghai.gov.cn/en-Hospitals/20241011/7bdecbcd193f4e2aab0de9f40e3b1001.html"
      },
      {
        label: "Raffles Hospital Shanghai listing",
        url: "https://english.shanghai.gov.cn/en-Hospitals/20241011/e50f1b8b9ea3482d90b6ef261388947d.html"
      }
    ]
  },
  {
    path: "/guides/hospital-visit-shanghai-foreigner",
    title: "How Foreigners Can Prepare for a Hospital Visit in Shanghai | CareBridge China",
    description:
      "A practical guide for foreigners visiting a hospital in Shanghai, including what to bring, how the process works, and where support helps most.",
    keywords: [
      "hospital visit shanghai foreigner",
      "how to go to hospital in shanghai as a foreigner",
      "prepare for hospital visit shanghai"
    ],
    eyebrow: "Guide for Foreigners in Shanghai",
    heading: "How foreigners can prepare for a hospital visit in Shanghai",
    intro:
      "If you have never visited a hospital in Shanghai before, the process can feel harder than the medical problem itself. The system is usually efficient, but it can be confusing if you do not read Chinese or do not know how registration, payments, and department routing work.",
    sections: [
      {
        title: "What to prepare before you go",
        bullets: [
          "Your passport or identification",
          "Your phone with local payment options if available",
          "Any previous test reports, prescriptions, or medical notes",
          "A short summary of your symptoms in English and, if possible, Chinese",
          "A rough idea of which department you may need"
        ]
      },
      {
        title: "What usually happens during the visit",
        paragraphs: [
          "A hospital visit often starts with registration, either at a counter or through a self-service process. After that, patients usually move between waiting areas, consultation rooms, payment counters, testing departments, and the pharmacy.",
          "Even when the medical care itself is straightforward, the logistics can feel difficult for foreigners because each step may happen in a different area and instructions may not be clearly available in English."
        ]
      },
      {
        title: "Where foreigners usually get stuck",
        bullets: [
          "Choosing the right hospital or department",
          "Understanding registration and queue flow",
          "Communicating symptoms clearly",
          "Handling payment steps and receipts",
          "Understanding what to do after the consultation"
        ]
      },
      {
        title: "When support is most useful",
        paragraphs: [
          "Support is especially useful for first-time hospital visits, specialist appointments, multi-step testing days, pediatric visits, and any situation where a patient feels uncertain about language or hospital process.",
          "CareBridge China supports foreigners with in-person hospital accompaniment, communication help, and practical navigation through the visit. It does not replace a doctor or provide diagnosis."
        ]
      }
    ]
  },
  {
    path: "/guides/public-hospital-vs-international-clinic-shanghai",
    title: "Public Hospital vs International Clinic in Shanghai | CareBridge China",
    description:
      "Understand the difference between public hospitals and international clinics in Shanghai, including speed, cost, specialist access, and when each option makes sense.",
    keywords: [
      "public hospital vs international clinic shanghai",
      "international clinic shanghai vs hospital",
      "where should foreigners go for medical care in shanghai"
    ],
    eyebrow: "Choosing Care in Shanghai",
    heading: "Public hospital vs international clinic in Shanghai",
    intro:
      "Foreigners in Shanghai often ask whether they should go to a public hospital or an international clinic. The answer depends on urgency, budget, specialty needs, and how comfortable you are navigating the system.",
    sections: [
      {
        title: "Why public hospitals are often chosen",
        bullets: [
          "Broader specialist coverage",
          "Strong diagnostic and testing resources",
          "Lower cost for many consultations and procedures",
          "Better fit for more complex or specialist-driven cases"
        ]
      },
      {
        title: "Why international clinics are often chosen",
        bullets: [
          "More English-language support built into the experience",
          "Simpler appointment flow",
          "More familiar patient experience for many foreigners",
          "Good fit for straightforward consultations if budget is less sensitive"
        ]
      },
      {
        title: "What foreigners should consider",
        paragraphs: [
          "If you want the broadest access to specialists and are comfortable with a more complex process, public hospitals may be the better option. If convenience and built-in communication support matter more than price, international clinics may be the better fit.",
          "Many foreigners choose public hospitals when they want stronger specialist access but add operational support to reduce friction during the visit."
        ]
      },
      {
        title: "Where CareBridge China fits",
        paragraphs: [
          "CareBridge China helps foreigners navigate hospital visits with practical support before, during, and after the appointment. That can be especially useful when a patient wants the resources of a public hospital without managing the process alone.",
          "The service focuses on navigation, communication, and coordination. Medical decisions remain with licensed providers."
        ]
      }
    ]
  },
  {
    path: "/guides/hospital-translation-help-shanghai",
    title: "When Foreigners Need Hospital Translation Help in Shanghai | CareBridge China",
    description:
      "Learn when hospital translation and accompaniment help are most useful in Shanghai, especially for specialist visits, testing, family care, and first-time appointments.",
    keywords: [
      "hospital translation help shanghai",
      "hospital translator shanghai foreigner",
      "medical translation support shanghai"
    ],
    eyebrow: "Communication and Navigation Support",
    heading: "When foreigners need hospital translation help in Shanghai",
    intro:
      "Language is only one part of the problem during a hospital visit. Many foreigners need help not only translating words, but also understanding process, payment steps, department routing, and what happens after the consultation.",
    sections: [
      {
        title: "Situations where support matters most",
        bullets: [
          "First-time hospital visits in Shanghai",
          "Specialist appointments with more detailed discussion",
          "Multi-step testing or imaging days",
          "Pediatric visits with stressed parents",
          "Visits where the patient is already in pain or anxious"
        ]
      },
      {
        title: "Why translation alone is sometimes not enough",
        paragraphs: [
          "A patient may understand the doctor but still be unsure where to go next, how to pay, where to collect medication, or whether another department is involved. That is why accompaniment and hospital navigation can matter as much as language support.",
          "In practice, many foreigners want one person who can help them move through the full visit instead of solving each problem separately."
        ]
      },
      {
        title: "What practical support can include",
        bullets: [
          "Registration and queue navigation",
          "Live interpretation during the consultation",
          "Payment and pharmacy support",
          "Clarifying next steps after the visit",
          "Reducing confusion during a stressful day"
        ]
      },
      {
        title: "Service boundary",
        paragraphs: [
          "CareBridge China is a hospital accompaniment and navigation service for foreigners in Shanghai. It does not diagnose, prescribe, or replace licensed medical providers.",
          "For emergencies, patients should go to the nearest emergency department immediately."
        ]
      }
    ]
  },
  {
    path: "/guides/pediatric-hospital-visit-shanghai-foreign-family",
    title: "Pediatric Hospital Visits in Shanghai for Foreign Families | CareBridge China",
    description:
      "A practical guide for foreign families preparing for pediatric hospital visits in Shanghai, including what to bring, what to expect, and where support helps most.",
    keywords: [
      "pediatric hospital visit shanghai foreign family",
      "children hospital shanghai foreigners",
      "foreign family pediatric hospital shanghai"
    ],
    eyebrow: "Guide for Foreign Parents",
    heading: "Pediatric hospital visits in Shanghai for foreign families",
    intro:
      "When a child is sick, parents need speed and clarity. In Shanghai, pediatric care can be strong and efficient, but the process can still feel overwhelming if the system is unfamiliar or language is a barrier.",
    sections: [
      {
        title: "What parents should prepare",
        bullets: [
          "Passport or identification for the child and parent",
          "A short symptom summary with timing and recent changes",
          "Previous prescriptions, vaccination records, or recent medical notes",
          "Items the child may need while waiting",
          "A plan for payment and transport"
        ]
      },
      {
        title: "What makes pediatric visits stressful",
        paragraphs: [
          "Parents are often making decisions quickly while also trying to comfort a child. That makes language friction and unclear hospital flow much harder than usual.",
          "Even routine steps like registration, moving between departments, or collecting medication can feel more difficult when the child is already uncomfortable."
        ]
      },
      {
        title: "When accompaniment helps most",
        bullets: [
          "First pediatric visits in Shanghai",
          "Fever and common illness visits",
          "Vaccination appointments",
          "Follow-up visits with multiple steps",
          "Situations where parents want clearer communication during the visit"
        ]
      },
      {
        title: "Where CareBridge China fits",
        paragraphs: [
          "CareBridge China helps foreign families with hospital navigation, communication support, and in-person accompaniment during pediatric visits in Shanghai.",
          "The service supports the process around the visit. Medical diagnosis and treatment remain with licensed providers."
        ]
      }
    ]
  },
  {
    path: "/guides/dental-care-shanghai-foreigners",
    title: "Dental Care in Shanghai for Foreigners | CareBridge China",
    description:
      "A practical guide for foreigners seeking dental care in Shanghai, including common visit types, what to expect, and when support can reduce friction.",
    keywords: [
      "dental care shanghai foreigners",
      "dentist shanghai foreigner help",
      "dental visit shanghai english support"
    ],
    eyebrow: "Dental Visits in Shanghai",
    heading: "Dental care in Shanghai for foreigners",
    intro:
      "Dental visits are a common reason foreigners seek help in Shanghai. The treatment itself may be routine, but the surrounding process can still be difficult if you are handling registration, communication, and payment alone.",
    sections: [
      {
        title: "Common dental visit types",
        bullets: [
          "Tooth pain and urgent dental discomfort",
          "Repairs, fillings, and crown-related visits",
          "Follow-up treatment plans",
          "Routine cleaning or examination",
          "Dental imaging and specialist consultation"
        ]
      },
      {
        title: "What foreigners usually need help with",
        bullets: [
          "Choosing the right clinic or department",
          "Understanding treatment flow and next steps",
          "Communicating pain level and treatment history",
          "Handling payment and receipts",
          "Following multi-visit treatment plans"
        ]
      },
      {
        title: "Why support matters for dental visits",
        paragraphs: [
          "Dental care often involves multiple visits, treatment explanations, imaging, and follow-up decisions. That can be manageable in your home country but more stressful in a new system.",
          "Practical support helps reduce friction so the patient can focus on the treatment instead of the process around it."
        ]
      },
      {
        title: "Service boundary",
        paragraphs: [
          "CareBridge China can help foreigners navigate dental visits in Shanghai with accompaniment and communication support.",
          "It does not provide dental treatment or medical advice."
        ]
      }
    ]
  },
  {
    path: "/guides/hospital-costs-shanghai-foreigners",
    title: "What Foreigners Should Expect from Hospital Costs in Shanghai | CareBridge China",
    description:
      "A practical overview of what foreigners should expect from hospital costs in Shanghai, including service fees, provider charges, and why pricing can vary.",
    keywords: [
      "hospital costs shanghai foreigners",
      "medical costs shanghai foreigner",
      "how much does hospital visit cost shanghai"
    ],
    eyebrow: "Hospital Costs in Shanghai",
    heading: "What foreigners should expect from hospital costs in Shanghai",
    intro:
      "One of the first questions foreigners ask is how much a hospital visit in Shanghai will cost. The answer depends on where you go, what department you need, and whether the visit involves tests, imaging, medication, or follow-up treatment.",
    sections: [
      {
        title: "Why hospital costs vary",
        bullets: [
          "Public hospital vs international clinic",
          "General consultation vs specialist care",
          "Whether tests or imaging are needed",
          "Medication and pharmacy cost",
          "Single visit vs multi-step treatment"
        ]
      },
      {
        title: "What to separate in your budget",
        paragraphs: [
          "Foreign patients should separate the cost of the medical provider from the cost of support around the visit. Hospital registration, consultation, tests, and medication are charged by the provider.",
          "CareBridge China charges separately for accompaniment and coordination support, and those fees are shown in advance."
        ]
      },
      {
        title: "Why clarity matters",
        paragraphs: [
          "Cost uncertainty adds stress, especially when the patient is already dealing with symptoms or an unfamiliar process. Clear separation between provider charges and support-service charges helps patients make decisions faster.",
          "That is one reason transparent support pricing can improve trust for foreigners who are comparing options."
        ]
      },
      {
        title: "What CareBridge China includes",
        bullets: [
          "Transparent accompaniment pricing before the visit",
          "Clear statement of what is and is not included",
          "Support with hospital navigation and communication",
          "No medical claims or bundled treatment pricing"
        ]
      }
    ]
  },
  {
    path: "/guides/foreigner-hospital-procedure-shanghai",
    title: "What a Foreigner's Hospital Visit in Shanghai Reveals About the Real Process | CareBridge China",
    description:
      "A practical blog post on what a foreigner's hospital visit in Shanghai reveals about registration, payment, language barriers, and the real process around care.",
    keywords: [
      "foreigner hospital procedure shanghai",
      "hospital process shanghai foreigner",
      "how hospital visits work in shanghai for foreigners"
    ],
    eyebrow: "Foreigner Hospital Experience in Shanghai",
    heading: "What a foreigner's hospital visit in Shanghai reveals about the real process",
    intro:
      "Videos made by foreigners about hospital visits in China are useful because they show something many people only understand after they go through it themselves: the medical care may be solid, but the real challenge is often the process around the visit.",
    sections: [
      {
        title: "Why hospital visit videos matter",
        paragraphs: [
          "For foreigners in Shanghai, the hardest part of going to hospital is not always the health problem itself. It is often the logistics around the visit: registration, choosing the right department, payment, waiting, pharmacy pickup, and understanding what to do next.",
          "That is why first-hand videos and personal accounts are useful. They make visible the parts of the system that locals may treat as normal but that can feel confusing or intimidating for someone who does not speak Chinese or has never used the system before."
        ]
      },
      {
        title: "What a typical hospital process can look like",
        paragraphs: [
          "In Shanghai, a hospital visit often begins with registration. After that, patients may move through a consultation, payment, testing, imaging, prescription pickup, or follow-up instructions depending on the case.",
          "On paper, this flow can look straightforward. In practice, it can feel fragmented for foreigners because each step may happen in a different place, instructions may not be available in clear English, and the patient may have to make decisions quickly while already feeling unwell."
        ]
      },
      {
        title: "Where foreigners usually feel the most friction",
        bullets: [
          "Choosing the right hospital or department",
          "Handling registration and queue flow",
          "Communicating clearly during the consultation",
          "Paying at the right stage and understanding receipts",
          "Knowing where to pick up medicine and what the next step is"
        ]
      },
      {
        title: "Why this does not mean Shanghai lacks strong care",
        paragraphs: [
          "The issue is not simply whether Shanghai has strong hospitals. In fact, official Shanghai data shows that the city is serving a growing number of foreign patients and continuing to expand international medical services.",
          "According to official Shanghai sources published in March 2026, public hospitals in the city recorded 73,200 visits by foreign patients in 2025, up more than 8 percent year on year. The city has also been expanding pilot international medical service programs and international medical tourism pilots."
        ]
      },
      {
        title: "The real takeaway for foreigners",
        paragraphs: [
          "A foreigner's hospital visit in Shanghai often shows the same pattern: good medical resources may exist, but access feels much easier when someone understands the process, the language, and the hospital workflow.",
          "That is why many foreigners solve the problem in one of a few ways: they choose an international clinic, bring a Chinese-speaking friend, rely on translation apps, or delay care because the whole process feels too complicated."
        ]
      },
      {
        title: "Where support fits in",
        paragraphs: [
          "CareBridge China exists around that non-medical gap. The service is designed to help foreigners navigate registration, communication, hospital flow, payment, and follow-up in Shanghai.",
          "It is not a clinic and does not provide diagnosis or treatment. The goal is to make the process around the visit easier to understand and easier to get through."
        ]
      }
    ],
    references: [
      {
        label: "Shanghai official English report: Advanced care draws growing number of overseas patients to Shanghai",
        url: "https://english.shanghai.gov.cn/en-Latest-WhatsNew/20260303/56484619104544d8a49847ab9a4c389b.html"
      },
      {
        label: "Shanghai official English report: Shanghai aims to strengthen global medical hub status",
        url: "https://english.shanghai.gov.cn/en-Latest-WhatsNew/20260305/64f641c0e82b408b8ba64c6cc276550e.html"
      },
      {
        label: "Shanghai government report in Chinese on foreign-patient growth and international medical services",
        url: "https://www.shanghai.gov.cn/nw4411/20260227/889d2e029aed40f99464ea79426726a9.html"
      }
    ]
  },
  {
    path: "/guides/circumcision-surgery-experience-shanghai-tongji-hospital",
    title: "My Circumcision Surgery Experience at Shanghai Tongji Hospital | CareBridge China",
    description:
      "A first-person account of getting circumcision surgery at Shanghai Tongji Hospital, including the appointment flow, waiting time, surgery process, and total cost.",
    keywords: [
      "circumcision surgery shanghai tongji hospital",
      "circumcision experience shanghai hospital",
      "tongji hospital shanghai circumcision cost"
    ],
    eyebrow: "First-Person Hospital Experience",
    heading: "My circumcision surgery experience at Shanghai Tongji Hospital",
    intro:
      "Yesterday, I had circumcision surgery at Shanghai Tongji Hospital, and the whole experience was much faster and more efficient than I expected. From the moment I entered the hospital to the moment I left, everything was done in less than three hours.",
    sections: [
      {
        title: "Arrival and first consultation",
        paragraphs: [
          "I had booked an appointment for the 1:30 to 2:00 pm time slot, and I arrived at the hospital at 1:30 pm. The first thing I did was register and pay at the cashier. After that, I went to the appointed department and waited in line.",
          "I waited for about half an hour before the doctor called me in. He asked about my situation, examined me, and then told me I needed to go to another surgery doctor to arrange the procedure."
        ]
      },
      {
        title: "Booking the surgery on the same day",
        paragraphs: [
          "After that, I found the surgery doctor, got checked again, and paid the surgery fee. I asked whether the procedure could be arranged as soon as possible.",
          "Fortunately, there was a vacancy that same afternoon. That was the part that surprised me most. Once the doctors confirmed the plan, everything moved very quickly."
        ]
      },
      {
        title: "Preparation before the operation",
        paragraphs: [
          "The medical staff prepared things quickly. They brought me a hospital gown, helped shave the surgical area, and then transported me to the operating room on an operation cart.",
          "Even though it was a short procedure, the preparation felt organized and professional."
        ]
      },
      {
        title: "The surgery itself",
        paragraphs: [
          "The surgery was very fast. It took about 15 minutes from start to finish.",
          "After the operation, I was taken to the inpatient ward, where I rested for a while before leaving."
        ]
      },
      {
        title: "Leaving the hospital",
        paragraphs: [
          "After resting for a short time, I paid the remaining fee and left the hospital at 4:01 pm.",
          "Looking back at the full timeline, I arrived at 1:30 pm and left at 4:01 pm, so the entire process took less than three hours."
        ]
      },
      {
        title: "Total cost and overall impression",
        bullets: [
          "Arrival time: 1:30 pm",
          "Exit time: 4:01 pm",
          "Total time in hospital: less than 3 hours",
          "Surgery time: around 15 minutes",
          "Total fee: 2708 yuan"
        ]
      },
      {
        title: "What stood out to me",
        paragraphs: [
          "My overall impression of Shanghai Tongji Hospital was very positive. The doctors and medical staff were professional, the process was highly efficient, and the surgery was arranged much faster than I expected.",
          "For me, the biggest takeaway was how quickly everything moved once the doctors confirmed the situation. From consultation to surgery to discharge, the whole process felt organized and smooth."
        ]
      }
    ]
  }
];

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
          <a href="/guides">Guides</a>
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

        <section className="section-surface py-16">
          <div className="container-shell">
            <h2 className="section-title">Frequently asked questions</h2>
            <p className="section-copy">
              These answers address common questions people search before requesting support.
            </p>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {page.faqs.map((item) => (
                <article
                  key={item.question}
                  className="card transition duration-200 hover:-translate-y-0.5"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
                </article>
              ))}
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

function ArticlePageView({ page }: { page: ArticlePage }) {
  return (
    <div>
      <Header compact />
      <main>
        <section className="container-shell py-20">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-medium text-brand-800">
              {page.eyebrow}
            </span>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              {page.heading}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">{page.intro}</p>
          </div>
        </section>

        <section className="section-surface py-16">
          <div className="container-shell max-w-4xl">
            <article className="prose prose-slate max-w-none">
              {page.sections.map((section) => (
                <section key={section.title} className="mb-12 last:mb-0">
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                    {section.title}
                  </h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph} className="mt-4 text-base leading-7 text-slate-600">
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets ? (
                    <ul className="mt-5 space-y-3 text-base leading-7 text-slate-600">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-3 h-2 w-2 rounded-full bg-brand-700" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </article>
            {page.references?.length ? (
              <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <h2 className="text-2xl font-semibold text-slate-900">Sources</h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  {page.references.map((reference) => (
                    <li key={reference.url}>
                      <a
                        href={reference.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-700 underline decoration-brand-200 underline-offset-4 transition hover:text-brand-800"
                      >
                        {reference.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>

        <section className="container-shell py-16">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-900">
              Need hospital support in Shanghai?
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
              CareBridge China helps foreigners with hospital navigation, communication, and
              in-person accompaniment. Request support if you want help before or during a hospital visit.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <a
                href="/#request"
                className="rounded-full bg-brand-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                Request support
              </a>
              <a
                href="/english-speaking-hospital-support-shanghai"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                View service page
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function GuidesHubPage() {
  return (
    <div>
      <Header compact />
      <main>
        <section className="container-shell py-20">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-medium text-brand-800">
              CareBridge China Guides
            </span>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              Practical hospital guides for foreigners in Shanghai
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              These guides answer common search questions from foreigners preparing for hospital visits in Shanghai.
            </p>
          </div>
        </section>

        <section className="section-surface py-16">
          <div className="container-shell">
            <div className="grid gap-6 lg:grid-cols-3">
              {articlePages.map((article) => (
                <article
                  key={article.path}
                  className="card transition duration-200 hover:-translate-y-0.5"
                >
                  <p className="text-sm font-semibold text-brand-700">{article.eyebrow}</p>
                  <h2 className="mt-3 text-xl font-semibold text-slate-900">{article.heading}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{article.description}</p>
                  <a
                    href={article.path}
                    className="mt-6 inline-flex text-sm font-semibold text-brand-700 transition hover:text-brand-800"
                  >
                    Read guide
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
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

        <section className="section-surface py-16">
          <div className="container-shell">
            <h2 className="section-title">Practical guides for foreigners in Shanghai</h2>
            <p className="section-copy">
              These guides answer common search questions from foreigners preparing for hospital visits in Shanghai.
            </p>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {articlePages.map((article) => (
                <article
                  key={article.path}
                  className="card transition duration-200 hover:-translate-y-0.5"
                >
                  <p className="text-sm font-semibold text-brand-700">{article.eyebrow}</p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900">{article.heading}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{article.description}</p>
                  <a
                    href={article.path}
                    className="mt-6 inline-flex text-sm font-semibold text-brand-700 transition hover:text-brand-800"
                  >
                    Read guide
                  </a>
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
  const articlePage = articlePages.find((page) => page.path === pathname);
  const isGuidesHubPage = pathname === "/guides";
  const isLeadsReportPage = pathname === "/ops/leads";

  const pageTitle = isLeadsReportPage
    ? "CareBridge China | Internal Lead Report"
    : isGuidesHubPage
      ? "CareBridge China Guides | Hospital Help for Foreigners in Shanghai"
      : landingPage?.title ??
        articlePage?.title ??
        "CareBridge China | Hospital Support for Foreigners in Shanghai";
  const pageDescription =
    isLeadsReportPage
      ? "Internal lead reporting for CareBridge China."
      : isGuidesHubPage
        ? "Practical hospital guides for foreigners in Shanghai from CareBridge China."
        : landingPage?.description ??
          articlePage?.description ??
          "CareBridge China provides in-person hospital accompaniment and English-speaking support for foreigners navigating hospital visits in Shanghai.";
  const canonicalUrl = `${siteUrl}${pathname === "/" ? "" : pathname}`;
  const pageKeywords =
    landingPage?.keywords ??
    articlePage?.keywords ?? [
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
    if (articlePage) {
      setJsonLd("carebridge-article", {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: articlePage.heading,
        description: articlePage.description,
        author: {
          "@type": "Organization",
          name: "CareBridge China"
        },
        publisher: {
          "@type": "Organization",
          name: "CareBridge China"
        },
        mainEntityOfPage: canonicalUrl,
        url: canonicalUrl
      });
    } else if (isGuidesHubPage) {
      setJsonLd("carebridge-article", {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "CareBridge China Guides",
        description: pageDescription,
        url: canonicalUrl
      });
    }
  }, [
    articlePage,
    canonicalUrl,
    isGuidesHubPage,
    isLeadsReportPage,
    landingPage,
    pageDescription,
    pageKeywords,
    pageTitle
  ]);

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

  if (articlePage) {
    return <ArticlePageView page={articlePage} />;
  }

  if (isGuidesHubPage) {
    return <GuidesHubPage />;
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
