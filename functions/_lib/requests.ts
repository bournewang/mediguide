export interface ServiceRequestPayload {
  name?: string;
  contact?: string;
  contactType?: string;
  city?: string;
  language?: string;
  symptoms?: string;
  urgency?: string;
  serviceDate?: string;
  notes?: string;
  pagePath?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export const supportedCities = ["Shanghai", "Beijing", "Shenzhen", "Guangzhou"];
export const supportedLanguages = ["English"];

export function normalizeText(value?: string) {
  return value?.trim() ?? "";
}

export function isEmergencyText(symptoms: string) {
  return /(chest pain|trouble breathing|can't breathe|heavy bleeding|unconscious|stroke|seizure)/i.test(
    symptoms
  );
}

export function availabilityStatus(input: {
  city: string;
  language: string;
  serviceDate?: string;
}) {
  const citySupported = supportedCities.includes(input.city);
  const languageSupported = supportedLanguages.includes(input.language);

  if (!citySupported || !languageSupported) {
    return {
      status: "manual_review",
      message: "Service requires manual confirmation for the selected city or language."
    };
  }

  if (!input.serviceDate) {
    return {
      status: "available",
      message: "Service is available. Final confirmation is still required."
    };
  }

  const requestedDate = new Date(`${input.serviceDate}T00:00:00`);
  const now = new Date();
  const diffDays = Math.floor((requestedDate.getTime() - now.getTime()) / 86400000);

  if (diffDays < 0) {
    return {
      status: "manual_review",
      message: "Please submit a future service date."
    };
  }

  if (diffDays <= 1) {
    return {
      status: "limited",
      message: "Priority review is required for near-term requests."
    };
  }

  return {
    status: "available",
    message: "Service is available. Final confirmation is still required."
  };
}
