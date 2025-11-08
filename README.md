# Gelibolu İngilizce Evi Web Sitesi

Gelibolu İngilizce Evi için modern bir web sitesi. Öğrenciler kayıt talebi oluşturabilir, admin panelinden talepler onaylanabilir ve onaylandığında otomatik olarak müşteriye email gönderilir.

## Özellikler

- 🏠 **Ana Sayfa**: Hoş geldin mesajı ve hizmetler hakkında bilgi
- 📖 **Hakkımızda**: İşletme hakkında detaylı bilgiler
- ✍️ **Öğrenci Kayıt**: Randevu talep formu
- 📍 **İletişim**: İşletme konumu ve iletişim bilgileri
- 🔐 **Admin Paneli**: Kayıt taleplerini görüntüleme ve onaylama

## Teknolojiler

- **Frontend**: React, React Router, Vite
- **Backend**: Node.js, Express
- **Veritabanı**: SQLite (better-sqlite3)
- **Email**: Nodemailer

## Kurulum

### 1. Tüm bağımlılıkları yükleyin

```bash
npm run install-all
```

Bu komut hem ana dizindeki, hem server hem de client klasörlerindeki paketleri yükleyecektir.

### 2. Email yapılandırması

`server` klasöründe `.env` dosyası oluşturun:

```bash
cd server
copy .env.example .env
```

`.env` dosyasını düzenleyin ve email ayarlarınızı girin:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@geliboluingilizceevi.com
PORT=3001
```

**Gmail için App Password:**
1. Google hesabınızda 2 faktörlü doğrulamayı açın
2. [Google App Passwords](https://myaccount.google.com/apppasswords) sayfasına gidin
3. Yeni bir app password oluşturun ve `.env` dosyasına `SMTP_PASS` olarak ekleyin

### 3. Uygulamayı çalıştırın

Geliştirme modunda (hem frontend hem backend):

```bash
npm run dev
```

Bu komut:
- Backend'i `http://localhost:3001` adresinde başlatır
- Frontend'i `http://localhost:3000` adresinde başlatır

### 4. Tarayıcıda açın

`http://localhost:3000` adresine gidin.

## Kullanım

### Öğrenci Kayıt

1. "Öğrenci Kayıt" sayfasına gidin
2. Formu doldurun (Ad, Email, Telefon, Tarih, Saat)
3. "Talep Gönder" butonuna tıklayın
4. Talep gönderildikten sonra admin email adresine bildirim emaili gönderilir

### Admin Paneli

1. "Admin" sayfasına gidin
2. Bekleyen kayıt taleplerini görüntüleyin
3. "Onayla" butonuna tıklayarak talebi onaylayın
4. Onaylandığında müşteriye otomatik olarak onay emaili gönderilir

## Yapı

```
geliboluingilizceevi/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React bileşenleri
│   │   ├── pages/      # Sayfa bileşenleri
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/              # Express backend
│   ├── index.js        # Ana server dosyası
│   ├── database.js     # Veritabanı işlemleri
│   ├── email.js        # Email gönderme
│   └── package.json
├── package.json
└── README.md
```

## Production Build

Frontend'i production için build etmek:

```bash
npm run build
```

Build edilen dosyalar `client/dist` klasöründe olacaktır.

## Notlar

- Email yapılandırması olmadan da uygulama çalışır, ancak email gönderilemez
- Veritabanı dosyası (`server/database.sqlite`) otomatik olarak oluşturulur
- Admin paneli şu an şifresizdir, production'da güvenlik eklenmelidir

## İletişim Bilgileri

Site içindeki iletişim bilgilerini (`client/src/pages/Contact.jsx`) ve harita konumunu (`client/src/pages/Contact.jsx` içindeki iframe src) kendi bilgilerinizle güncelleyin.

