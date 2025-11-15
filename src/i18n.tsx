import React, { createContext, useContext, useMemo, useState } from 'react';

type Lang = 'en' | 'id';

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Navigation
    features: 'Features',
    howItWorks: 'How It Works',
    showcase: 'Showcase',
    testimonials: 'Testimonials',
    signIn: 'Sign In',
    getStarted: 'Get Started',
    // Hero
    heroBadge: 'Empowering Communities',
    heroTitle: 'Empowering Villages Through Digital Connection',
    heroDescription: 'A community platform for villagers, MSMEs, and admins to collaborate, promote, and grow the local economy.',
    joinNow: 'Join Now',
    learnMore: 'Learn More',
    statVillages: 'Villages Connected',
    statBusinesses: 'Local Businesses',
    statUsers: 'Active Users',
    statCommunityGrowth: 'Community Growth',
    statEconomicImpact: 'Economic Impact',
    // Features
    featuresHeading: 'Built for Everyone in the Village',
    featuresSub: 'Three powerful dashboards designed for different roles in your community',
    featureVillagersTitle: 'For Villagers',
    featureVillagersDesc: 'Connect with your community, discover local businesses, stay updated with village news and events, and participate in community discussions.',
    featureMsmeTitle: 'For MSMEs',
    featureMsmeDesc: 'Showcase your products and services, reach local customers, manage orders efficiently, and grow your business with data-driven insights.',
    featureAdminTitle: 'For Admins',
    featureAdminDesc: 'Monitor village activities, verify businesses, manage community data, track economic growth, and make informed decisions.',
    // Auth
    welcomeBack: 'Welcome Back',
    signInToContinue: 'Sign in to your account to continue',
    signInHint: 'Sign in with your credentials. We’ll send you to the correct dashboard based on your account role.',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    signingIn: 'Signing In...',
    pleaseFillAllFields: 'Please fill in all fields',
    unableToSignIn: 'Unable to sign in',
    joinYourCommunity: 'Join Your Community',
    joinCommunityDesc: 'Connect with villagers, discover local businesses, and grow together',
    dontHaveAccount: "Don't have an account?",
    signUp: 'Sign up'
    ,
    // Register / Forgot
    createAccount: 'Create an Account',
    createAccountDesc: 'Join your village community today',
    creatingAccount: 'Creating...',
    alreadyHaveAccount: 'Already have an account?',
    pleaseEnterEmail: 'Please enter your email',
    resetLinkSent: "Password reset link sent to your email!",
    sendResetLink: 'Send Reset Link',
    backToSignIn: 'Back to Sign In',
    returnToSignIn: 'Return to Sign In',
    didntReceiveEmail: "Didn't receive the email? Resend",
    checkEmailForReset: 'Check your email for reset instructions',
    willSendResetLink: "We'll send you a reset link"
    ,
    // How it works
    howHeading: 'How It Works',
    howSub: 'Get started in three simple steps',
    step1Title: 'Create Your Profile',
    step1Desc: 'Sign up and choose your role - Villager, MSME, or Admin. Set up your personalized dashboard in minutes.',
    step2Title: 'Explore & Connect',
    step2Desc: 'Discover local businesses, village events, tourism spots, and connect with your community members.',
    step3Title: 'Grow Together',
    step3Desc: 'Collaborate, promote, and contribute to the village economy. Track progress with real-time analytics.'
    ,
    // CTA / Showcase / Testimonials / Footer
    ctaTitle: 'Start Building a Stronger Village Today',
    ctaDesc: 'Join thousands of villagers, businesses, and administrators already using Karya Desa to create thriving communities.',
    getStartedFree: 'Get Started Free',
    showcaseHeading: 'See It in Action',
    showcaseSub: 'Explore our intuitive dashboards designed for your community',
    testimonialsHeading: 'Loved by Communities',
    testimonialsSub: 'See what our users have to say about Karya Desa',
    footerTagline: 'Empowering villages through digital connection and collaboration.',
    product: 'Product',
    company: 'Company',
    connect: 'Connect',
    aboutUs: 'About Us',
    contact: 'Contact',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    copyright: '© 2025 Karya Desa. All rights reserved.'
  },
  id: {
    // Navigation
    features: 'Fitur',
    howItWorks: 'Cara Kerja',
    showcase: 'Galeri',
    testimonials: 'Testimoni',
    signIn: 'Masuk',
    getStarted: 'Mulai',
    // Hero
    heroBadge: 'Menguatkan Komunitas',
    heroTitle: 'Meningkatkan Desa melalui Koneksi Digital',
    heroDescription: 'Platform komunitas untuk penduduk desa, UMKM, dan admin untuk berkolaborasi, mempromosikan, dan mengembangkan ekonomi lokal.',
    joinNow: 'Bergabung Sekarang',
    learnMore: 'Pelajari Lebih Lanjut',
    statVillages: 'Desa Terhubung',
    statBusinesses: 'Usaha Lokal',
    statUsers: 'Pengguna Aktif',
    statCommunityGrowth: 'Pertumbuhan Komunitas',
    statEconomicImpact: 'Dampak Ekonomi',
    // Features
    featuresHeading: 'Dibuat untuk Semua di Desa',
    featuresSub: 'Tiga dasbor kuat yang dirancang untuk peran berbeda dalam komunitas Anda',
    featureVillagersTitle: 'Untuk Warga',
    featureVillagersDesc: 'Terhubung dengan komunitas Anda, temukan usaha lokal, tetap diperbarui dengan berita dan acara desa, dan berpartisipasi dalam diskusi komunitas.',
    featureMsmeTitle: 'Untuk UMKM',
    featureMsmeDesc: 'Tampilkan produk dan layanan Anda, jangkau pelanggan lokal, kelola pesanan dengan efisien, dan kembangkan usaha Anda dengan wawasan berbasis data.',
    featureAdminTitle: 'Untuk Admin',
    featureAdminDesc: 'Pantau aktivitas desa, verifikasi usaha, kelola data komunitas, lacak pertumbuhan ekonomi, dan buat keputusan yang tepat.',
    // Auth
    welcomeBack: 'Selamat Datang Kembali',
    signInToContinue: 'Masuk ke akun Anda untuk melanjutkan',
    signInHint: 'Masuk dengan kredensial Anda. Kami akan mengarahkan Anda ke dasbor yang sesuai berdasarkan peran akun Anda.',
    rememberMe: 'Ingat saya',
    forgotPassword: 'Lupa kata sandi?',
    signingIn: 'Sedang Masuk...',
    pleaseFillAllFields: 'Harap isi semua kolom',
    unableToSignIn: 'Tidak dapat masuk',
    joinYourCommunity: 'Bergabung dengan Komunitas Anda',
    joinCommunityDesc: 'Terhubung dengan warga, temukan usaha lokal, dan berkembang bersama',
    dontHaveAccount: 'Belum punya akun?',
    signUp: 'Daftar'
    ,
    // Register / Forgot
    createAccount: 'Buat Akun',
    createAccountDesc: 'Bergabunglah dengan komunitas desa Anda hari ini',
    creatingAccount: 'Sedang Membuat...',
    alreadyHaveAccount: 'Sudah punya akun?',
    pleaseEnterEmail: 'Harap masukkan email Anda',
    resetLinkSent: 'Tautan pengaturan ulang kata sandi telah dikirim ke email Anda!',
    sendResetLink: 'Kirim Tautan Reset',
    backToSignIn: 'Kembali ke Masuk',
    returnToSignIn: 'Kembali ke Masuk',
    didntReceiveEmail: 'Tidak menerima email? Kirim ulang',
    checkEmailForReset: 'Periksa email Anda untuk instruksi pengaturan ulang',
    willSendResetLink: 'Kami akan mengirimkan tautan pengaturan ulang'
    ,
    // How it works
    howHeading: 'Cara Kerja',
    howSub: 'Mulai dalam tiga langkah sederhana',
    step1Title: 'Buat Profil Anda',
    step1Desc: 'Daftar dan pilih peran Anda - Warga, UMKM, atau Admin. Siapkan dasbor pribadi Anda dalam beberapa menit.',
    step2Title: 'Jelajahi & Terhubung',
    step2Desc: 'Temukan usaha lokal, acara desa, tempat wisata, dan terhubung dengan anggota komunitas Anda.',
    step3Title: 'Berkembang Bersama',
    step3Desc: 'Berkolaborasi, promosikan, dan kontribusi pada ekonomi desa. Lacak kemajuan dengan analitik waktu nyata.'
    ,
    // CTA / Showcase / Testimonials / Footer
    ctaTitle: 'Mulai Membangun Desa yang Lebih Kuat Hari Ini',
    ctaDesc: 'Bergabunglah dengan ribuan warga, pelaku usaha, dan administrator yang sudah menggunakan Karya Desa untuk menciptakan komunitas yang berkembang.',
    getStartedFree: 'Mulai Gratis',
    showcaseHeading: 'Lihat dalam Aksi',
    showcaseSub: 'Jelajahi dasbor intuitif kami yang dirancang untuk komunitas Anda',
    testimonialsHeading: 'Disukai oleh Komunitas',
    testimonialsSub: 'Lihat apa kata pengguna kami tentang Karya Desa',
    footerTagline: 'Menguatkan desa melalui koneksi dan kolaborasi digital.',
    product: 'Produk',
    company: 'Perusahaan',
    connect: 'Hubungi',
    aboutUs: 'Tentang Kami',
    contact: 'Kontak',
    privacyPolicy: 'Kebijakan Privasi',
    termsOfService: 'Ketentuan Layanan',
    copyright: '© 2025 Karya Desa. Semua hak dilindungi.'
  }
};

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (k: string) => k
});

const STORAGE_KEY = 'karyades_lang';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const initial = (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'id') return saved as Lang;
    } catch (e) {
      // ignore
    }
    // fallback: prefer navigator language when available
    if (typeof navigator !== 'undefined') {
      const nav = navigator.language || (navigator as any).userLanguage || 'en';
      if (nav.startsWith('id')) return 'id';
    }
    return 'en';
  })();

  const [lang, setLangState] = useState<Lang>(initial);

  const setLang = (l: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch (e) {
      // ignore
    }
    setLangState(l);
  };

  const value = useMemo<I18nContextValue>(() => ({
    lang,
    setLang,
    t: (key: string) => translations[lang][key] ?? key
  }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
