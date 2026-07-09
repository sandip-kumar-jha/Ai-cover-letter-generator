import { useState } from "react";
import { FaFilePdf, FaTrash } from "react-icons/fa";

import CoverLetterOutput from "./CoverLetterOutput";
import Loader from "./Loader";
import { generateCoverLetter } from "../services/gemini";
import { extractPdfText } from "../utils/pdfReader";

function CoverLetterForm() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");

  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);

  // Resume State
  const [resume, setResume] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [resumeText, setResumeText] = useState("");

  // Upload Resume
 const handleResume = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (file.type !== "application/pdf") {
    alert("Please upload PDF only.");
    return;
  }

  try {
    setResume(file);
    setResumeName(file.name);

    const extractedText = await extractPdfText(file);

    setResumeText(extractedText);

    console.log("Resume Text:");
    console.log(extractedText);

    alert("Resume uploaded successfully!");
  } catch (error) {
    console.error(error);
    alert("Unable to read PDF.");
    setResume(null);
    setResumeName("");
    setResumeText("");
  }
};

  const removeResume = () => {
    setResume(null);
    setResumeName("");
    setResumeText("");
  };

  const generateLetter = async () => {
    if (!name || !role || !company || !skills) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await generateCoverLetter({
        name,
        role,
        company,
        skills,
        resumeText,
      });

      setLetter(response);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setRole("");
    setCompany("");
    setSkills("");

    setLetter("");

    setResume(null);
    setResumeName("");
    setResumeText("");
  };

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Candidate Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Job Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <input
        type="text"
        placeholder="Target Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <textarea
        rows="5"
        placeholder="Key Skills"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      <div className="resumeUpload">
        <label className="uploadLabel">
          <FaFilePdf />
          <span>Upload Resume (PDF)</span>

          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={handleResume}
          />
        </label>

        {resume && (
          <div className="resumeCard">
            <span>{resumeName}</span>

            <button
              type="button"
              className="deleteBtn"
              onClick={removeResume}
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      <div className="btnGroup">
        <button
          type="button"
          onClick={generateLetter}
        >
          Generate Cover Letter
        </button>

        <button
          type="button"
          className="resetBtn"
          onClick={resetForm}
        >
          Reset
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <CoverLetterOutput letter={letter} />
      )}
    </div>
  );
}

export default CoverLetterForm;