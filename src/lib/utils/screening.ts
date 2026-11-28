import {
	ASPECT_META,
	type MilestoneAspect,
	type MilestoneChoice
} from '$lib/data/milestone-screening';

export type AnswerStatus = 'optimal' | 'stimulasi' | 'perlu_pantauan';
export type PillarType = 'wicara' | 'okupasi' | 'perilaku';

export interface AspectSummary {
	aspect: MilestoneAspect;
	label: string;
	yaCount: number;
	tidakCount: number;
	belumDinilaiCount: number;
	total: number;
}

export function summarizeMilestoneAspects(
	answers: Array<{ aspect: MilestoneAspect; choice: MilestoneChoice }>,
	hasRegressionOrConcern: boolean
) {
	const aspectOrder: MilestoneAspect[] = [
		'motorik_kasar',
		'motorik_halus',
		'bahasa_komunikasi',
		'sosialisasi_kemandirian'
	];

	const summaries: AspectSummary[] = aspectOrder.map((aspect) => {
		const subset = answers.filter((a) => a.aspect === aspect);
		return {
			aspect,
			label: ASPECT_META[aspect].label,
			yaCount: subset.filter((a) => a.choice === 'ya').length,
			tidakCount: subset.filter((a) => a.choice === 'tidak').length,
			belumDinilaiCount: subset.filter((a) => a.choice === 'belum_dinilai').length,
			total: subset.length
		};
	});

	const totalYa = summaries.reduce((acc, s) => acc + s.yaCount, 0);
	const totalTidak = summaries.reduce((acc, s) => acc + s.tidakCount, 0);
	const totalBelumDinilai = summaries.reduce((acc, s) => acc + s.belumDinilaiCount, 0);

	const needsFollowUp = totalTidak > 0 || totalBelumDinilai > 0 || hasRegressionOrConcern;

	const followUpSummary = needsFollowUp
		? 'Terdapat beberapa kemampuan yang belum tampak, belum dinilai, atau menjadi perhatian orang tua. Disarankan melanjutkan observasi langsung melalui permainan di rumah dan berkonsultasi dengan tenaga kesehatan atau Psikolog Klinis Anak untuk penilaian lanjutan.'
		: 'Seluruh milestone pemantauan awal pada kelompok usia ini sudah tampak. Teruskan stimulasi bermain bebas layar di rumah dan lakukan pemantauan ulang secara berkala pada kelompok usia berikutnya.';

	return {
		summaries,
		totalYa,
		totalTidak,
		totalBelumDinilai,
		needsFollowUp,
		followUpSummary
	};
}

export interface AgeCalculation {
	chronologicalMonths: number;
	correctedMonths: number;
	chronologicalLabel: string;
	correctedLabel: string;
	isCatchUp: boolean;
}

export function calculateDenverAges(
	birthDateStr: string,
	isPremature: boolean,
	gestationalWeeks: number
): AgeCalculation {
	const birth = new Date(birthDateStr);
	const now = new Date();
	const diffMs = Math.max(0, now.getTime() - birth.getTime());
	const diffDays = diffMs / (1000 * 60 * 60 * 24);
	const chronologicalMonths = Number((diffDays / 30.4375).toFixed(2));

	let correctedMonths = chronologicalMonths;
	let isCatchUp = false;

	if (isPremature && gestationalWeeks < 37) {
		if (chronologicalMonths >= 24) {
			isCatchUp = true;
		} else {
			const prematureWeeks = 40 - gestationalWeeks;
			const deductionMonths = (prematureWeeks * 7) / 30.4375;
			correctedMonths = Number(Math.max(0, chronologicalMonths - deductionMonths).toFixed(2));
		}
	}

	const formatMonths = (m: number) => {
		const whole = Math.floor(m);
		const yrs = Math.floor(whole / 12);
		const rem = whole % 12;
		if (yrs === 0) return `${whole} Bulan`;
		return `${whole} Bulan (${yrs} Thn ${rem} Bln)`;
	};

	return {
		chronologicalMonths,
		correctedMonths,
		chronologicalLabel: formatMonths(chronologicalMonths),
		correctedLabel: isCatchUp
			? `${formatMonths(correctedMonths)} (Catch-up > 24 Bln)`
			: formatMonths(correctedMonths),
		isCatchUp
	};
}

