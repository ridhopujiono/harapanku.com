export interface HeroCms {
	badge: string;
	title: string;
	subtitle: string;
	imageUrl: string;
	ctaPrimary: string;
	ctaSecondary: string;
	ratingScore: string;
	ratingLabel: string;
	slotBadge: string;
	trustBadges: string[];
}

export interface AdvantageItem {
	icon: string;
	title: string;
	description: string;
}

export interface AdvantagesCms {
	badge: string;
	title: string;
	subtitle: string;
	items: AdvantageItem[];
}

export interface SectionHeaderCms {
	badge: string;
	title: string;
	subtitle: string;
}

export interface FlowStep {
	stepLabel: string;
	title: string;
	description: string;
}

export interface FlowCms {
	badge: string;
	title: string;
	subtitle: string;
	footerNote: string;
	steps: FlowStep[];
}

export interface TransparencyCms {
	badge: string;
	title: string;
	subtitle: string;
	ctaLabel: string;
	highlights: string[];
}

export interface FacilityItem {
	tag: string;
	title: string;
	description: string;
	footerLabel: string;
	imageUrl: string;
}

export interface FacilitiesCms {
	badge: string;
	title: string;
	subtitle: string;
	items: FacilityItem[];
}

export interface InvestmentCms {
	badge: string;
	title: string;
	subtitle: string;
	calloutTitle: string;
	calloutBadge: string;
	calloutDescription: string;
	calloutButton: string;
}

export interface FaqItem {
	q: string;
	a: string;
}

export interface FaqCms {
	badge: string;
	title: string;
	subtitle: string;
	helpTitle: string;
	helpSubtitle: string;
	items: FaqItem[];
}

export interface FooterCms {
	description: string;
	whatsappDisplay: string;
	address: string;
	phone: string;
	hoursWeekday: string;
	hoursSunday: string;
	copyright: string;
}

export interface LandingCmsData {
	hero: HeroCms;
	advantages: AdvantagesCms;
	services_header: SectionHeaderCms;
	flow: FlowCms;
	transparency: TransparencyCms;
	facilities: FacilitiesCms;
	investment: InvestmentCms;
	faq: FaqCms;
	footer: FooterCms;
}

