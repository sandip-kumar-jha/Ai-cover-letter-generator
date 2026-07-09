import { FaCopy } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

function CoverLetterOutput({ letter }) {
  const copyText = async () => {
    if (!letter) return;

    await navigator.clipboard.writeText(letter);
    toast.success("Copied Successfully");
  };

  return (
    <div className="outputBox">

      <div className="outputHeader">

        <h2>Generated Cover Letter</h2>

        {letter && (
          <button className="copyBtn" onClick={copyText}>
            <FaCopy />
            Copy
          </button>
        )}

      </div>

      <div className="letter">

        {letter ? (
          <ReactMarkdown>{letter}</ReactMarkdown>
        ) : (
          "Your AI generated cover letter will appear here."
        )}

      </div>

    </div>
  );
}

export default CoverLetterOutput;