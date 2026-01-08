export const sessionsData = {
  1: {
    subject: "PHYSICS",
    questions: [
      {
        questionText:
          "Hukum Newton yang menyatakan bahwa 'Setiap aksi ada reaksi yang sama besar dan berlawanan arah' adalah...",
        answerOptions: [
          { answerText: "Hukum Newton I", isCorrect: false },
          { answerText: "Hukum Newton II", isCorrect: false },
          { answerText: "Hukum Newton III", isCorrect: true },
        ],
      },
      {
        questionText: "Rumus energi kinetik adalah...",
        answerOptions: [
          { answerText: "Ek = m.g.h", isCorrect: false },
          { answerText: "Ek = 1/2 m.v²", isCorrect: true },
          { answerText: "Ek = F.s", isCorrect: false },
        ],
      },
    ],
  },
  2: {
    subject: "MATHEMATICS",
    questions: [
      {
        questionText:
          "Jika f(x) = 2x + 3, maka turunan pertama f'(x) adalah...",
        answerOptions: [
          { answerText: "2", isCorrect: true },
          { answerText: "2x", isCorrect: false },
          { answerText: "3", isCorrect: false },
        ],
      },
      {
        questionText: "Nilai dari sin(90°) adalah...",
        answerOptions: [
          { answerText: "0", isCorrect: false },
          { answerText: "1", isCorrect: true },
          { answerText: "0.5", isCorrect: false },
        ],
      },
    ],
  },
  3: {
    subject: "ESSAY",
    // Catatan: Karena backend tRPC saat ini menerima array angka (index),
    // saya menggunakan format Pilihan Ganda untuk 'Logika Esai' agar kompatibel.
    // Jika backend mendukung string, UI ini bisa diubah menjadi Textarea.
    questions: [
      {
        questionText:
          "Turunkan persamaan perpindahan panas konduksi 1 Dimensi Steady State",
        answerOptions: [
          {
            answerText: "Karena lebih murah tanpa memikirkan dampak lingkungan",
            isCorrect: false,
          },
          {
            answerText:
              "Mengurangi emisi karbon dan menjaga keberlanjutan sumber daya",
            isCorrect: true,
          },
          { answerText: "Agar terlihat modern saja", isCorrect: false },
        ],
      },
    ],
  },
};
