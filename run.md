# Bogcha Guard AI - Backend Run Guide

Ushbu hujjat backendni ishga tushirish, AI simulyatsiyani tekshirish, testlarni yuritish va API bilan ishlash uchun toliq yoriqnoma.

## 1) Talablar

- Python 3.12+
- Windows PowerShell yoki CMD
- Internet (paketlarni o'rnatish uchun)

## 2) Loyihani tayyorlash

1. Backend papkaga kiring:

   d:/SaaS/kidshield_camera_modul/kidshield_back

2. Virtual environment (agar hali bo'lmasa):

   d:/SaaS/kidshield_camera_modul/.venv/Scripts/python.exe -m pip install -r requirements.txt

3. Migratsiyalarni qo'llang:

   d:/SaaS/kidshield_camera_modul/.venv/Scripts/python.exe manage.py migrate

## 3) Serverni ishga tushirish

- Buyruq:

  d:/SaaS/kidshield_camera_modul/.venv/Scripts/python.exe manage.py runserver

- API bazaviy URL:

  http://127.0.0.1:8000/api/

## 4) Asosiy endpointlar

- Kameralar:
  - GET /api/cameras/
  - POST /api/cameras/
  - GET /api/cameras/{id}/
  - PATCH /api/cameras/{id}/
  - DELETE /api/cameras/{id}/
  - POST /api/cameras/{id}/upload-video/

- Hodisalar:
  - GET /api/events/
  - GET /api/events/?camera_id={id}
  - CRUD /api/events/{id}/

- Notificationlar:
  - GET /api/notifications/
  - GET /api/notifications/?event_id={id}
  - CRUD /api/notifications/{id}/
  - POST /api/notifications/{id}/mark-read/

## 5) Mock AI qanday ishlaydi

Video yuklanganda signal pipeline ishga tushadi:

1. Camera uchun yangi video saqlanadi.
2. 2 tadan 5 tagacha random Event yaratiladi.
3. Event severity Info bo'lsa, u aldamchi signal sifatida qaraladi va notification yuborilmaydi.
4. Warning/Critical uchun notification yaratiladi.

Muhim:

- Video almashtirilsa eski fayl diskdan jismonan o'chiriladi.
- Camera o'chirilsa unga tegishli video fayl diskdan o'chiriladi.
- Video fayllar media/videos/ ichiga saqlanadi.

## 6) Real testlarni ishga tushirish

Backendda yozilgan testlarni ishga tushirish:

1. Tekshiruv:

   d:/SaaS/kidshield_camera_modul/.venv/Scripts/python.exe manage.py makemigrations --check

2. Test:

   d:/SaaS/kidshield_camera_modul/.venv/Scripts/python.exe manage.py test monitoring -v 2

Kutilgan natija:

- 8 test, 0 failure, 0 error.

Qamrov:

- Video lifecycle (replace/delete paytida fayl o'chishi)
- AI signal orqali event/notification generatsiya
- Aldamchi signal uchun notify yubormaslik
- Upload endpoint bilan pipeline ishlashi
- Nested serializer javobi
- Notification mark-read va filter ishlashi

## 7) Qo'lda smoke test ssenariysi

1. Camera yarating (POST /api/cameras/).
2. Video yuklang (POST /api/cameras/{id}/upload-video/).
3. GET /api/cameras/{id}/ orqali eventlarni tekshiring.
4. GET /api/notifications/?event_id={id} orqali notifylarni tekshiring.
5. Agar event severity Info bo'lsa, unga notification yaratilmagan bo'lishi kerak.

## 8) Frontend ulanishi

CORS allaqachon quyidagiga ruxsat beradi:

- http://localhost:1336

Shuning uchun frontend shu origin orqali backendga so'rov yuborishi mumkin.

## 9) Ehtimoliy muammolar va yechimlar

1. DisallowedHost xatosi:
   - settings.py ichida localhost, 127.0.0.1 va testserver ruxsatga qo'shilgan.

2. Video upload ishlamayapti:
   - upload-video endpointga multipart formatda video_file nomi bilan yuboring.

3. Media ochilmayapti:
   - DEBUG=True bo'lsa media URL avtomatik serve bo'ladi.

## 10) Tezkor tekshiruv ro'yxati

- Migrate bajarildimi
- Server ishga tushdimi
- Camera yaratildimi
- Video upload bo'ldimi
- Eventlar 2-5 oralig'ida paydo bo'ldimi
- Info event uchun notify yo'qligi tekshirildimi
- Testlar 100% yashilmi

## 11) Postman orqali test qilish

Ushbu loyiha uchun tayyor Postman fayllari:

- postman/BogchaGuardAI.postman_collection.json
- postman/BogchaGuardAI.local.postman_environment.json

Import qilish:

1. Postman oching.
2. Import tugmasini bosing.
3. Yuqoridagi 2 ta JSON faylni tanlang.
4. Environment sifatida Bogcha Guard AI Local ni tanlang.

Ishlatish tartibi:

1. Serverni yoqing.
2. Collection ichida Cameras -> Create Camera ni yuboring.
3. Javobdagi id ni environmentdagi cameraId ga qo'ying.
4. Cameras -> Upload Camera Video orqali video_file ni fayl qilib yuboring.
5. Events -> Filter Events By Camera bilan eventlarni tekshiring.
6. Notifications -> List Notifications bilan notifylarni tekshiring.
7. Notifications -> Mark Notification Read bilan notify holatini yangilang.

Eslatma:

- Upload Camera Video requestida video_file ni albatta File turida tanlang.
- Agar aldamchi signal (Info) hosil bo'lsa, unga notify yaratilmasligi normal holat.
