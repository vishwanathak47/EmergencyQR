import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Small client-side translations for common labels and relationship words.
const TRANSLATIONS = {
  en: {
    allergies: 'Allergies',
    emergencyContacts: 'Emergency Contacts',
    none: 'None',
    relationshipMap: {}
  },
  es: {
    allergies: 'Alergias',
    emergencyContacts: 'Contactos de Emergencia',
    none: 'Ninguna',
    relationshipMap: {
      spouse: 'Cónyuge',
      parent: 'Padre/Madre',
      sibling: 'Hermano/a',
      friend: 'Amigo/a',
      child: 'Hijo/a'
    }
  },
  hi: {
    allergies: 'एलर्जी',
    emergencyContacts: 'आपातकालीन संपर्क',
    none: 'कोई नहीं',
    relationshipMap: {
      spouse: 'पति/पत्नी',
      parent: 'माता/पिता',
      sibling: 'भाई/बहन',
      friend: 'मित्र',
      child: 'बेटा/बेटी'
    }
  },
  fr: {
    allergies: 'Allergies',
    emergencyContacts: 'Contacts d\'urgence',
    none: 'Aucun',
    relationshipMap: {
      spouse: 'Conjoint(e)',
      parent: 'Parent',
      sibling: 'Frère/Sœur',
      friend: 'Ami(e)',
      child: 'Enfant'
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
        setError('Not found');
      }
    }
    fetchData();
  }, [id]);

  if(error) return <div className="p-6">{error}</div>;
  if(!data) return <div className="p-6">Loading...</div>;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded shadow">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold">{data.fullName}</h2>
        <div className="flex gap-2">
          {/* Language selector buttons - simple and visible for scanned links */}
          {Object.keys(TRANSLATIONS).map(code => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`px-2 py-1 border rounded ${lang === code ? 'bg-blue-600 text-white' : ''}`}
              aria-pressed={lang === code}
              title={`Switch to ${code}`}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-2">{t.allergies}: {data.allergies || t.none}</p>
      <h3 className="mt-4 font-semibold">{t.emergencyContacts}</h3>
      <ul className="mt-2">
        {data.emergencyContacts.map((c, i) => {
          const relKey = normalizeRelationship(c.relationship);
          const relTranslated = t.relationshipMap[relKey] || c.relationship || '';
          return (
            <li key={i} className="border p-2 mt-2">
              <div className="font-bold">{c.name}</div>
              <div className="text-sm">{relTranslated}{relTranslated && c.phone ? ' - ' : ''}{c.phone}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
