'use client';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';

const INITIAL_FORM_DATA = {
  // Step 1 - Personal Data
  Applicant_Name: '',
  Applicant_Sex: '',
  Date_of_Birth: '',
  Place_of_Birth: '',
  Nationality: '',
  State_of_Origin: '',
  LGA: '',
  Home_Address: '',
  Email_Address: '',

  // Step 2 - Guardian Info
  Father_Name: '',
  Father_Occupation: '',
  Father_Phone: '',
  Father_Office_Address: '',
  Mother_Name: '',
  Mother_Occupation: '',
  Mother_Phone: '',
  Mother_Office_Address: '',
  Religion: '',
  Religious_Leader_Name: '',
  Religious_Leader_Phone: '',
  Fee_Payer_Name: '',

  // Step 3 - Health History
  Disability_Status: '',
  Nature_Hearing: '',
  Nature_Visual: '',
  Nature_Physical: '',
  Nature_Multiple: '',
  Nature_Other_Specify: '',
  Exp_Restlessness: '',
  Exp_Sleeplessness: '',
  Exp_Convulsion: '',
  Exp_Lack_Concentration: '',
  Special_Medication: '',
  Medication_Details: '',

  // Step 4 - Medical Examination
  Med_Exam_Surname: '',
  Med_Exam_FirstName: '',
  Med_Exam_MiddleName: '',
  Med_Exam_DOB: '',
  Med_Exam_Gender: '',
  Med_Exam_Disability_Type: '',
  Med_Sight_Left: '',
  Med_Sight_Right: '',
  Med_Mouth_Teeth: '',
  Med_Tonsils: '',
  Med_Genotype: '',
  Med_Blood_Group: '',
  Med_Nervous_System: '',
  Med_Reproductive_System: '',
  Med_Skin: '',
  Med_Heart: '',
  Med_Abdomen: '',
  Med_Spleen: '',
  Med_Urine: '',
  Med_Stools: '',
  Med_Is_Fit: '',
  Med_Comments: '',
  Med_Director_Name: '',
  Med_Exam_Date: '',

  // Step 5 - Education & Attestation
  Previous_School: '',
  Can_Read_Write: '',
  Reason_for_Leaving: '',
  Consent_Check: '',
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? value : '') : value,
    }));
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

    try {
      // 1. Submit to Web3Forms (Original Form Data)
      const web3Response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "e4d88a8c-2205-425b-b40b-c19adf7cfad1",
          subject: `Full EL-OLAM Application: ${formData.Applicant_Name || 'New Student'}`,
          ...formData,
        }),
      });

      const web3Data = await web3Response.json();

      // 2. Data Transformation for Supabase 'children' table
      const supabaseData = {
        // 1.0 Personal Data
        full_name: formData.Applicant_Name,
        sex: formData.Applicant_Sex,
        dob: formData.Date_of_Birth || null,
        pob: formData.Place_of_Birth,
        nationality: formData.Nationality,
        state_of_origin: formData.State_of_Origin,
        lga: formData.LGA,
        email_address: formData.Email_Address,
        home_address: formData.Home_Address,

        // 2.0 Guardian Info
        father_name: formData.Father_Name,
        father_occupation: formData.Father_Occupation,
        father_phone: formData.Father_Phone,
        mother_name: formData.Mother_Name,
        mother_occupation: formData.Mother_Occupation,
        mother_phone: formData.Mother_Phone,
        religion: formData.Religion,
        religious_leader_name: formData.Religious_Leader_Name,
        religious_leader_phone: formData.Religious_Leader_Phone,
        fee_payer_name: formData.Fee_Payer_Name,

        // 3.0 Health & Medical
        disability_timing: formData.Disability_Status,
        disability_nature: [
          formData.Nature_Hearing === 'Yes' && 'Hearing',
          formData.Nature_Visual === 'Yes' && 'Visual',
          formData.Nature_Physical === 'Yes' && 'Physical',
          formData.Nature_Multiple === 'Yes' && 'Multiple',
          formData.Nature_Other_Specify
        ].filter(Boolean),
        observations: [
          formData.Exp_Restlessness === 'Yes' && 'Restlessness',
          formData.Exp_Sleeplessness === 'Yes' && 'Sleeplessness',
          formData.Exp_Convulsion === 'Yes' && 'Convulsion',
          formData.Exp_Lack_Concentration === 'Yes' && 'Lack of Concentration'
        ].filter(Boolean),
        is_on_medication: formData.Special_Medication === 'Yes',
        medication_details: formData.Medication_Details,
        genotype: formData.Med_Genotype,
        blood_group: formData.Med_Blood_Group,
        clinical_observations: {
          Eyes_Left: formData.Med_Sight_Left,
          Eyes_Right: formData.Med_Sight_Right,
          Mouth_Teeth: formData.Med_Mouth_Teeth,
          Tonsils: formData.Med_Tonsils
        },
        systems_review: {
          Nervous: formData.Med_Nervous_System,
          Reproductive: formData.Med_Reproductive_System,
          Skin: formData.Med_Skin,
          Heart: formData.Med_Heart,
          Abdomen: formData.Med_Abdomen,
          Spleen: formData.Med_Spleen,
          Urine: formData.Med_Urine,
          Stools: formData.Med_Stools
        },

        // 4.0 Education
        previous_school: formData.Previous_School,
        can_read_write: formData.Can_Read_Write === 'Yes',
        reason_for_leaving: formData.Reason_for_Leaving
      };

      // 3. Insert into Supabase
      const { error: supabaseError } = await supabase
        .from('children')
        .insert([supabaseData]);

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        // We still consider it a success if Web3Forms worked
      }

      if (web3Data.success) {
        setStatus("Success");
        toast.success('Application Submitted Successfully!', { id: loadingToast });
        setFormData(INITIAL_FORM_DATA);
        setStep(1);
      } else {
        setStatus("Error");
        toast.error('Submission failed. Please check your details.', { id: loadingToast });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus("Error");
      toast.error('Network error. Please try again later.', { id: loadingToast });
    }
  };

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

          {/* STEP 1: PERSONAL DATA */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 border-l-8 border-blue-600 pl-4 py-2 bg-slate-50">
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">1.0 Personal Data</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>1. Name</label>
                  <input className={inputStyle} placeholder="FULL NAME" name="Applicant_Name" required value={formData.Applicant_Name} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>2. Sex</label>
                  <select className={inputStyle} name="Applicant_Sex" required value={formData.Applicant_Sex} onChange={handleInputChange}>
                    <option value="">SELECT SEX</option>
                    <option value="Male">MALE</option>
                    <option value="Female">FEMALE</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>3. Date of Birth</label>
                  <input type="date" className={inputStyle} name="Date_of_Birth" required value={formData.Date_of_Birth} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>4. Place of Birth</label>
                  <input className={inputStyle} placeholder="CITY/TOWN" name="Place_of_Birth" required value={formData.Place_of_Birth} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>5. Nationality</label>
                  <input className={inputStyle} placeholder="COUNTRY" name="Nationality" required value={formData.Nationality} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>6. State of Origin</label>
                  <input className={inputStyle} placeholder="STATE" name="State_of_Origin" required value={formData.State_of_Origin} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>7. LGA</label>
                  <input className={inputStyle} placeholder="LOCAL GOVT AREA" name="LGA" required value={formData.LGA} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>9. Email Address</label>
                  <input type="email" className={inputStyle} placeholder="EMAIL" name="Email_Address" required value={formData.Email_Address} onChange={handleInputChange} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className={sectionLabelStyle}>8. Home Address</label>
                  <input className={inputStyle} placeholder="COMPLETE RESIDENTIAL ADDRESS" name="Home_Address" required value={formData.Home_Address} onChange={handleInputChange} />
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
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>10. Father's Name</label>
                  <input className={inputStyle} name="Father_Name" placeholder="FATHER'S FULL NAME" value={formData.Father_Name} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>11. Occupation</label>
                  <input className={inputStyle} name="Father_Occupation" placeholder="FATHER'S OCCUPATION" value={formData.Father_Occupation} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>12. Telephone No</label>
                  <input className={inputStyle} name="Father_Phone" placeholder="PHONE" value={formData.Father_Phone} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>13. Office Address</label>
                  <input className={inputStyle} name="Father_Office_Address" placeholder="OFFICE ADDRESS" value={formData.Father_Office_Address} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>14. Mother's Name</label>
                  <input className={inputStyle} name="Mother_Name" placeholder="MOTHER'S FULL NAME" value={formData.Mother_Name} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>15. Occupation</label>
                  <input className={inputStyle} name="Mother_Occupation" placeholder="MOTHER'S OCCUPATION" value={formData.Mother_Occupation} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>16. Telephone No</label>
                  <input className={inputStyle} name="Mother_Phone" placeholder="PHONE" value={formData.Mother_Phone} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>17. Office Address</label>
                  <input className={inputStyle} name="Mother_Office_Address" placeholder="OFFICE ADDRESS" value={formData.Mother_Office_Address} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>18. Religion</label>
                  <input className={inputStyle} name="Religion" placeholder="RELIGION" value={formData.Religion} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>Religious Leader Name</label>
                  <input className={inputStyle} name="Religious_Leader_Name" placeholder="NAME OF RELIGIOUS LEADER" value={formData.Religious_Leader_Name} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>Religious Leader Phone</label>
                  <input className={inputStyle} name="Religious_Leader_Phone" placeholder="PHONE OF RELIGIOUS LEADER" value={formData.Religious_Leader_Phone} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>19. Who pays child's fees?</label>
                  <input className={inputStyle} name="Fee_Payer_Name" placeholder="PAYER NAME" value={formData.Fee_Payer_Name} onChange={handleInputChange} />
                </div>
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
                  <label className={selectionLabelStyle}>
                    <input type="radio" name="Disability_Status" value="Acquired" className={radioCheckStyle} checked={formData.Disability_Status === 'Acquired'} onChange={handleInputChange} />
                    DISABILITY ACQUIRED
                  </label>
                  <label className={selectionLabelStyle}>
                    <input type="radio" name="Disability_Status" value="At Birth" className={radioCheckStyle} checked={formData.Disability_Status === 'At Birth'} onChange={handleInputChange} />
                    DISABILITY AT BIRTH
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-2 border-slate-300 p-6 rounded-xl bg-slate-50">
                  <p className="col-span-full text-xs font-black uppercase text-blue-900 mb-2 border-b-2 border-blue-100 pb-2">Nature of Disability</p>
                  <label className={selectionLabelStyle}>
                    <input type="checkbox" name="Nature_Hearing" value="Yes" className={radioCheckStyle} checked={formData.Nature_Hearing === 'Yes'} onChange={handleInputChange} />
                    HEARING IMPAIRED
                  </label>
                  <label className={selectionLabelStyle}>
                    <input type="checkbox" name="Nature_Visual" value="Yes" className={radioCheckStyle} checked={formData.Nature_Visual === 'Yes'} onChange={handleInputChange} />
                    VISUALLY IMPAIRED
                  </label>
                  <label className={selectionLabelStyle}>
                    <input type="checkbox" name="Nature_Physical" value="Yes" className={radioCheckStyle} checked={formData.Nature_Physical === 'Yes'} onChange={handleInputChange} />
                    PHYSICALLY CHALLENGED
                  </label>
                  <label className={selectionLabelStyle}>
                    <input type="checkbox" name="Nature_Multiple" value="Yes" className={radioCheckStyle} checked={formData.Nature_Multiple === 'Yes'} onChange={handleInputChange} />
                    MULTIPLE CHALLENGED
                  </label>
                  <div className="col-span-full mt-2">
                    <input className={inputStyle} name="Nature_Other_Specify" placeholder="OTHER (PLEASE SPECIFY)" value={formData.Nature_Other_Specify} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-2 border-slate-300 p-6 rounded-xl bg-white shadow-sm">
                  <p className="col-span-full text-xs font-black uppercase text-blue-900 mb-2 border-b-2 border-blue-100 pb-2">Observations (Experiences)</p>
                  <label className={selectionLabelStyle}>
                    <input type="checkbox" name="Exp_Restlessness" value="Yes" className={radioCheckStyle} checked={formData.Exp_Restlessness === 'Yes'} onChange={handleInputChange} />
                    RESTLESSNESS
                  </label>
                  <label className={selectionLabelStyle}>
                    <input type="checkbox" name="Exp_Sleeplessness" value="Yes" className={radioCheckStyle} checked={formData.Exp_Sleeplessness === 'Yes'} onChange={handleInputChange} />
                    SLEEPLESSNESS
                  </label>
                  <label className={selectionLabelStyle}>
                    <input type="checkbox" name="Exp_Convulsion" value="Yes" className={radioCheckStyle} checked={formData.Exp_Convulsion === 'Yes'} onChange={handleInputChange} />
                    CONVULSION AT INTERVALS
                  </label>
                  <label className={selectionLabelStyle}>
                    <input type="checkbox" name="Exp_Lack_Concentration" value="Yes" className={radioCheckStyle} checked={formData.Exp_Lack_Concentration === 'Yes'} onChange={handleInputChange} />
                    LACK OF CONCENTRATION
                  </label>
                </div>

                <div className="space-y-4 border-2 border-blue-300 p-6 rounded-xl bg-blue-50">
                  <span className="text-sm font-black text-blue-900 uppercase tracking-tight">Is child on special medication?</span>
                  <div className="flex gap-8 mt-2">
                    <label className={selectionLabelStyle}>
                      <input type="radio" name="Special_Medication" value="Yes" className={radioCheckStyle} checked={formData.Special_Medication === 'Yes'} onChange={handleInputChange} />
                      YES
                    </label>
                    <label className={selectionLabelStyle}>
                      <input type="radio" name="Special_Medication" value="No" className={radioCheckStyle} checked={formData.Special_Medication === 'No'} onChange={handleInputChange} />
                      NO
                    </label>
                  </div>
                  <textarea className={`${inputStyle} h-24 mt-4 resize-none`} name="Medication_Details" placeholder="IF YES, LIST MEDICATIONS TO BE ADMINISTERED" value={formData.Medication_Details} onChange={handleInputChange}></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MEDICAL EXAMINATION */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 border-l-8 border-blue-700 pl-4 py-2 bg-blue-50/50">
                <h2 className="text-xl font-black text-blue-900 uppercase tracking-tight">Medical Examination Form</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1 md:col-span-1">
                  <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">Surname</label>
                  <input className={inputStyle} name="Med_Exam_Surname" placeholder="ENTER SURNAME" value={formData.Med_Exam_Surname} onChange={handleInputChange} />
                </div>
                <div className="space-y-1 md:col-span-1">
                  <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">First Name</label>
                  <input className={inputStyle} name="Med_Exam_FirstName" placeholder="ENTER FIRST NAME" value={formData.Med_Exam_FirstName} onChange={handleInputChange} />
                </div>
                <div className="space-y-1 md:col-span-1">
                  <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">Middle Name</label>
                  <input className={inputStyle} name="Med_Exam_MiddleName" placeholder="ENTER MIDDLE NAME" value={formData.Med_Exam_MiddleName} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">Date of Birth</label>
                  <input type="date" className={inputStyle} name="Med_Exam_DOB" value={formData.Med_Exam_DOB} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">Gender</label>
                  <select className={inputStyle} name="Med_Exam_Gender" value={formData.Med_Exam_Gender} onChange={handleInputChange}>
                    <option value="">SELECT GENDER</option>
                    <option value="Male">MALE</option>
                    <option value="Female">FEMALE</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">Type of Disability</label>
                  <input className={inputStyle} name="Med_Exam_Disability_Type" placeholder="SPECIFY DISABILITY" value={formData.Med_Exam_Disability_Type} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border-2 border-slate-300 shadow-sm">
                <p className="col-span-full text-xs font-black uppercase text-blue-800 border-b-2 border-blue-100 pb-2 mb-2 tracking-widest">Clinical Observations</p>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase block">Sight (Left Eye)</label>
                  <input className={inputStyle} name="Med_Sight_Left" placeholder="LEFT EYE RESULTS" value={formData.Med_Sight_Left} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase block">Sight (Right Eye)</label>
                  <input className={inputStyle} name="Med_Sight_Right" placeholder="RIGHT EYE RESULTS" value={formData.Med_Sight_Right} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase block">Mouth & Teeth</label>
                  <input className={inputStyle} name="Med_Mouth_Teeth" placeholder="ORAL HEALTH STATUS" value={formData.Med_Mouth_Teeth} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase block">Tonsils</label>
                  <input className={inputStyle} name="Med_Tonsils" placeholder="TONSILS STATUS" value={formData.Med_Tonsils} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase block">Genotype</label>
                  <input className={inputStyle} name="Med_Genotype" placeholder="e.g. AA, AS, SS" value={formData.Med_Genotype} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase block">Blood Group</label>
                  <input className={inputStyle} name="Med_Blood_Group" placeholder="e.g. A+, O-, B+" value={formData.Med_Blood_Group} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl border-2 border-slate-300 shadow-sm">
                <p className="col-span-full text-xs font-black uppercase text-blue-800 border-b-2 border-blue-100 pb-2 mb-2 tracking-widest">Systems Review</p>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase block">Nervous System</label>
                  <input className={inputStyle} name="Med_Nervous_System" placeholder="NERVOUS SYSTEM STATUS" value={formData.Med_Nervous_System} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase block">Reproductive System</label>
                  <input className={inputStyle} name="Med_Reproductive_System" placeholder="REPRODUCTIVE STATUS" value={formData.Med_Reproductive_System} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase block">Skin</label>
                  <input className={inputStyle} name="Med_Skin" placeholder="SKIN CONDITION" value={formData.Med_Skin} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase block">Heart</label>
                  <input className={inputStyle} name="Med_Heart" placeholder="HEART RATE/CONDITION" value={formData.Med_Heart} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase block">Abdomen</label>
                  <input className={inputStyle} name="Med_Abdomen" placeholder="ABDOMINAL EXAMINATION" value={formData.Med_Abdomen} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase block">Spleen</label>
                  <input className={inputStyle} name="Med_Spleen" placeholder="SPLEEN CONDITION" value={formData.Med_Spleen} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase block">Urine</label>
                  <input className={inputStyle} name="Med_Urine" placeholder="URINALYSIS RESULTS" value={formData.Med_Urine} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase block">Stools</label>
                  <input className={inputStyle} name="Med_Stools" placeholder="STOOL EXAMINATION" value={formData.Med_Stools} onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-4 p-6 bg-blue-50 border-2 border-blue-300 rounded-2xl shadow-inner">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-sm font-black uppercase text-blue-900 tracking-tight">Do you consider candidate medically fit?</span>
                  <div className="flex gap-10">
                    <label className={selectionLabelStyle}>
                      <input type="radio" name="Med_Is_Fit" value="Yes" className={radioCheckStyle} checked={formData.Med_Is_Fit === 'Yes'} onChange={handleInputChange} />
                      YES
                    </label>
                    <label className={selectionLabelStyle}>
                      <input type="radio" name="Med_Is_Fit" value="No" className={radioCheckStyle} checked={formData.Med_Is_Fit === 'No'} onChange={handleInputChange} />
                      NO
                    </label>
                  </div>
                </div>
                <div className="space-y-1 pt-2">
                  <label className="text-[11px] font-black text-blue-900 uppercase block">Comments including any relevant illness in the past</label>
                  <textarea className={`${inputStyle} h-24 resize-none`} name="Med_Comments" placeholder="PROVIDE ADDITIONAL MEDICAL HISTORY OR COMMENTS" value={formData.Med_Comments} onChange={handleInputChange}></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-blue-900 uppercase block">Name of Medical Director</label>
                    <input className={inputStyle} name="Med_Director_Name" placeholder="DIRECTOR'S FULL NAME" value={formData.Med_Director_Name} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-blue-900 uppercase block">Examination Date</label>
                    <input type="date" className={inputStyle} name="Med_Exam_Date" value={formData.Med_Exam_Date} onChange={handleInputChange} />
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
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>Previous School/Center Attended</label>
                  <input className={inputStyle} name="Previous_School" placeholder="ENTER SCHOOL NAME" value={formData.Previous_School} onChange={handleInputChange} />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-2 border-blue-200 rounded-xl bg-white shadow-sm gap-4">
                  <span className="text-sm font-black text-slate-900 uppercase tracking-tight">He/She can read and write?</span>
                  <div className="flex gap-8">
                    <label className={selectionLabelStyle}>
                      <input type="radio" name="Can_Read_Write" value="Yes" className={radioCheckStyle} checked={formData.Can_Read_Write === 'Yes'} onChange={handleInputChange} />
                      YES
                    </label>
                    <label className={selectionLabelStyle}>
                      <input type="radio" name="Can_Read_Write" value="No" className={radioCheckStyle} checked={formData.Can_Read_Write === 'No'} onChange={handleInputChange} />
                      NO
                    </label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={sectionLabelStyle}>Reason for leaving previous center</label>
                  <textarea className={`${inputStyle} h-24 resize-none`} name="Reason_for_Leaving" placeholder="ENTER REASON" value={formData.Reason_for_Leaving} onChange={handleInputChange}></textarea>
                </div>
                <div className="p-8 bg-blue-900 text-white rounded-2xl shadow-2xl border-t-8 border-blue-500 text-center uppercase tracking-tight">
                  <p className="text-[11px] font-bold leading-relaxed mb-6">"I hereby attest to the accuracy of the information obtained in this application. I agree to accept ESHRC decision regarding this application and its penalty regarding falsification or wrong presentation of information and by the rules and regulations."</p>
                  <label className="flex items-center justify-center gap-3 cursor-pointer bg-blue-800/50 p-5 rounded-xl border border-blue-400 hover:bg-blue-700 transition-all">
                    <input
                      type="checkbox"
                      name="Consent_Check"
                      required
                      className="w-6 h-6 accent-green-500"
                      checked={formData.Consent_Check === 'Agreed'}
                      onChange={(e) => setFormData(prev => ({ ...prev, Consent_Check: e.target.checked ? 'Agreed' : '' }))}
                    />
                    <span className="text-xs font-black tracking-widest">20. AGREE & CONFIRM (Parent/Guardian Signature)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="flex items-center justify-between mt-12 mb-8 gap-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className={`flex-1 h-16 flex items-center justify-center rounded-2xl font-black border-4 ${step === 1 ? 'opacity-0 invisible' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white uppercase tracking-widest transition-all'}`}
            >
              ← BACK
            </button>
            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 h-16 flex items-center justify-center rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 uppercase tracking-widest border-b-4 border-blue-800 transition-all active:translate-y-1 active:border-b-0"
              >
                NEXT STEP →
              </button>
            ) : (
              <button
                type="submit"
                disabled={status === "Sending..."}
                className="flex-1 h-16 flex items-center justify-center rounded-2xl bg-green-600 text-white font-black hover:bg-green-700 shadow-xl transition-all active:scale-95 uppercase tracking-widest border-b-4 border-green-800 disabled:opacity-50"
              >
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