"use client";

import React, { useState, useMemo, useEffect } from "react";

// Official Province codes according to pmfuelrelief.pk
const PROVINCES = [
  { id: "P", name: "پنجاب", eng: "Punjab", code: "P" },
  { id: "S", name: "سندھ", eng: "Sindh", code: "S" },
  { id: "K", name: "خیبر پختونخوا", eng: "KPK", code: "K" },
  { id: "B", name: "بلوچستان", eng: "Balochistan", code: "B" },
  { id: "I", name: "اسلام آباد", eng: "Islamabad", code: "I" },
  { id: "G", name: "گلگت بلتستان", eng: "Gilgit-Baltistan", code: "G" },
  { id: "A", name: "آزاد کشمیر", eng: "AJK", code: "A" },
];

const MONTHS = [
  { val: "01", name: "01 - جنوری" },
  { val: "02", name: "02 - فروری" },
  { val: "03", name: "03 - مارچ" },
  { val: "04", name: "04 - اپریل" },
  { val: "05", name: "05 - مئی" },
  { val: "06", name: "06 - جون" },
  { val: "07", name: "07 - جولائی" },
  { val: "08", name: "08 - اگست" },
  { val: "09", name: "09 - ستمبر" },
  { val: "10", name: "10 - اکتوبر" },
  { val: "11", name: "11 - نومبر" },
  { val: "12", name: "12 - دسمبر" },
];

// Generate days 01 to 31
const DAYS = Array.from({ length: 31 }, (_, i) => {
  const d = i + 1;
  return d < 10 ? `0${d}` : `${d}`;
});

// Generate years 2026 down to 1990
const YEARS = Array.from({ length: 37 }, (_, i) => `${2026 - i}`);

