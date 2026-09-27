import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Supabase Backend Configuration
const SUPABASE_PROJECT_ID = 'humbckobaficvgtkohjp';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Oe7eqi54mz8oeDFHnH8TGA_dpAmpeBQ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Persistent JSON storage path
const DATA_DIR = path.resolve(__dirname, 'data_store');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const TRADES_FILE = path.join(DATA_DIR, 'trades.json');
const NOTICES_FILE = path.join(DATA_DIR, 'notices.json');
const FAQS_FILE = path.join(DATA_DIR, 'faqs.json');

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// REST API Endpoints

// Settings
app.get('/api/settings', (req: Request, res: Response) => {
  const fallback = {
    working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opening_time: '09:30',
    closing_time: '17:00',
    slot_duration_minutes: 30,
    break_start: '13:00',
    break_end: '14:00',
    max_per_slot: 2,
    holidays: ['2026-10-02', '2026-11-01', '2026-12-25'],
    institute_name: 'Government ITI College, Jewargi',
    location_name: 'Jewargi, Kalaburagi (Gulbarga), Karnataka, India',
    phone: '[To be verified]',
    email: '[To be verified]',
    address: 'Government ITI College, Jewargi, Kalaburagi District, Karnataka 585310, India',
    office_hours_display: 'Mon - Sat: 09:30 AM - 05:00 PM (Closed on Sundays & Govt Holidays)',
    google_maps_url: 'https://maps.app.goo.gl/GqmRmEwoYkHQCdbj9',
  };
  const settings = readJsonFile(SETTINGS_FILE, fallback);
  res.json(settings);
});

app.put('/api/settings', (req: Request, res: Response) => {
  writeJsonFile(SETTINGS_FILE, req.body);
  res.json(req.body);
});

// Trades
app.get('/api/trades', (req: Request, res: Response) => {
  const trades = readJsonFile(TRADES_FILE, []);
  res.json(trades);
});

app.post('/api/trades', (req: Request, res: Response) => {
  const trades = readJsonFile<any[]>(TRADES_FILE, []);
  const newTrade = { ...req.body, id: req.body.id || `trade-${Date.now()}` };
  trades.unshift(newTrade);
  writeJsonFile(TRADES_FILE, trades);
  res.status(201).json(newTrade);
});

app.put('/api/trades', (req: Request, res: Response) => {
  const trades = readJsonFile<any[]>(TRADES_FILE, []);
  const index = trades.findIndex(t => t.id === req.body.id);
  if (index >= 0) {
    trades[index] = req.body;
  } else {
    trades.push(req.body);
  }
  writeJsonFile(TRADES_FILE, trades);
  res.json(req.body);
});

app.delete('/api/trades/:id', (req: Request, res: Response) => {
  let trades = readJsonFile<any[]>(TRADES_FILE, []);
  trades = trades.filter(t => t.id !== req.params.id);
  writeJsonFile(TRADES_FILE, trades);
  res.json({ success: true });
});

// Notices
app.get('/api/notices', (req: Request, res: Response) => {
  const notices = readJsonFile(NOTICES_FILE, []);
  res.json(notices);
});

app.post('/api/notices', (req: Request, res: Response) => {
  const notices = readJsonFile<any[]>(NOTICES_FILE, []);
  const newNotice = { ...req.body, id: req.body.id || `notice-${Date.now()}` };
  notices.unshift(newNotice);
  writeJsonFile(NOTICES_FILE, notices);
  res.status(201).json(newNotice);
});

app.put('/api/notices', (req: Request, res: Response) => {
  const notices = readJsonFile<any[]>(NOTICES_FILE, []);
  const index = notices.findIndex(n => n.id === req.body.id);
  if (index >= 0) {
    notices[index] = req.body;
  } else {
    notices.push(req.body);
  }
  writeJsonFile(NOTICES_FILE, notices);
  res.json(req.body);
});

app.delete('/api/notices/:id', (req: Request, res: Response) => {
  let notices = readJsonFile<any[]>(NOTICES_FILE, []);
  notices = notices.filter(n => n.id !== req.params.id);
  writeJsonFile(NOTICES_FILE, notices);
  res.json({ success: true });
});

