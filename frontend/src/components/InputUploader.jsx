export default function InputUploader({ disease, inputData, setInputData }) {
  if (!disease) return null;

  const isRadiology = disease === "lung" || disease === "brain";
  const isBiomarker = disease === "heart" || disease === "diabetes";

  return (
    <div className="field">

      {/* IMAGE UPLOAD — ONLY FOR BRAIN & LUNG */}
      {isRadiology && (
        <>
          <label>
            Upload {disease === "lung" ? "Chest X-ray" : "MRI"} Image
            <span className="required">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e =>
              setInputData({ ...inputData, image: e.target.files[0] })
            }
          />
        </>
      )}

      {/* REPORT UPLOAD — OPTIONAL FOR RADIOLOGY, REQUIRED FOR BIOMARKERS */}
      <label>
        Upload Report
        {isBiomarker && <span className="required">*</span>}
        {isRadiology && <span className="optional"> (Optional)</span>}
      </label>

      <input
        type="file"
        accept="application/pdf"
        onChange={e =>
          setInputData({ ...inputData, report: e.target.files[0] })
        }
      />

      {isRadiology && (
        <small className="hint">
          
        </small>
      )}
    </div>
  );
}
