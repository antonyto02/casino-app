import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { api } from '../api/client';
import { deleteCookie, getAllCookies, setCookie } from '../api/cookies';
import { getSessionId } from '../api/session';

type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

type ConsentChoices = Record<ConsentCategory, boolean>;

interface ConsentContextValue {
  choices: ConsentChoices | null;
  bannerVisible: boolean;
  savePreferences: (choices: Omit<ConsentChoices, 'necessary'>) => Promise<void>;
  acceptAll: () => Promise<void>;
}

const STORAGE_KEY = 'casino_consent';

export const NECESSARY_COOKIE = 'casino_visit_id';
export const ANALYTICS_COOKIE = 'casino_analytics_id';
export const MARKETING_COOKIE = 'casino_marketing_opt';
const COOKIE_DAYS = 7;

const ConsentContext = createContext<ConsentContextValue | null>(null);

function syncCookies(next: ConsentChoices) {
  if (!getAllCookies()[NECESSARY_COOKIE]) {
    setCookie(NECESSARY_COOKIE, crypto.randomUUID(), COOKIE_DAYS);
  }

  if (next.analytics) {
    setCookie(ANALYTICS_COOKIE, crypto.randomUUID(), COOKIE_DAYS);
  } else {
    deleteCookie(ANALYTICS_COOKIE);
  }

  if (next.marketing) {
    setCookie(MARKETING_COOKIE, 'true', COOKIE_DAYS);
  } else {
    deleteCookie(MARKETING_COOKIE);
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [choices, setChoices] = useState<ConsentChoices | null>(null);

  useEffect(() => {
    // Necessary cookies don't require opt-in, so this one is set on load
    // regardless of what the banner decides later.
    if (!getAllCookies()[NECESSARY_COOKIE]) {
      setCookie(NECESSARY_COOKIE, crypto.randomUUID(), COOKIE_DAYS);
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const stored = JSON.parse(raw) as ConsentChoices;
        setChoices(stored);
        syncCookies(stored);
      } catch {
        setChoices(null);
      }
    }
  }, []);

  async function persist(next: ConsentChoices) {
    const sessionId = getSessionId();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setChoices(next);
    syncCookies(next);
    await Promise.all(
      (Object.entries(next) as [ConsentCategory, boolean][]).map(
        ([category, accepted]) =>
          api.post('/consent', { sessionId, category, accepted }),
      ),
    );
  }

  async function savePreferences(partial: Omit<ConsentChoices, 'necessary'>) {
    await persist({ necessary: true, ...partial });
  }

  async function acceptAll() {
    await persist({ necessary: true, analytics: true, marketing: true });
  }

  return (
    <ConsentContext.Provider
      value={{
        choices,
        bannerVisible: choices === null,
        savePreferences,
        acceptAll,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx)
    throw new Error('useConsent debe usarse dentro de <ConsentProvider>');
  return ctx;
}
