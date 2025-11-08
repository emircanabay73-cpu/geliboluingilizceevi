import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.json');

function readDatabase() {
  if (!existsSync(dbPath)) {
    return { meeting_requests: [] };
  }
  try {
    const data = readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { meeting_requests: [] };
  }
}

function writeDatabase(data) {
  writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export function createDatabase() {
  if (!existsSync(dbPath)) {
    writeDatabase({ meeting_requests: [] });
    console.log('Database initialized');
  } else {
    console.log('Database already exists');
  }
}

export function getMeetingRequests() {
  const db = readDatabase();
  return db.meeting_requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getMeetingRequestById(id) {
  const db = readDatabase();
  return db.meeting_requests.find(req => req.id === id);
}

export function createMeetingRequest(data) {
  const db = readDatabase();
  const id = db.meeting_requests.length > 0 
    ? Math.max(...db.meeting_requests.map(r => r.id)) + 1 
    : 1;
  
  const newRequest = {
    id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    preferredDate: data.preferredDate,
    preferredTime: data.preferredTime,
    message: data.message || '',
    status: data.status || 'pending',
    createdAt: new Date().toISOString()
  };
  
  db.meeting_requests.push(newRequest);
  writeDatabase(db);
  
  return id;
}

export function updateMeetingRequestStatus(id, status) {
  const db = readDatabase();
  const request = db.meeting_requests.find(req => req.id === parseInt(id));
  
  if (!request) {
    return null;
  }
  
  request.status = status;
  writeDatabase(db);
  
  return request;
}

