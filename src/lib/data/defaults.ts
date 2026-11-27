export interface ServiceItem {
	id: number;
	slug: string;
	name: string;
	categoryLabel: string;
	durationMinutes: number;
	description: string;
	highlights: string[];
	defaultComplaint: string;
}

export interface PackageItem {
	id: number;
	slug: string;
	name: string;
	priceIdr: number;
	observationMinutes: number;
	dashboardFreeDays: number;
	features: string[];
	isRecommended: boolean;
}

export interface QuestionItem {
	id: number;
	code: string;
	sourceStandard: string;
	pillar: 'wicara' | 'okupasi' | 'perilaku';
	questionTemplate: string;
	homeExample: string;
	miniGameTitle: string | null;
	miniGameSteps: {
		duration_sec: number;
		materials: string;
		steps: string[];
	} | null;
	isCriticalIndicator: boolean;
	sortOrder: number;
}

export const DEFAULT_SERVICES: ServiceItem[] = [
	{
		id: 1,
		slug: 'asesmen-awal',
		name: 'Asesmen Awal Komprehensif',
		categoryLabel: 'Evaluasi Milestone 360°',
		durationMinutes: 90,
		description:
			'Evaluasi menyeluruh tumbuh kembang anak oleh Psikolog Klinis untuk memetakan potensi dan kebutuhan terapi.',
		highlights: [
			'Observasi perilaku & komunikasi',
			'Skrining Denver II & M-CHAT-R/F',
			'Penyusunan Roadmap Personal'
		],
		defaultComplaint: 'Asesmen Tumbuh Kembang Awal'
	},
	{
		id: 2,
		slug: 'terapi-aba',
		name: 'Terapi Perilaku (ABA)',
		categoryLabel: 'Modifikasi Perilaku',
		durationMinutes: 60,
		description:
			'Pendekatan terstruktur berbasis Applied Behavior Analysis untuk meningkatkan fokus, kepatuhan, dan mengurangi tantrum.',
		highlights: [
			'Peningkatan rentang fokus & atensi',
			'Manajemen tantrum & transisi',
			'Kemandirian aktivitas harian'
		],
		defaultComplaint: 'Tantrum & Fokus Perilaku (ABA)'
	},
	{
		id: 3,
		slug: 'terapi-wicara',
		name: 'Terapi Wicara (Speech Therapy)',
		categoryLabel: 'Komunikasi & Bahasa',
		durationMinutes: 45,
		description:
			'Stimulasi komunikasi verbal dan non-verbal untuk anak dengan keterlambatan bicara (speech delay) dan artikulasi.',
		highlights: [
			'Artikulasi & fonem ekspresif',
			'Pemahaman instruksi reseptif',
			'Komunikasi sosial dua arah'
		],
		defaultComplaint: 'Keterlambatan Bicara (Speech Delay)'
	},
	{
		id: 4,
		slug: 'terapi-okupasi',
		name: 'Terapi Okupasi (Occupational Therapy)',
		categoryLabel: 'Sensori & Motorik Halus',
		durationMinutes: 60,
		description:
			'Latihan integrasi sensori dan koordinasi motorik halus agar anak lebih nyaman dengan rangsangan lingkungan.',
		highlights: [
			'Modulasi sensori taktil & auditori',
			'Koordinasi motorik halus (pincer grasp)',
			'Keseimbangan & motorik kasar'
		],
		defaultComplaint: 'Sensori & Motorik Halus (Okupasi)'
	}
];

export const DEFAULT_PACKAGES: PackageItem[] = [
	{
		id: 1,
		slug: 'basic-screening',
		name: 'Basic Screening — Screening Tumbuh Kembang Dasar',
		priceIdr: 350000,
		observationMinutes: 45,
		dashboardFreeDays: 0,
		features: [
			'Observasi langsung 45 menit',
			'Skrining Denver II / M-CHAT',
			'Ringkasan laporan PDF',
			'Konsultasi hasil 15 menit'
		],
		isRecommended: false
	},
	{
		id: 2,
		slug: 'comprehensive-assessment',
		name: 'Comprehensive Assessment — Asesmen Komprehensif Multidisiplin',
		priceIdr: 750000,
		observationMinutes: 90,
		dashboardFreeDays: 30,
		features: [
			'Observasi menyeluruh 90 menit',
			'Pemeriksaan 3 aspek (Wicara, Sensori, Perilaku)',
			'Laporan klinis + Roadmap Personal',
			'Konseling 1-on-1 Psikolog 30 menit',
			'Gratis akses Parent Dashboard 1 bulan'
		],
		isRecommended: true
	}
];

