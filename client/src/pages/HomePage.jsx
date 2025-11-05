import React from 'react';

export default function HomePage(){
  return (
    <main className="p-8">
      <section className="text-center py-12">
        <h1 className="text-3xl font-bold">Instant Emergency QR Portal: Life-Saving Data in a Scan.</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Provide rapid, secure access to vital contact and medical data with a scannable QR code for emergency responders.</p>
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-semibold">Uses & Benefits</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          <div className="p-4 border rounded"> 
            <h3 className="font-bold">Rapid Responder Access</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">First responders can instantly view critical emergency contacts and allergies.</p>
          </div>
          <div className="p-4 border rounded"> 
            <h3 className="font-bold">Data Security & Privacy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Sensitive data is stored securely and only minimal information is exposed publicly when scanned.</p>
          </div>
          <div className="p-4 border rounded"> 
            <h3 className="font-bold">Global Accessibility</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Accessible from any smartphone with a QR scanner, anywhere in the world.</p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-semibold">How to Use</h2>
        <ol className="mt-4 space-y-3">
          <li className="flex items-start"><span className="mr-3">🔒</span><div><h4 className="font-bold">Step 1: Secure Signup</h4><p className="text-sm text-gray-600 dark:text-gray-300">Create an account to manage your emergency details safely.</p></div></li>
          <li className="flex items-start"><span className="mr-3">📝</span><div><h4 className="font-bold">Step 2: Fill Emergency Form</h4><p className="text-sm text-gray-600 dark:text-gray-300">Enter your personal, medical and emergency contact information.</p></div></li>
          <li className="flex items-start"><span className="mr-3">� QR</span><div><h4 className="font-bold">Step 3: Generate & Print QR</h4><p className="text-sm text-gray-600 dark:text-gray-300">Download or print the generated QR code for quick access.</p></div></li>
          <li className="flex items-start"><span className="mr-3">📱</span><div><h4 className="font-bold">Step 4: Scan Anytime, Anywhere</h4><p className="text-sm text-gray-600 dark:text-gray-300">Authorized scanners can access emergency contacts without logging in.</p></div></li>
        </ol>
      </section>
    </main>
  );
}
