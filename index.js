import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createDatabase, getMeetingRequests, createMeetingRequest, updateMeetingRequestStatus } from './database.js';
import { sendEmail, sendConfirmationEmail } from './email.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database
createDatabase();

// Get all meeting requests (for admin panel)
app.get('/api/meetings', async (req, res) => {
  try {
    const meetings = getMeetingRequests();
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new meeting request
app.post('/api/meetings', async (req, res) => {
  try {
    const { name, email, phone, preferredDate, preferredTime, message } = req.body;

    if (!name || !email || !phone || !preferredDate || !preferredTime) {
      return res.status(400).json({ error: 'Tüm gerekli alanlar doldurulmalıdır' });
    }

    // Create meeting request in database
    const meetingId = createMeetingRequest({
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      message: message || '',
      status: 'pending'
    });

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@geliboluingilizceevi.com';
    const emailSubject = 'Yeni Öğrenci Kayıt Talebi';
    const emailBody = `
      Yeni bir öğrenci kayıt talebi alındı:
      
      Ad Soyad: ${name}
      Email: ${email}
      Telefon: ${phone}
      Tercih Edilen Tarih: ${preferredDate}
      Tercih Edilen Saat: ${preferredTime}
      Mesaj: ${message || 'Mesaj yok'}
      
      Admin panelinden onaylayabilirsiniz.
    `;

    await sendEmail(adminEmail, emailSubject, emailBody);

    res.json({ success: true, id: meetingId, message: 'Talebiniz alındı. En kısa sürede size dönüş yapacağız.' });
  } catch (error) {
    console.error('Error creating meeting request:', error);
    res.status(500).json({ error: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
  }
});

// Update meeting request status (approve/reject)
app.put('/api/meetings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Geçersiz durum' });
    }

    const meeting = updateMeetingRequestStatus(id, status);

    if (!meeting) {
      return res.status(404).json({ error: 'Talep bulunamadı' });
    }

    // If approved, send confirmation email to customer
    if (status === 'approved') {
      await sendConfirmationEmail(
        meeting.email,
        meeting.name,
        meeting.preferredDate,
        meeting.preferredTime
      );
    }

    res.json({ success: true, meeting });
  } catch (error) {
    console.error('Error updating meeting request:', error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

