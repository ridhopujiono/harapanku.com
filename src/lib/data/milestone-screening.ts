export type MilestoneAspect =
	| 'motorik_kasar'
	| 'motorik_halus'
	| 'bahasa_komunikasi'
	| 'sosialisasi_kemandirian';

export type MilestoneChoice = 'ya' | 'tidak' | 'belum_dinilai';

export interface MilestoneQuestion {
	id: number;
	code: string;
	ageGroupMonths: number;
	ageGroupLabel: string;
	aspect: MilestoneAspect;
	aspectLabel: string;
	questionNumber: number;
	questionText: string;
	verificationGuide: string;
	pillar: 'wicara' | 'okupasi' | 'perilaku';
}

export const MILESTONE_AGE_GROUPS = [12, 15, 18, 21, 24, 30, 36, 42, 48, 54, 60] as const;

export const AGE_GROUP_LABELS: Record<number, string> = {
	12: '12 bulan (1 tahun)',
	15: '15 bulan (1 tahun 3 bulan)',
	18: '18 bulan (1 tahun 6 bulan)',
	21: '21 bulan (1 tahun 9 bulan)',
	24: '24 bulan (2 tahun)',
	30: '30 bulan (2 tahun 6 bulan)',
	36: '36 bulan (3 tahun)',
	42: '42 bulan (3 tahun 6 bulan)',
	48: '48 bulan (4 tahun)',
	54: '54 bulan (4 tahun 6 bulan)',
	60: '60 bulan (5 tahun)'
};

export const ASPECT_META: Record<
	MilestoneAspect,
	{ label: string; pillar: 'wicara' | 'okupasi' | 'perilaku'; guide: string }
> = {
	motorik_kasar: {
		label: 'Motorik kasar',
		pillar: 'okupasi',
		guide: 'Minta anak melakukan gerakan dengan aman; beri contoh bila perlu.'
	},
	motorik_halus: {
		label: 'Motorik halus',
		pillar: 'okupasi',
		guide: 'Sediakan balok, kertas, krayon, buku, bola kecil atau wadah sesuai usia.'
	},
	bahasa_komunikasi: {
		label: 'Bahasa dan komunikasi',
		pillar: 'wicara',
		guide: 'Tanyakan kepada orang tua dan ajak anak berkomunikasi langsung.'
	},
	sosialisasi_kemandirian: {
		label: 'Sosialisasi dan kemandirian',
		pillar: 'perilaku',
		guide: 'Amati saat bermain, makan, berpakaian, dan berinteraksi.'
	}
};

type RawTuple = [number, MilestoneAspect, number, string];

