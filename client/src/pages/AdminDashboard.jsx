import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard(){
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize QR Scanner
    const scanner = new Html5QrcodeScanner("qr-reader", 
      { fps: 10, qrbox: {width: 250, height: 250} },
      /* verbose= */ false);
    
    scanner.render((decodedText) => {
      // success callback
      handleScan(decodedText);
    }, (error) => {
      // error callback
      console.warn(`QR error: ${error}`);
    });

    // Cleanup
    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  useEffect(() => {
    // admin contacts endpoint
    async function fetchAll(){
      try{
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/contacts`, { withCredentials: true });
        setContacts(res.data);
      }catch(e){ }
    }
    fetchAll();
  }, []);

  function handleScan(data){
    if(data) {
      // expect data to be a URL ending with /scan/:id
      const parts = data.split('/');
      const id = parts[parts.length-1];
      navigate(`/scan/${id}`);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Admin Dashboard</h2>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">QR Scanner</h3>
          <div className="mt-2" id="qr-reader"></div>
        </div>
        <div>
          <h3 className="font-semibold">Contacts</h3>
          <ul>
            {contacts.map(c => <li key={c._id} className="border p-2 mt-2">{c.fullName}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
