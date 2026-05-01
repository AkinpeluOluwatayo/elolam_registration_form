'use client';
import { useState } from 'react';
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '', sex: '', dob: '', nationality: '', lga: '', placeOfBirth: '', stateOfOrigin: '', homeAddress: '', email: '',
    fatherName: '', fatherOccupation: '', fatherOffice: '', fatherPhone: '',
    motherName: '', motherOccupation: '', motherOffice: '', motherPhone: '',
    religion: '', feePayer: '',
    disabilityStatus: '', natureOfDisability: [], healthInstitution: '', specialMedication: '', medicationFrequency: '',
    canReadWrite: '', previousSchool: '', leavingReason: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        natureOfDisability: checked
            ? [...prev.natureOfDisability, value]
            : prev.natureOfDisability.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = (e) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
    window.scrollTo(0, 0); // Scroll to top on step change
  };

  const prevStep = (e) => {
    e.preventDefault();
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a loading toast
    const loadingToast = toast.loading('Submitting your application...');
    setStatus("Sending...");

    const submissionData = new FormData(e.currentTarget);
    submissionData.append("access_key", "e4d88a8c-2205-425b-b40b-c19adf7cfad1");
    submissionData.append("subject", `New Application: ${formData.Applicant_Name || 'New Student'}`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submissionData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Success");
        toast.success('Application Submitted Successfully!', { id: loadingToast });
        e.target.reset(); // Clear form
        setStep(1); // Optional: Reset to first step
      } else {
        setStatus("Error");
        toast.error('Submission failed. Please check your details.', { id: loadingToast });
      }
    } catch (error) {
      setStatus("Error");
      toast.error('Network error. Please try again later.', { id: loadingToast });
    }
  };

  // Styles
  const inputStyle = "w-full border-2 border-slate-300 p-3 rounded-xl focus:border-blue-600 focus:ring-0 outline-none transition-colors text-slate-900 font-bold placeholder:text-slate-500 placeholder:font-bold bg-white shadow-sm";
  const selectionLabelStyle = "flex items-center gap-3 cursor-pointer text-sm font-black text-slate-800 uppercase tracking-tight hover:text-blue-700 transition-colors";
  const radioCheckStyle = "w-5 h-5 accent-blue-600 cursor-pointer border-2 border-slate-400";

  return (
      <div className="flex flex-col min-h-screen bg-slate-100 font-sans">
        {/* Toast Container */}
        <Toaster position="top-center" reverseOrder={false} />

        <main className="flex flex-1 w-full max-w-4xl mx-auto flex-col items-center py-8 px-4 sm:px-12 bg-white shadow-2xl my-6 rounded-xl border border-slate-200">

          <header className="w-full mb-10 border-b-2 border-slate-100 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <Image
                  src="/images/letterhead.jpeg"
                  alt="El-Olam Letterhead"
                  width={800}
                  height={150}
                  className="rounded-lg shadow-sm"
                  priority
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-3xl font-black text-blue-900 tracking-tighter uppercase">Application Form</h1>
              <div className="flex items-center gap-4">
                <span className="h-1 w-12 bg-blue-600"></span>
                <p className="text-blue-700 font-black text-base">CAC/IT NO: 156872</p>
                <span className="h-1 w-12 bg-blue-600"></span>
              </div>
            </div>
          </header>

          {/* Progress Bar */}
          <div className="w-full mb-8 px-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-blue-700 uppercase">Section {step} of 4</span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                {step === 1 && "Personal Data"}
                {step === 2 && "Guardian Info"}
                {step === 3 && "Health History"}
                {step === 4 && "Education & Review"}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden shadow-inner">
              <div
                  className="bg-blue-600 h-full transition-all duration-700 ease-in-out"
                  style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          <form className="w-full px-4" onSubmit={handleSubmit}>
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-blue-600 pl-4 py-2 bg-slate-50">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">1.0 Personal Data</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[12px] font-black text-blue-900 uppercase ml-1">1. Full Name</label>
                      <input className={inputStyle} placeholder="ENTER FULL LEGAL NAME" name="Applicant_Name" required onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-black text-blue-900 uppercase ml-1">2. Sex</label>
                      <select className={inputStyle} name="Applicant_Sex" required onChange={handleInputChange}>
                        <option value="">SELECT SEX</option>
                        <option value="Male">MALE</option>
                        <option value="Female">FEMALE</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-black text-blue-900 uppercase ml-1">3. Date of Birth</label>
                      <input type="date" className={inputStyle} name="Date_of_Birth" required onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-black text-blue-900 uppercase ml-1">4. Email Address</label>
                      <input type="email" className={inputStyle} placeholder="ENTER EMAIL ADDRESS" name="Email_Address" required onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[12px] font-black text-blue-900 uppercase ml-1">8. Home Address</label>
                      <input className={inputStyle} placeholder="ENTER COMPLETE RESIDENTIAL ADDRESS" name="Home_Address" required onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-blue-600 pl-4 py-2 bg-slate-50">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">2.0 Guardian Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1"><label className="text-[12px] font-black text-blue-900 uppercase ml-1">10. Father's Name</label>
                      <input className={inputStyle} name="Father_Name" placeholder="FATHER'S FULL NAME" /></div>
                    <div className="space-y-1"><label className="text-[12px] font-black text-blue-900 uppercase ml-1">12. Phone No</label>
                      <input className={inputStyle} name="Father_Phone" placeholder="FATHER'S PHONE NUMBER" /></div>
                    <div className="space-y-1"><label className="text-[12px] font-black text-blue-900 uppercase ml-1">14. Mother's Name</label>
                      <input className={inputStyle} name="Mother_Name" placeholder="MOTHER'S FULL NAME" /></div>
                    <div className="space-y-1"><label className="text-[12px] font-black text-blue-900 uppercase ml-1">16. Phone No</label>
                      <input className={inputStyle} name="Mother_Phone" placeholder="MOTHER'S PHONE NUMBER" /></div>
                    <div className="space-y-1"><label className="text-[12px] font-black text-blue-900 uppercase ml-1">19. Fee Payer</label>
                      <input className={inputStyle} name="Fee_Payer_Name" placeholder="WHO PAYS CHILD'S FEES?" /></div>
                  </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-blue-600 pl-4 py-2 bg-slate-50">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">3.0 Applicant Health History</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                      <label className={selectionLabelStyle}>
                        <input type="radio" name="Disability_Origin" value="Acquired" className={radioCheckStyle} />
                        DISABILITY ACQUIRED
                      </label>
                      <label className={selectionLabelStyle}>
                        <input type="radio" name="Disability_Origin" value="At Birth" className={radioCheckStyle} />
                        DISABILITY AT BIRTH
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-2 border-slate-200 p-6 rounded-xl bg-slate-50">
                      <p className="col-span-full text-xs font-black uppercase text-blue-700 mb-2 border-b border-blue-100 pb-2">Nature of Disability</p>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Disability_Type_Hearing" value="Yes" className={radioCheckStyle} /> HEARING IMPAIRED</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Disability_Type_Visual" value="Yes" className={radioCheckStyle} /> VISUALLY IMPAIRED</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Disability_Type_Physical" value="Yes" className={radioCheckStyle} /> PHYSICALLY CHALLENGED</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Disability_Type_Multiple" value="Yes" className={radioCheckStyle} /> MULTIPLE CHALLENGED</label>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-2 border-blue-200 rounded-xl bg-white shadow-sm gap-4">
                      <span className="text-sm font-black text-slate-800 uppercase tracking-tight">Is child on special medication?</span>
                      <div className="flex gap-8">
                        <label className={selectionLabelStyle}><input type="radio" name="Special_Medication_Status" value="Yes" className={radioCheckStyle} /> YES</label>
                        <label className={selectionLabelStyle}><input type="radio" name="Special_Medication_Status" value="No" className={radioCheckStyle} /> NO</label>
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-blue-600 pl-4 py-2 bg-slate-50">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">4.0 Educational Background</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-2 border-blue-200 rounded-xl bg-white shadow-sm gap-4">
                      <span className="text-sm font-black text-slate-800 uppercase tracking-tight">He/She can read and write?</span>
                      <div className="flex gap-8">
                        <label className={selectionLabelStyle}><input type="radio" name="Literacy_Status" value="Yes" className={radioCheckStyle} /> YES</label>
                        <label className={selectionLabelStyle}><input type="radio" name="Literacy_Status" value="No" className={radioCheckStyle} /> NO</label>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-black text-blue-900 uppercase ml-1">Reason for leaving previous center</label>
                      <textarea className={`${inputStyle} h-32 resize-none`} name="Reason_for_Leaving" placeholder="ENTER REASON"></textarea>
                    </div>

                    <div className="p-8 bg-blue-900 text-white rounded-2xl shadow-2xl border-t-8 border-blue-500 relative overflow-hidden">
                      <p className="text-sm font-black leading-relaxed italic text-center uppercase tracking-tight">
                        "I hereby attest to the accuracy of the information obtained in this application. I agree to accept ESHRC decision regarding this application."
                      </p>
                    </div>
                  </div>
                </div>
            )}

            <div className="flex items-center justify-between mt-12 mb-8 gap-6">
              <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`flex-1 h-16 flex items-center justify-center rounded-2xl font-black border-4 
                ${step === 1 ? 'opacity-0 invisible' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white uppercase tracking-widest'}`}
              >
                ← BACK
              </button>

              {step < 4 ? (
                  <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 h-16 flex items-center justify-center rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 uppercase tracking-widest border-b-4 border-blue-800"
                  >
                    NEXT STEP →
                  </button>
              ) : (
                  <button
                      type="submit"
                      disabled={status === "Sending..."}
                      className="flex-1 h-16 flex items-center justify-center rounded-2xl bg-green-600 text-white font-black hover:bg-green-700 shadow-xl transition-all active:scale-95 uppercase tracking-widest border-b-4 border-green-800 disabled:opacity-50"
                  >
                    {status === "Sending..." ? "SENDING..." : "SUBMIT FORM ✓"}
                  </button>
              )}
            </div>
          </form>

          <footer className="w-full pt-8 border-t-2 border-slate-100 text-center pb-4">
            <div className="flex justify-center items-center gap-8">
              <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
              <div className="text-left border-l-4 pl-4 border-blue-600 text-[10px] font-black uppercase text-slate-800">
                <p>08025613422, 08122646941</p>
                <p className="text-blue-700 lowercase">Elolamspecialhome@gmail.com</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
  );
}