const RAW_MILESTONE_DATA: RawTuple[] = [
	// 12 bulan (1 tahun)
	[12, 'motorik_kasar', 1, 'Apakah anak sudah dapat berdiri sendiri tanpa berpegangan, meskipun hanya sebentar?'],
	[12, 'motorik_kasar', 2, 'Apakah anak sudah dapat berjalan beberapa langkah sendiri atau berjalan sambil berpegangan pada perabot?'],
	[12, 'motorik_kasar', 3, 'Apakah anak dapat berpindah dari posisi duduk ke berdiri dengan bantuan minimal?'],
	[12, 'motorik_halus', 1, 'Apakah anak dapat mengambil benda kecil menggunakan ibu jari dan telunjuk?'],
	[12, 'motorik_halus', 2, 'Apakah anak dapat memasukkan benda ke dalam wadah dan mengeluarkannya kembali?'],
	[12, 'motorik_halus', 3, 'Apakah anak dapat menunjuk atau menyentuh benda yang menarik perhatiannya?'],
	[12, 'bahasa_komunikasi', 1, 'Apakah anak menoleh atau memberi respons ketika namanya dipanggil?'],
	[12, 'bahasa_komunikasi', 2, 'Apakah anak menggunakan gestur seperti menunjuk, melambaikan tangan, atau menggeleng untuk berkomunikasi?'],
	[12, 'bahasa_komunikasi', 3, "Apakah anak mengucapkan kata bermakna sederhana, misalnya 'mama' atau 'ayah', untuk menyebut orang yang tepat?"],
	[12, 'sosialisasi_kemandirian', 1, 'Apakah anak meniru gerakan atau kegiatan sederhana yang dilakukan orang dewasa?'],
	[12, 'sosialisasi_kemandirian', 2, 'Apakah anak mau minum dari cangkir dengan bantuan?'],
	[12, 'sosialisasi_kemandirian', 3, 'Apakah anak menunjukkan atau memberikan benda kepada orang lain untuk berbagi perhatian?'],

	// 15 bulan (1 tahun 3 bulan)
	[15, 'motorik_kasar', 1, 'Apakah anak dapat berjalan sendiri tanpa dipegang?'],
	[15, 'motorik_kasar', 2, 'Apakah anak dapat membungkuk untuk mengambil benda lalu kembali berdiri?'],
	[15, 'motorik_kasar', 3, 'Apakah anak mencoba naik ke permukaan rendah atau menaiki anak tangga dengan bantuan dan pengawasan?'],
	[15, 'motorik_halus', 1, 'Apakah anak dapat membuat coretan spontan menggunakan krayon atau alat tulis yang aman?'],
	[15, 'motorik_halus', 2, 'Apakah anak dapat menyusun dua balok atau benda di atas satu sama lain?'],
	[15, 'motorik_halus', 3, 'Apakah anak dapat mengambil potongan makanan kecil menggunakan jari?'],
	[15, 'bahasa_komunikasi', 1, 'Apakah anak menggunakan beberapa kata bermakna selain panggilan orang tua?'],
	[15, 'bahasa_komunikasi', 2, 'Apakah anak dapat menunjuk benda yang disebutkan oleh orang tua?'],
	[15, 'bahasa_komunikasi', 3, 'Apakah anak memahami perintah sederhana tanpa harus selalu disertai contoh gerakan?'],
	[15, 'sosialisasi_kemandirian', 1, 'Apakah anak meniru kegiatan rumah tangga sederhana, seperti menyapu atau menyeka meja?'],
	[15, 'sosialisasi_kemandirian', 2, 'Apakah anak mau makan sendiri menggunakan jari atau mencoba sendok?'],
	[15, 'sosialisasi_kemandirian', 3, 'Apakah anak membawa atau menunjukkan benda kepada orang tua untuk meminta perhatian?'],

	// 18 bulan (1 tahun 6 bulan)
	[18, 'motorik_kasar', 1, 'Apakah anak dapat berjalan sendiri dengan stabil?'],
	[18, 'motorik_kasar', 2, 'Apakah anak dapat menarik mainan sambil berjalan?'],
	[18, 'motorik_kasar', 3, 'Apakah anak dapat naik beberapa anak tangga dengan bantuan orang dewasa?'],
	[18, 'motorik_halus', 1, 'Apakah anak dapat mencoret-coret kertas secara spontan?'],
	[18, 'motorik_halus', 2, 'Apakah anak dapat menyusun sedikitnya tiga balok menjadi menara?'],
	[18, 'motorik_halus', 3, 'Apakah anak mencoba menggunakan sendok untuk makan sendiri?'],
	[18, 'bahasa_komunikasi', 1, "Apakah anak dapat mengucapkan sedikitnya tiga kata bermakna selain 'mama' atau 'ayah'?"],
	[18, 'bahasa_komunikasi', 2, 'Apakah anak menunjuk benda atau bagian tubuh yang diminta?'],
	[18, 'bahasa_komunikasi', 3, "Apakah anak dapat mengikuti perintah satu langkah sederhana, misalnya 'ambil bola'?"],
	[18, 'sosialisasi_kemandirian', 1, 'Apakah anak menunjukkan minat terhadap anak lain, misalnya memperhatikan atau mendekati mereka?'],
	[18, 'sosialisasi_kemandirian', 2, 'Apakah anak membantu saat dipakaikan baju, misalnya mengulurkan tangan atau kaki?'],
	[18, 'sosialisasi_kemandirian', 3, 'Apakah anak dapat minum dari cangkir dengan sedikit bantuan?'],

	// 21 bulan (1 tahun 9 bulan)
	[21, 'motorik_kasar', 1, 'Apakah anak dapat berlari kecil tanpa sering terjatuh?'],
	[21, 'motorik_kasar', 2, 'Apakah anak dapat menendang bola ke arah depan?'],
	[21, 'motorik_kasar', 3, 'Apakah anak dapat menaiki tangga dengan berpegangan atau dibantu?'],
	[21, 'motorik_halus', 1, 'Apakah anak dapat membuat coretan garis menggunakan krayon atau pensil?'],
	[21, 'motorik_halus', 2, 'Apakah anak dapat menyusun sekitar empat balok menjadi menara?'],
	[21, 'motorik_halus', 3, 'Apakah anak dapat membuka atau membalik halaman buku, meskipun beberapa halaman sekaligus?'],
	[21, 'bahasa_komunikasi', 1, "Apakah anak mulai menggabungkan dua kata, misalnya 'mau susu' atau 'bola besar'?"],
	[21, 'bahasa_komunikasi', 2, 'Apakah anak dapat menyebut nama benda yang sering dijumpai?'],
	[21, 'bahasa_komunikasi', 3, 'Apakah anak memahami instruksi sederhana dalam kegiatan sehari-hari?'],
	[21, 'sosialisasi_kemandirian', 1, 'Apakah anak mau bermain berdampingan dengan anak lain?'],
	[21, 'sosialisasi_kemandirian', 2, 'Apakah anak mencoba melepas pakaian sederhana, seperti kaus kaki atau topi?'],
	[21, 'sosialisasi_kemandirian', 3, 'Apakah anak dapat makan menggunakan sendok dengan bantuan yang semakin sedikit?'],

	// 24 bulan (2 tahun)
	[24, 'motorik_kasar', 1, 'Apakah anak dapat berlari tanpa sering kehilangan keseimbangan?'],
	[24, 'motorik_kasar', 2, 'Apakah anak dapat menendang bola ke depan?'],
	[24, 'motorik_kasar', 3, 'Apakah anak dapat naik dan turun tangga sambil berpegangan, satu anak tangga setiap langkah?'],
	[24, 'motorik_halus', 1, 'Apakah anak dapat menyusun sekitar empat sampai enam balok menjadi menara?'],
	[24, 'motorik_halus', 2, 'Apakah anak dapat meniru garis atau coretan sederhana?'],
	[24, 'motorik_halus', 3, 'Apakah anak dapat membuka halaman buku satu per satu?'],
	[24, 'bahasa_komunikasi', 1, "Apakah anak dapat menggabungkan minimal dua kata yang bermakna, misalnya 'mau makan'?"],
	[24, 'bahasa_komunikasi', 2, 'Apakah anak dapat menunjuk beberapa bagian tubuh ketika diminta?'],
	[24, 'bahasa_komunikasi', 3, 'Apakah anak dapat mengikuti dua instruksi sederhana yang berurutan?'],
	[24, 'sosialisasi_kemandirian', 1, 'Apakah anak melakukan permainan pura-pura sederhana, misalnya memberi makan boneka?'],
	[24, 'sosialisasi_kemandirian', 2, 'Apakah anak dapat makan sendiri menggunakan sendok?'],
	[24, 'sosialisasi_kemandirian', 3, 'Apakah anak mulai menunjukkan kebutuhan buang air atau ketertarikan menggunakan toilet?'],

	// 30 bulan (2 tahun 6 bulan)
	[30, 'motorik_kasar', 1, 'Apakah anak dapat melompat dengan kedua kaki terangkat dari lantai?'],
	[30, 'motorik_kasar', 2, 'Apakah anak dapat berdiri dengan satu kaki sesaat ketika dicontohkan?'],
	[30, 'motorik_kasar', 3, 'Apakah anak dapat menaiki tangga dengan koordinasi yang semakin baik?'],
	[30, 'motorik_halus', 1, 'Apakah anak dapat menyusun sekitar enam balok atau lebih menjadi menara?'],
	[30, 'motorik_halus', 2, 'Apakah anak dapat memutar gagang atau tutup wadah sederhana?'],
	[30, 'motorik_halus', 3, 'Apakah anak dapat membuat coretan menyerupai garis atau lingkaran?'],
	[30, 'bahasa_komunikasi', 1, 'Apakah anak dapat berbicara menggunakan gabungan dua sampai tiga kata untuk menyampaikan kebutuhan?'],
	[30, 'bahasa_komunikasi', 2, 'Apakah anak dapat menyebut nama benda atau gambar yang dikenal?'],
	[30, 'bahasa_komunikasi', 3, "Apakah anak mulai menggunakan kata ganti sederhana, seperti 'aku' atau 'saya'?"],
	[30, 'sosialisasi_kemandirian', 1, 'Apakah anak mulai bermain bersama atau berinteraksi dengan anak lain?'],
	[30, 'sosialisasi_kemandirian', 2, 'Apakah anak dapat melepas beberapa jenis pakaian sederhana sendiri?'],
	[30, 'sosialisasi_kemandirian', 3, 'Apakah anak dapat mencuci dan mengeringkan tangan dengan bantuan?'],

	// 36 bulan (3 tahun)
	[36, 'motorik_kasar', 1, 'Apakah anak dapat mengayuh sepeda roda tiga atau menggerakkannya dengan kaki?'],
	[36, 'motorik_kasar', 2, 'Apakah anak dapat melompat ke depan menggunakan kedua kaki?'],
	[36, 'motorik_kasar', 3, 'Apakah anak dapat menaiki tangga dengan kaki bergantian?'],
	[36, 'motorik_halus', 1, 'Apakah anak dapat meniru gambar lingkaran setelah dicontohkan?'],
	[36, 'motorik_halus', 2, 'Apakah anak dapat menyusun sekitar delapan balok menjadi menara?'],
	[36, 'motorik_halus', 3, 'Apakah anak dapat memegang krayon atau pensil dan membuat coretan dengan lebih terarah?'],
	[36, 'bahasa_komunikasi', 1, 'Apakah anak dapat berbicara menggunakan kalimat sederhana yang terdiri dari tiga kata atau lebih?'],
	[36, 'bahasa_komunikasi', 2, 'Apakah anak dapat menyebutkan nama atau menjawab pertanyaan sederhana tentang dirinya?'],
	[36, 'bahasa_komunikasi', 3, 'Apakah sebagian besar ucapan anak dapat dipahami oleh orang yang tidak tinggal serumah?'],
	[36, 'sosialisasi_kemandirian', 1, 'Apakah anak dapat bermain pura-pura dengan alur sederhana, misalnya bermain masak-masakan?'],
	[36, 'sosialisasi_kemandirian', 2, 'Apakah anak mulai dapat bergiliran saat bermain dengan arahan?'],
	[36, 'sosialisasi_kemandirian', 3, 'Apakah anak dapat makan sendiri dan mencoba memakai pakaian sederhana?'],

	// 42 bulan (3 tahun 6 bulan)
	[42, 'motorik_kasar', 1, 'Apakah anak dapat berdiri dengan satu kaki selama beberapa detik?'],
	[42, 'motorik_kasar', 2, 'Apakah anak dapat mencoba melompat menggunakan satu kaki?'],
	[42, 'motorik_kasar', 3, 'Apakah anak dapat melempar bola ke arah orang atau sasaran dari jarak dekat?'],
	[42, 'motorik_halus', 1, 'Apakah anak dapat menggambar orang dengan beberapa bagian tubuh?'],
	[42, 'motorik_halus', 2, 'Apakah anak dapat meniru bentuk tanda tambah atau garis silang?'],
	[42, 'motorik_halus', 3, 'Apakah anak dapat menggunakan gunting khusus anak dengan pengawasan untuk menggunting kertas?'],
	[42, 'bahasa_komunikasi', 1, 'Apakah anak dapat menceritakan kejadian sederhana yang dialaminya?'],
	[42, 'bahasa_komunikasi', 2, 'Apakah anak dapat menjawab pertanyaan sederhana seperti siapa, apa, atau di mana?'],
	[42, 'bahasa_komunikasi', 3, 'Apakah anak dapat berbicara dengan kalimat yang lebih panjang dan dapat dipahami?'],
	[42, 'sosialisasi_kemandirian', 1, 'Apakah anak dapat bermain peran bersama teman, misalnya bermain dokter-dokteran?'],
	[42, 'sosialisasi_kemandirian', 2, 'Apakah anak dapat mengikuti aturan permainan sederhana?'],
	[42, 'sosialisasi_kemandirian', 3, 'Apakah anak dapat memakai pakaian sederhana dengan sedikit bantuan?'],

	// 48 bulan (4 tahun)
	[48, 'motorik_kasar', 1, 'Apakah anak dapat melompat menggunakan satu kaki beberapa kali?'],
	[48, 'motorik_kasar', 2, 'Apakah anak dapat menangkap bola besar yang dilempar dari jarak dekat?'],
	[48, 'motorik_kasar', 3, 'Apakah anak dapat berjalan mengikuti garis atau menjaga keseimbangan tubuh?'],
	[48, 'motorik_halus', 1, 'Apakah anak dapat menggambar orang dengan sedikitnya dua sampai empat bagian tubuh?'],
	[48, 'motorik_halus', 2, 'Apakah anak dapat meniru bentuk silang setelah dicontohkan?'],
	[48, 'motorik_halus', 3, 'Apakah anak dapat menggunakan gunting anak untuk memotong garis sederhana dengan pengawasan?'],
	[48, 'bahasa_komunikasi', 1, 'Apakah anak dapat menceritakan pengalaman sederhana dengan urutan yang dapat dipahami?'],
	[48, 'bahasa_komunikasi', 2, 'Apakah anak memahami konsep sederhana seperti besar-kecil atau banyak-sedikit?'],
	[48, 'bahasa_komunikasi', 3, 'Apakah anak dapat berbicara menggunakan kalimat lengkap yang umumnya mudah dipahami?'],
	[48, 'sosialisasi_kemandirian', 1, 'Apakah anak dapat bermain bersama anak lain dan mulai bekerja sama?'],
	[48, 'sosialisasi_kemandirian', 2, 'Apakah anak dapat menunggu giliran dan mengikuti aturan sederhana?'],
	[48, 'sosialisasi_kemandirian', 3, 'Apakah anak dapat mencuci tangan dan menggunakan toilet dengan bantuan minimal?'],

	// 54 bulan (4 tahun 6 bulan)
	[54, 'motorik_kasar', 1, 'Apakah anak dapat melompat maju beberapa kali dengan koordinasi yang baik?'],
	[54, 'motorik_kasar', 2, 'Apakah anak dapat berdiri dengan satu kaki lebih lama tanpa berpegangan?'],
	[54, 'motorik_kasar', 3, 'Apakah anak dapat melempar dan menangkap bola dengan koordinasi yang semakin baik?'],
	[54, 'motorik_halus', 1, 'Apakah anak dapat menggambar orang dengan beberapa bagian tubuh yang lebih jelas?'],
	[54, 'motorik_halus', 2, 'Apakah anak dapat mencoba menyalin bentuk persegi setelah dicontohkan?'],
	[54, 'motorik_halus', 3, 'Apakah anak dapat mewarnai gambar dengan kontrol tangan yang semakin baik?'],
	[54, 'bahasa_komunikasi', 1, 'Apakah anak dapat menceritakan cerita atau pengalaman sederhana?'],
	[54, 'bahasa_komunikasi', 2, 'Apakah anak dapat menjawab pertanyaan tentang kegiatan sehari-hari?'],
	[54, 'bahasa_komunikasi', 3, 'Apakah anak dapat menjelaskan kebutuhan atau perasaannya menggunakan kata-kata?'],
	[54, 'sosialisasi_kemandirian', 1, 'Apakah anak dapat bermain dalam kelompok kecil dengan mengikuti aturan?'],
	[54, 'sosialisasi_kemandirian', 2, 'Apakah anak mulai mencoba menyelesaikan perselisihan sederhana dengan bantuan orang dewasa?'],
	[54, 'sosialisasi_kemandirian', 3, 'Apakah anak dapat memakai dan melepas pakaian serta merapikan barang dengan arahan?'],

	// 60 bulan (5 tahun)
	[60, 'motorik_kasar', 1, 'Apakah anak dapat melompat menggunakan satu kaki sambil menjaga keseimbangan?'],
	[60, 'motorik_kasar', 2, 'Apakah anak dapat menangkap bola ukuran sedang menggunakan kedua tangan?'],
	[60, 'motorik_kasar', 3, 'Apakah anak dapat berjalan maju, mundur, dan mengubah arah dengan koordinasi yang baik?'],
	[60, 'motorik_halus', 1, 'Apakah anak dapat menggambar orang dengan beberapa bagian tubuh yang dapat dikenali?'],
	[60, 'motorik_halus', 2, 'Apakah anak dapat menyalin bentuk sederhana seperti persegi atau segitiga setelah dicontohkan?'],
	[60, 'motorik_halus', 3, 'Apakah anak dapat menggunakan pensil dan gunting khusus anak dengan kontrol yang lebih baik?'],
	[60, 'bahasa_komunikasi', 1, 'Apakah anak dapat menceritakan kembali cerita atau pengalaman sederhana?'],
	[60, 'bahasa_komunikasi', 2, 'Apakah anak dapat memahami dan menjalankan instruksi yang terdiri dari beberapa langkah?'],
	[60, 'bahasa_komunikasi', 3, 'Apakah anak dapat berbicara dengan kalimat lebih kompleks dan ucapannya dapat dipahami?'],
	[60, 'sosialisasi_kemandirian', 1, 'Apakah anak dapat bermain bersama teman dan mengikuti aturan kelompok?'],
	[60, 'sosialisasi_kemandirian', 2, 'Apakah anak memahami serta mengikuti beberapa aturan keselamatan sederhana?'],
	[60, 'sosialisasi_kemandirian', 3, 'Apakah anak dapat makan, berpakaian, dan menjaga kebersihan diri dengan mandiri atau bantuan minimal?']
];

