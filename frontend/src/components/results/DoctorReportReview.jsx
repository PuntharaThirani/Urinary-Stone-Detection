import React, { useState } from 'react';
import axios from 'axios'; // API calls වලට
import DoctorReportReview from '../components/results/DoctorReportReview.jsx'

// මෙතන 'report' කියන්නේ Database එකෙන් අරගත්ත pending තත්ත්වයේ තියෙන රිපෝට් එක
const DoctorReportReview = ({ report, onVerifiedSuccess }) => {
  
  // AI එකෙන් ආපු Draft එක Editable Textbox එකකට දාන්න State එකක්
  const [editedDraft, setEditedDraft] = useState(report.aiDraft);
  
  // ඩොක්ටර්ට අලුතින් මොනවා හරි ලියන්න ඕන නම්
  const [doctorNotes, setDoctorNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirm බොත්තම එබුවාම Backend එකට Data යවන Function එක
  const handleConfirmReport = async () => {
    setIsSubmitting(true);
    try {
      // Backend එකේ Update Route එකට (PUT Request) යවනවා
      const response = await axios.put(`http://localhost:5000/api/reports/confirm/${report._id}`, {
        aiDraft: editedDraft, // ඩොක්ටර් වෙනස් කරපු Draft එක
        doctorNotes: doctorNotes,
        status: 'verified', // මෙතනින් තමයි රිපෝට් එක පේෂන්ට්ගේ පැත්තට යන්නේ!
        diagnosis: report.hasStones ? 'Urolithiasis Detected' : 'Normal / No Stones'
      });

      if (response.data.success) {
        alert("✅ Report successfully verified and sent to the patient!");
        // සාර්ථක වුණාම ඊළඟට වෙන්න ඕන දේ (උදා: ලිස්ට් එකෙන් මේක අයින් කරන එක)
        if (onVerifiedSuccess) onVerifiedSuccess(); 
      }
    } catch (error) {
      console.error("Error verifying report:", error);
      alert("❌ Failed to verify the report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
        🩺 Doctor's Review Panel
      </h2>

      {/* රෝගියාගේ විස්තර */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>Patient Name:</strong> {report.patientName}</p>
        <p><strong>Age / Gender:</strong> {report.patientAge} | {report.patientGender}</p>
        <p><strong>AI Stone Detection:</strong> {report.hasStones ? `⚠️ Detected ${report.stoneCount} stone(s)` : '✅ No stones detected'}</p>
      </div>

      {/* AI Draft එක පෙන්නන සහ Edit කරන Textarea එක */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          🤖 AI Preliminary Draft (You can edit this):
        </label>
        <textarea 
          value={editedDraft}
          onChange={(e) => setEditedDraft(e.target.value)}
          rows="12"
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontFamily: 'monospace' }}
        />
      </div>

      {/* ඩොක්ටර්ගේ අමතර සටහන් */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          ✍️ Additional Doctor's Notes (Optional):
        </label>
        <textarea 
          value={doctorNotes}
          onChange={(e) => setDoctorNotes(e.target.value)}
          placeholder="Type any specific clinical recommendations or prescriptions here..."
          rows="4"
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      {/* Confirm Button එක */}
      <button 
        onClick={handleConfirmReport}
        disabled={isSubmitting}
        style={{
          backgroundColor: isSubmitting ? '#95a5a6' : '#27ae60',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          width: '100%',
          fontWeight: 'bold'
        }}
      >
        {isSubmitting ? 'Verifying...' : '✅ Confirm & Send to Patient'}
      </button>
    </div>
  );
};

export default DoctorReportReview;