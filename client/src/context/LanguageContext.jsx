import { createContext, useState, useEffect, useCallback } from 'react';
import translations from '../utils/translations';

export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('neuronita-language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('neuronita-language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));
  }, []);

  const t = useCallback((key) => {
    const value = translations[language]?.[key];
    if (!value) {
      console.warn(`Missing translation: ${key} [${language}]`);
      return key;
    }
    return value;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
