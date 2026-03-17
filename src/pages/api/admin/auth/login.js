// pages/api/admin/auth/login.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const supabase = createClient(supabaseUrl, anonKey);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(401).json({ error: error.message });

    return res.status(200).json({
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: data.session,
    });
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
