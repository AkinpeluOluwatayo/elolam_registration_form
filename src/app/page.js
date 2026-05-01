'use client';
import { useState } from 'react';
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({
    Applicant_Name: '', Applicant_Sex: '', Date_of_Birth: '', Nationality: '', Email_Address: '', Home_Address: '',
    Father_Name: '', Father_Occupation: '', Father_Phone: '', Father_Office_Address: '',
    Mother_Name: '', Mother_Occupation: '', Mother_Phone: '', Mother_Office_Address: '',
    Religion: '', Fee_Payer_Name: '',
    Health_Institution: '', Literacy_Status: '', Reason_for_Leaving: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = (e) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = (e) => {
    e.preventDefault();
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Submitting application...');
    setStatus("Sending...");

    const submissionData = new FormData(e.currentTarget);
    submissionData.append("access_key", "e4d88a8c-2205-425b-b40b-c19adf7cfad1");
    // Ensure the subject shows the actual applicant name from the state
    submissionData.append("subject", `New Application: ${formData.Applicant_Name}`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submissionData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Success");
        toast.success('Submitted successfully!', { id: loadingToast });
        setStep(1);
        e.target.reset();
      } else {
        setStatus("Error");
        toast.error('Submission failed.', { id: loadingToast });
      }
    } catch (error) {
      setStatus("Error");
      toast.error('Network error.', { id: loadingToast });
    }
  };

  const inputStyle = "w-full border-2 border-slate-300 p-3 rounded-xl focus:border-blue-600 focus:ring-0 outline-none transition-colors text-slate-900 font-bold placeholder:text-slate-500 placeholder:font-bold bg-white shadow-sm";
  const selectionLabelStyle = "flex items-center gap-3 cursor-pointer text-sm font-black text-slate-800 uppercase tracking-tight hover:text-blue-700 transition-colors";
  const radioCheckStyle = "w-5 h-5 accent-blue-600 cursor-pointer border-2 border-slate-400";

  return (
      <div className="flex flex-col min-h-screen bg-slate-100 font-sans">
        <Toaster position="top-center" />
        <main className="flex flex-1 w-full max-w-4xl mx-auto flex-col items-center py-8 px-4 sm:px-12 bg-white shadow-2xl my-6 rounded-xl border border-slate-200">

          <header className="w-full mb-10 border-b-2 border-slate-100 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <Image src="/images/letterhead.jpeg" alt="Letterhead" width={800} height={150} priority />
            </div>
            <h1 className="text-3xl font-black text-blue-900 uppercase">Application Form</h1>
            <p className="text-blue-700 font-black">CAC/IT NO: 156872</p>
          </header>

          <form className="w-full px-4" onSubmit={handleSubmit}>
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

            {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black border-l-8 border-blue-600 pl-4 bg-slate-50 py-2">1.0 PERSONAL DATA</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-blue-900">1. Full Name</label>
                      <input className={inputStyle} name="Applicant_Name" required onChange={handleInputChange} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-blue-900">2. Sex</label>
                      <select className={inputStyle} name="Applicant_Sex" required onChange={handleInputChange}>
                        <option value="">SELECT</option>
                        <option value="Male">MALE</option>
                        <option value="Female">FEMALE</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-blue-900">3. Date of Birth</label>
                      <input type="date" className={inputStyle} name="Date_of_Birth" required onChange={handleInputChange} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-blue-900">4. Email Address</label>
                      <input type="email" className={inputStyle} name="Email_Address" required onChange={handleInputChange} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-blue-900">5. Home Address</label>
                      <input className={inputStyle} name="Home_Address" required onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black border-l-8 border-blue-600 pl-4 bg-slate-50 py-2">2.0 GUARDIAN INFO</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input className={inputStyle} name="Father_Name" placeholder="FATHER'S NAME" />
                    <input className={inputStyle} name="Father_Occupation" placeholder="FATHER'S OCCUPATION" />
                    <input className={inputStyle} name="Father_Phone" placeholder="FATHER'S PHONE" />
                    <input className={inputStyle} name="Father_Office_Address" placeholder="FATHER'S OFFICE ADDRESS" />
                    <input className={inputStyle} name="Mother_Name" placeholder="MOTHER'S NAME" />
                    <input className={inputStyle} name="Mother_Occupation" placeholder="MOTHER'S OCCUPATION" />
                    <input className={inputStyle} name="Mother_Phone" placeholder="MOTHER'S PHONE" />
                    <input className={inputStyle} name="Mother_Office_Address" placeholder="MOTHER'S OFFICE ADDRESS" />
                    <input className={inputStyle} name="Religion" placeholder="RELIGION" />
                    <input className={inputStyle} name="Fee_Payer_Name" placeholder="WHO PAYS FEES?" />
                  </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black border-l-8 border-blue-600 pl-4 bg-slate-50 py-2">3.0 HEALTH HISTORY</h2>
                  <div className="space-y-4">
                    <div className="flex gap-6 p-4 bg-blue-50 rounded-xl">
                      <label className={selectionLabelStyle}><input type="radio" name="Disability_Origin" value="Acquired" className={radioCheckStyle} /> ACQUIRED</label>
                      <label className={selectionLabelStyle}><input type="radio" name="Disability_Origin" value="Birth" className={radioCheckStyle} /> AT BIRTH</label>
                    </div>
                    <div className="grid grid-cols-2 gap-4 p-4 border-2 rounded-xl">
                      <label className={selectionLabelStyle}><input type="checkbox" name="Hearing_Impaired" value="Yes" className={radioCheckStyle} /> HEARING</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Visual_Impaired" value="Yes" className={radioCheckStyle} /> VISUAL</label>
                    </div>
                    <input className={inputStyle} name="Health_Institution" placeholder="HEALTH INSTITUTION VISITED" />
                  </div>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black border-l-8 border-blue-600 pl-4 bg-slate-50 py-2">4.0 EDUCATION</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between p-4 border-2 rounded-xl">
                      <span className="font-bold">CAN READ AND WRITE?</span>
                      <div className="flex gap-4">
                        <label className={selectionLabelStyle}><input type="radio" name="Literacy_Status" value="Yes" className={radioCheckStyle} /> YES</label>
                        <label className={selectionLabelStyle}><input type="radio" name="Literacy_Status" value="No" className={radioCheckStyle} /> NO</label>
                      </div>
                    </div>
                    <textarea className={`${inputStyle} h-32`} name="Reason_for_Leaving" placeholder="REASON FOR LEAVING PREVIOUS CENTER"></textarea>
                  </div>
                </div>
            )}

            <div className="flex items-center justify-between mt-12 gap-6">
              <button type="button" onClick={prevStep} disabled={step === 1} className={`flex-1 h-16 rounded-2xl border-4 border-blue-600 text-blue-600 font-black ${step === 1 ? 'invisible' : ''}`}>BACK</button>
              {step < 4 ? (
                  <button type="button" onClick={nextStep} className="flex-1 h-16 rounded-2xl bg-blue-600 text-white font-black">NEXT</button>
              ) : (
                  <button type="submit" className="flex-1 h-16 rounded-2xl bg-green-600 text-white font-black">SUBMIT FORM ✓</button>
              )}
            </div>
          </form>
        </main>
      </div>
  );
}