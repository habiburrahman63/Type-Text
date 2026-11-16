import React, { useRef } from 'react';
import { CertificateRecord } from '../context/AppContext';
import { X, Printer, Download, Award, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  certificate: CertificateRecord;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Verified Certificate"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-amber-500/40 my-8">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 tracking-wide">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Official Verified Academic Credential
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold tracking-tight rounded-xl transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              aria-label="Close certificate modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div
          ref={certRef}
          className="relative mt-6 p-8 md:p-12 border-8 border-double border-amber-600/30 rounded-2xl bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 flex flex-col items-center text-center overflow-hidden"
        >
          {/* Corner Flourishes */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-600/50" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-600/50" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-600/50" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-600/50" />

          {/* Platform Seal */}
          <div className="mb-4">
            <img
              src="/src/assets/images/certificate_seal_emblem_1793985549833.jpg"
              alt="Official Academic Excellence Seal"
              referrerPolicy="no-referrer"
              className="w-20 h-20 md:w-24 md:h-24 object-contain mx-auto drop-shadow-md rounded-full border-2 border-amber-400"
            />
          </div>

          {/* Heading */}
          <span className="text-xs uppercase tracking-widest font-extrabold text-amber-700">
            Typenex International Academy of Digital Skills
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 tracking-tight leading-tight">
            Certificate of Typing Achievement
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 uppercase tracking-widest font-semibold">
            This certifies that
          </p>

          {/* Recipient */}
          <div className="my-6 py-2 px-8 border-b-2 border-slate-900/60 inline-block min-w-[280px]">
            <span className="text-2xl md:text-3xl font-bold text-slate-900 italic tracking-wide">
              {certificate.recipientName}
            </span>
          </div>

          <p className="text-sm md:text-base text-slate-600 max-w-lg leading-relaxed">
            has successfully demonstrated professional touch-typing competence and digital mastery under standardized test conditions.
          </p>

          {/* Performance Badges */}
          <div className="grid grid-cols-2 gap-6 my-8 w-full max-w-md bg-white/80 p-4 rounded-xl border border-amber-200/60 shadow-xs">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Certified Speed</span>
              <span className="text-3xl font-extrabold text-indigo-700 tabular-nums tracking-tight mt-0.5">
                {certificate.wpm} <span className="text-sm font-bold">WPM</span>
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Certified Accuracy</span>
              <span className="text-3xl font-extrabold text-emerald-700 tabular-nums tracking-tight mt-0.5">
                {certificate.accuracy}%
              </span>
            </div>
          </div>

          {/* Footer Signatures & Verification Hash */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-200 text-left">
            <div>
              <div className="italic text-lg text-slate-800 tracking-tight leading-snug">
                Dr. Marcus Vance
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Director of Academic Evaluation
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Issued on {certificate.issuedDate}
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                Verification ID
              </span>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 tracking-wider">
                {certificate.verificationCode}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1 tracking-tight">
                <CheckCircle2 className="w-3 h-3" /> Validated via Typenex Ledger
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
