export const quizQuestions = [
    {
        questionText: "Apa fungsi utama dari Next.js dalam sebuah aplikasi React?",
        answerOptions: [
            { answerText: "Hanya untuk manajemen styling CSS", isCorrect: false },
            { answerText: "Server-Side Rendering (SSR) dan routing berbasis file", isCorrect: true },
            { answerText: "Sebagai pustaka state management global", isCorrect: false },
        ],
    },
    {
        questionText: "Bagaimana cara mendefinisikan rute dinamis seperti `/posts/1` di Next.js Pages Router?",
        answerOptions: [
            { answerText: "Menggunakan nama file `[id].js`", isCorrect: true },
            { answerText: "Menggunakan nama file `id.js`", isCorrect: false },
            { answerText: "Menggunakan nama file `post-id.js`", isCorrect: false },
        ],
    },
    {
        questionText: "Apa hook React yang ideal digunakan untuk mengambil data (data fetching) setelah komponen dipasang?",
        answerOptions: [
            { answerText: "useState", isCorrect: false },
            { answerText: "useMemo", isCorrect: false },
            { answerText: "useEffect", isCorrect: true },
        ],
    },
    {
        questionText: "Di React, elemen apa yang harus dimiliki oleh setiap item dalam daftar (list) yang dibuat dengan `map`?",
        answerOptions: [
            { answerText: "Properti `ref`", isCorrect: false },
            { answerText: "Properti `key`", isCorrect: true },
            { answerText: "Properti `index`", isCorrect: false },
        ],
    },
    {
        questionText: "Apa perintah yang benar untuk menjalankan mode pengembangan (development mode) Next.js?",
        answerOptions: [
            { answerText: "npm run start", isCorrect: false },
            { answerText: "npm run build", isCorrect: false },
            { answerText: "npm run dev", isCorrect: true },
        ],
    },
];