// Supabase Health Check Endpoint
app.get('/api/supabase/status', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('appointments').select('id').limit(1);
    if (error) {
      const tableMissing =
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        error.message?.includes('does not exist') ||
        error.message?.includes('Could not find the table');
      return res.json({
        connected: true,
        projectId: SUPABASE_PROJECT_ID,
        supabaseUrl: SUPABASE_URL,
        tableExists: !tableMissing,
        error: error.message,
      });
    }
    return res.json({
      connected: true,
      projectId: SUPABASE_PROJECT_ID,
      supabaseUrl: SUPABASE_URL,
      tableExists: true,
    });
  } catch (err: any) {
    return res.json({
      connected: false,
      projectId: SUPABASE_PROJECT_ID,
      supabaseUrl: SUPABASE_URL,
      tableExists: false,
      error: err?.message || 'Connection failure',
    });
  }
});

// Appointments
app.get('/api/appointments', async (req: Request, res: Response) => {
  try {
    const { data: sbData, error: sbError } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!sbError && sbData && sbData.length > 0) {
      writeJsonFile(APPOINTMENTS_FILE, sbData);
      return res.json(sbData);
    }
  } catch (err) {
    console.error('Supabase fetch error, using local fallback:', err);
  }

  const appointments = readJsonFile(APPOINTMENTS_FILE, []);
  res.json(appointments);
});

app.post('/api/appointments', async (req: Request, res: Response) => {
  const appointments = readJsonFile<any[]>(APPOINTMENTS_FILE, []);
  const newAppointment = {
    ...req.body,
    id: req.body.id || `apt-${Date.now()}`,
    status: req.body.status || 'Pending',
    created_at: req.body.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Persist to Supabase
  try {
    const { error: sbError } = await supabase
      .from('appointments')
      .insert([newAppointment]);

    if (sbError) {
      console.warn('[Server Supabase Warning]:', sbError.message);
    } else {
      console.log('[Server Supabase]: Appointment written to Supabase successfully:', newAppointment.reference_id);
    }
  } catch (sbEx) {
    console.error('[Server Supabase Exception]:', sbEx);
  }

  appointments.unshift(newAppointment);
  writeJsonFile(APPOINTMENTS_FILE, appointments);
  res.status(201).json(newAppointment);
});

app.put('/api/appointments/:id', async (req: Request, res: Response) => {
  const appointments = readJsonFile<any[]>(APPOINTMENTS_FILE, []);
  const index = appointments.findIndex(a => a.id === req.params.id);
  if (index >= 0) {
    const updated = { ...appointments[index], ...req.body, updated_at: new Date().toISOString() };

    // Update in Supabase
    try {
      await supabase
        .from('appointments')
        .update(updated)
        .eq('id', req.params.id);
    } catch (sbErr) {
      console.error('[Server Supabase Update Error]:', sbErr);
    }

    appointments[index] = updated;
    writeJsonFile(APPOINTMENTS_FILE, appointments);
    res.json(appointments[index]);
  } else {
    res.status(404).json({ error: 'Appointment not found' });
  }
});

app.delete('/api/appointments/:id', async (req: Request, res: Response) => {
  let appointments = readJsonFile<any[]>(APPOINTMENTS_FILE, []);
  const permanent = req.query.permanent === 'true';

  if (permanent) {
    appointments = appointments.filter(a => a.id !== req.params.id);
    try {
      await supabase
        .from('appointments')
        .delete()
        .eq('id', req.params.id);
    } catch (sbErr) {
      console.error('[Server Supabase Delete Error]:', sbErr);
    }
    writeJsonFile(APPOINTMENTS_FILE, appointments);
    return res.json({ success: true, permanent: true });
  }

  const target = appointments.find(a => a.id === req.params.id);
  if (target) {
    target.status = 'Cancelled';
    target.updated_at = new Date().toISOString();

    // Update in Supabase
    try {
      await supabase
        .from('appointments')
        .update({ status: 'Cancelled', updated_at: target.updated_at })
        .eq('id', req.params.id);
    } catch (sbErr) {
      console.error('[Server Supabase Cancel Error]:', sbErr);
    }

    writeJsonFile(APPOINTMENTS_FILE, appointments);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Appointment not found' });
  }
});

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  const VALID_PINS = ['iti@jewargi2026', 'admin123', 'iti2026'];
  if (VALID_PINS.includes((password || '').trim())) {
    res.json({
      success: true,
      token: `adm_${Date.now()}_auth`,
      role: 'Super Administrator',
      institute: 'Government ITI College, Jewargi'
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid administrative password' });
  }
});

// Mount Vite middleware in development or static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
