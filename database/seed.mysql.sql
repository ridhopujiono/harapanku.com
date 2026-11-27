-- Harapanku & TumbuhKembang.id — Initial Seed Data

SET NAMES utf8mb4;

-- 1. Layanan Klinis Harapanku
INSERT INTO services (slug, name, category_label, duration_minutes, description, highlights, is_active)
VALUES
(
    'asesmen-awal',
    'Asesmen Awal Komprehensif',
    'Evaluasi Milestone 360°',
    90,
    'Evaluasi menyeluruh tumbuh kembang anak oleh Psikolog Klinis untuk memetakan potensi dan kebutuhan terapi.',
    JSON_ARRAY('Observasi perilaku & komunikasi', 'Skrining Denver II & M-CHAT-R/F', 'Penyusunan Roadmap Personal'),
    TRUE
),
(
    'terapi-aba',
    'Terapi Perilaku (ABA)',
    'Modifikasi Perilaku',
    60,
    'Pendekatan terstruktur berbasis Applied Behavior Analysis untuk meningkatkan fokus, kepatuhan, dan mengurangi tantrum.',
    JSON_ARRAY('Peningkatan rentang fokus & atensi', 'Manajemen tantrum & transisi', 'Kemandirian aktivitas harian'),
    TRUE
),
(
    'terapi-wicara',
    'Terapi Wicara (Speech Therapy)',
    'Komunikasi & Bahasa',
    45,
    'Stimulasi komunikasi verbal dan non-verbal untuk anak dengan keterlambatan bicara (speech delay) dan artikulasi.',
    JSON_ARRAY('Artikulasi & fonem ekspresif', 'Pemahaman instruksi reseptif', 'Komunikasi sosial dua arah'),
    TRUE
),
(
    'terapi-okupasi',
    'Terapi Okupasi (Occupational Therapy)',
    'Sensori & Motorik Halus',
    60,
    'Latihan integrasi sensori dan koordinasi motorik halus agar anak lebih nyaman dengan rangsangan lingkungan.',
    JSON_ARRAY('Modulasi sensori taktil & auditori', 'Koordinasi motorik halus (pincer grasp)', 'Keseimbangan & motorik kasar'),
    TRUE
)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 2. Paket Asesmen
INSERT INTO assessment_packages (slug, name, price_idr, observation_minutes, dashboard_free_days, features, is_recommended, is_active)
VALUES
(
    'basic-screening',
    'Basic Screening — Screening Tumbuh Kembang Dasar',
    350000,
    45,
    0,
    JSON_ARRAY('Observasi 45 menit', 'Skrining Denver II / M-CHAT', 'Ringkasan laporan PDF', 'Konsultasi hasil 15 menit'),
    FALSE,
    TRUE
),
(
    'comprehensive-assessment',
    'Comprehensive Assessment — Asesmen Komprehensif Multidisiplin',
    750000,
    90,
    30,
    JSON_ARRAY('Observasi 90 menit', 'Pemeriksaan 3 aspek (Wicara, Sensori, Perilaku)', 'Laporan klinis + Roadmap Personal', 'Konseling 1-on-1 Psikolog 30 menit', 'Gratis akses Parent Dashboard 1 bulan'),
    TRUE,
    TRUE
)
ON DUPLICATE KEY UPDATE price_idr = VALUES(price_idr);