export const DEFAULT_CMS: LandingCmsData = {
	hero: {
		badge: 'Terakreditasi & Lingkungan Ramah Anak di Balikpapan',
		title: 'Ketahui Kebutuhan Tumbuh Kembang Anak Anda Hari Ini.',
		subtitle:
			'Tanpa antrean berbulan-bulan. Layanan terpadu Terapi ABA, Wicara, dan Okupasi dengan pemantauan data transparan terintegrasi langsung untuk ketenangan pikiran orang tua.',
		imageUrl: '/assets/images/hero-clinic-care.png',
		ctaPrimary: 'Jadwalkan Asesmen Awal Sekarang',
		ctaSecondary: 'Tanya via WhatsApp',
		ratingScore: '4.9 / 5.0',
		ratingLabel: 'Kepuasan 350+ Orang Tua',
		slotBadge: 'Slot Asesmen Pekan Ini Siap',
		trustBadges: [
			'Terapis Ber-STR Kemenkes',
			'Parent Dashboard Real-Time',
			'Pendekatan Penuh Kasih'
		]
	},
	advantages: {
		badge: 'KEUNGGULAN HARAPANKU',
		title: 'Mengapa Ratusan Orang Tua Mempercayakan Buah Hatinya Kepada Kami?',
		subtitle:
			'Pendekatan holistik yang dirancang secara personal dan berorientasi jangka panjang untuk setiap tahapan usia.',
		items: [
			{
				icon: 'family_restroom',
				title: 'Terapi Terintegrasi Komprehensif',
				description:
					'Layanan menyeluruh meliputi Terapi ABA (Perilaku), Wicara, dan Okupasi dalam satu roadmap terpadu tanpa penanganan yang terpisah-pisah, sehingga kemajuan stimulasi lebih terarah.'
			},
			{
				icon: 'monitoring',
				title: 'Parent Dashboard Terbuka',
				description:
					'Pemantauan progres anak secara berkala dan real-time langsung melalui smartphone atau laptop Anda tanpa jeda informasi, memberi rasa tenang bagi Ayah dan Bunda.'
			},
			{
				icon: 'clinical_notes',
				title: 'Terapis Tersertifikasi & Hangat',
				description:
					'Didukung oleh psikolog anak dan tenaga terapis ber-STR Kemenkes resmi, mengutamakan pendekatan bermain yang menyenangkan tanpa rasa takut bagi si kecil.'
			}
		]
	},
	services_header: {
		badge: 'LAYANAN KLINIS KAMI',
		title: 'Program Terapi Spesifik & Terarah',
		subtitle:
			'Metode klinis teruji untuk mendukung kemandirian gerak, komunikasi aktif, dan ketenangan sensorik buah hati Anda.'
	},
	flow: {
		badge: 'ALUR TERAPI KAMI',
		title: '3 Langkah Mudah Menuju Tumbuh Kembang Optimal',
		subtitle: 'Prosedur terstruktur yang ramah anak dan sepenuhnya transparan bagi keluarga.',
		footerNote:
			'Semua catatan sesi dapat langsung diakses orang tua di hari yang sama via Parent Dashboard',
		steps: [
			{
				stepLabel: 'Langkah Pertama',
				title: 'Asesmen Psikologi & Observasi',
				description:
					'Pemeriksaan menyeluruh milestone motorik, kognitif, dan wicara bersama psikolog anak di ruang observasi ramah anak yang nyaman dan penuh mainan edukatif.'
			},
			{
				stepLabel: 'Langkah Kedua',
				title: 'Penyusunan Roadmap Personal',
				description:
					'Tim klinis merumuskan target perkembangan spesifik buah hati bersama orang tua, menentukan kombinasi jadwal terapi yang tepat dan proporsional.'
			},
			{
				stepLabel: 'Langkah Ketiga',
				title: 'Sesi Terapi & Evaluasi Berkala',
				description:
					'Sesi terapi 1-on-1 interaktif yang selalu tercatat dalam laporan harian, lengkap dengan evaluasi milestone berkala setiap 12 sesi bersama orang tua.'
			}
		]
	},
	transparency: {
		badge: 'TEKNOLOGI TRANSPARANSI',
		title: 'Pantau progres anak Anda secara real-time dari mana saja',
		subtitle:
			'Orang tua tidak perlu lagi bertanya-tanya apa yang terjadi di dalam ruang terapi. Akses catatan harian terapis, grafik milestone, dan kurva kemandirian si kecil langsung dari genggaman Anda.',
		ctaLabel: 'Konsultasikan Akses Dashboard',
		highlights: [
			'Grafik perkembangan kompetensi motorik & wicara mingguan',
			'Catatan evaluasi harian (Daily Therapy Log) terperinci',
			'Rekomendasi stimulasi di rumah (Home Activity Guide)'
		]
	},
	facilities: {
		badge: 'FASILITAS KLINIK',
		title: 'Fasilitas Ramah Anak & Nyaman Seperti di Rumah',
		subtitle:
			'Ruang terapi dirancang khusus dengan standar higienis dan terapeutik internasional agar anak merasa riang dan bebas dari rasa cemas.',
		items: [
			{
				tag: 'Sensori Integrasi',
				title: 'Ruang Sensori Integrasi (SI)',
				description:
					'Lengkap dengan sensory swing (ayunan terapi), matras pengaman bertaraf medis, dan tactile wall untuk melatih regulasi keseimbangan motorik si kecil.',
				footerLabel: 'Higienis & Aman Standar Medis',
				imageUrl: '/assets/images/fasilitas-sensori-integrasi.png'
			},
			{
				tag: 'Wicara & Bahasa',
				title: 'Ruang Terapi Wicara & Artikulasi',
				description:
					'Meja ergonomis kayu ramah anak, cermin artikulasi interaktif, flashcards kosakata, dan instrumen oral motor dalam ruangan yang tenang bebas kebisingan.',
				footerLabel: 'Kedap Suara & Bebas Distraksi',
				imageUrl: '/assets/images/fasilitas-terapi-wicara.png'
			},
			{
				tag: 'Konsultasi Keluarga',
				title: 'Ruang Observasi & Konsultasi Ortu',
				description:
					'Dilengkapi area bermain Montessori dan sofa keluarga yang nyaman untuk diskusi santai 1-on-1 bersama psikolog anak dan tim terapis.',
				footerLabel: 'Privasi Terjamin & Suasana Tenang',
				imageUrl: '/assets/images/fasilitas-ruang-observasi.png'
			}
		]
	},
	investment: {
		badge: 'Investasi Tumbuh Kembang Buah Hati',
		title: 'Pilihan Paket Asesmen Awal yang Transparan',
		subtitle:
			'Tanpa biaya tersembunyi. Dapatkan evaluasi objektif dan rencana penanganan berbasis bukti klinis.',
		calloutTitle: 'Ingin Cek Mandiri di Rumah Dahulu?',
		calloutBadge: 'Gratis & Empatik',
		calloutDescription:
			'Gunakan platform skrining mandiri 3-5 menit berbasis Denver II & M-CHAT-R/F dengan kalkulator usia koreksi prematur dan roadmap stimulasi 14 hari di rumah.',
		calloutButton: 'Mulai Skrining Mandiri'
	},
	faq: {
		badge: 'Bantuan & Informasi',
		title: 'Pertanyaan Seputar Layanan Harapanku',
		subtitle:
			'Temukan jawaban atas hal yang paling sering ditanyakan oleh Ayah dan Bunda sebelum memulai proses asesmen.',
		helpTitle: 'Punya pertanyaan khusus mengenai si kecil?',
		helpSubtitle: 'Care Coordinator kami siap berdiskusi santai dan memberikan panduan awal.',
		items: [
			{
				q: 'Apakah ada masa tunggu (waiting list) untuk memulai asesmen atau terapi?',
				a: 'Di Harapanku, kami berkomitmen Zero Waiting List untuk asesmen awal. Jadwal asesmen dapat dikonfirmasi dalam 1–3 hari kerja sejak pendaftaran online, sehingga intervensi penting bagi buah hati tidak tertunda berbulan-bulan seperti di faskes konvensional.'
			},
			{
				q: 'Bagaimana latar belakang dan sertifikasi para terapis di Harapanku?',
				a: 'Seluruh tenaga terapis kami (Terapis Wicara, Terapis Okupasi, dan Terapi Perilaku/ABA) memiliki Surat Tanda Registrasi (STR) aktif dari Kementerian Kesehatan RI dan merupakan lulusan sarjana profesi dari universitas terkemuka. Seluruh program disupervisi langsung oleh Psikolog Klinis Anak anggota HIMPSI.'
			},
			{
				q: 'Berapa usia anak yang dapat mengikuti terapi di Klinik Harapanku?',
				a: 'Kami melayani anak usia intervensi dini mulai dari 12 bulan (1 tahun) hingga 12 tahun. Pendekatan terapi kami berbasis stimulasi bermain interaktif (play-based therapy) yang disesuaikan secara proporsional menurut fase tumbuh kembang dan karakteristik anak.'
			},
			{
				q: 'Apakah orang tua diperbolehkan mendampingi anak selama sesi observasi/terapi?',
				a: 'Tentu saja! Kami sangat menganut filosofi kolaborasi keluarga (family-centered care). Orang tua dapat mendampingi langsung pada sesi asesmen pengantar atau mengamati melalui cermin satu arah (one-way observation window) dan rekaman ringkasan di Parent Dashboard, agar anak dapat berlatih kemandirian tanpa distraksi.'
			}
		]
	},
	footer: {
		description:
			'Pusat layanan terapi dan stimulasi tumbuh kembang anak terpadu di Balikpapan. Pendekatan ramah anak, transparan, dan berbasis bukti klinis.',
		whatsappDisplay: '+62 811-5400-992',
		address: 'Jl. MT Haryono No. 88, Balikpapan Selatan, Kalimantan Timur 76114',
		phone: '(0542) 876-209',
		hoursWeekday: '08:00 – 17:00 WITA',
		hoursSunday: 'Khusus Reservasi Khusus',
		copyright: '© 2026 Klinik Tumbuh Kembang Harapanku. Seluruh hak cipta dilindungi.'
	}
};
