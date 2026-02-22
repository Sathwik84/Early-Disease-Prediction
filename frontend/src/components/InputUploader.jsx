import { useState } from "react";

export default function InputUploader({ disease, inputData, setInputData }) {
  const [imageFileName, setImageFileName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [reportFileName, setReportFileName] = useState("");

  if (!disease) return null;

  const isRadiology = disease === "lung" || disease === "brain";
  const isBiomarker = disease === "heart" || disease === "diabetes";

  return (
    <div className="field fade-in">

      {/* IMAGE UPLOAD — ONLY FOR BRAIN & LUNG */}
      {isRadiology && (
        <div style={{ marginBottom: "20px" }}>
          <div className="section-label">
            Upload {disease === "lung" ? "Chest X-ray" : "Brain MRI"} Image
            <span className="required"> *</span>
          </div>
          <div className={`upload-zone${imageFileName ? " has-file" : ""}`}>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const f = e.target.files[0];
                if (f) {
                  setInputData({ ...inputData, image: f });
                  setImageFileName(f.name);
                  // Generate live preview URL
                  setImagePreview(URL.createObjectURL(f));
                }
              }}
            />
            <div className="upload-icon">
              {imageFileName ? "🖼️" : "📤"}
            </div>
            <div className="upload-text">
              {imageFileName ? (
                <div className="upload-filename">✅ {imageFileName}</div>
              ) : (
                <>Drop your image here or <strong>browse</strong></>
              )}
            </div>
          </div>

          {/* 🔍 Image Preview */}
          {imagePreview && (
            <div className="img-preview-wrap fade-in">
              <img src={imagePreview} alt="Preview" />
              <div className="img-preview-label">
                Preview — {disease === "lung" ? "Chest X-ray" : "Brain MRI"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* REPORT UPLOAD — BIOMARKER MODULES */}
      {isBiomarker && (
        <div>
          <div className="section-label">
            Upload Biomarker Report (PDF)
            <span className="required"> *</span>
          </div>
          <div className={`upload-zone${reportFileName ? " has-file" : ""}`}>
            <input
              type="file"
              accept="application/pdf"
              onChange={e => {
                const f = e.target.files[0];
                if (f) {
                  setInputData({ ...inputData, report: f });
                  setReportFileName(f.name);
                }
              }}
            />
            <div className="upload-icon">
              {reportFileName ? "📄" : "📋"}
            </div>
            <div className="upload-text">
              {reportFileName ? (
                <div className="upload-filename">✅ {reportFileName}</div>
              ) : (
                <>Drop your PDF here or <strong>browse</strong></>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
