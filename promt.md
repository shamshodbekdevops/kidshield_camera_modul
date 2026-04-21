Role: Sen Senior Python/Django Developer va System Architectsan.
Task: "Bogcha Guard AI" loyihasi uchun Django Rest Framework (DRF) asosida MVP backend tizimini qurishing kerak.

1. Core Models & Database Schema
Quyidagi modellarni loyihalashtir:

Camera: name (string), location (string), video_file (FileField), status (active/offline).

Event: camera (FK), event_type (Choices: 'Fall', 'Fight', 'Intruder', 'Crying'), severity (Choices: 'Critical', 'Warning', 'Info'), timestamp (auto_now_add), description (text), is_resolved (boolean).

Notification: event (FK), message (text), is_read (boolean), created_at.

2. Video Management Logic
Upload & Storage: Videolar media/videos/ papkasiga yuklanishi kerak.

Auto-Deletion: Agar kameraga yangi video yuklansa yoki kamera o'chirilsa, server diskidagi eski video fayli os.remove() orqali jismonan o'chirilishi shart (fayl axlatga aylanib qolmasligi uchun).

Viewsets: Kameralar uchun CRUD amallarini yarat. POST /api/cameras/{id}/upload-video/ endpointi orqali video yuklashni ta'minla.

3. "Mock AI" Simulation Logic (Signal-based)
Tizimda real-time AI o'rniga quyidagi mexanizmni ishlat:

Trigger: Har safar Camera modelida video_file yangilanganda (save bo'lganda), Django post_save signali ishga tushsin.

Action: Signal ichida Python random kutubxonasidan foydalanib, ushbu video uchun 2 tadan 5 tagacha tasodifiy Event va ularga mos Notification yarat (Masalan: "12-soniyada bola yiqilishi aniqlandi"). Bu frontendingda xulosalar va grafiklar paydo bo'lishi uchun kerak.

4. API & Integration Requirements
Serializers: Barcha modellar uchun chuqurlashtirilgan (nested) serializerlar yoz, toki bitta kamerani chaqirganda uning barcha hodisalari (events) ham kelsin.

CORS: django-cors-headers yordamida http://localhost:1336 dan kelayotgan so'rovlarga ruxsat ber.

Media Serving: Media fayllarni URL orqali (Static serve) ko'rishni sozla.

5. Output Format
Kodni modular strukturada yoz (models.py, serializers.py, views.py, signals.py).

Har bir endpoint uchun API hujjatini (Docstring) qoldir.

Clean Code va PEP8 standartlariga qat'iy rioya qil.