-- 3. Bank Soal Skrining Mandiri (TumbuhKembang.id - 8 Pertanyaan Adaptif)
INSERT INTO screening_questions (code, source_standard, pillar, min_age_months, max_age_months, question_template, home_example, mini_game_title, mini_game_steps, is_critical_indicator, sort_order, is_active)
VALUES
(
    'TK_WICARA_01',
    'M-CHAT-R/F',
    'wicara',
    12,
    144,
    'Apakah {nickname} menunjuk dengan jari untuk memperlihatkan sesuatu yang menarik kepada Anda (bukan sekadar meminta)?',
    'Saat melihat pesawat terbang atau mainan baru, {nickname} menunjuk ke arah benda tersebut sambil menoleh ke wajah Anda untuk berbagi antusiasme.',
    'Eksperimen ''Lihat Itu!'' (60 Detik)',
    JSON_OBJECT('duration_sec', 60, 'materials', 'Mainan favorit atau gambar menarik', 'steps', JSON_ARRAY('Pegang mainan di jarak pandang anak', 'Tunjuk benda tersebut sambil berkata antusias: Lihat itu!', 'Amati apakah anak ikut melihat lalu menunjuk', 'Catat respons anak selama 60 detik')),
    FALSE,
    1,
    TRUE
),
(
    'TK_WICARA_02',
    'Denver II',
    'wicara',
    12,
    144,
    'Apakah {nickname} sudah mengucapkan kata bermakna secara konsisten selain panggilan Papa/Mama?',
    'Mengucapkan kata seperti minum, bola, mau, atau mobil saat melihat atau menginginkan objek tersebut.',
    'Tes Kosa Kata Benda Favorit (60 Detik)',
    JSON_OBJECT('duration_sec', 60, 'materials', '3 benda harian (gelas, bola, buku)', 'steps', JSON_ARRAY('Tunjukkan satu per satu benda', 'Tanya dengan intonasi ramah: Ini apa ya?', 'Tunggu respons 5 detik tanpa memaksa', 'Catat kata bermakna yang keluar')),
    FALSE,
    2,
    TRUE
),
(
    'TK_WICARA_03',
    'Denver II',
    'wicara',
    12,
    144,
    'Apakah {nickname} dapat mengikuti instruksi verbal sederhana satu langkah tanpa dibantu gerakan tangan atau tunjukan?',
    'Ketika Anda berkata "Tolong ambilkan bola" tanpa menunjuk ke arah bola, {nickname} memahami maksudnya dan mengambil bola tersebut.',
    'Tantangan Instruksi Tanpa Tunjuk (60 Detik)',
    JSON_OBJECT('duration_sec', 60, 'materials', '1 mainan di dekat anak', 'steps', JSON_ARRAY('Pastikan tangan Anda tetap di samping badan', 'Berikan 1 instruksi pendek dengan suara jelas', 'Beri jeda 5 detik untuk anak memproses', 'Amati apakah anak melakukan instruksi')),
    FALSE,
    3,
    TRUE
),
(
    'TK_OKUPASI_01',
    'Denver II',
    'okupasi',
    12,
    144,
    'Bagaimana reaksi {nickname} terhadap suara peralatan rumah tangga yang keras seperti blender, vacuum cleaner, atau pengering rambut?',
    '{nickname} tetap tenang atau hanya sedikit terkejut wajar, tanpa langsung menutup telinga sambil menangis panik berkepanjangan.',
    'Observasi Toleransi Suara (60 Detik)',
    JSON_OBJECT('duration_sec', 60, 'materials', 'Mainan bersuara atau tepuk tangan berirama', 'steps', JSON_ARRAY('Mulai dari volume pelan di jarak 2 meter', 'Naikkan intensitas suara perlahan', 'Amati ekspresi wajah dan bahasa tubuh anak', 'Hentikan segera jika anak tampak tidak nyaman')),
    FALSE,
    4,
    TRUE
),
(
    'TK_OKUPASI_02',
    'Denver II',
    'okupasi',
    12,
    144,
    'Apakah {nickname} merasa nyaman menyentuh berbagai tekstur seperti rumput, pasir, adonan kue, atau label baju?',
    'Mau bermain pasir/playdough tanpa langsung menarik tangan jijik atau menolak keras memakai baju berbahan tertentu.',
    'Eksplorasi 2 Tekstur (60 Detik)',
    JSON_OBJECT('duration_sec', 60, 'materials', 'Kain lembut & beras/pasir dalam wadah kecil', 'steps', JSON_ARRAY('Ajak anak menyentuh kain lembut terlebih dahulu', 'Ajak menyentuh wadah berisi beras/pasir', 'Biarkan anak menyentuh dengan ujung jari', 'Amati kenyamanan anak')),
    FALSE,
    5,
    TRUE
),
(
    'TK_OKUPASI_03',
    'Denver II',
    'okupasi',
    12,
    144,
    'Apakah {nickname} dapat mengambil benda berukuran kecil menggunakan ujung ibu jari dan jari telunjuk (pincer grasp)?',
    'Mengambil kismis, sereal bulat, atau manik-manik besar dengan menjepit memakai dua jari, bukan menggenggam seluruh telapak tangan.',
    'Permainan Ambil Sereal (60 Detik)',
    JSON_OBJECT('duration_sec', 60, 'materials', '3-5 butir sereal/potongan biskuit kecil', 'steps', JSON_ARRAY('Letakkan sereal di atas meja datar', 'Minta anak memindahkan ke mangkuk kecil', 'Amati posisi ibu jari dan telunjuk saat menjepit', 'Beri pujian tiap berhasil')),
    FALSE,
    6,
    TRUE
),
(
    'TK_PERILAKU_01',
    'M-CHAT-R/F',
    'perilaku',
    12,
    144,
    'Apakah {nickname} membalas senyuman dan menjaga kontak mata hangat saat Anda tersenyum atau mengajaknya bermain?',
    'Saat bermain cilukba atau Anda tersenyum di hadapannya, {nickname} menatap mata Anda dan membalas senyuman.',
    'Permainan Cilukba Kontak Mata (60 Detik)',
    JSON_OBJECT('duration_sec', 60, 'materials', 'Tanpa alat (wajah orang tua)', 'steps', JSON_ARRAY('Posisikan wajah sejajar mata anak', 'Tutup wajah dengan tangan lalu buka sambil tersenyum', 'Tunggu apakah anak menatap mata dan tersenyum balik', 'Ulangi 3 kali dengan jeda santai')),
    FALSE,
    7,
    TRUE
),
(
    'TK_PERILAKU_02',
    'M-CHAT-R/F',
    'perilaku',
    12,
    144,
    'Apakah {nickname} menoleh atau merespons ketika dipanggil namanya dari arah samping atau belakang (tanpa disentuh)?',
    'Ketika dipanggil namanya dengan nada biasa saat sedang bermain santai, {nickname} menoleh mencari sumber suara.',
    'Tes Panggilan Nama (60 Detik)',
    JSON_OBJECT('duration_sec', 60, 'materials', 'Tanpa alat', 'steps', JSON_ARRAY('Berdiri 1-2 meter di belakang/samping anak saat anak tidak sibuk gadget', 'Panggil nama anak dengan suara jelas', 'Amati apakah anak menoleh dalam 3 detik', 'Ulangi maksimal 2 kali')),
    TRUE,
    8,
    TRUE
)
ON DUPLICATE KEY UPDATE question_template = VALUES(question_template);
