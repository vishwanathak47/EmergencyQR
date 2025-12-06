import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Comprehensive translations for multiple languages including Indian languages
const TRANSLATIONS = {
  en: {
    name: 'Name',
    address: 'Address',
    emergencyContacts: 'Emergency Contacts',
    relationship: 'Relationship',
    phone: 'Phone',
    none: 'Not available',
    relationshipMap: {
      spouse: 'Spouse',
      parent: 'Parent',
      sibling: 'Sibling',
      friend: 'Friend',
      child: 'Child'
    }
  },
  es: {
    name: 'Nombre',
    address: 'Dirección',
    emergencyContacts: 'Contactos de Emergencia',
    relationship: 'Relación',
    phone: 'Teléfono',
    none: 'No disponible',
    relationshipMap: {
      spouse: 'Cónyuge',
      parent: 'Padre/Madre',
      sibling: 'Hermano/a',
      friend: 'Amigo/a',
      child: 'Hijo/a'
    }
  },
  hi: {
    name: 'नाम',
    address: 'पता',
    emergencyContacts: 'आपातकालीन संपर्क',
    relationship: 'संबंध',
    phone: 'फोन',
    none: 'उपलब्ध नहीं',
    relationshipMap: {
      spouse: 'पति/पत्नी',
      parent: 'माता/पिता',
      sibling: 'भाई/बहन',
      friend: 'मित्र',
      child: 'बेटा/बेटी'
    }
  },
  fr: {
    name: 'Nom',
    address: 'Adresse',
    emergencyContacts: 'Contacts d\'urgence',
    relationship: 'Relation',
    phone: 'Téléphone',
    none: 'Non disponible',
    relationshipMap: {
      spouse: 'Conjoint(e)',
      parent: 'Parent',
      sibling: 'Frère/Sœur',
      friend: 'Ami(e)',
      child: 'Enfant'
    }
  },
  te: {
    name: 'పేరు',
    address: 'చిరునామా',
    emergencyContacts: 'అత్యవసర సంప్రదాయాలు',
    relationship: 'సంబంధం',
    phone: 'ఫోన్',
    none: 'అందుబాటులో లేనిది',
    relationshipMap: {
      spouse: 'జీవనసంగీ',
      parent: 'తల్లిదండ్రులు',
      sibling: 'సోదరుడు/సోదరి',
      friend: 'స్నేహితుడు',
      child: 'సంతానం'
    }
  },
  kn: {
    name: 'ಹೆಸರು',
    address: 'ವಿಳಾಸ',
    emergencyContacts: 'ತುರ್ತು ಸಂಪರ್ಕಗಳು',
    relationship: 'ಸಂಬಂಧ',
    phone: 'ಫೋನ್',
    none: 'ಲಭ್ಯವಿಲ್ಲ',
    relationshipMap: {
      spouse: 'ಪತ್ನಿ/ಗಂಡು',
      parent: 'ತಾಯಿ/ತಂದೆ',
      sibling: 'ಸಹೋದರ/ಸಹೋದರಿ',
      friend: 'ಸ್ನೇಹಿತ',
      child: 'ಮಕ್ಕಳು'
    }
  },
  ta: {
    name: 'பெயர்',
    address: 'முகவரி',
    emergencyContacts: 'அவசர தொடர்புக்கள்',
    relationship: 'உறவு',
    phone: 'ஃபோன்',
    none: 'கிடைக்கவில்லை',
    relationshipMap: {
      spouse: 'மணைவி/மணைவன்',
      parent: 'பெற்றோர்',
      sibling: 'சகோதரன்/சகோதரி',
      friend: 'நண்பன்',
      child: 'குழந்தை'
    }
  },
  ml: {
    name: 'പേര്',
    address: 'വിലാസം',
    emergencyContacts: 'എമർജൻസി കോണ്ടാക്ട്സ്',
    relationship: 'ബന്ധം',
    phone: 'ഫോൺ',
    none: 'ലഭ്യമല്ല',
    relationshipMap: {
      spouse: 'ഭാര്യ/ഭർത്താവ്',
      parent: 'മാതൃപിതൃ',
      sibling: 'സഹോദരൻ/സഹോദരി',
      friend: 'സുഹൃത്ത്',
      child: 'മക്കൾ'
    }
  }
};

function normalizeRelationship(str) {
  if (!str) return '';
  return String(str).trim().toLowerCase();
}

export default function ScanPage(){
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    // detect browser language and pick supported one if available
    try{
      const nav = navigator && (navigator.language || navigator.userLanguage || navigator.browserLanguage);
      const code = nav ? nav.split('-')[0] : 'en';
      if (TRANSLATIONS[code]) setLang(code);
    }catch(e){ /* ignore */ }
  }, []);

  useEffect(() => {
    async function fetchData(){
      try{
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/contact/scan/${id}`);
        setData(res.data);
      }catch(e){
        setError('Contact not found');
      }
    }
    fetchData();
  }, [id]);

  if(error) return <div className="p-6 text-red-500 text-center text-lg">{error}</div>;
  if(!data) return <div className="p-6 text-center">Loading...</div>;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const availableLangs = Object.keys(TRANSLATIONS);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded shadow">
      {/* Header with Name and Language Dropdown */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">{data.fullName}</h2>
        
        {/* Language Dropdown */}
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer"
        >
          {availableLangs.map(code => (
            <option key={code} value={code}>
              {code === 'en' ? 'English' :
               code === 'es' ? 'Español' :
               code === 'hi' ? 'हिंदी' :
               code === 'fr' ? 'Français' :
               code === 'te' ? 'తెలుగు' :
               code === 'kn' ? 'ಕನ್ನಡ' :
               code === 'ta' ? 'தமிழ்' :
               code === 'ml' ? 'മലയാളം' : code.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Address */}
      {data.address && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.address}</p>
          <p className="text-gray-900 dark:text-gray-100">{data.address}</p>
        </div>
      )}

      {/* Emergency Contacts Section */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">{t.emergencyContacts}</h3>
        <div className="space-y-3">
          {data.emergencyContacts && data.emergencyContacts.map((c, i) => {
            const relKey = normalizeRelationship(c.relationship);
            const relTranslated = t.relationshipMap[relKey] || c.relationship || '';
            
            return (
              <div key={i} className="border border-gray-200 dark:border-gray-600 p-4 rounded bg-gray-50 dark:bg-gray-700">
                <div className="font-bold text-lg text-gray-900 dark:text-gray-100">{c.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span className="font-semibold">{t.relationship}:</span> {relTranslated}
                </div>
                {c.phone && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="font-semibold">{t.phone}:</span> {c.phone}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 text-center">
        Emergency Information - Handle with Care
      </div>
    </div>
  );
}
