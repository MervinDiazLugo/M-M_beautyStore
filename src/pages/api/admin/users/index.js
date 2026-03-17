// pages/api/admin/users/index.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) return res.status(500).json({ error: error.message });
    
    const users = data.users.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      email_confirmed_at: u.email_confirmed_at,
    }));
    
    return res.status(200).json(users);
  }

  if (method === 'POST') {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) return res.status(500).json({ error: error.message });
    
    return res.status(201).json({
      id: data.user.id,
      email: data.user.email,
      created_at: data.user.created_at,
    });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
