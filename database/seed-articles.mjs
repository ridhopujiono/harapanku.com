import mysql from 'mysql2/promise';

const connectionUrl =
	process.env.DATABASE_URL ??
	'mysql://harapanku_app:harapanku_app_secret@127.0.0.1:3306/harapanku';

const SEED_ARTICLES = [
	{
		slug: 'deteksi-dini-speech-delay-pada-batita',
		title: 'Deteksi Dini Speech Delay pada Anak Usia 1–3 Tahun: Tanda yang Perlu Diperhatikan Orang Tua',
		abstract:
			'Keterlambatan bicara sering dianggap wajar pada usia dini. Padahal, mengenali tanda awal sejak usia 12 hingga 36 bulan membantu orang tua memberikan stimulasi dan intervensi yang jauh lebih efektif sebelum usia sekolah.',
		content: `Kemampuan berkomunikasi merupakan salah satu tonggak perkembangan paling penting di tiga tahun pertama kehidupan anak. Meski setiap anak memiliki tempo belajar yang berbeda, ada rentang usia tertentu yang menjadi acuan klinis apakah kemampuan bicara dan bahasa anak berkembang sesuai usianya.

Pada usia 12 bulan, anak umumnya sudah mulai mengoceh dengan variasi suku kata, menoleh ketika namanya dipanggil, serta menggunakan gestur seperti menunjuk atau melambai. Memasuki usia 18 bulan, anak idealnya mulai mengucapkan beberapa kata bermakna secara konsisten dan mampu memahami instruksi sederhana tanpa bantuan isyarat berlebihan.

Ketika memasuki usia 24 bulan, orang tua perlu lebih peka apabila anak belum mampu menggabungkan dua kata bermakna secara spontan, seperti "mau susu" atau "mama gendong". Tanda lain yang juga patut dievaluasi meliputi kesulitan meniru suara atau kata, jarang melakukan kontak mata saat diajak berkomunikasi, atau tampak kurang merespons suara di sekitarnya.

Langkah pertama yang dapat dilakukan orang tua di rumah adalah melakukan skrining perkembangan secara terstruktur, mengurangi paparan gawai pasif, serta memperbanyak interaksi dua arah melalui membacakan buku, bernyanyi, dan menamai benda di sekitar anak. Apabila hasil skrining menunjukkan kecurigaan keterlambatan, konsultasikan segera dengan tim dokter spesialis dan terapis wicara agar program intervensi dapat dimulai sedini mungkin.`,
		image_url: '/assets/images/article-1.svg',
		author_name: 'dr. Nadia Kusuma, Sp.KFR',
		tags: ['Terapi Wicara', 'Deteksi Dini', 'Parenting'],
		view_count: 342,
		is_published: true,
		published_at: '2026-11-26 09:00:00'
	},
	{
		slug: 'memahami-kebutuhan-sensori-integrasi-anak',
		title: 'Memahami Sensori Integrasi: Mengapa Anak Terlalu Sensitif atau Terlalu Aktif?',
		abstract:
			'Sebagian anak tampak menutup telinga saat mendengar suara bising, sementara sebagian lain tidak bisa diam dan terus mencari gerakan fisik. Pelajari bagaimana sistem sensori memengaruhi perilaku, fokus belajar, serta emosi anak sehari-hari.',
		content: `Setiap detik, otak anak menerima jutaan rangsangan dari lingkungan melalui indera penglihatan, pendengaran, sentuhan, penciuman, pengecapan, serta dua sistem sensori internal yang kerap terlupakan: proprioseptif (kesadaran posisi tubuh dan sendi) dan vestibular (keseimbangan dan gerakan).

Sensori integrasi adalah proses otak mengorganisasi seluruh informasi tersebut agar anak dapat merespons lingkungan secara nyaman dan terarah. Saat proses ini belum matang, anak dapat menunjukkan respons hipersensitif (menghindari tekstur makanan tertentu, tidak suka label baju, mudah kaget) maupun hiposensitif (mencari dorongan fisik kuat, sering menabrak benda, atau sulit duduk tenang).

Kondisi ini bukan berarti anak nakal atau kurang disiplin, melainkan sinyal bahwa sistem sarafnya membutuhkan penyesuaian regulasi. Melalui terapi okupasi berbasis sensori integrasi, terapis merancang aktivitas bermain terarah yang membantu otak memproses stimulasi secara bertahap dan aman.

Di rumah, orang tua dapat mendukung regulasi sensori dengan membangun rutinitas harian yang terprediksi, menyediakan sudut tenang untuk menenangkan diri, serta memberi aktivitas proprioseptif sederhana seperti mendorong keranjang mainan atau bermain playdough bersama.`,
		image_url: '/assets/images/article-2.svg',
		author_name: 'Raka Pratama, S.Tr.Kes',
		tags: ['Terapi Okupasi', 'Sensori Integrasi', 'Tumbuh Kembang'],
		view_count: 289,
		is_published: true,
		published_at: '2026-11-22 09:00:00'
	},
	{
		slug: 'stimulasi-harian-di-rumah-untuk-motorik-halus',
		title: '5 Aktivitas Sederhana di Rumah untuk Melatih Motorik Halus Anak Usia Prasekolah',
		abstract:
			'Kesiapan menulis, mengancingkan baju, hingga menggunakan sendok secara mandiri sangat bergantung pada kekuatan otot jari dan koordinasi mata-tangan. Simak lima ide permainan praktis yang mudah dilakukan bersama orang tua di rumah.',
		content: `Motorik halus melibatkan koordinasi otot-otot kecil pada jari, telapak tangan, dan pergelangan tangan bersama penglihatan. Keterampilan ini menjadi fondasi kemandirian anak sejak usia dini hingga kesiapan belajar di sekolah dasar.

Beberapa aktivitas sederhana yang dapat dilakukan di rumah selama 15 hingga 20 menit setiap hari antara lain:

1. Meremas dan membentuk playdough untuk memperkuat otot jari dan telapak tangan.
2. Memindahkan benda kecil seperti pom-pom menggunakan penjepit makanan atau pinset anak untuk melatih kekuatan menjepit (pincer grasp).
3. Meronce manik-manik berukuran besar atau sedotan yang dipotong untuk mengasah koordinasi dua tangan sekaligus.
4. Merobek dan menempel kertas warna menjadi kolase gambar sederhana.
5. Membantu aktivitas harian seperti menuang air dari gelas kecil, membuka tutup wadah makanan, atau memasang jepitan baju.

Kunci utama stimulasi di rumah bukanlah hasil yang sempurna, melainkan konsistensi dan suasana bermain yang menyenangkan tanpa paksaan. Bila anak tampak cepat lelah, menghindari aktivitas menggambar, atau kesulitan mengontrol alat makan di atas usia tiga tahun, evaluasi okupasi klinis dapat membantu memetakan area yang perlu diperkuat.`,
		image_url: '/assets/images/article-3.svg',
		author_name: 'Sinta Dewi, S.Psi., M.Psi.',
		tags: ['Motorik Halus', 'Stimulasi Rumah', 'Okupasi'],
		view_count: 215,
		is_published: true,
		published_at: '2026-11-18 09:00:00'
	},
	{
		slug: 'peran-kolaborasi-orang-tua-dan-terapis',
		title: 'Mengapa Kemajuan Terapi Anak Jauh Lebih Optimal dengan Kolaborasi Orang Tua dan Klinik',
		abstract:
			'Sesi terapi di klinik hanya berlangsung beberapa jam setiap minggu, sedangkan anak menghabiskan sebagian besar waktunya di rumah. Pelajari bagaimana pelaporan progres transparan menjembatani latihan klinik dan kebiasaan harian keluarga.',
		content: `Keberhasilan program tumbuh kembang anak tidak hanya ditentukan oleh metode di ruang terapi, tetapi juga oleh kesinambungan latihan yang dilakukan anak bersama keluarganya di rumah. Dalam satu minggu, waktu anak bersama orang tua jauh lebih panjang dibandingkan durasi tatap muka di klinik.

Oleh karena itu, komunikasi yang terbuka dan terstruktur antara terapis dan orang tua menjadi komponen kunci. Ketika orang tua mengetahui target bulanan anak, teknik pendekatan yang digunakan terapis, serta bagian mana yang sudah berkembang atau masih membutuhkan pengulangan, orang tua dapat menerapkan strategi serupa dalam aktivitas sehari-hari seperti saat makan, mandi, atau bermain sore.

Di Harapanku, setiap sesi terapi dilengkapi catatan perkembangan ringkas serta panduan stimulasi harian yang mudah dipraktikkan di rumah. Dengan keterlibatan aktif keluarga dan pemantauan data yang konsisten, anak mendapatkan lingkungan belajar yang selaras antara rumah dan klinik sehingga progresnya lebih terukur dan berkelanjutan.`,
		image_url: '/assets/images/article-4.svg',
		author_name: 'Tim Klinis Harapanku',
		tags: ['Kolaborasi Keluarga', 'Progres Terapi', 'Edukasi'],
		view_count: 178,
		is_published: true,
		published_at: '2026-11-12 09:00:00'
	}
];

