'use client';
import { useState } from 'react';
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({
    Applicant_Name: '',
    Applicant_Sex: '',
    Date_of_Birth: '',
    Email_Address: ''
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
    submissionData.append("subject", `Full EL-OLAM Application: ${formData.Applicant_Name || 'New Student'}`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submissionData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Success");
        toast.success('Application Submitted Successfully!', { id: loadingToast });
        e.target.reset();
        setStep(1);
      } else {
        setStatus("Error");
        toast.error('Submission failed. Please check your details.', { id: loadingToast });
      }
    } catch (error) {
      setStatus("Error");
      toast.error('Network error. Please try again later.', { id: loadingToast });
    }
  };

  // Enhanced visibility styles
  const inputStyle = "w-full border-2 border-slate-400 p-3 rounded-xl focus:border-blue-700 focus:ring-2 focus:ring-blue-200 outline-none transition-colors text-slate-900 font-black placeholder:text-slate-600 placeholder:font-bold bg-white shadow-sm";
  const selectionLabelStyle = "flex items-center gap-3 cursor-pointer text-sm font-black text-slate-900 uppercase tracking-tight hover:text-blue-700 transition-colors";
  const radioCheckStyle = "w-5 h-5 accent-blue-700 cursor-pointer border-2 border-slate-500";
  const sectionLabelStyle = "text-[12px] font-black text-blue-900 uppercase ml-1 mb-1 block";

  return (
      <div className="flex flex-col min-h-screen bg-slate-100 font-sans">
        <Toaster position="top-center" reverseOrder={false} />

        <main className="flex flex-1 w-full max-w-4xl mx-auto flex-col items-center py-8 px-4 sm:px-12 bg-white shadow-2xl my-6 rounded-xl border border-slate-200">

          <header className="w-full mb-10 border-b-2 border-slate-100 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <Image src="/images/letterhead.jpeg" alt="El-Olam Letterhead" width={800} height={150} className="rounded-lg shadow-sm" priority />
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

          <div className="w-full mb-8 px-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Section {step} of 5</span>
              <span className="text-xs font-black text-slate-600 uppercase tracking-widest text-right">
              {step === 1 && "Personal Data"}
                {step === 2 && "Guardian Info"}
                {step === 3 && "Health History"}
                {step === 4 && "Medical Examination"}
                {step === 5 && "Education & Attestation"}
            </span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden shadow-inner">
              <div className="bg-blue-600 h-full transition-all duration-700 ease-in-out" style={{ width: `${(step / 5) * 100}%` }} />
            </div>
          </div>

          <form className="w-full px-4" onSubmit={handleSubmit}>
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

            {/* STEP 1: PERSONAL DATA */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-blue-600 pl-4 py-2 bg-slate-50">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">1.0 Personal Data</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className={sectionLabelStyle}>1. Name</label>
                      <input className={inputStyle} placeholder="FULL NAME" name="Applicant_Name" required onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                      <label className={sectionLabelStyle}>2. Sex</label>
                      <select className={inputStyle} name="Applicant_Sex" required onChange={handleInputChange}>
                        <option value="">SELECT SEX</option>
                        <option value="Male">MALE</option>
                        <option value="Female">FEMALE</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className={sectionLabelStyle}>3. Date of Birth</label>
                      <input type="date" className={inputStyle} name="Date_of_Birth" required onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                      <label className={sectionLabelStyle}>4. Place of Birth</label>
                      <input className={inputStyle} placeholder="CITY/TOWN" name="Place_of_Birth" required />
                    </div>
                    <div className="space-y-1">
                      <label className={sectionLabelStyle}>5. Nationality</label>
                      <input className={inputStyle} placeholder="COUNTRY" name="Nationality" required />
                    </div>
                    <div className="space-y-1">
                      <label className={sectionLabelStyle}>6. State of Origin</label>
                      <input className={inputStyle} placeholder="STATE" name="State_of_Origin" required />
                    </div>
                    <div className="space-y-1">
                      <label className={sectionLabelStyle}>7. LGA</label>
                      <input className={inputStyle} placeholder="LOCAL GOVT AREA" name="LGA" required />
                    </div>
                    <div className="space-y-1">
                      <label className={sectionLabelStyle}>9. Email Address</label>
                      <input type="email" className={inputStyle} placeholder="EMAIL" name="Email_Address" required onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className={sectionLabelStyle}>8. Home Address</label>
                      <input className={inputStyle} placeholder="COMPLETE RESIDENTIAL ADDRESS" name="Home_Address" required />
                    </div>
                  </div>
                </div>
            )}

            {/* STEP 2: GUARDIAN INFO */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-blue-600 pl-4 py-2 bg-slate-50">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">2.0 Guardian Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1"><label className={sectionLabelStyle}>10. Father's Name</label>
                      <input className={inputStyle} name="Father_Name" placeholder="FATHER'S FULL NAME" /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>11. Occupation</label>
                      <input className={inputStyle} name="Father_Occupation" placeholder="FATHER'S OCCUPATION" /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>12. Telephone No</label>
                      <input className={inputStyle} name="Father_Phone" placeholder="PHONE" /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>13. Office Address</label>
                      <input className={inputStyle} name="Father_Office_Address" placeholder="OFFICE ADDRESS" /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>14. Mother's Name</label>
                      <input className={inputStyle} name="Mother_Name" placeholder="MOTHER'S FULL NAME" /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>15. Occupation</label>
                      <input className={inputStyle} name="Mother_Occupation" placeholder="MOTHER'S OCCUPATION" /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>16. Telephone No</label>
                      <input className={inputStyle} name="Mother_Phone" placeholder="PHONE" /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>17. Office Address</label>
                      <input className={inputStyle} name="Mother_Office_Address" placeholder="OFFICE ADDRESS" /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>18. Religion</label>
                      <input className={inputStyle} name="Religion" placeholder="RELIGION" /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>19. Who pays child's fees?</label>
                      <input className={inputStyle} name="Fee_Payer_Name" placeholder="PAYER NAME" /></div>
                  </div>
                </div>
            )}

            {/* STEP 3: HEALTH HISTORY */}
            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-blue-600 pl-4 py-2 bg-slate-50">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">3.0 Health History</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                      <label className={selectionLabelStyle}><input type="radio" name="Disability_Status" value="Acquired" className={radioCheckStyle} /> DISABILITY ACQUIRED</label>
                      <label className={selectionLabelStyle}><input type="radio" name="Disability_Status" value="At Birth" className={radioCheckStyle} /> DISABILITY AT BIRTH</label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-2 border-slate-300 p-6 rounded-xl bg-slate-50">
                      <p className="col-span-full text-xs font-black uppercase text-blue-900 mb-2 border-b-2 border-blue-100 pb-2">Nature of Disability</p>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Nature_Hearing" value="Yes" className={radioCheckStyle} /> HEARING IMPAIRED</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Nature_Visual" value="Yes" className={radioCheckStyle} /> VISUALLY IMPAIRED</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Nature_Physical" value="Yes" className={radioCheckStyle} /> PHYSICALLY CHALLENGED</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Nature_Multiple" value="Yes" className={radioCheckStyle} /> MULTIPLE CHALLENGED</label>
                      <div className="col-span-full mt-2"><input className={inputStyle} name="Nature_Other_Specify" placeholder="OTHER (PLEASE SPECIFY)" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-2 border-slate-300 p-6 rounded-xl bg-white shadow-sm">
                      <p className="col-span-full text-xs font-black uppercase text-blue-900 mb-2 border-b-2 border-blue-100 pb-2">Observations (Experiences)</p>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Exp_Restlessness" value="Yes" className={radioCheckStyle} /> RESTLESSNESS</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Exp_Sleeplessness" value="Yes" className={radioCheckStyle} /> SLEEPLESSNESS</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Exp_Convulsion" value="Yes" className={radioCheckStyle} /> CONVULSION AT INTERVALS</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Exp_Lack_Concentration" value="Yes" className={radioCheckStyle} /> LACK OF CONCENTRATION</label>
                    </div>
                    <div className="space-y-4 border-2 border-blue-300 p-6 rounded-xl bg-blue-50">
                      <span className="text-sm font-black text-blue-900 uppercase tracking-tight">Is child on special medication?</span>
                      <div className="flex gap-8 mt-2">
                        <label className={selectionLabelStyle}><input type="radio" name="Special_Medication" value="Yes" className={radioCheckStyle} /> YES</label>
                        <label className={selectionLabelStyle}><input type="radio" name="Special_Medication" value="No" className={radioCheckStyle} /> NO</label>
                      </div>
                      <textarea className={`${inputStyle} h-24 mt-4 resize-none`} name="Medication_Details" placeholder="IF YES, LIST MEDICATIONS TO BE ADMINISTERED"></textarea>
                    </div>
                  </div>
                </div>
            )}

            {/* STEP 4: MEDICAL EXAMINATION FORM (HIGH VISIBILITY UPDATE) */}
            {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-blue-700 pl-4 py-2 bg-blue-50/50">
                    <h2 className="text-xl font-black text-blue-900 uppercase tracking-tight">Medical Examination Form</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1 md:col-span-1">
                      <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">Surname</label>
                      <input className={inputStyle} name="Med_Exam_Surname" placeholder="ENTER SURNAME" />
                    </div>
                    <div className="space-y-1 md:col-span-1">
                      <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">First Name</label>
                      <input className={inputStyle} name="Med_Exam_FirstName" placeholder="ENTER FIRST NAME" />
                    </div>
                    <div className="space-y-1 md:col-span-1">
                      <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">Middle Name</label>
                      <input className={inputStyle} name="Med_Exam_MiddleName" placeholder="ENTER MIDDLE NAME" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">Date of Birth</label>
                      <input type="date" className={inputStyle} name="Med_Exam_DOB" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">Gender</label>
                      <select className={inputStyle} name="Med_Exam_Gender">
                        <option value="">SELECT GENDER</option>
                        <option value="Male">MALE</option>
                        <option value="Female">FEMALE</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">Type of Disability</label>
                      <input className={inputStyle} name="Med_Exam_Disability_Type" placeholder="SPECIFY DISABILITY" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border-2 border-slate-300 shadow-sm">
                    <p className="col-span-full text-xs font-black uppercase text-blue-800 border-b-2 border-blue-100 pb-2 mb-2 tracking-widest">Clinical Observations</p>
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-900 uppercase block">Sight (Left Eye)</label>
                      <input className={inputStyle} name="Med_Sight_Left" placeholder="LEFT EYE RESULTS" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-900 uppercase block">Sight (Right Eye)</label>
                      <input className={inputStyle} name="Med_Sight_Right" placeholder="RIGHT EYE RESULTS" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-900 uppercase block">Mouth & Teeth</label>
                      <input className={inputStyle} name="Med_Mouth_Teeth" placeholder="ORAL HEALTH STATUS" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-900 uppercase block">Tonsils</label>
                      <input className={inputStyle} name="Med_Tonsils" placeholder="TONSILS STATUS" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-900 uppercase block">Genotype</label>
                      <input className={inputStyle} name="Med_Genotype" placeholder="e.g. AA, AS, SS" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-900 uppercase block">Blood Group</label>
                      <input className={inputStyle} name="Med_Blood_Group" placeholder="e.g. A+, O-, B+" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl border-2 border-slate-300 shadow-sm">
                    <p className="col-span-full text-xs font-black uppercase text-blue-800 border-b-2 border-blue-100 pb-2 mb-2 tracking-widest">Systems Review</p>
                    <div className="space-y-1"><label className="text-[11px] font-black text-slate-900 uppercase block">Nervous System</label><input className={inputStyle} name="Med_Nervous_System" placeholder="NERVOUS SYSTEM STATUS" /></div>
                    <div className="space-y-1"><label className="text-[11px] font-black text-slate-900 uppercase block">Reproductive System</label><input className={inputStyle} name="Med_Reproductive_System" placeholder="REPRODUCTIVE STATUS" /></div>
                    <div className="space-y-1"><label className="text-[11px] font-black text-slate-900 uppercase block">Skin</label><input className={inputStyle} name="Med_Skin" placeholder="SKIN CONDITION" /></div>
                    <div className="space-y-1"><label className="text-[11px] font-black text-slate-900 uppercase block">Heart</label><input className={inputStyle} name="Med_Heart" placeholder="HEART RATE/CONDITION" /></div>
                    <div className="space-y-1"><label className="text-[11px] font-black text-slate-900 uppercase block">Abdomen</label><input className={inputStyle} name="Med_Abdomen" placeholder="ABDOMINAL EXAMINATION" /></div>
                    <div className="space-y-1"><label className="text-[11px] font-black text-slate-900 uppercase block">Spleen</label><input className={inputStyle} name="Med_Spleen" placeholder="SPLEEN CONDITION" /></div>
                    <div className="space-y-1"><label className="text-[11px] font-black text-slate-900 uppercase block">Urine</label><input className={inputStyle} name="Med_Urine" placeholder="URINALYSIS RESULTS" /></div>
                    <div className="space-y-1"><label className="text-[11px] font-black text-slate-900 uppercase block">Stools</label><input className={inputStyle} name="Med_Stools" placeholder="STOOL EXAMINATION" /></div>
                  </div>

                  <div className="space-y-4 p-6 bg-blue-50 border-2 border-blue-300 rounded-2xl shadow-inner">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-sm font-black uppercase text-blue-900 tracking-tight">Do you consider candidate medically fit?</span>
                      <div className="flex gap-10">
                        <label className={selectionLabelStyle}><input type="radio" name="Med_Is_Fit" value="Yes" className={radioCheckStyle} /> YES</label>
                        <label className={selectionLabelStyle}><input type="radio" name="Med_Is_Fit" value="No" className={radioCheckStyle} /> NO</label>
                      </div>
                    </div>
                    <div className="space-y-1 pt-2">
                      <label className="text-[11px] font-black text-blue-900 uppercase block">Comments including any relevant illness in the past</label>
                      <textarea className={`${inputStyle} h-24 resize-none`} name="Med_Comments" placeholder="PROVIDE ADDITIONAL MEDICAL HISTORY OR COMMENTS"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-blue-900 uppercase block">Name of Medical Director</label>
                        <input className={inputStyle} name="Med_Director_Name" placeholder="DIRECTOR'S FULL NAME" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-blue-900 uppercase block">Examination Date</label>
                        <input type="date" className={inputStyle} name="Med_Exam_Date" />
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {/* STEP 5: EDUCATION & ATTESTATION */}
            {step === 5 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-blue-600 pl-4 py-2 bg-slate-50">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">5.0 Educational Background</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-1"><label className={sectionLabelStyle}>Previous School/Center Attended</label><input className={inputStyle} name="Previous_School" placeholder="ENTER SCHOOL NAME" /></div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-2 border-blue-200 rounded-xl bg-white shadow-sm gap-4">
                      <span className="text-sm font-black text-slate-900 uppercase tracking-tight">He/She can read and write?</span>
                      <div className="flex gap-8"><label className={selectionLabelStyle}><input type="radio" name="Can_Read_Write" value="Yes" className={radioCheckStyle} /> YES</label><label className={selectionLabelStyle}><input type="radio" name="Can_Read_Write" value="No" className={radioCheckStyle} /> NO</label></div>
                    </div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Reason for leaving previous center</label><textarea className={`${inputStyle} h-24 resize-none`} name="Reason_for_Leaving" placeholder="ENTER REASON"></textarea></div>
                    <div className="p-8 bg-blue-900 text-white rounded-2xl shadow-2xl border-t-8 border-blue-500 text-center uppercase tracking-tight">
                      <p className="text-[11px] font-bold leading-relaxed mb-6">"I hereby attest to the accuracy of the information obtained in this application. I agree to accept ESHRC decision regarding this application and its penalty regarding falsification or wrong presentation of information and by the rules and regulations."</p>
                      <label className="flex items-center justify-center gap-3 cursor-pointer bg-blue-800/50 p-5 rounded-xl border border-blue-400 hover:bg-blue-700 transition-all">
                        <input type="checkbox" name="Consent_Check" required className="w-6 h-6 accent-green-500" />
                        <span className="text-xs font-black tracking-widest">20. AGREE & CONFIRM (Parent/Guardian Signature)</span>
                      </label>
                    </div>
                  </div>
                </div>
            )}

            {/* NAVIGATION BUTTONS */}
            <div className="flex items-center justify-between mt-12 mb-8 gap-6">
              <button type="button" onClick={prevStep} disabled={step === 1} className={`flex-1 h-16 flex items-center justify-center rounded-2xl font-black border-4 ${step === 1 ? 'opacity-0 invisible' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white uppercase tracking-widest transition-all'}`}>← BACK</button>
              {step < 5 ? (
                  <button type="button" onClick={nextStep} className="flex-1 h-16 flex items-center justify-center rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 uppercase tracking-widest border-b-4 border-blue-800 transition-all active:translate-y-1 active:border-b-0">NEXT STEP →</button>
              ) : (
                  <button type="submit" disabled={status === "Sending..."} className="flex-1 h-16 flex items-center justify-center rounded-2xl bg-green-600 text-white font-black hover:bg-green-700 shadow-xl transition-all active:scale-95 uppercase tracking-widest border-b-4 border-green-800 disabled:opacity-50">
                    {status === "Sending..." ? "SENDING..." : "SUBMIT APPLICATION ✓"}
                  </button>
              )}
            </div>
          </form>

          <footer className="w-full pt-8 border-t-2 border-slate-100 text-center pb-4">
            <div className="flex justify-center items-center gap-8">
              <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
              <div className="text-left border-l-4 pl-4 border-blue-600 text-[10px] font-black uppercase text-slate-800">
                <p>08025613422, 08122646941</p>
                <p className="text-blue-700 lowercase">elolamspecialhome@gmail.com</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
  );
}