const ASPECT_CODE: Record<MilestoneAspect, string> = {
	motorik_kasar: 'MK',
	motorik_halus: 'MH',
	bahasa_komunikasi: 'BK',
	sosialisasi_kemandirian: 'SK'
};

export const MILESTONE_QUESTIONS: MilestoneQuestion[] = RAW_MILESTONE_DATA.map(
	([ageGroupMonths, aspect, questionNumber, questionText], idx) => ({
		id: 1000 + idx + 1,
		code: `MS_${ageGroupMonths}M_${ASPECT_CODE[aspect]}_0${questionNumber}`,
		ageGroupMonths,
		ageGroupLabel: AGE_GROUP_LABELS[ageGroupMonths] ?? `${ageGroupMonths} bulan`,
		aspect,
		aspectLabel: ASPECT_META[aspect].label,
		questionNumber,
		questionText,
		verificationGuide: ASPECT_META[aspect].guide,
		pillar: ASPECT_META[aspect].pillar
	})
);

export function selectMilestoneAgeGroup(ageMonths: number): number {
	if (ageMonths < 12) return 12;
	let chosen = 12;
	for (const group of MILESTONE_AGE_GROUPS) {
		if (ageMonths >= group) {
			chosen = group;
		}
	}
	return chosen;
}

export function getQuestionsForAgeGroup(ageGroupMonths: number): MilestoneQuestion[] {
	return MILESTONE_QUESTIONS.filter((q) => q.ageGroupMonths === ageGroupMonths);
}

export const OFFICIAL_REFERENCES = [
	{
		title: 'Buku KIA 2024 – Kementerian Kesehatan RI',
		description: 'Panduan pemantauan kesehatan dan perkembangan anak.',
		url: 'https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/Buku_KIA_2024.pdf'
	},
	{
		title: 'Buku Bagan SDIDTK – Kementerian Kesehatan RI (revisi 2022)',
		description: 'Bagan dan tata laksana SDIDTK/KPSP.',
		url: 'https://www.apgpaud.org/wp-content/uploads/2023/02/BUKU-BAGAN-SDIDTK-revisi-22082022.pdf'
	},
	{
		title: 'Pedoman Pelaksanaan SDIDTK – Kementerian Kesehatan RI (revisi 2022)',
		description: 'Pedoman pelaksanaan skrining, intervensi, dan rujukan.',
		url: 'https://www.apgpaud.org/wp-content/uploads/2023/02/BUKU-PEDOMAN-SDIDTK-revisi-23082022.pdf'
	}
];
