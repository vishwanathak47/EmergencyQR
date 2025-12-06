import { useContext, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const schema = yup.object().shape({
  fullName: yup.string().required(),
  emergencyContacts: yup.array().of(yup.object().shape({ name: yup.string().required(), phone: yup.string().required() })).min(1)
});

export default function ContactFormPage(){
  const { user } = useContext(AuthContext);
  const { register, control, handleSubmit } = useForm({ resolver: yupResolver(schema), defaultValues: { emergencyContacts: [{ name: '', relationship: '', phone: '' }] } });
  const { fields, append, remove } = useFieldArray({ control, name: 'emergencyContacts' });
  const [qrData, setQrData] = useState(null);

  async function onSubmit(data){
    try{
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/contact/submit`, data, { withCredentials: true });
      setQrData(res.data.qrCodeDataUrl);
      toast.success('Contact saved and QR generated');
    }catch(e){
      toast.error('Failed to submit');
    }
  }

  function downloadPNG(){
    if(!qrData) return;
    const a = document.createElement('a');
    a.href = qrData;
    a.download = 'qr.png';
    a.click();
  }

  return (
    <div className="p-6">
      <Toaster />
      <h2 className="text-xl font-bold">Emergency Contact Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <label className="block">Full Name</label>
          <input className="border p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" {...register('fullName')} />
        </div>
        <div>
          <label className="block">Address</label>
          <input className="border p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" {...register('address')} />
        </div>

        <div>
          <label className="block">Emergency Contacts</label>
          {fields.map((f, idx) => (
            <div key={f.id} className="flex gap-2 mt-2">
              <input placeholder="Name" className="border p-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" {...register(`emergencyContacts.${idx}.name`)} />
              <input placeholder="Relationship" className="border p-2 w-36 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" {...register(`emergencyContacts.${idx}.relationship`)} />
              <input placeholder="Phone" className="border p-2 w-36 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" {...register(`emergencyContacts.${idx}.phone`)} />
              <button type="button" onClick={() => remove(idx)} className="text-red-500">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => append({ name: '', relationship: '', phone: '' })} className="mt-2">Add Contact</button>
        </div>

        <div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save & Generate QR</button>
        </div>
      </form>

      {qrData && (
        <div id="qrcard" className="mt-6 p-4 border inline-block">
          <img src={qrData} alt="qr" />
          <div className="mt-2 flex gap-2">
            <button onClick={downloadPNG} className="px-3 py-1 border rounded">Download PNG</button>
          </div>
        </div>
      )}
    </div>
  );
}