export function computePillarScores(
	answers: Array<{ pillar: PillarType; status: AnswerStatus; isCritical: boolean }>
) {
	const mapScore = (status: AnswerStatus) =>
		status === 'optimal' ? 100 : status === 'stimulasi' ? 60 : 25;

	const avgFor = (pillar: PillarType) => {
		const subset = answers.filter((a) => a.pillar === pillar);
		if (subset.length === 0) return 100;
		const sum = subset.reduce((acc, cur) => acc + mapScore(cur.status), 0);
		return Math.round(sum / subset.length);
	};

	const scoreWicara = avgFor('wicara');
	const scoreOkupasi = avgFor('okupasi');
	const scorePerilaku = avgFor('perilaku');

	const hasCriticalFlag = answers.some(
		(a) => a.isCritical && a.status === 'perlu_pantauan'
	);
	const minScore = Math.min(scoreWicara, scoreOkupasi, scorePerilaku);

	let riskLevel: 'optimal' | 'stimulasi' | 'perlu_evaluasi' = 'optimal';
	if (hasCriticalFlag || minScore < 55) {
		riskLevel = 'perlu_evaluasi';
	} else if (minScore < 85) {
		riskLevel = 'stimulasi';
	}

	const clinicalSummary =
		riskLevel === 'optimal'
			? 'Perkembangan berjalan sesuai rentang usia. Teruskan stimulasi bermain bebas layar setiap hari di rumah.'
			: riskLevel === 'stimulasi'
				? 'Beberapa aspek membutuhkan stimulasi terarah di rumah selama 14 hari ke depan. Pantau progresnya secara berkala.'
				: 'Ditemukan beberapa indikator penting yang sebaiknya dievaluasi lebih lanjut bersama Psikolog Klinis agar intervensi dapat dimulai lebih awal.';

	return {
		scoreWicara,
		scoreOkupasi,
		scorePerilaku,
		riskLevel,
		clinicalSummary
	};
}

export interface RoadmapActivity {
	dayNumber: number;
	pillar: PillarType | 'semua';
	activityTitle: string;
	activityDescription: string;
}

export function generate14DayRoadmap(nickname: string): RoadmapActivity[] {
	return [
		{ dayNumber: 1, pillar: 'wicara', activityTitle: 'Self-Talk Harian', activityDescription: `Narasi aktif setiap aktivitas bersama ${nickname} tanpa gadget.` },
		{ dayNumber: 2, pillar: 'okupasi', activityTitle: 'Sensory Bin Beras', activityDescription: `Ajak ${nickname} mencari mainan tersembunyi di wadah beras/pasir.` },
		{ dayNumber: 3, pillar: 'perilaku', activityTitle: 'Joint Attention Cilukba', activityDescription: `Latih kontak mata hangat 5 menit saat bermain cilukba.` },
		{ dayNumber: 4, pillar: 'wicara', activityTitle: 'Onomatope Suara Hewan', activityDescription: `Tirukan suara hewan dan kendaraan dengan ekspresi wajah jelas.` },
		{ dayNumber: 5, pillar: 'okupasi', activityTitle: 'Pincer Grasp Sereal', activityDescription: `Latih menjepit sereal/kismis dengan ibu jari dan telunjuk.` },
		{ dayNumber: 6, pillar: 'perilaku', activityTitle: 'Transisi 2 Menit', activityDescription: `Beri aba-aba hitung mundur sebelum berpindah aktivitas.` },
		{ dayNumber: 7, pillar: 'wicara', activityTitle: 'Sabotase Positif', activityDescription: `Tunggu ${nickname} menunjuk/bersuara sebelum memberikan mainan.` },
		{ dayNumber: 8, pillar: 'okupasi', activityTitle: 'Rintangan Bantal Karpet', activityDescription: `Merangkak melewati bantal untuk melatih proprioseptif.` },
		{ dayNumber: 9, pillar: 'perilaku', activityTitle: 'Cermin Ekspresi Wajah', activityDescription: `Kenalkan ekspresi senang, kaget, dan sedih di depan cermin.` },
		{ dayNumber: 10, pillar: 'wicara', activityTitle: 'Membaca Buku Gambar', activityDescription: `Tunjuk gambar dan minta ${nickname} ikut menunjuk objek.` },
		{ dayNumber: 11, pillar: 'okupasi', activityTitle: 'Deep Pressure Burrito Roll', activityDescription: `Gulung lembut dengan selimut untuk menenangkan sensori taktil.` },
		{ dayNumber: 12, pillar: 'perilaku', activityTitle: 'Latihan Panggilan Nama', activityDescription: `Panggil nama dengan nada hangat lalu beri pelukan saat menoleh.` },
		{ dayNumber: 13, pillar: 'wicara', activityTitle: 'Instruksi 1 Langkah', activityDescription: `Berikan 1 instruksi pendek tanpa tunjukan tangan.` },
		{ dayNumber: 14, pillar: 'semua', activityTitle: 'Evaluasi 14 Hari', activityDescription: `Catat perubahan ${nickname} dan konsultasikan bila perlu.` }
	];
}