async function main() {
	const conn = await mysql.createConnection(connectionUrl);

	await conn.execute(`
		CREATE TABLE IF NOT EXISTS articles (
			id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
			slug VARCHAR(180) NOT NULL,
			title VARCHAR(255) NOT NULL,
			abstract TEXT NOT NULL,
			content LONGTEXT NOT NULL,
			image_url VARCHAR(500) NOT NULL,
			author_name VARCHAR(150) NOT NULL,
			tags JSON NOT NULL,
			view_count INT UNSIGNED NOT NULL DEFAULT 0,
			is_published BOOLEAN NOT NULL DEFAULT TRUE,
			published_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			UNIQUE KEY uq_articles_slug (slug),
			KEY idx_articles_pub (is_published, published_at)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
	`);

	for (const art of SEED_ARTICLES) {
		await conn.execute(
			`INSERT IGNORE INTO articles (slug, title, abstract, content, image_url, author_name, tags, view_count, is_published, published_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				art.slug,
				art.title,
				art.abstract,
				art.content,
				art.image_url,
				art.author_name,
				JSON.stringify(art.tags),
				art.view_count,
				art.is_published,
				art.published_at
			]
		);
	}

	const [rows] = await conn.execute(
		'SELECT id, slug, author_name, view_count, published_at FROM articles ORDER BY published_at DESC'
	);
	console.log('Seeded articles in MySQL:', rows);
	await conn.end();
}

main().catch((err) => {
	console.error('Failed to seed articles:', err.message);
	process.exit(1);
});
