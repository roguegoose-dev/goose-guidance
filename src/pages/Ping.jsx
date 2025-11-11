import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent]   = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email, options: {
      emailRedirectTo: window.location.origin + '/ping'
    }});
    if (!error) setSent(true); else alert(error.message);
  };

  return (
    <main className="container" style={{padding: 24}}>
      <h1>Sign in</h1>
      {!sent ? (
        <form onSubmit={onSubmit}>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          <button type="submit">Send magic link</button>
        </form>
      ) : <p>Check your email for the magic link.</p>}
    </main>
  );
}
