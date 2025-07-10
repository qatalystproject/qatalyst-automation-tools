
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    tagline: "Test Smarter. Ship Faster.",
    apiConnected: "API Connected",
    
    // Authentication
    authTitle: "API Authentication",
    authDescription: "Enter your OpenAI API key to start generating test scenarios",
    apiKeyPlaceholder: "Enter your OpenAI API key...",
    authenticateButton: "Authenticate",
    
    // Tabs
    generator: "Generator",
    playwright: "Playwright",
    testCases: "Test Cases",
    execute: "Execute",
    export: "Export",
    
    // Execution Engine
    executionMode: "Execution Mode",
    headlessMode: "Headless Mode",
    headlessDescription: "Tests run in the background without opening browser windows for faster execution. Only active test cases will be executed.",
    quickActions: "Quick Actions",
    runActiveTests: "Run Active Tests (Headless)",
    stopTests: "Stop Tests",
    rerunFailed: "Rerun Failed",
    testSummary: "Test Summary",
    successRate: "Success Rate",
    passed: "Passed",
    failed: "Failed",
    archived: "Archived",
    running: "Running",
    testResults: "Test Results",
    testResultsDescription: "Execution results from Playwright tests",
    noTestResults: "No Test Results",
    noTestResultsDescription: "Test results will appear here after running Playwright tests.",
    
    // Footer
    aboutUs: "About Us",
    aboutDescription: "QAtalyst is an advanced test automation platform that helps QA teams generate, manage, and execute tests more efficiently. Our mission is to make testing smarter and shipping faster.",
    aboutContent: "We believe in empowering quality assurance professionals with cutting-edge tools that streamline the testing process. From Gherkin scenario generation to Playwright code automation, QAtalyst bridges the gap between manual testing and automated excellence.",
    copyright: "© 2024 QAtalyst. All rights reserved.",
    socialMedia: "Follow Us",
    
    // Toast Messages
    authSuccess: "Authentication Success",
    authSuccessDesc: "OpenAI API Key has been configured successfully.",
    testCasesCreated: "Test Cases Created",
    noActiveTests: "No Active Tests Available",
    noActiveTestsDesc: "Please ensure you have active test cases to execute.",
    runningActiveTests: "Running Active Tests",
    testExecutionComplete: "Test Execution Complete",
    testsStopped: "Tests Stopped",
    testsStoppedDesc: "Test execution has been stopped.",
    noFailedTests: "No Failed Tests",
    noFailedTestsDesc: "There are no failed tests to rerun.",
    rerunningFailedTests: "Rerunning Failed Tests",
    rerunComplete: "Rerun Complete",
    browserOpening: "Browser Opening",
  },
  id: {
    // Header
    tagline: "Testing Lebih Cerdas. Pengiriman Lebih Cepat.",
    apiConnected: "API Terhubung",
    
    // Authentication
    authTitle: "Autentikasi API",
    authDescription: "Masukkan kunci API OpenAI Anda untuk mulai menghasilkan skenario tes",
    apiKeyPlaceholder: "Masukkan kunci API OpenAI Anda...",
    authenticateButton: "Autentikasi",
    
    // Tabs
    generator: "Generator",
    playwright: "Playwright",
    testCases: "Kasus Tes",
    execute: "Eksekusi",
    export: "Ekspor",
    
    // Execution Engine
    executionMode: "Mode Eksekusi",
    headlessMode: "Mode Headless",
    headlessDescription: "Tes berjalan di latar belakang tanpa membuka jendela browser untuk eksekusi yang lebih cepat. Hanya kasus tes aktif yang akan dieksekusi.",
    quickActions: "Aksi Cepat",
    runActiveTests: "Jalankan Tes Aktif (Headless)",
    stopTests: "Hentikan Tes",
    rerunFailed: "Jalankan Ulang yang Gagal",
    testSummary: "Ringkasan Tes",
    successRate: "Tingkat Keberhasilan",
    passed: "Berhasil",
    failed: "Gagal",
    archived: "Diarsipkan",
    running: "Berjalan",
    testResults: "Hasil Tes",
    testResultsDescription: "Hasil eksekusi dari tes Playwright",
    noTestResults: "Tidak Ada Hasil Tes",
    noTestResultsDescription: "Hasil tes akan muncul di sini setelah menjalankan tes Playwright.",
    
    // Footer
    aboutUs: "Tentang Kami",
    aboutDescription: "QAtalyst adalah platform otomasi testing canggih yang membantu tim QA menghasilkan, mengelola, dan mengeksekusi tes dengan lebih efisien. Misi kami adalah membuat testing lebih cerdas dan pengiriman lebih cepat.",
    aboutContent: "Kami percaya dalam memberdayakan profesional quality assurance dengan tools terdepan yang menyederhanakan proses testing. Dari pembuatan skenario Gherkin hingga otomasi kode Playwright, QAtalyst menjembatani kesenjangan antara manual testing dan keunggulan otomatis.",
    copyright: "© 2024 QAtalyst. Seluruh hak cipta dilindungi.",
    socialMedia: "Ikuti Kami",
    
    // Toast Messages
    authSuccess: "Autentikasi Berhasil",
    authSuccessDesc: "Kunci API OpenAI telah dikonfigurasi dengan sukses.",
    testCasesCreated: "Kasus Tes Dibuat",
    noActiveTests: "Tidak Ada Tes Aktif Tersedia",
    noActiveTestsDesc: "Pastikan Anda memiliki kasus tes aktif untuk dieksekusi.",
    runningActiveTests: "Menjalankan Tes Aktif",
    testExecutionComplete: "Eksekusi Tes Selesai",
    testsStopped: "Tes Dihentikan",
    testsStoppedDesc: "Eksekusi tes telah dihentikan.",
    noFailedTests: "Tidak Ada Tes yang Gagal",
    noFailedTestsDesc: "Tidak ada tes yang gagal untuk dijalankan ulang.",
    rerunningFailedTests: "Menjalankan Ulang Tes yang Gagal",
    rerunComplete: "Jalankan Ulang Selesai",
    browserOpening: "Membuka Browser",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
