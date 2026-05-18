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

  // Step 6 - Assessment Basic Info
  Assessment_Age: '',
  Assessment_Diagnosis: '',
  Assessment_PositionInFamily: '',
  Assessment_SchoolAttended: '',
  Assessment_Class: '',
  Assessment_Expectations: '',

  // Step 7 - Assessment Birth History
  Assessment_Gestation: '',
  Assessment_DeliveryType: '',
  Assessment_CriesAtBirth: '',
  Assessment_BirthWeight: '',

  // Step 8 - Assessment Developmental Milestones
  Assessment_NeckControl: '',
  Assessment_Sitting: '',
  Assessment_Crawling: '',
  Assessment_Walking: '',
  Assessment_LanguageDev: '',

  // Step 9 - Assessment Health & Behavior
  Assessment_HearingTest: '',
  Assessment_Seizures: '',
  Assessment_HurtfulToSelf: '',
  Assessment_HurtfulToOthers: '',

  // Step 10 - Assessment Sensory Profile
  Assessment_TactileSensitivity: '',
  Assessment_TasteSmellSensitivity: '',
  Assessment_MovementSensitivity: '',
  Assessment_UnderresponsiveSeeking: '',
  Assessment_AuditoryFiltering: '',
  Assessment_EnergyLevel: '',
  Assessment_VisualAuditory: '',
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

    let web3Success = false;
    let supabaseSuccess = false;

    // ── 1. Web3Forms ──────────────────────────────────────────────────────────
    try {
      const web3Response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: "e4d88a8c-2205-425b-b40b-c19adf7cfad1",
          subject: `Full EL-OLAM Application: ${formData.Applicant_Name || 'New Student'}`,
          ...formData,
        }),
      });
      const web3Data = await web3Response.json();
      web3Success = web3Data.success;
      if (!web3Success) console.error('Web3Forms rejection:', web3Data);
    } catch (error) {
      console.error('Web3Forms Submission Error:', error);
    }

    // ── 2. Build Supabase row ─────────────────────────────────────────────────
    // IMPORTANT: every field maps directly to the INITIAL_FORM_DATA keys above.
    // Nothing is left as an empty string by accident — we use || null for
    // optional text so Supabase stores NULL rather than ''.
    let supabaseData;
    try {
      supabaseData = {
        // ── Registration: Personal ──────────────────────────────────────────
        full_name:               formData.Applicant_Name          || null,
        sex:                     formData.Applicant_Sex            || null,
        dob:                     formData.Date_of_Birth            || null,
        pob:                     formData.Place_of_Birth           || null,
        nationality:             formData.Nationality              || null,
        state_of_origin:         formData.State_of_Origin          || null,
        lga:                     formData.LGA                      || null,
        email_address:           formData.Email_Address            || null,
        home_address:            formData.Home_Address             || null,

        // ── Registration: Guardian ──────────────────────────────────────────
        father_name:             formData.Father_Name              || null,
        father_occupation:       formData.Father_Occupation        || null,
        father_phone:            formData.Father_Phone             || null,
        mother_name:             formData.Mother_Name              || null,
        mother_occupation:       formData.Mother_Occupation        || null,
        mother_phone:            formData.Mother_Phone             || null,
        religion:                formData.Religion                 || null,
        religious_leader_name:   formData.Religious_Leader_Name    || null,
        religious_leader_phone:  formData.Religious_Leader_Phone   || null,
        fee_payer_name:          formData.Fee_Payer_Name           || null,

        // ── Registration: Health ────────────────────────────────────────────
        disability_timing:  formData.Disability_Status || null,
        disability_nature: [
          formData.Nature_Hearing   === 'Yes' && 'Hearing',
          formData.Nature_Visual    === 'Yes' && 'Visual',
          formData.Nature_Physical  === 'Yes' && 'Physical',
          formData.Nature_Multiple  === 'Yes' && 'Multiple',
          formData.Nature_Other_Specify || false,
        ].filter(Boolean),
        observations: [
          formData.Exp_Restlessness        === 'Yes' && 'Restlessness',
          formData.Exp_Sleeplessness       === 'Yes' && 'Sleeplessness',
          formData.Exp_Convulsion          === 'Yes' && 'Convulsion',
          formData.Exp_Lack_Concentration  === 'Yes' && 'Lack of Concentration',
        ].filter(Boolean),
        is_on_medication:   formData.Special_Medication === 'Yes',
        medication_details: formData.Medication_Details || null,

        // ── Registration: Medical Exam ──────────────────────────────────────
        genotype:    formData.Med_Genotype    || null,
        blood_group: formData.Med_Blood_Group || null,
        clinical_observations: {
          Eyes_Left:   formData.Med_Sight_Left   || null,
          Eyes_Right:  formData.Med_Sight_Right  || null,
          Mouth_Teeth: formData.Med_Mouth_Teeth  || null,
          Tonsils:     formData.Med_Tonsils      || null,
        },
        systems_review: {
          Nervous:      formData.Med_Nervous_System      || null,
          Reproductive: formData.Med_Reproductive_System || null,
          Skin:         formData.Med_Skin                || null,
          Heart:        formData.Med_Heart               || null,
          Abdomen:      formData.Med_Abdomen             || null,
          Spleen:       formData.Med_Spleen              || null,
          Urine:        formData.Med_Urine               || null,
          Stools:       formData.Med_Stools              || null,
        },

        // ── Registration: Education ─────────────────────────────────────────
        previous_school:    formData.Previous_School    || null,
        can_read_write:     formData.Can_Read_Write === 'Yes',
        reason_for_leaving: formData.Reason_for_Leaving || null,

        // ── Assessment: Basic Info ──────────────────────────────────────────
        diagnosis:           formData.Assessment_Diagnosis         || null,
        position_in_family:  formData.Assessment_PositionInFamily  || null,
        expectations_goals:  formData.Assessment_Expectations      || null,

        // ── Assessment: Birth History ───────────────────────────────────────
        gestation_period:    formData.Assessment_Gestation    || null,
        delivery_type:       formData.Assessment_DeliveryType || null,
        cries_at_birth:      formData.Assessment_CriesAtBirth || null,
        birth_weight:        formData.Assessment_BirthWeight  || null,

        // ── Assessment: Milestones ──────────────────────────────────────────
        milestones: {
          neckControl:  formData.Assessment_NeckControl || null,
          sitting:      formData.Assessment_Sitting     || null,
          crawling:     formData.Assessment_Crawling    || null,
          walking:      formData.Assessment_Walking     || null,
          languageDev:  formData.Assessment_LanguageDev || null,
        },

        // ── Assessment: Health & Behavior ───────────────────────────────────
        hearing_test_conducted: formData.Assessment_HearingTest    || null,
        seizures_frequency:     formData.Assessment_Seizures       || null,
        behavioral_issues: {
          hurtfulToSelf:   formData.Assessment_HurtfulToSelf   || null,
          hurtfulToOthers: formData.Assessment_HurtfulToOthers || null,
        },

        // ── Assessment: Sensory Profile ─────────────────────────────────────
        sensory_profile: {
          tactileSensitivity:     formData.Assessment_TactileSensitivity     || null,
          tasteSmellSensitivity:  formData.Assessment_TasteSmellSensitivity  || null,
          movementSensitivity:    formData.Assessment_MovementSensitivity    || null,
          underresponsiveSeeking: formData.Assessment_UnderresponsiveSeeking || null,
          auditoryFiltering:      formData.Assessment_AuditoryFiltering      || null,
          energyLevel:            formData.Assessment_EnergyLevel            || null,
          visualAuditory:         formData.Assessment_VisualAuditory         || null,
        },
      };
    } catch (error) {
      console.error('Data Mapping Error:', error);
    }

    // ── 3. Supabase insert ────────────────────────────────────────────────────
    if (supabaseData) {
      try {
        const { error: supabaseError } = await supabase
            .from('children')
            .insert([supabaseData]);

        if (supabaseError) {
          console.error('Supabase Insert Error:', JSON.stringify(supabaseError, null, 2));
        } else {
          supabaseSuccess = true;
        }
      } catch (error) {
        console.error('Supabase fetch error:', error);
      }
    }

    // ── 4. UI feedback ────────────────────────────────────────────────────────
    if (web3Success || supabaseSuccess) {
      setStatus("Success");
      const message = web3Success && supabaseSuccess
          ? 'Application Submitted Successfully!'
          : web3Success
              ? 'Email sent — database save failed (check console)'
              : 'Saved to database — email delivery failed';

      toast.success(message, { id: loadingToast });

      if (web3Success && supabaseSuccess) {
        setFormData(INITIAL_FORM_DATA);
        setStep(1);
      }
    } else {
      setStatus("Error");
      toast.error('Submission failed on all channels. Check browser console.', { id: loadingToast });
    }
  };

  // ── Shared style tokens ────────────────────────────────────────────────────
  const inputStyle       = "w-full border-2 border-slate-400 p-3 rounded-xl focus:border-blue-700 focus:ring-2 focus:ring-blue-200 outline-none transition-colors text-slate-900 font-black placeholder:text-slate-600 placeholder:font-bold bg-white shadow-sm";
  const selectionLabelStyle = "flex items-center gap-3 cursor-pointer text-sm font-black text-slate-900 uppercase tracking-tight hover:text-blue-700 transition-colors";
  const radioCheckStyle  = "w-5 h-5 accent-blue-700 cursor-pointer";
  const sectionLabelStyle = "text-[12px] font-black text-blue-900 uppercase ml-1 mb-1 block";

  return (
      <div className="flex flex-col min-h-screen bg-slate-100 font-sans">
        <Toaster position="top-center" reverseOrder={false} />

        <main className="flex flex-1 w-full max-w-4xl mx-auto flex-col items-center py-8 px-4 sm:px-12 bg-white shadow-2xl my-6 rounded-xl border border-slate-200">

          {/* ── HEADER ── */}
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

          {/* ── PROGRESS ── */}
          <div className="w-full mb-8 px-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Section {step} of 10</span>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${step <= 5 ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
              {step <= 5 ? 'REGISTRATION' : 'ASSESSMENT'}
            </span>
            </div>
            <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
              {step === 1  && "Personal Data"}
              {step === 2  && "Guardian Info"}
              {step === 3  && "Health History"}
              {step === 4  && "Medical Examination"}
              {step === 5  && "Educational Background"}
              {step === 6  && "Assessment – Basic Info"}
              {step === 7  && "Assessment – Birth History"}
              {step === 8  && "Assessment – Milestones"}
              {step === 9  && "Assessment – Health & Behavior"}
              {step === 10 && "Assessment – Sensory Profile"}
            </span>
            </div>
            {/* Two-tone progress bar: blue = reg, indigo = assessment */}
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden shadow-inner flex">
              <div className="bg-blue-600 h-full transition-all duration-700 ease-in-out"
                   style={{ width: `${Math.min(step, 5) / 10 * 100}%` }} />
              <div className="bg-indigo-500 h-full transition-all duration-700 ease-in-out"
                   style={{ width: `${Math.max(step - 5, 0) / 10 * 100}%` }} />
            </div>
          </div>

          <form className="w-full px-4" onSubmit={handleSubmit}>

            {/* ════════════════════════════════════════
              STEP 1 – PERSONAL DATA
          ════════════════════════════════════════ */}
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
                      <label className={sectionLabelStyle}>8. Email Address</label>
                      <input type="email" className={inputStyle} placeholder="EMAIL" name="Email_Address" required value={formData.Email_Address} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className={sectionLabelStyle}>9. Home Address</label>
                      <input className={inputStyle} placeholder="COMPLETE RESIDENTIAL ADDRESS" name="Home_Address" required value={formData.Home_Address} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
            )}

            {/* ════════════════════════════════════════
              STEP 2 – GUARDIAN INFO
          ════════════════════════════════════════ */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-blue-600 pl-4 py-2 bg-slate-50">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">2.0 Guardian Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1"><label className={sectionLabelStyle}>10. Father's Name</label><input className={inputStyle} name="Father_Name" placeholder="FATHER'S FULL NAME" value={formData.Father_Name} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>11. Occupation</label><input className={inputStyle} name="Father_Occupation" placeholder="FATHER'S OCCUPATION" value={formData.Father_Occupation} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>12. Telephone No</label><input className={inputStyle} name="Father_Phone" placeholder="PHONE" value={formData.Father_Phone} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>13. Office Address</label><input className={inputStyle} name="Father_Office_Address" placeholder="OFFICE ADDRESS" value={formData.Father_Office_Address} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>14. Mother's Name</label><input className={inputStyle} name="Mother_Name" placeholder="MOTHER'S FULL NAME" value={formData.Mother_Name} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>15. Occupation</label><input className={inputStyle} name="Mother_Occupation" placeholder="MOTHER'S OCCUPATION" value={formData.Mother_Occupation} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>16. Telephone No</label><input className={inputStyle} name="Mother_Phone" placeholder="PHONE" value={formData.Mother_Phone} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>17. Office Address</label><input className={inputStyle} name="Mother_Office_Address" placeholder="OFFICE ADDRESS" value={formData.Mother_Office_Address} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>18. Religion</label><input className={inputStyle} name="Religion" placeholder="RELIGION" value={formData.Religion} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Religious Leader Name</label><input className={inputStyle} name="Religious_Leader_Name" placeholder="NAME" value={formData.Religious_Leader_Name} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Religious Leader Phone</label><input className={inputStyle} name="Religious_Leader_Phone" placeholder="PHONE" value={formData.Religious_Leader_Phone} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>19. Who pays child's fees?</label><input className={inputStyle} name="Fee_Payer_Name" placeholder="PAYER NAME" value={formData.Fee_Payer_Name} onChange={handleInputChange} /></div>
                  </div>
                </div>
            )}

            {/* ════════════════════════════════════════
              STEP 3 – HEALTH HISTORY
          ════════════════════════════════════════ */}
            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-blue-600 pl-4 py-2 bg-slate-50">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">3.0 Health History</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                      <label className={selectionLabelStyle}><input type="radio" name="Disability_Status" value="Acquired" className={radioCheckStyle} checked={formData.Disability_Status === 'Acquired'} onChange={handleInputChange} />DISABILITY ACQUIRED</label>
                      <label className={selectionLabelStyle}><input type="radio" name="Disability_Status" value="At Birth" className={radioCheckStyle} checked={formData.Disability_Status === 'At Birth'} onChange={handleInputChange} />DISABILITY AT BIRTH</label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-2 border-slate-300 p-6 rounded-xl bg-slate-50">
                      <p className="col-span-full text-xs font-black uppercase text-blue-900 mb-2 border-b-2 border-blue-100 pb-2">Nature of Disability</p>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Nature_Hearing"  value="Yes" className={radioCheckStyle} checked={formData.Nature_Hearing  === 'Yes'} onChange={handleInputChange} />HEARING IMPAIRED</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Nature_Visual"   value="Yes" className={radioCheckStyle} checked={formData.Nature_Visual   === 'Yes'} onChange={handleInputChange} />VISUALLY IMPAIRED</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Nature_Physical" value="Yes" className={radioCheckStyle} checked={formData.Nature_Physical === 'Yes'} onChange={handleInputChange} />PHYSICALLY CHALLENGED</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Nature_Multiple" value="Yes" className={radioCheckStyle} checked={formData.Nature_Multiple === 'Yes'} onChange={handleInputChange} />MULTIPLE CHALLENGED</label>
                      <div className="col-span-full mt-2"><input className={inputStyle} name="Nature_Other_Specify" placeholder="OTHER (PLEASE SPECIFY)" value={formData.Nature_Other_Specify} onChange={handleInputChange} /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-2 border-slate-300 p-6 rounded-xl bg-white shadow-sm">
                      <p className="col-span-full text-xs font-black uppercase text-blue-900 mb-2 border-b-2 border-blue-100 pb-2">Observations (Experiences)</p>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Exp_Restlessness"       value="Yes" className={radioCheckStyle} checked={formData.Exp_Restlessness       === 'Yes'} onChange={handleInputChange} />RESTLESSNESS</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Exp_Sleeplessness"      value="Yes" className={radioCheckStyle} checked={formData.Exp_Sleeplessness      === 'Yes'} onChange={handleInputChange} />SLEEPLESSNESS</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Exp_Convulsion"         value="Yes" className={radioCheckStyle} checked={formData.Exp_Convulsion         === 'Yes'} onChange={handleInputChange} />CONVULSION AT INTERVALS</label>
                      <label className={selectionLabelStyle}><input type="checkbox" name="Exp_Lack_Concentration" value="Yes" className={radioCheckStyle} checked={formData.Exp_Lack_Concentration === 'Yes'} onChange={handleInputChange} />LACK OF CONCENTRATION</label>
                    </div>
                    <div className="space-y-4 border-2 border-blue-300 p-6 rounded-xl bg-blue-50">
                      <span className="text-sm font-black text-blue-900 uppercase tracking-tight">Is child on special medication?</span>
                      <div className="flex gap-8 mt-2">
                        <label className={selectionLabelStyle}><input type="radio" name="Special_Medication" value="Yes" className={radioCheckStyle} checked={formData.Special_Medication === 'Yes'} onChange={handleInputChange} />YES</label>
                        <label className={selectionLabelStyle}><input type="radio" name="Special_Medication" value="No"  className={radioCheckStyle} checked={formData.Special_Medication === 'No'}  onChange={handleInputChange} />NO</label>
                      </div>
                      <textarea className={`${inputStyle} h-24 mt-4 resize-none`} name="Medication_Details" placeholder="IF YES, LIST MEDICATIONS TO BE ADMINISTERED" value={formData.Medication_Details} onChange={handleInputChange}></textarea>
                    </div>
                  </div>
                </div>
            )}

            {/* ════════════════════════════════════════
              STEP 4 – MEDICAL EXAMINATION
          ════════════════════════════════════════ */}
            {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-blue-700 pl-4 py-2 bg-blue-50/50">
                    <h2 className="text-xl font-black text-blue-900 uppercase tracking-tight">4.0 Medical Examination</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1"><label className={sectionLabelStyle}>Surname</label><input className={inputStyle} name="Med_Exam_Surname"    placeholder="SURNAME"     value={formData.Med_Exam_Surname}    onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>First Name</label><input className={inputStyle} name="Med_Exam_FirstName"  placeholder="FIRST NAME"  value={formData.Med_Exam_FirstName}  onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Middle Name</label><input className={inputStyle} name="Med_Exam_MiddleName" placeholder="MIDDLE NAME" value={formData.Med_Exam_MiddleName} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Date of Birth</label><input type="date" className={inputStyle} name="Med_Exam_DOB" value={formData.Med_Exam_DOB} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Gender</label>
                      <select className={inputStyle} name="Med_Exam_Gender" value={formData.Med_Exam_Gender} onChange={handleInputChange}>
                        <option value="">SELECT GENDER</option><option value="Male">MALE</option><option value="Female">FEMALE</option>
                      </select>
                    </div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Type of Disability</label><input className={inputStyle} name="Med_Exam_Disability_Type" placeholder="SPECIFY" value={formData.Med_Exam_Disability_Type} onChange={handleInputChange} /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border-2 border-slate-300">
                    <p className="col-span-full text-xs font-black uppercase text-blue-800 border-b-2 border-blue-100 pb-2 mb-2 tracking-widest">Clinical Observations</p>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Sight (Left Eye)</label><input className={inputStyle} name="Med_Sight_Left"  placeholder="LEFT EYE RESULTS"  value={formData.Med_Sight_Left}  onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Sight (Right Eye)</label><input className={inputStyle} name="Med_Sight_Right" placeholder="RIGHT EYE RESULTS" value={formData.Med_Sight_Right} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Mouth & Teeth</label><input className={inputStyle} name="Med_Mouth_Teeth" placeholder="ORAL HEALTH STATUS" value={formData.Med_Mouth_Teeth} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Tonsils</label><input className={inputStyle} name="Med_Tonsils" placeholder="TONSILS STATUS" value={formData.Med_Tonsils} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Genotype</label><input className={inputStyle} name="Med_Genotype"    placeholder="e.g. AA, AS, SS" value={formData.Med_Genotype}    onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Blood Group</label><input className={inputStyle} name="Med_Blood_Group" placeholder="e.g. A+, O-, B+" value={formData.Med_Blood_Group} onChange={handleInputChange} /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl border-2 border-slate-300">
                    <p className="col-span-full text-xs font-black uppercase text-blue-800 border-b-2 border-blue-100 pb-2 mb-2 tracking-widest">Systems Review</p>
                    {[
                      ['Med_Nervous_System',     'Nervous System'],
                      ['Med_Reproductive_System','Reproductive System'],
                      ['Med_Skin',               'Skin'],
                      ['Med_Heart',              'Heart'],
                      ['Med_Abdomen',            'Abdomen'],
                      ['Med_Spleen',             'Spleen'],
                      ['Med_Urine',              'Urine'],
                      ['Med_Stools',             'Stools'],
                    ].map(([n, l]) => (
                        <div key={n} className="space-y-1">
                          <label className={sectionLabelStyle}>{l}</label>
                          <input className={inputStyle} name={n} placeholder={`${l.toUpperCase()} STATUS`} value={formData[n]} onChange={handleInputChange} />
                        </div>
                    ))}
                  </div>
                  <div className="space-y-4 p-6 bg-blue-50 border-2 border-blue-300 rounded-2xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-sm font-black uppercase text-blue-900">Medically fit?</span>
                      <div className="flex gap-10">
                        <label className={selectionLabelStyle}><input type="radio" name="Med_Is_Fit" value="Yes" className={radioCheckStyle} checked={formData.Med_Is_Fit === 'Yes'} onChange={handleInputChange} />YES</label>
                        <label className={selectionLabelStyle}><input type="radio" name="Med_Is_Fit" value="No"  className={radioCheckStyle} checked={formData.Med_Is_Fit === 'No'}  onChange={handleInputChange} />NO</label>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={sectionLabelStyle}>Comments / past illness</label>
                      <textarea className={`${inputStyle} h-24 resize-none`} name="Med_Comments" placeholder="ADDITIONAL MEDICAL HISTORY OR COMMENTS" value={formData.Med_Comments} onChange={handleInputChange}></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1"><label className={sectionLabelStyle}>Medical Director Name</label><input className={inputStyle} name="Med_Director_Name" placeholder="DIRECTOR'S FULL NAME" value={formData.Med_Director_Name} onChange={handleInputChange} /></div>
                      <div className="space-y-1"><label className={sectionLabelStyle}>Examination Date</label><input type="date" className={inputStyle} name="Med_Exam_Date" value={formData.Med_Exam_Date} onChange={handleInputChange} /></div>
                    </div>
                  </div>
                </div>
            )}

            {/* ════════════════════════════════════════
              STEP 5 – EDUCATION & ATTESTATION
          ════════════════════════════════════════ */}
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
                      <span className="text-sm font-black text-slate-900 uppercase">He/She can read and write?</span>
                      <div className="flex gap-8">
                        <label className={selectionLabelStyle}><input type="radio" name="Can_Read_Write" value="Yes" className={radioCheckStyle} checked={formData.Can_Read_Write === 'Yes'} onChange={handleInputChange} />YES</label>
                        <label className={selectionLabelStyle}><input type="radio" name="Can_Read_Write" value="No"  className={radioCheckStyle} checked={formData.Can_Read_Write === 'No'}  onChange={handleInputChange} />NO</label>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={sectionLabelStyle}>Reason for leaving previous center</label>
                      <textarea className={`${inputStyle} h-24 resize-none`} name="Reason_for_Leaving" placeholder="ENTER REASON" value={formData.Reason_for_Leaving} onChange={handleInputChange}></textarea>
                    </div>
                    {/* Transition card */}
                    <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 text-center">
                      <p className="text-green-800 font-black text-base uppercase tracking-wide">✓ Registration Section Complete</p>
                      <p className="text-green-600 text-sm mt-1">Click <strong>Next Step</strong> to begin the Child Assessment section.</p>
                    </div>
                  </div>
                </div>
            )}

            {/* ════════════════════════════════════════
              STEP 6 – ASSESSMENT BASIC INFO
          ════════════════════════════════════════ */}
            {step === 6 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Phase banner */}
                  <div className="bg-indigo-900 text-white rounded-2xl px-6 py-4 text-center">
                    <p className="text-[10px] font-black tracking-widest uppercase text-indigo-300 mb-1">Child Assessment</p>
                    <p className="text-lg font-black uppercase">Detailed Assessment Form</p>
                  </div>
                  <div className="flex items-center gap-3 border-l-8 border-indigo-600 pl-4 py-2 bg-indigo-50">
                    <h2 className="text-xl font-black text-indigo-900 uppercase tracking-tight">6.0 Basic Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1"><label className={sectionLabelStyle}>Age</label><input className={inputStyle} placeholder="AGE" name="Assessment_Age" value={formData.Assessment_Age} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Diagnosis</label><input className={inputStyle} placeholder="PRIMARY DIAGNOSIS" name="Assessment_Diagnosis" value={formData.Assessment_Diagnosis} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Position in Family</label><input className={inputStyle} placeholder="E.G. 1st, 2nd" name="Assessment_PositionInFamily" value={formData.Assessment_PositionInFamily} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>School Attended/Attending</label><input className={inputStyle} placeholder="SCHOOL NAME" name="Assessment_SchoolAttended" value={formData.Assessment_SchoolAttended} onChange={handleInputChange} /></div>
                    <div className="space-y-1 md:col-span-2"><label className={sectionLabelStyle}>Class</label><input className={inputStyle} placeholder="CURRENT CLASS" name="Assessment_Class" value={formData.Assessment_Class} onChange={handleInputChange} /></div>
                    <div className="space-y-1 md:col-span-2"><label className={sectionLabelStyle}>Expectations / Goals</label><textarea className={`${inputStyle} h-24 resize-none`} placeholder="WHAT DO YOU HOPE TO ACHIEVE?" name="Assessment_Expectations" value={formData.Assessment_Expectations} onChange={handleInputChange}></textarea></div>
                  </div>
                </div>
            )}

            {/* ════════════════════════════════════════
              STEP 7 – ASSESSMENT BIRTH HISTORY
          ════════════════════════════════════════ */}
            {step === 7 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-indigo-600 pl-4 py-2 bg-indigo-50">
                    <h2 className="text-xl font-black text-indigo-900 uppercase tracking-tight">7.0 Birth History</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1"><label className={sectionLabelStyle}>Gestation Period</label><input className={inputStyle} placeholder="E.G. 38 WEEKS / NORMAL / PREMATURE" name="Assessment_Gestation" value={formData.Assessment_Gestation} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Type of Delivery</label><input className={inputStyle} placeholder="E.G. NORMAL / CS" name="Assessment_DeliveryType" value={formData.Assessment_DeliveryType} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Cried at Birth?</label><input className={inputStyle} placeholder="YES / NO" name="Assessment_CriesAtBirth" value={formData.Assessment_CriesAtBirth} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Birth Weight</label><input className={inputStyle} placeholder="E.G. 3.5 KG" name="Assessment_BirthWeight" value={formData.Assessment_BirthWeight} onChange={handleInputChange} /></div>
                  </div>
                </div>
            )}

            {/* ════════════════════════════════════════
              STEP 8 – ASSESSMENT MILESTONES
          ════════════════════════════════════════ */}
            {step === 8 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-indigo-600 pl-4 py-2 bg-indigo-50">
                    <h2 className="text-xl font-black text-indigo-900 uppercase tracking-tight">8.0 Developmental Milestones</h2>
                  </div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Enter the age (in months) each milestone was achieved</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1"><label className={sectionLabelStyle}>Neck Control</label><input className={inputStyle} placeholder="IN MONTHS" name="Assessment_NeckControl" value={formData.Assessment_NeckControl} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Sitting</label><input className={inputStyle} placeholder="IN MONTHS" name="Assessment_Sitting" value={formData.Assessment_Sitting} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Crawling</label><input className={inputStyle} placeholder="IN MONTHS" name="Assessment_Crawling" value={formData.Assessment_Crawling} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Walking</label><input className={inputStyle} placeholder="IN MONTHS" name="Assessment_Walking" value={formData.Assessment_Walking} onChange={handleInputChange} /></div>
                    <div className="space-y-1 md:col-span-2"><label className={sectionLabelStyle}>Language Development</label><textarea className={`${inputStyle} h-24 resize-none`} placeholder="DESCRIBE LANGUAGE DEVELOPMENT" name="Assessment_LanguageDev" value={formData.Assessment_LanguageDev} onChange={handleInputChange}></textarea></div>
                  </div>
                </div>
            )}

            {/* ════════════════════════════════════════
              STEP 9 – ASSESSMENT HEALTH & BEHAVIOR
          ════════════════════════════════════════ */}
            {step === 9 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-indigo-600 pl-4 py-2 bg-indigo-50">
                    <h2 className="text-xl font-black text-indigo-900 uppercase tracking-tight">9.0 Health & Behavior</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-1"><label className={sectionLabelStyle}>Hearing Test Conducted?</label><input className={inputStyle} placeholder="YES / NO / DETAILS" name="Assessment_HearingTest" value={formData.Assessment_HearingTest} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Seizures Frequency</label><input className={inputStyle} placeholder="E.G. NONE / WEEKLY / DETAILS" name="Assessment_Seizures" value={formData.Assessment_Seizures} onChange={handleInputChange} /></div>
                    <div className="p-6 border-2 border-slate-300 rounded-xl bg-slate-50">
                      <p className="text-xs font-black uppercase text-blue-900 mb-4 border-b-2 border-blue-100 pb-2">Behavioural Issues</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1"><label className={sectionLabelStyle}>Hurtful to Themselves?</label><input className={inputStyle} placeholder="NIL / OCCASIONALLY / FREQUENTLY" name="Assessment_HurtfulToSelf" value={formData.Assessment_HurtfulToSelf} onChange={handleInputChange} /></div>
                        <div className="space-y-1"><label className={sectionLabelStyle}>Hurtful to Others?</label><input className={inputStyle} placeholder="NIL / OCCASIONALLY / FREQUENTLY" name="Assessment_HurtfulToOthers" value={formData.Assessment_HurtfulToOthers} onChange={handleInputChange} /></div>
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {/* ════════════════════════════════════════
              STEP 10 – SENSORY PROFILE + FINAL CONSENT
          ════════════════════════════════════════ */}
            {step === 10 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 border-l-8 border-indigo-600 pl-4 py-2 bg-indigo-50">
                    <h2 className="text-xl font-black text-indigo-900 uppercase tracking-tight">10.0 Sensory Profile</h2>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm font-bold italic">
                    These observations help our specialists design the most accurate therapy program for your child.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1"><label className={sectionLabelStyle}>Tactile Sensitivity</label><input className={inputStyle} placeholder="TYPICAL / PROBABLE / DEFINITE DIFFERENCE" name="Assessment_TactileSensitivity" value={formData.Assessment_TactileSensitivity} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Taste / Smell Sensitivity</label><input className={inputStyle} placeholder="TYPICAL / PROBABLE / DEFINITE DIFFERENCE" name="Assessment_TasteSmellSensitivity" value={formData.Assessment_TasteSmellSensitivity} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Movement Sensitivity</label><input className={inputStyle} placeholder="TYPICAL / PROBABLE / DEFINITE DIFFERENCE" name="Assessment_MovementSensitivity" value={formData.Assessment_MovementSensitivity} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Underresponsive / Seeking</label><input className={inputStyle} placeholder="TYPICAL / PROBABLE / DEFINITE DIFFERENCE" name="Assessment_UnderresponsiveSeeking" value={formData.Assessment_UnderresponsiveSeeking} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Auditory Filtering</label><input className={inputStyle} placeholder="TYPICAL / PROBABLE / DEFINITE DIFFERENCE" name="Assessment_AuditoryFiltering" value={formData.Assessment_AuditoryFiltering} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><label className={sectionLabelStyle}>Energy Level</label><input className={inputStyle} placeholder="TYPICAL / PROBABLE / DEFINITE DIFFERENCE" name="Assessment_EnergyLevel" value={formData.Assessment_EnergyLevel} onChange={handleInputChange} /></div>
                    <div className="space-y-1 md:col-span-2"><label className={sectionLabelStyle}>Visual / Auditory Sensitivity</label><input className={inputStyle} placeholder="TYPICAL / PROBABLE / DEFINITE DIFFERENCE" name="Assessment_VisualAuditory" value={formData.Assessment_VisualAuditory} onChange={handleInputChange} /></div>
                  </div>

                  {/* Final consent */}
                  <div className="mt-8 p-8 bg-blue-900 text-white rounded-2xl shadow-2xl border-t-8 border-blue-500 text-center uppercase tracking-tight">
                    <p className="text-[11px] font-bold leading-relaxed mb-6">
                      "I hereby attest to the accuracy of the information obtained in this application. I agree to accept ESHRC decision regarding this application and its penalty regarding falsification or wrong presentation of information and by the rules and regulations."
                    </p>
                    <label className="flex items-center justify-center gap-3 cursor-pointer bg-blue-800/50 p-5 rounded-xl border border-blue-400 hover:bg-blue-700 transition-all">
                      <input
                          type="checkbox"
                          name="Consent_Check"
                          required
                          className="w-6 h-6 accent-green-500"
                          checked={formData.Consent_Check === 'Agreed'}
                          onChange={(e) => setFormData(prev => ({ ...prev, Consent_Check: e.target.checked ? 'Agreed' : '' }))}
                      />
                      <span className="text-xs font-black tracking-widest">AGREE &amp; CONFIRM (Parent/Guardian Signature)</span>
                    </label>
                  </div>
                </div>
            )}

            {/* ── NAVIGATION BUTTONS ── */}
            <div className="flex items-center justify-between mt-12 mb-8 gap-6">
              <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`flex-1 h-16 flex items-center justify-center rounded-2xl font-black border-4 uppercase tracking-widest transition-all ${
                      step === 1
                          ? 'opacity-0 invisible pointer-events-none'
                          : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
              >
                ← BACK
              </button>
              {step < 10 ? (
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
                      className="flex-1 h-16 flex items-center justify-center rounded-2xl bg-green-600 text-white font-black hover:bg-green-700 shadow-xl uppercase tracking-widest border-b-4 border-green-800 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {status === "Sending..." ? "SENDING…" : "SUBMIT APPLICATION ✓"}
                  </button>
              )}
            </div>
          </form>

          {/* ── FOOTER ── */}
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