export default function HomePage() {
  // Disclaimer Modal
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // App Install / Download Confirmation Modal
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Form State
  const [cnic, setCnic] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [province, setProvince] = useState("P");

  // Date State: 3 Modes (easy-dropdowns, calendar, manual)
  const [dateInputMode, setDateInputMode] = useState<"dropdown" | "calendar" | "manual">("dropdown");
  const [day, setDay] = useState("01");
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState("2024");
  const [calDate, setCalDate] = useState(""); // YYYY-MM-DD
  const [manualDate, setManualDate] = useState(""); // 8 digits

  // Device & Platform Detection
  const [isIOS, setIsIOS] = useState(false);

  // UI Toast / Modal States
  const [copied, setCopied] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [showValidationError, setShowValidationError] = useState(false);

  // Calculator State - Official Quotas: Bike (20L), Rickshaw (20L), 800cc (30L)
  const [vehicleType, setVehicleType] = useState<"bike" | "rickshaw" | "car">("bike");
  const [monthlyLiters, setMonthlyLiters] = useState(20);

  // Check LocalStorage on Mount for Disclaimer & listen for install prompt
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("pm_fuel_disclaimer_v3");
      if (dismissed !== "true") {
        setShowDisclaimer(true);
      }
    } catch {
      setShowDisclaimer(true);
    }

    if (typeof navigator !== "undefined") {
      const isApple =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      setIsIOS(isApple);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleCloseDisclaimer = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem("pm_fuel_disclaimer_v3", "true");
      } catch {
        // ignore
      }
    }
    setShowDisclaimer(false);
  };

  // CNIC Formatting (13 digits only)
  const handleCnicChange = (val: string) => {
    const numbersOnly = val.replace(/\D/g, "").slice(0, 13);
    setCnic(numbersOnly);
  };

  const displayCnic = useMemo(() => {
    if (!cnic) return "";
    if (cnic.length <= 5) return cnic;
    if (cnic.length <= 12) return `${cnic.slice(0, 5)}-${cnic.slice(5)}`;
    return `${cnic.slice(0, 5)}-${cnic.slice(5, 12)}-${cnic.slice(12, 13)}`;
  }, [cnic]);

  // Vehicle Number Formatting
  const handleVehicleChange = (val: string) => {
    const formatted = val.toUpperCase().replace(/[^A-Z0-9- ]/g, "");
    setVehicleNo(formatted);
  };

  const cleanVehicleNo = useMemo(() => {
    return vehicleNo.replace(/[^A-Z0-9]/g, "");
  }, [vehicleNo]);

  // Unified Date string: Always DDMMYYYY (e.g. 02092026)
  const formattedDateStr = useMemo(() => {
    if (dateInputMode === "dropdown") {
      if (day && month && year) {
        return `${day}${month}${year}`;
      }
      return "";
    }
    if (dateInputMode === "calendar") {
      if (!calDate) return "";
      const parts = calDate.split("-");
      if (parts.length === 3) {
        const [y, m, d] = parts;
        return `${d}${m}${y}`;
      }
      return "";
    }
    if (dateInputMode === "manual") {
      return manualDate.replace(/\D/g, "").slice(0, 8);
    }
    return "";
  }, [dateInputMode, day, month, year, calDate, manualDate]);

  // Constructed SMS Text: REG <CNIC> <VEHICLE> <PROVINCE> <DDMMYYYY>
  const smsMessage = useMemo(() => {
    const cleanCnic = cnic || "XXXXXXXXXXXXX";
    const vNo = cleanVehicleNo || "VEHICLENO";
    const prov = province || "P";
    const dStr = formattedDateStr || "DDMMYYYY";
    return `REG ${cleanCnic} ${vNo} ${prov} ${dStr}`;
  }, [cnic, cleanVehicleNo, province, formattedDateStr]);

  // Completion calculation (0 to 4)
  const completedSteps = useMemo(() => {
    let count = 0;
    if (cnic.length === 13) count++;
    if (cleanVehicleNo.length >= 2) count++;
    if (province.length === 1) count++;
    if (formattedDateStr.length === 8) count++;
    return count;
  }, [cnic, cleanVehicleNo, province, formattedDateStr]);

  const isFormValid = completedSteps === 4;

  // Direct native SMS URLs
  const registrationSmsHref = useMemo(() => {
    const encoded = encodeURIComponent(smsMessage);
    return isIOS ? `sms:9771&body=${encoded}` : `sms:9771?body=${encoded}`;
  }, [smsMessage, isIOS]);

  const tokenSmsHref = useMemo(() => {
    const encoded = encodeURIComponent("TOK");
    return isIOS ? `sms:9771&body=${encoded}` : `sms:9771?body=${encoded}`;
  }, [isIOS]);

  // Calculator Quotas & Limits
  // Bike: 20L, Rickshaw: 20L, 800cc: 30L
  const maxQuota = useMemo(() => {
    if (vehicleType === "car") return 30;
    return 20;
  }, [vehicleType]);

  const handleVehicleTypeSelect = (type: "bike" | "rickshaw" | "car") => {
    setVehicleType(type);
    if (type === "car") {
      setMonthlyLiters(30);
    } else {
      setMonthlyLiters(20);
    }
  };

  const reliefPerLiter = 100;
  const monthlySavings = Math.min(monthlyLiters, maxQuota) * reliefPerLiter;
  const annualSavings = monthlySavings * 12;

  // Direct Download App Action
  const handleConfirmDirectDownload = () => {
    setShowDownloadConfirm(false);

    // 1. If native PWA install is supported (Android Chrome / Edge)
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        deferredPrompt.userChoice.then((_choice: unknown) => {
          setDeferredPrompt(null);
        });
      } catch {
        // ignore
      }
    } else {
      // If browser doesn't support immediate prompt (like Safari or older browsers), show visual guide
      setShowGuideModal(true);
    }

    // 2. Direct Web App Shortcut download for offline/home access
    const currentOrigin = typeof window !== "undefined" ? window.location.href : "https://pm-fuel-relief.vercel.app";
    const htmlShortcut = `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>⛽ فیول ریلیف 9771 ایپ</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⛽</text></svg>">
  <meta name="theme-color" content="#01411C">
  <script>
    window.location.replace("${currentOrigin}");
  </script>
</head>
<body style="font-family:sans-serif; text-align:center; padding:40px; background:#01411C; color:#fff;">
  <div style="font-size:80px;">⛽</div>
  <h2>فیول ریلیف 9771 پورٹل</h2>
  <p>ایپ کھل رہی ہے، براہ کرم انتظار کریں...</p>
  <p><a href="${currentOrigin}" style="color:#FDE047; font-size:18px; font-weight:bold; text-decoration:none; background:rgba(255,255,255,0.1); padding:10px 20px; border-radius:10px; display:inline-block; margin-top:20px;">یہاں کلک کر کے پورٹل کھولیں</a></p>
</body>
</html>`;

    const blob = new Blob([htmlShortcut], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Fuel_Relief_9771_App.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 4500);
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(smsMessage);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = smsMessage;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyTok = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText("TOK");
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = "TOK";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2500);
  };

  const faqs = [
    {
      q: "یہ پورٹل کیا کام کرتا ہے؟",
      a: "یہ پورٹل صرف ایک خودکار میسج جنریٹر (Message Generator) ہے تاکہ عام شہری بغیر کسی دشواری کے 9771 پر رجسٹریشن کا درست میسج تیار کر سکیں۔ اس سے آپ ایک کلک پر اپنے موبائل کی میسج ایپ کھول کر ایس ایم ایس بھیج سکتے ہیں۔",
    },
    {
      q: "کیا اس پورٹل کا حکومت سے کوئی تعلق ہے؟",
      a: "ہرگز نہیں! اس پورٹل کا حکومتِ پاکستان، نادرا، یا کسی بھی آفیشل ادارے سے کسی قسم کا کوئی تعلق نہیں ہے۔ یہ خالصتاً عوامی سہولت کے لیے بنایا گیا ایک فری اوپن ٹول ہے۔",
    },
    {
      q: "کون سی گاڑی کے لیے ماہانہ کتنا ریلیف مقرر ہے؟",
      a: "سرکاری قواعد کے مطابق:\n• موٹر سائیکل: زیادہ سے زیادہ 20 لیٹر ماہانہ (2,000 روپے رعایت)\n• رکشہ و چنگ چی: زیادہ سے زیادہ 20 لیٹر ماہانہ (2,000 روپے رعایت)\n• 800cc تک کاریں: زیادہ سے زیادہ 30 لیٹر ماہانہ (3,000 روپے رعایت)",
    },
    {
      q: "کون سی تاریخ اور کس صورت میں درج کروں؟",
      a: "گاڑی کی بک یا اسمارٹ کارڈ پر درج رجسٹریشن تاریخ لکھیں۔ پہلے دن کے 2 ہندسے، پھر مہینے کے 2 ہندسے اور آخر میں سال کے 4 ہندسے درج کریں۔ مثلاً: 2 ستمبر 2026 کے لیے 02092026 منتخب کریں۔",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6faf7] text-[#14281d] flex flex-col font-sans pb-28 sm:pb-8">
      {/* 1. Initial Disclaimer Popup Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 shadow-2xl border-2 border-amber-400 relative text-right max-h-[85vh] flex flex-col justify-between my-auto">
            <div className="overflow-y-auto pr-1">
              <div className="text-center mb-3">
                <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-xs mb-1.5">
                  ⛽
                </div>
                <span className="bg-amber-100 text-amber-950 text-[11px] font-bold px-3 py-0.5 rounded-full border border-amber-300 inline-block mb-1">
                  عوامی معلوماتی ٹول (غیر سرکاری)
                </span>
                <h3 className="text-lg sm:text-xl font-black text-emerald-950">
                  ضروری وضاحت و ڈس کلیمر
                </h3>
              </div>

              <div className="bg-stone-50 rounded-2xl p-3 sm:p-4 border border-stone-200 space-y-2 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold text-base shrink-0">✓</span>
                  <div>
                    <strong>صرف میسج جنریٹر:</strong> یہ پورٹل صرف اس لیے بنایا گیا ہے تاکہ عام شہری بغیر کسی غلطی کے <strong>9771</strong> پر بھیجنے کے لیے درست ایس ایم ایس تیار کر سکیں۔
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold text-base shrink-0">✕</span>
                  <div>
                    <strong>کوئی سرکاری تعلق نہیں:</strong> اس پورٹل کا حکومت، نادرا، یا کسی بھی سرکاری ادارے سے <strong>کوئی تعلق نہیں ہے</strong>۔
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold text-base shrink-0">🔒</span>
                  <div>
                    <strong>رازداری کی ضمانت:</strong> آپ کا کوئی بھی ڈیٹا محفوظ نہیں ہوتا، یہ صرف آپ کے فون میں میسج بناتا ہے۔
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-stone-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="dontShowDisclaimer"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-4 h-4 rounded-sm border-stone-300 text-emerald-800 focus:ring-emerald-700 cursor-pointer"
                />
                <label htmlFor="dontShowDisclaimer" className="cursor-pointer">
                  آئندہ نہ دکھائیں (Don&apos;t show again)
                </label>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={handleCloseDisclaimer}
                className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white rounded-xl font-bold text-sm sm:text-base shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>ٹھیک ہے، سمجھ گیا (آگے بڑھیں)</span>
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Direct App Download Confirmation Modal with ⛽ Logo */}
      {showDownloadConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border-2 border-emerald-700 relative text-right max-h-[85vh] flex flex-col justify-between my-auto animate-in fade-in zoom-in duration-150">
            <div className="text-center">
              {/* Official ⛽ Logo */}
              <div className="w-16 h-16 bg-linear-to-br from-[#01411C] to-[#002811] text-amber-300 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-md border-2 border-amber-400/50 mb-2.5">
                ⛽
              </div>
              <h3 className="text-lg sm:text-xl font-black text-emerald-950">
                فیول ریلیف 9771 پورٹل ایپ
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                کیا آپ یہ ایپ اپنے موبائل میں ڈاؤن لوڈ / انسٹال کرنا چاہتے ہیں؟
              </p>
            </div>

            <div className="my-3.5 bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <div>✅ ایک کلک پر بغیر انٹرنیٹ میسج جنریٹر کھولیں</div>
              <div>✅ ہوم اسکرین پر ⛽ آئیکن بن جائے گا</div>
              <div>✅ 100% محفوظ اور تیز رفتار</div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleConfirmDirectDownload}
                className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white rounded-xl font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📲 ہاں، ابھی ڈاؤن لوڈ کریں</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDownloadConfirm(false)}
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                منسوخ کریں
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Visual Step-by-Step Install Guide Modal (If needed) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 shadow-2xl border border-stone-300 relative text-right max-h-[85vh] flex flex-col justify-between my-auto">
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="absolute left-4 top-4 w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-stone-200 cursor-pointer text-xs"
            >
              ✕
            </button>

            <div className="overflow-y-auto pr-1">
              <div className="text-center mb-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-900 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-1">
                  ⛽
                </div>
                <h3 className="text-base font-black text-emerald-950">
                  ہوم اسکرین پر ایپ کیسے شامل کریں؟
                </h3>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <strong className="text-emerald-900 block mb-1">اینڈرائیڈ (Chrome):</strong>
                  1. اوپر <strong>تین نقطوں (⋮)</strong> پر کلک کریں۔<br />
                  2. فہرست سے <strong>&quot;Install App&quot;</strong> یا <strong>&quot;Add to Home screen&quot;</strong> دبائیں۔
                </div>

                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                  <strong className="text-amber-950 block mb-1">آئی فون (Safari):</strong>
                  1. نیچے <strong>شیئر (Share ⎋)</strong> کا بٹن دبائیں۔<br />
                  2. <strong>&quot;Add to Home Screen&quot; (+)</strong> منتخب کریں۔
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-full py-2.5 px-4 bg-emerald-800 text-white rounded-xl font-bold text-xs"
              >
                ٹھیک ہے
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Success Notification Toast */}
      {downloadSuccessToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top-4">
          <span className="text-xl">⛽</span>
          <span>ایپ کامیابی سے ڈاؤن لوڈ ہو گئی ہے! ہوم اسکرین پر شامل کریں۔</span>
        </div>
      )}

      {/* Top Banner (Responsive Single Row) */}
      <div className="bg-amber-400 text-stone-950 text-[11px] sm:text-xs py-1.5 px-3 border-b border-amber-500">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold truncate">
            <span className="text-sm">⛽</span>
            <span className="truncate">عوامی معلوماتی ٹول • 9771 میسج جنریٹر</span>
          </div>
          <button
            type="button"
            onClick={() => setShowDisclaimer(true)}
            className="underline font-bold hover:text-stone-800 shrink-0 cursor-pointer text-[11px]"
          >
            ڈس کلیمر
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white sticky top-0 z-30 border-b border-stone-200 shadow-xs">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
              ⛽
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-black text-emerald-950 leading-tight truncate">
                فیول ریلیف میسج پورٹل
              </h1>
              <p className="text-[10px] sm:text-[11px] text-stone-500 truncate">
                100 روپے فی لیٹر رعایت کے لیے 9771 ایس ایم ایس
              </p>
            </div>
          </div>

          {/* GitHub Link */}
            <a
              href="https://github.com/rktech0078/PM-Fuel-Relief-9771-Web-Portal---SMS-Generator"
              target="_blank"
              rel="noopener noreferrer"
              title="Open Source on GitHub – MIT License"
              className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-700 active:scale-95 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs shrink-0"
            >
              {/* GitHub SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
              <span className="bg-amber-400 text-stone-900 text-[9px] font-black px-1.5 py-0.5 rounded-md leading-none hidden sm:inline">
                MIT
              </span>
            </a>

        </div>
      </header>

      {/* Hero Notice */}
      <section className="bg-linear-to-b from-emerald-900 to-emerald-800 text-white pt-5 pb-9 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-1.5">
          <div className="inline-block bg-amber-400 text-stone-950 text-[11px] font-black px-3 py-0.5 rounded-full">
            عوام کی رہنمائی کے لیے مفت ٹول
          </div>
          <h2 className="text-xl sm:text-3xl font-black leading-snug">
            9771 پر میسج بھیجنے کا آسان طریقہ
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-lg mx-auto">
            نیچے 4 خانے پُر کریں اور ہرا بٹن دبائیں۔ آپ کے فون کا میسج باکس خود بخود کھل جائے گا۔
          </p>
        </div>
      </section>

      {/* Main Step-by-Step Form */}
      <main className="px-3 sm:px-4 -mt-5 z-20 relative max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
          {/* Progress Header */}
          <div className="bg-emerald-950 text-white p-3.5 sm:p-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center">
                {completedSteps}
              </span>
              <div>
                <div className="text-[11px] text-emerald-300">مرحلہ 1: رجسٹریشن</div>
                <div className="text-xs sm:text-sm font-bold">
                  {completedSteps === 4 ? "چاروں خانے مکمل ہیں! ✓" : `4 میں سے ${completedSteps} خانے مکمل`}
                </div>
              </div>
            </div>

            <div className="w-24 sm:w-32 bg-emerald-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${(completedSteps / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {/* Step 1: CNIC */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 border-2 border-stone-200 focus-within:border-emerald-700 transition">
              <label className="block text-xs sm:text-sm font-black text-emerald-950 mb-1 flex items-center justify-between">
                <span>1️⃣ شناختی کارڈ نمبر (13 ہندسے)</span>
                {cnic.length === 13 && (
                  <span className="text-emerald-700 font-bold text-[11px] bg-emerald-100 px-2 py-0.5 rounded-md">
                    ✓ درست
                  </span>
                )}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={cnic}
                onChange={(e) => handleCnicChange(e.target.value)}
                placeholder="4210112345671"
                className="w-full text-lg sm:text-xl font-bold px-3 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-hidden transition text-stone-900"
              />
              <div className="flex justify-between items-center text-[10px] text-stone-500 mt-1">
                <span>ڈیش (-) کے بغیر لکھیں</span>
                <span>{cnic.length} / 13 ہندسے</span>
              </div>
            </div>

            {/* Step 2: Vehicle Number */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 border-2 border-stone-200 focus-within:border-emerald-700 transition">
              <label className="block text-xs sm:text-sm font-black text-emerald-950 mb-1 flex items-center justify-between">
                <span>2️⃣ گاڑی یا موٹر سائیکل کا نمبر</span>
                {cleanVehicleNo.length >= 2 && (
                  <span className="text-emerald-700 font-bold text-[11px] bg-emerald-100 px-2 py-0.5 rounded-md">
                    ✓ درست
                  </span>
                )}
              </label>
              <input
                type="text"
                value={vehicleNo}
                onChange={(e) => handleVehicleChange(e.target.value)}
                placeholder="مثال: LEA 1234 یا KHI 5566"
                className="w-full text-lg sm:text-xl font-bold uppercase px-3 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-hidden transition text-stone-900"
              />
              <p className="text-[10px] text-stone-500 mt-1">
                نمبر پلیٹ پر درج رجسٹریشن نمبر لکھیں۔
              </p>
            </div>

            {/* Step 3: Province */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 border-2 border-stone-200 transition">
              <label className="block text-xs sm:text-sm font-black text-emerald-950 mb-2">
                3️⃣ صوبہ چنیں (جہاں گاڑی رجسٹرڈ ہے)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {PROVINCES.map((prov) => {
                  const isSelected = province === prov.id;
                  return (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => setProvince(prov.id)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border-2 transition text-center flex items-center justify-between active:scale-95 cursor-pointer ${
                        isSelected
                          ? "bg-emerald-800 text-white border-emerald-800 shadow-xs"
                          : "bg-white text-stone-700 border-stone-300 hover:bg-emerald-50"
                      }`}
                    >
                      <span>{prov.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${isSelected ? "bg-amber-400 text-stone-900" : "bg-stone-200"}`}>
                        {prov.code}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Registration Date (Fixed & Multi-Option) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 border-2 border-stone-200 transition">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-1">
                  <span>4️⃣ گاڑی کی رجسٹریشن تاریخ</span>
                  {formattedDateStr.length === 8 && (
                    <span className="text-emerald-700 font-bold text-[11px] bg-emerald-100 px-2 py-0.5 rounded-md">
                      ✓ {formattedDateStr}
                    </span>
                  )}
                </label>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex gap-1 mb-2.5 bg-stone-200 p-1 rounded-xl text-[11px]">
                <button
                  type="button"
                  onClick={() => setDateInputMode("dropdown")}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition cursor-pointer ${
                    dateInputMode === "dropdown"
                      ? "bg-white text-emerald-950 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  📅 آسان انتخاب (دن/مہینہ/سال)
                </button>

                <button
                  type="button"
                  onClick={() => setDateInputMode("manual")}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition cursor-pointer ${
                    dateInputMode === "manual"
                      ? "bg-white text-emerald-950 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  ✍️ 8 ہندسے لکھیں
                </button>

                <button
                  type="button"
                  onClick={() => setDateInputMode("calendar")}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition cursor-pointer ${
                    dateInputMode === "calendar"
                      ? "bg-white text-emerald-950 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  📆 کیلنڈر
                </button>
              </div>

              {/* Option A: Dropdown Mode (Easiest for common user) */}
              {dateInputMode === "dropdown" && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-1.5">
                    {/* Day */}
                    <div>
                      <span className="block text-[10px] font-bold text-stone-600 mb-1">دن (Day)</span>
                      <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="w-full text-sm font-bold p-2 bg-white border border-stone-300 rounded-xl focus:outline-hidden transition text-stone-900"
                      >
                        {DAYS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Month */}
                    <div>
                      <span className="block text-[10px] font-bold text-stone-600 mb-1">مہینہ (Month)</span>
                      <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="w-full text-xs sm:text-sm font-bold p-2 bg-white border border-stone-300 rounded-xl focus:outline-hidden transition text-stone-900"
                      >
                        {MONTHS.map((m) => (
                          <option key={m.val} value={m.val}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Year */}
                    <div>
                      <span className="block text-[10px] font-bold text-stone-600 mb-1">سال (Year)</span>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full text-sm font-bold p-2 bg-white border border-stone-300 rounded-xl focus:outline-hidden transition text-stone-900"
                      >
                        {YEARS.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Option B: Manual 8 digits */}
              {dateInputMode === "manual" && (
                <div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    placeholder="مثال: 02092026 (DDMMYYYY)"
                    className="w-full text-base font-bold p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-hidden transition text-stone-900"
                  />
                  <div className="text-[10px] text-stone-500 mt-1">
                    پہلے دن کے 2 ہندسے، پھر مہینے کے 2 اور سال کے 4 ہندسے لکھیں۔
                  </div>
                </div>
              )}

              {/* Option C: HTML5 Calendar (Forced LTR) */}
              {dateInputMode === "calendar" && (
                <div>
                  <input
                    type="date"
                    dir="ltr"
                    value={calDate}
                    onChange={(e) => setCalDate(e.target.value)}
                    className="w-full text-sm p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-hidden transition text-stone-900"
                  />
                </div>
              )}

              {/* Formatted Date Result Hint */}
              <div className="text-[11px] text-stone-700 mt-2 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center justify-between">
                <span>تیار شدہ کوڈ:</span>
                <span className="font-mono font-bold text-emerald-950 text-xs">
                  {formattedDateStr || "DDMMYYYY"} (DDMMYYYY فارمیٹ)
                </span>
              </div>
            </div>

            {/* Live Message Box & Send Button */}
            <div className="pt-2">
              <div className="bg-emerald-950 rounded-3xl p-4 sm:p-5 text-white shadow-lg space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-300 font-bold">تیار شدہ میسج (SMS)</span>
                  <span className="text-emerald-200">شارٹ کوڈ: <strong className="font-mono text-white text-base">9771</strong></span>
                </div>

                <div
                  className="bg-black/40 text-amber-200 font-bold text-base sm:text-xl p-3 rounded-xl border border-amber-400/40 text-left break-all select-all font-mono"
                  dir="ltr"
                >
                  {smsMessage}
                </div>

                {/* Big Direct Action Buttons */}
                <div className="space-y-2">
                  {/* Validation Error */}
                  {showValidationError && (
                    <div className="bg-red-600/90 border border-red-400 text-white rounded-xl px-3 py-2.5 text-xs font-bold text-center animate-bounce">
                      ⚠️ براہ کرم پہلے چاروں خانے مکمل بھریں:
                      <ul className="mt-1 space-y-0.5 font-normal text-[11px] text-red-100 text-right">
                        {cnic.length !== 13 && <li>• شناختی کارڈ نمبر (13 ہندسے) نامکمل ہے</li>}
                        {cleanVehicleNo.length < 2 && <li>• گاڑی کا نمبر خالی ہے</li>}
                        {!province && <li>• صوبہ منتخب نہیں کیا</li>}
                        {formattedDateStr.length !== 8 && <li>• تاریخ مکمل نہیں ہے</li>}
                      </ul>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (!isFormValid) {
                        setShowValidationError(true);
                        setTimeout(() => setShowValidationError(false), 4000);
                        return;
                      }
                      setShowValidationError(false);
                      window.location.href = registrationSmsHref;
                    }}
                    className={`w-full py-3.5 px-4 rounded-2xl font-black text-base shadow-lg transition flex items-center justify-center gap-2 text-center cursor-pointer ${
                      isFormValid
                        ? "bg-linear-to-r from-amber-400 to-amber-300 hover:from-amber-300 active:scale-95 text-stone-950"
                        : "bg-stone-600 text-stone-400 cursor-not-allowed opacity-70"
                    }`}
                  >
                    <span className="text-xl">📩</span>
                    <span>میسج ایپ میں کھولیں اور بھیجیں (9771)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="py-2.5 px-3 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>{copied ? "کاپی ہو گیا! ✓" : "میسج کاپی کریں"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSlipModal(true)}
                      className="py-2.5 px-3 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>پرچی دیکھیں / پرنٹ</span>
                    </button>
                  </div>
                </div>

                {!isFormValid && !showValidationError && (
                  <p className="text-[10px] text-amber-300 text-center bg-black/30 py-1 px-2 rounded-lg">
                    نوٹ: چاروں خانے مکمل کریں تاکہ میسج بالکل درست بنے۔
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Step 2: TOK SMS Section */}
      <section className="px-3 sm:px-4 mt-6 max-w-2xl mx-auto w-full">
        <div className="bg-linear-to-r from-emerald-900 to-emerald-950 text-white rounded-3xl p-4 sm:p-5 border border-emerald-800 space-y-2 text-right">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-stone-950 text-xs font-black px-2 py-0.5 rounded-full">
              مرحلہ 2
            </span>
            <h3 className="text-sm sm:text-base font-bold">
              پٹرول پمپ جانے سے پہلے ٹوکن حاصل کریں
            </h3>
          </div>

          <p className="text-xs text-emerald-100 leading-relaxed">
            جب رجسٹریشن ہو جائے تو پٹرول پمپ جانے سے پہلے اپنے فون سے <strong>TOK</strong> لکھ کر <strong>9771</strong> پر بھیجیں۔
          </p>

          <div className="flex gap-2 pt-1">
            <a
              href={tokenSmsHref}
              className="flex-1 py-2.5 px-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-950 font-black text-xs rounded-xl text-center shadow-md transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>TOK بھیجیں (9771)</span>
            </a>

            <button
              type="button"
              onClick={handleCopyTok}
              className="py-2.5 px-3 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {tokenCopied ? "کاپی ہو گیا! ✓" : "کاپی"}
            </button>
          </div>
        </div>
      </section>

      {/* Accurate Relief Savings Calculator */}
      <section className="px-3 sm:px-4 mt-6 max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-md border border-stone-200 text-right space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-black text-emerald-950">
              100 روپے فی لیٹر ریلیف سے بچت معلوم کریں
            </h3>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md">
              سرکاری کوٹہ
            </span>
          </div>

          {/* Vehicle Type Switcher with Official Quota labels */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleVehicleTypeSelect("bike")}
              className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                vehicleType === "bike"
                  ? "bg-emerald-800 text-white border-emerald-800 font-bold shadow-xs"
                  : "bg-stone-50 text-stone-700 border-stone-200"
              }`}
            >
              <div className="text-base sm:text-lg">🛵</div>
              <div className="text-[11px] font-bold">موٹرسائیکل</div>
              <div className={`text-[9px] ${vehicleType === "bike" ? "text-amber-300" : "text-stone-500"}`}>
                کوٹہ: 20 لیٹر
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleVehicleTypeSelect("rickshaw")}
              className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                vehicleType === "rickshaw"
                  ? "bg-emerald-800 text-white border-emerald-800 font-bold shadow-xs"
                  : "bg-stone-50 text-stone-700 border-stone-200"
              }`}
            >
              <div className="text-base sm:text-lg">🛺</div>
              <div className="text-[11px] font-bold">رکشہ / چنگ چی</div>
              <div className={`text-[9px] ${vehicleType === "rickshaw" ? "text-amber-300" : "text-stone-500"}`}>
                کوٹہ: 20 لیٹر
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleVehicleTypeSelect("car")}
              className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                vehicleType === "car"
                  ? "bg-emerald-800 text-white border-emerald-800 font-bold shadow-xs"
                  : "bg-stone-50 text-stone-700 border-stone-200"
              }`}
            >
              <div className="text-base sm:text-lg">🚗</div>
              <div className="text-[11px] font-bold">800cc کار</div>
              <div className={`text-[9px] ${vehicleType === "car" ? "text-amber-300" : "text-stone-500"}`}>
                کوٹہ: 30 لیٹر
              </div>
            </button>
          </div>

          {/* Slider bounded by maximum quota */}
          <div>
            <div className="flex justify-between text-xs text-stone-600 mb-1">
              <span>ماہانہ ریلیف ایندھن:</span>
              <strong className="font-mono text-emerald-900 text-sm">
                {monthlyLiters} لیٹر (زیادہ سے زیادہ {maxQuota} لیٹر)
              </strong>
            </div>
            <input
              type="range"
              min="5"
              max={maxQuota}
              step="1"
              value={monthlyLiters}
              onChange={(e) => setMonthlyLiters(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
              <span>5 لیٹر</span>
              <span>مقررہ سرکاری حد: {maxQuota} لیٹر</span>
            </div>
          </div>

          {/* Savings Box */}
          <div className="bg-emerald-950 text-white rounded-2xl p-3.5 text-center">
            <div className="text-[11px] text-emerald-200">ماہانہ براہِ راست بچت:</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 my-0.5">
              {monthlySavings.toLocaleString("ur-PK")} روپے
            </div>
            <div className="text-[11px] text-emerald-300">
              سالانہ متوقع ریلیف: {annualSavings.toLocaleString("ur-PK")} روپے (100 روپے فی لیٹر رعایت)
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="px-3 sm:px-4 mt-6 max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-md border border-stone-200 text-right">
          <h3 className="text-sm sm:text-base font-black text-emerald-950 mb-2">
            عام سوالات و جوابات
          </h3>

          <div className="space-y-1.5">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="border border-stone-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-2.5 sm:p-3 text-right font-bold text-xs sm:text-sm text-emerald-950 flex items-center justify-between gap-2 hover:bg-stone-50 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-stone-400 text-xs">{isOpen ? "▲" : "▼"}</span>
                  </button>

                  {isOpen && (
                    <div className="p-3 pt-0 text-xs text-stone-600 border-t border-stone-100 bg-stone-50/50 whitespace-pre-line leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* App Install Banner Box in Flow */}
      <section className="px-3 sm:px-4 mt-6 max-w-2xl mx-auto w-full">
        <div className="bg-amber-100 border-2 border-amber-400 rounded-3xl p-4 flex items-center justify-between gap-3 text-right">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center text-xl shrink-0">
              ⛽
            </div>
            <div className="min-w-0">
              <div className="font-black text-stone-950 text-xs sm:text-sm truncate">
                فیول ریلیف ایپ ڈاؤن لوڈ کریں
              </div>
              <p className="text-[10px] sm:text-xs text-stone-700 truncate">
                موبائل ہوم اسکرین سے ایک کلک پر میسج جنریٹر کھولیں!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDownloadConfirm(true)}
            className="py-2 px-3 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white rounded-xl font-bold text-xs transition shrink-0 cursor-pointer shadow-xs"
          >
            ڈاؤن لوڈ
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 bg-stone-900 text-stone-400 text-xs py-6 px-4 border-t border-stone-800 text-center space-y-3">
        <div className="max-w-2xl mx-auto bg-stone-800/80 border border-amber-500/30 rounded-2xl p-3 text-amber-200 text-[11px] leading-relaxed">
          <strong className="text-amber-300 block mb-0.5">
            ⚠️ قانونی وضاحت و ڈس کلیمر:
          </strong>
          یہ پورٹل صرف ایک خودکار میسج جنریٹر ہے تاکہ عام شہری بغیر کسی دشواری کے 9771 پر رجسٹریشن کا درست میسج تیار کر سکیں۔ اس پورٹل کا حکومت، نادرا، یا کسی بھی سرکاری ادارے سے کوئی تعلق نہیں ہے۔
        </div>

        <div className="text-[10px] text-stone-500">
          عوامی معلوماتی پورٹل • تمام حقوق محفوظ ہیں © {new Date().getFullYear()}
        </div>
      </footer>

      {/* Mobile Validation Error Toast — appears above bottom bar */}
      {showValidationError && (
        <div className="fixed bottom-16 inset-x-0 z-50 sm:hidden px-3 pb-1">
          <div className="bg-red-600 border border-red-400 text-white rounded-2xl px-3 py-2.5 text-xs font-bold text-center shadow-2xl animate-bounce">
            ⚠️ براہ کرم پہلے چاروں خانے مکمل بھریں:
            <ul className="mt-1 space-y-0.5 font-normal text-[11px] text-red-100 text-right">
              {cnic.length !== 13 && <li>• شناختی کارڈ نمبر (13 ہندسے) نامکمل ہے</li>}
              {cleanVehicleNo.length < 2 && <li>• گاڑی کا نمبر خالی ہے</li>}
              {!province && <li>• صوبہ منتخب نہیں کیا</li>}
              {formattedDateStr.length !== 8 && <li>• تاریخ مکمل نہیں ہے</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Clean, Non-overlapping Sticky Bottom Action Bar for Mobile */}
      <div className="fixed bottom-0 inset-x-0 bg-stone-950/95 backdrop-blur-md border-t border-emerald-800/80 p-2 z-40 sm:hidden flex items-center justify-between gap-2 shadow-2xl">
        {/* Main Primary Send SMS Button */}
        <button
          type="button"
          onClick={() => {
            if (!isFormValid) {
              setShowValidationError(true);
              setTimeout(() => setShowValidationError(false), 4000);
              return;
            }
            setShowValidationError(false);
            window.location.href = registrationSmsHref;
          }}
          className={`flex-1 py-3 px-3 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md text-center transition active:scale-95 ${
            isFormValid
              ? "bg-linear-to-r from-amber-400 to-amber-300 text-stone-950"
              : "bg-stone-600 text-stone-400 opacity-70"
          }`}
        >
          <span>📩</span>
          <span>میسج بھیجیں (9771)</span>
        </button>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="py-3 px-3 bg-white/15 active:scale-95 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center justify-center shrink-0"
        >
          <span>{copied ? "✓" : "کاپی"}</span>
        </button>

        {/* App Download with Confirmation */}
        <button
          type="button"
          onClick={() => setShowDownloadConfirm(true)}
          className="py-3 px-3 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs rounded-xl border border-emerald-600 transition flex items-center justify-center gap-1 shrink-0"
        >
          <span>📲</span>
          <span>ایپ</span>
        </button>
      </div>


      {/* Slip Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 shadow-2xl border border-stone-300 relative text-right max-h-[85vh] flex flex-col justify-between my-auto">
            <button
              type="button"
              onClick={() => setShowSlipModal(false)}
              className="absolute left-4 top-4 w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-stone-200 no-print cursor-pointer text-xs"
            >
              ✕
            </button>

            <div id="printable-slip" className="space-y-3 overflow-y-auto pr-1">
              <div className="border-b-2 border-dashed border-stone-300 pb-2 text-center">
                <div className="inline-block p-1 rounded-md bg-emerald-800 text-amber-300 font-bold text-[11px] mb-1">
                  فیول ریلیف پورٹل (عوامی ٹول)
                </div>
                <h4 className="text-base font-bold text-emerald-950">
                  9771 ایس ایم ایس یاد دہانی پرچی
                </h4>
                <p className="text-[10px] text-stone-500">
                  تاریخ: {new Date().toLocaleDateString("ur-PK")}
                </p>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-0.5 border-b border-stone-100">
                  <span className="text-stone-500">شناختی کارڈ:</span>
                  <span className="font-mono font-bold text-stone-900">{displayCnic || "درج نہیں کیا"}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-stone-100">
                  <span className="text-stone-500">گاڑی کا نمبر:</span>
                  <span className="font-mono font-bold text-stone-900 uppercase">{vehicleNo || "درج نہیں کیا"}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-stone-100">
                  <span className="text-stone-500">صوبہ:</span>
                  <span className="font-bold text-stone-900">
                    {PROVINCES.find((p) => p.id === province)?.name} ({province})
                  </span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-stone-100">
                  <span className="text-stone-500">رجسٹریشن تاریخ:</span>
                  <span className="font-mono font-bold text-stone-900">{formattedDateStr || "درج نہیں کی"}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-stone-100">
                  <span className="text-stone-500">شارٹ کوڈ:</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">9771</span>
                </div>
              </div>

              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <div className="text-[10px] text-stone-500 mb-0.5">تیار شدہ ایس ایم ایس:</div>
                <div className="font-mono text-xs font-bold text-emerald-950 text-left break-all" dir="ltr">
                  {smsMessage}
                </div>
              </div>

              <div className="bg-amber-50 p-2 rounded-xl border border-amber-200 text-[10px] text-amber-900">
                نوٹ: یہ پرچی آپ کے ذاتی ریکارڈ کے لیے ہے۔ میسج اپنے موبائل سے 9771 پر خود بھیجنا لازمی ہے۔
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-stone-100 flex gap-2 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs transition cursor-pointer"
              >
                <span>پرچی پرنٹ کریں</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSlipModal(false)}
                className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-xs transition cursor-pointer"
              >
                بند کریں
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
