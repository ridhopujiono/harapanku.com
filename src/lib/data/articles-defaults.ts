export interface ArticleItem {
	id: number;
	slug: string;
	title: string;
	abstract: string;
	content: string;
	imageUrl: string;
	authorName: string;
	tags: string[];
	viewCount: number;
	isPublished: boolean;
	publishedAt: string;
}

export const DEFAULT_ARTICLES: ArticleItem[] = [
	{
		id: 1,
		slug: 'deteksi-dini-speech-delay-pada-batita',
		title: 'Deteksi Dini Speech Delay pada Anak Usia 1–3 Tahun: Tanda yang Perlu Diperhatikan Orang Tua',
		abstract:
			'Keterlambatan bicara sering dianggap wajar pada usia dini. Padahal, mengenali tanda awal sejak usia 12 hingga 36 bulan membantu orang tua memberikan stimulasi dan intervensi yang jauh lebih efektif sebelum usia sekolah.',
		content: `Kemampuan berkomunikasi merupakan salah satu tonggak perkembangan paling penting di tiga tahun pertama kehidupan anak. Meski setiap anak memiliki tempo belajar yang berbeda, ada rentang usia tertentu yang menjadi acuan klinis apakah kemampuan bicara dan bahasa anak berkembang sesuai usianya.

Pada usia 12 bulan, anak umumnya sudah mulai mengoceh dengan variasi suku kata, menoleh ketika namanya dipanggil, serta menggunakan gestur seperti menunjuk atau melambai. Memasuki usia 18 bulan, anak idealnya mulai mengucapkan beberapa kata bermakna secara konsisten dan mampu memahami instruksi sederhana tanpa bantuan isyarat berlebihan.

Ketika memasuki usia 24 bulan, orang tua perlu lebih peka apabila anak belum mampu menggabungkan dua kata bermakna secara spontan, seperti "mau susu" atau "mama gendong". Tanda lain yang juga patut dievaluasi meliputi kesulitan meniru suara atau kata, jarang melakukan kontak mata saat diajak berkomunikasi, atau tampak kurang merespons suara di sekitarnya.

Langkah pertama yang dapat dilakukan orang tua di rumah adalah melakukan skrining perkembangan secara terstruktur, mengurangi paparan gawai pasif, serta memperbanyak interaksi dua arah melalui membacakan buku, bernyanyi, dan menamai benda di sekitar anak. Apabila hasil skrining menunjukkan kecurigaan keterlambatan, konsultasikan segera dengan tim dokter spesialis dan terapis wicara agar program intervensi dapat dimulai sedini mungkin.`,
		imageUrl: '/assets/images/article-1.svg',
		authorName: 'dr. Nadia Kusuma, Sp.KFR',
		tags: ['Terapi Wicara', 'Deteksi Dini', 'Parenting'],
		viewCount: 342,
		isPublished: true,
		publishedAt: '2026-11-26T09:00:00.000Z'
	},
	{
		id: 2,
		slug: 'memahami-kebutuhan-sensori-integrasi-anak',
		title: 'Memahami Sensori Integrasi: Mengapa Anak Terlalu Sensitif atau Terlalu Aktif?',
		abstract:
			'Sebagian anak tampak menutup telinga saat mendengar suara bising, sementara sebagian lain tidak bisa diam dan terus mencari gerakan fisik. Pelajari bagaimana sistem sensori memengaruhi perilaku, fokus belajar, serta emosi anak sehari-hari.',
		content: `Setiap detik, otak anak menerima jutaan rangsangan dari lingkungan melalui indera penglihatan, pendengaran, sentuhan, penciuman, pengecapan, serta dua sistem sensori internal yang kerap terlupakan: proprioseptif (kesadaran posisi tubuh dan sendi) dan vestibular (keseimbangan dan gerakan).

Sensori integrasi adalah proses otak mengorganisasi seluruh informasi tersebut agar anak dapat merespons lingkungan secara nyaman dan terarah. Saat proses ini belum matang, anak dapat menunjukkan respons hipersensitif (menghindari tekstur makanan tertentu, tidak suka label baju, mudah kaget) maupun hiposensitif (mencari dorongan fisik kuat, sering menabrak benda, atau sulit duduk tenang).

Kondisi ini bukan berarti anak nakal atau kurang disiplin, melainkan sinyal bahwa sistem sarafnya membutuhkan penyesuaian regulasi. Melalui terapi okupasi berbasis sensori integrasi, terapis merancang aktivitas bermain terarah yang membantu otak memproses stimulasi secara bertahap dan aman.

Di rumah, orang tua dapat mendukung regulasi sensori dengan membangun rutinitas harian yang terprediksi, menyediakan sudut tenang untuk menenangkan diri, serta memberi aktivitas proprioseptif sederhana seperti mendorong keranjang mainan atau bermain playdough bersama.`,
		imageUrl: '/assets/images/article-2.svg',
		authorName: 'Raka Pratama, S.Tr.Kes',
		tags: ['Terapi Okupasi', 'Sensori Integrasi', 'Tumbuh Kembang'],
		viewCount: 289,
		isPublished: true,
		publishedAt: '2026-11-22T09:00:00.000Z'
	},
	{
		id: 3,
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
		imageUrl: '/assets/images/article-3.svg',
		authorName: 'Sinta Dewi, S.Psi., M.Psi.',
		tags: ['Motorik Halus', 'Stimulasi Rumah', 'Okupasi'],
		viewCount: 215,
		isPublished: true,
		publishedAt: '2026-11-18T09:00:00.000Z'
	},
	{
		id: 4,
		slug: 'peran-kolaborasi-orang-tua-dan-terapis',
		title: 'Mengapa Kemajuan Terapi Anak Jauh Lebih Optimal dengan Kolaborasi Orang Tua dan Klinik',
		abstract:
			'Sesi terapi di klinik hanya berlangsung beberapa jam setiap minggu, sedangkan anak menghabiskan sebagian besar waktunya di rumah. Pelajari bagaimana pelaporan progres transparan menjembatani latihan klinik dan kebiasaan harian keluarga.',
		content: `Keberhasilan program tumbuh kembang anak tidak hanya ditentukan oleh metode di ruang terapi, tetapi juga oleh kesinambungan latihan yang dilakukan anak bersama keluarganya di rumah. Dalam satu minggu, waktu anak bersama orang tua jauh lebih panjang dibandingkan durasi tatap muka di klinik.

Oleh karena itu, komunikasi yang terbuka dan terstruktur antara terapis dan orang tua menjadi komponen kunci. Ketika orang tua mengetahui target bulanan anak, teknik pendekatan yang digunakan terapis, serta bagian mana yang sudah berkembang atau masih membutuhkan pengulangan, orang tua dapat menerapkan strategi serupa dalam aktivitas sehari-hari seperti saat makan, mandi, atau bermain sore.

Di Harapanku, setiap sesi terapi dilengkapi catatan perkembangan ringkas serta panduan stimulasi harian yang mudah dipraktikkan di rumah. Dengan keterlibatan aktif keluarga dan pemantauan data yang konsisten, anak mendapatkan lingkungan belajar yang selaras antara rumah dan klinik sehingga progresnya lebih terukur dan berkelanjutan.`,
		imageUrl: '/assets/images/article-4.svg',
		authorName: 'Tim Klinis Harapanku',
		tags: ['Kolaborasi Keluarga', 'Progres Terapi', 'Edukasi'],
		viewCount: 178,
		isPublished: true,
		publishedAt: '2026-11-12T09:00:00.000Z'
	}
];
