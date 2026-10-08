import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { CertificateType, CertificateData } from '../../types';
import { Modal } from '../common/Modal';
import { Scroll, Plus, Printer, Trash2, Award, Calendar, CheckCircle2 } from 'lucide-react';

export const CertificatesView: React.FC = () => {
  const { certificates, students, generateCertificate, deleteCertificate, settings } = useSchool();

  const [selectedCertType, setSelectedCertType] = useState<CertificateType>('Bonafide Certificate');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('For Passport Application and State Scholarship portal');
  const [conductRemarks, setConductRemarks] = useState('Good conduct and exemplary moral character');

  const [activeCert, setActiveCert] = useState<CertificateData | null>(certificates[0] || null);

  const certTypes: CertificateType[] = [
    'Bonafide Certificate',
    'Leaving Certificate',
    'Character Certificate',
    'Study Certificate',
    'Fee Certificate'
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentId);
    if (!st) return;

    const newId = generateCertificate({
      certificateType: selectedCertType,
      studentId: st.id,
      studentName: st.name,
      fatherName: st.fatherName,
      motherName: st.motherName,
      class: st.class,
      division: st.division,
      academicYear: settings.academicYear,
      issueDate,
      reason,
      conductRemarks
    });

    const newlyCreated = certificates.find((c) => c.id === newId) || {
      id: newId,
      certificateNo: `SPS/${selectedCertType.substring(0, 3).toUpperCase()}/2026/099`,
      certificateType: selectedCertType,
      studentId: st.id,
      studentName: st.name,
      fatherName: st.fatherName,
      motherName: st.motherName,
      class: st.class,
      division: st.division,
      academicYear: settings.academicYear,
      issueDate,
      reason,
      conductRemarks
    };
    setActiveCert(newlyCreated);
  };

  const getCertificateWording = (cert: CertificateData) => {
    switch (cert.certificateType) {
      case 'Bonafide Certificate':
        return (
          <>
            <p className="indent-8 leading-loose">
              This is to certify that <strong>Master / Kum. {cert.studentName}</strong>, Son / Daughter of{' '}
              <strong>Shri {cert.fatherName}</strong> and <strong>Smt. {cert.motherName}</strong>, is a bonafide student of{' '}
              <strong>{settings.schoolName}</strong> studying in <strong>Class {cert.class} - Division {cert.division}</strong> during the academic year{' '}
              <strong>{cert.academicYear}</strong>.
            </p>
            <p className="indent-8 leading-loose mt-4">
              According to the school General Register, his/her date of birth is on record. He/She bears good moral character. This certificate is issued upon the request of his/her parent for <strong>{cert.reason}</strong>.
            </p>
          </>
        );
      case 'Leaving Certificate':
        return (
          <>
            <p className="indent-8 leading-loose">
              This is to certify that <strong>{cert.studentName}</strong>, child of <strong>Shri {cert.fatherName}</strong>, was a student of this recognized institution and has completed schooling up to <strong>Class {cert.class}</strong>.
            </p>
            <p className="indent-8 leading-loose mt-4">
              All school fees and library dues have been fully cleared up to date. Reason for leaving: <strong>{cert.reason}</strong>. General conduct in school: <strong>{cert.conductRemarks}</strong>. We wish him/her the best in future academic pursuits.
            </p>
          </>
        );
      case 'Character Certificate':
        return (
          <>
            <p className="indent-8 leading-loose">
              It is certified that <strong>{cert.studentName}</strong>, Son / Daughter of <strong>Shri {cert.fatherName}</strong>, has been a student of <strong>Class {cert.class}</strong> in this school. During his/her tenure at <strong>{settings.schoolName}</strong>, he/she displayed <strong>{cert.conductRemarks}</strong>.
            </p>
            <p className="indent-8 leading-loose mt-4">
              To the best of our knowledge, he/she does not bear any disciplinary infractions. Issued for <strong>{cert.reason}</strong>.
            </p>
          </>
        );
      case 'Study Certificate':
        return (
          <>
            <p className="indent-8 leading-loose">
              This is to certify that <strong>{cert.studentName}</strong> is actively studying in <strong>Class {cert.class}</strong> under the curriculum recognized by the State Education Board at <strong>{settings.schoolName}</strong> for session <strong>{cert.academicYear}</strong>. Medium of instruction: English / Gujarati.
            </p>
            <p className="indent-8 leading-loose mt-4">
              Purpose of issuance: <strong>{cert.reason}</strong>.
            </p>
          </>
        );
      case 'Fee Certificate':
        return (
          <>
            <p className="indent-8 leading-loose">
              This is to certify that <strong>Master / Kum. {cert.studentName}</strong> (Class {cert.class}-{cert.division}) has cleared all requisite tuition and laboratory fee obligations for the academic session <strong>{cert.academicYear}</strong> with the Accounts Department of <strong>{settings.schoolName}</strong>.
            </p>
            <p className="indent-8 leading-loose mt-4">
              This certificate is officially furnished for income tax rebate / employer education reimbursement claims for <strong>{cert.reason}</strong>.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Scroll className="w-6 h-6 text-emerald-600" />
            <span>Official Certificate Generator</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Bonafide, School Leaving (TC), Character, Study & Fee Certificates with authentic borders
          </p>
        </div>

        {activeCert && (
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print Certificate</span>
          </button>
        )}
      </div>

      {/* Generator Form */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs no-print">
        <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Generate New Certificate</span>
        </h3>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Certificate Type</label>
            <select
              value={selectedCertType}
              onChange={(e) => setSelectedCertType(e.target.value as CertificateType)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              {certTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} (Class {st.class}-{st.division})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date of Issue</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Reason for Issuance</label>
            <input
              type="text"
              required
              placeholder="e.g. For Passport Application / Scholarship verification"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
            >
              Generate Certificate
            </button>
          </div>
        </form>
      </div>

      {/* Previously Issued Selector Pills */}
      {certificates.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-print">
          <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Recent Issues:</span>
          {certificates.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCert(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                activeCert?.id === c.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.studentName} ({c.certificateType})
            </button>
          ))}
        </div>
      )}

      {/* LIVE CERTIFICATE TEMPLATE PREVIEW */}
      {activeCert && (
        <div className="max-w-4xl mx-auto bg-white border-8 border-double border-emerald-900 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden font-serif print-container">
          {/* Subtle Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
            <img
              src={settings.logoUrl}
              alt=""
              className="w-96 h-96 object-contain filter grayscale"
            />
          </div>

          {/* School Header */}
          <div className="text-center border-b-2 border-emerald-900 pb-6 relative z-10 font-sans">
            <div className="flex justify-center mb-3">
              <img
                src={settings.logoUrl}
                alt={settings.schoolName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-800 shadow-md"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-emerald-950 tracking-tight leading-tight">
              {settings.schoolName}
            </h1>
            <p className="text-xs text-slate-700 font-semibold mt-1">
              {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
            </p>
            <p className="text-[11px] text-slate-500">
              Recognized by Govt. of Gujarat • Affiliation No: {settings.affiliationNo} • Phone: {settings.phone}
            </p>
          </div>

          {/* Certificate Badge */}
          <div className="text-center my-6 relative z-10 font-sans">
            <div className="inline-block px-8 py-2 bg-emerald-900 text-amber-200 text-base font-black uppercase tracking-widest rounded-full shadow-md border-2 border-amber-300/40">
              {activeCert.certificateType}
            </div>
          </div>

          {/* Meta Bar */}
          <div className="flex justify-between text-xs font-sans font-bold text-slate-600 mb-8 border-b border-slate-200 pb-2 relative z-10">
            <span>Certificate No: {activeCert.certificateNo}</span>
            <span>Date of Issue: {activeCert.issueDate}</span>
          </div>

          {/* Body Content */}
          <div className="text-base sm:text-lg text-slate-900 leading-loose space-y-4 my-8 relative z-10">
            {getCertificateWording(activeCert)}
          </div>

          {/* Seal and Signatures */}
          <div className="pt-16 mt-8 flex justify-between items-end border-t border-slate-300 relative z-10 font-sans">
            <div className="text-center">
              <div className="w-36 border-b border-slate-700 mb-1" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Prepared by Clerk
              </span>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-900/40 flex items-center justify-center text-[10px] font-black text-emerald-900 uppercase text-center p-2 mx-auto">
                Official School Seal
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm font-serif font-black italic text-slate-900 mb-1">
                {settings.principalSignatureText}
              </div>
              <div className="w-44 border-b border-slate-700 mb-1" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Principal & Headmaster
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