export const DEFAULT_QUESTIONS: QuestionItem[] = [
	{
		id: 1,
		code: 'TK_WICARA_01',
		sourceStandard: 'M-CHAT-R/F',
		pillar: 'wicara',
		questionTemplate:
			'Apakah {nickname} menunjuk dengan jari untuk memperlihatkan sesuatu yang menarik kepada Anda (bukan sekadar meminta)?',
		homeExample:
			'Saat melihat pesawat terbang atau mainan baru, {nickname} menunjuk ke arah benda tersebut sambil menoleh ke wajah Anda untuk berbagi antusiasme.',
		miniGameTitle: "Eksperimen 'Lihat Itu!' (60 Detik)",
		miniGameSteps: {
			duration_sec: 60,
			materials: 'Mainan favorit atau gambar menarik',
			steps: [
				'Pegang mainan di jarak pandang anak',
				'Tunjuk benda tersebut sambil berkata antusias: Lihat itu!',
				'Amati apakah anak ikut melihat lalu menunjuk',
				'Catat respons anak selama 60 detik'
			]
		},
		isCriticalIndicator: false,
		sortOrder: 1
	},
	{
		id: 2,
		code: 'TK_WICARA_02',
		sourceStandard: 'Denver II',
		pillar: 'wicara',
		questionTemplate:
			'Apakah {nickname} sudah mengucapkan kata bermakna secara konsisten selain panggilan Papa/Mama?',
		homeExample:
			'Mengucapkan kata seperti minum, bola, mau, atau mobil saat melihat atau menginginkan objek tersebut.',
		miniGameTitle: 'Tes Kosa Kata Benda Favorit (60 Detik)',
		miniGameSteps: {
			duration_sec: 60,
			materials: '3 benda harian (gelas, bola, buku)',
			steps: [
				'Tunjukkan satu per satu benda',
				'Tanya dengan intonasi ramah: Ini apa ya?',
				'Tunggu respons 5 detik tanpa memaksa',
				'Catat kata bermakna yang keluar'
			]
		},
		isCriticalIndicator: false,
		sortOrder: 2
	},
	{
		id: 3,
		code: 'TK_WICARA_03',
		sourceStandard: 'Denver II',
		pillar: 'wicara',
		questionTemplate:
			'Apakah {nickname} dapat mengikuti instruksi verbal sederhana satu langkah tanpa dibantu gerakan tangan atau tunjukan?',
		homeExample:
			'Ketika Anda berkata "Tolong ambilkan bola" tanpa menunjuk ke arah bola, {nickname} memahami maksudnya dan mengambil bola tersebut.',
		miniGameTitle: 'Tantangan Instruksi Tanpa Tunjuk (60 Detik)',
		miniGameSteps: {
			duration_sec: 60,
			materials: '1 mainan di dekat anak',
			steps: [
				'Pastikan tangan Anda tetap di samping badan',
				'Berikan 1 instruksi pendek dengan suara jelas',
				'Beri jeda 5 detik untuk anak memproses',
				'Amati apakah anak melakukan instruksi'
			]
		},
		isCriticalIndicator: false,
		sortOrder: 3
	},
	{
		id: 4,
		code: 'TK_OKUPASI_01',
		sourceStandard: 'Denver II',
		pillar: 'okupasi',
		questionTemplate:
			'Bagaimana reaksi {nickname} terhadap suara peralatan rumah tangga yang keras seperti blender, vacuum cleaner, atau pengering rambut?',
		homeExample:
			'{nickname} tetap tenang atau hanya sedikit terkejut wajar, tanpa langsung menutup telinga sambil menangis panik berkepanjangan.',
		miniGameTitle: 'Observasi Toleransi Suara (60 Detik)',
		miniGameSteps: {
			duration_sec: 60,
			materials: 'Mainan bersuara atau tepuk tangan berirama',
			steps: [
				'Mulai dari volume pelan di jarak 2 meter',
				'Naikkan intensitas suara perlahan',
				'Amati ekspresi wajah dan bahasa tubuh anak',
				'Hentikan segera jika anak tampak tidak nyaman'
			]
		},
		isCriticalIndicator: false,
		sortOrder: 4
	},
	{
		id: 5,
		code: 'TK_OKUPASI_02',
		sourceStandard: 'Denver II',
		pillar: 'okupasi',
		questionTemplate:
			'Apakah {nickname} merasa nyaman menyentuh berbagai tekstur seperti rumput, pasir, adonan kue, atau label baju?',
		homeExample:
			'Mau bermain pasir/playdough tanpa langsung menarik tangan jijik atau menolak keras memakai baju berbahan tertentu.',
		miniGameTitle: 'Eksplorasi 2 Tekstur (60 Detik)',
		miniGameSteps: {
			duration_sec: 60,
			materials: 'Kain lembut & beras/pasir dalam wadah kecil',
			steps: [
				'Ajak anak menyentuh kain lembut terlebih dahulu',
				'Ajak menyentuh wadah berisi beras/pasir',
				'Biarkan anak menyentuh dengan ujung jari',
				'Amati kenyamanan anak'
			]
		},
		isCriticalIndicator: false,
		sortOrder: 5
	},
	{
		id: 6,
		code: 'TK_OKUPASI_03',
		sourceStandard: 'Denver II',
		pillar: 'okupasi',
		questionTemplate:
			'Apakah {nickname} dapat mengambil benda berukuran kecil menggunakan ujung ibu jari dan jari telunjuk (pincer grasp)?',
		homeExample:
			'Mengambil kismis, sereal bulat, atau manik-manik besar dengan menjepit memakai dua jari, bukan menggenggam seluruh telapak tangan.',
		miniGameTitle: 'Permainan Ambil Sereal (60 Detik)',
		miniGameSteps: {
			duration_sec: 60,
			materials: '3-5 butir sereal/potongan biskuit kecil',
			steps: [
				'Letakkan sereal di atas meja datar',
				'Minta anak memindahkan ke mangkuk kecil',
				'Amati posisi ibu jari dan telunjuk saat menjepit',
				'Beri pujian tiap berhasil'
			]
		},
		isCriticalIndicator: false,
		sortOrder: 6
	},
	{
		id: 7,
		code: 'TK_PERILAKU_01',
		sourceStandard: 'M-CHAT-R/F',
		pillar: 'perilaku',
		questionTemplate:
			'Apakah {nickname} membalas senyuman dan menjaga kontak mata hangat saat Anda tersenyum atau mengajaknya bermain?',
		homeExample:
			'Saat bermain cilukba atau Anda tersenyum di hadapannya, {nickname} menatap mata Anda dan membalas senyuman.',
		miniGameTitle: 'Permainan Cilukba Kontak Mata (60 Detik)',
		miniGameSteps: {
			duration_sec: 60,
			materials: 'Tanpa alat (wajah orang tua)',
			steps: [
				'Posisikan wajah sejajar mata anak',
				'Tutup wajah dengan tangan lalu buka sambil tersenyum',
				'Tunggu apakah anak menatap mata dan tersenyum balik',
				'Ulangi 3 kali dengan jeda santai'
			]
		},
		isCriticalIndicator: false,
		sortOrder: 7
	},
	{
		id: 8,
		code: 'TK_PERILAKU_02',
		sourceStandard: 'M-CHAT-R/F',
		pillar: 'perilaku',
		questionTemplate:
			'Apakah {nickname} menoleh atau merespons ketika dipanggil namanya dari arah samping atau belakang (tanpa disentuh)?',
		homeExample:
			'Ketika dipanggil namanya dengan nada biasa saat sedang bermain santai, {nickname} menoleh mencari sumber suara.',
		miniGameTitle: 'Tes Panggilan Nama (60 Detik)',
		miniGameSteps: {
			duration_sec: 60,
			materials: 'Tanpa alat',
			steps: [
				'Berdiri 1-2 meter di belakang/samping anak saat tidak sibuk gadget',
				'Panggil nama anak dengan suara jelas',
				'Amati apakah anak menoleh dalam 3 detik',
				'Ulangi maksimal 2 kali'
			]
		},
		isCriticalIndicator: true,
		sortOrder: 8
	}
];
