import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SignupPage(){
  const { signup } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handle(e){
    e.preventDefault();
    try{
      await signup(email, password);
      navigate('/form');
    }catch(e){
      alert('Signup failed');
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Signup</h2>
      <form onSubmit={handle} className="mt-4 space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="border p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="border p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        <button className="px-4 py-2 bg-green-600 text-white rounded">Signup</button>
      </form>
    </div>
  );
}
