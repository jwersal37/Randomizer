import React, { useState } from "react";
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConfirmDeleteModal from "../shared/ConfirmDeleteModal";
import ResultsList from "./ResultsList";
import RandomizerControls from "./RandomizerControls";
import { generateShareUrl, decodeEntries, getEntriesFromUrl } from "../../utils/shareUtils";

export default function Randomizer() {
  const [input, setInput] = useState(() => {
    // Check URL for shared entries first
    const encodedEntries = getEntriesFromUrl();
    if (encodedEntries) {
      const decoded = decodeEntries(encodedEntries);
      if (decoded) return decoded;
    }
    // Fall back to localStorage
    return localStorage.getItem("randomizer_entries") || "";
  });
  const [results, setResults] = useState(() => {
    const stored = localStorage.getItem("randomizer_results");
    return stored ? JSON.parse(stored) : {};
  });
  const [attempts, setAttempts] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // 'clearAll' or 'removeOne'
  const [pendingRemove, setPendingRemove] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  React.useEffect(() => {
    localStorage.setItem("randomizer_entries", input);
  }, [input]);

  React.useEffect(() => {
    localStorage.setItem("randomizer_results", JSON.stringify(results));
  }, [results]);

  // Accessibility: focus trap for modal
  React.useEffect(() => {
    if (showConfirm) {
      const firstButton = document.querySelector('.modal .btn-secondary');
      if (firstButton) firstButton.focus();
      const trap = (e) => {
        if (e.key === 'Tab') {
          const modal = document.querySelector('.modal.show');
          if (modal) {
            const focusable = modal.querySelectorAll('button');
            if (focusable.length) {
              const first = focusable[0];
              const last = focusable[focusable.length - 1];
              if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
              } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
              }
            }
          }
        }
      };
      document.addEventListener('keydown', trap);
      return () => document.removeEventListener('keydown', trap);
    }
  }, [showConfirm]);

  // Toast state
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleRandomize = () => {
    const entries = input
      .split("\n")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
    if (entries.length === 0) return;
    let randomEntry = null;
    const maxAttempts = Math.min(Number(attempts) || 1, 25);
    for (let i = 0; i < maxAttempts; i++) {
      randomEntry = entries[Math.floor(Math.random() * entries.length)];
    }
    setResults((prev) => ({
      ...prev,
      [randomEntry]: prev[randomEntry] ? prev[randomEntry] + 1 : 1
    }));
  };

  const handleShuffle = () => {
    const entries = input
      .split("\n")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
    if (entries.length === 0) return;
    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    setInput(entries.join("\n"));
  };

  const handleClearResults = () => {
    setConfirmType('clearAll');
    setShowConfirm(true);
  };

  const handleRemoveResult = (result) => {
    setPendingRemove(result);
    setConfirmType('removeOne');
    setShowConfirm(true);
  };

  const handleClearEntries = () => {
    setInput("");
    showToast("Entries cleared", "info");
  };

  const handleShare = () => {
    if (!input || input.trim() === '') {
      showToast("No entries to share", "warning");
      return;
    }
    const shareUrl = generateShareUrl(input);
    if (!shareUrl) {
      showToast("Failed to generate share link", "danger");
      return;
    }
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        showToast("Share link copied to clipboard!", "success");
      })
      .catch(() => {
        showToast("Failed to copy link", "danger");
      });
  };

  const confirmClear = () => {
    if (confirmType === 'clearAll') {
      setResults({});
      showToast("Results cleared", "success");
    } else if (confirmType === 'removeOne' && pendingRemove) {
      setResults(prev => {
        const newResults = { ...prev };
        delete newResults[pendingRemove];
        return newResults;
      });
      showToast(`Removed '${pendingRemove}'`, "info");
      setPendingRemove(null);
    }
    setShowConfirm(false);
    setConfirmType(null);
  };

  const cancelClear = () => {
    setShowConfirm(false);
    setConfirmType(null);
    setPendingRemove(null);
  };

  // Enhanced textarea with floating label, monospace, auto-resize, line numbers, and duplicate/empty highlighting
  const textareaRef = React.useRef();

  // Compute entries and line info
  const entryLines = input.split('\n');

  // Auto-resize effect
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 300) + 'px';
    }
  }, [input]);

  const entries = input.split("\n").map(e => e.trim()).filter(e => e.length > 0);

  // --- UI ---
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm p-4">
            <h2 className="mb-4 text-center">Randomizer</h2>
            <div className="alert alert-info mb-4" role="alert">
              <strong>How to use:</strong><br />
              Enter each item on a new line in the box below.<br />
              Optionally set the number of attempts (higher = more randomization, max 25).<br />
              Click <strong>Randomize</strong> to pick an entry.<br />
              Use <strong>Shuffle Entries</strong> to reorder, and <strong>Clear</strong> buttons as needed.
            </div>
            <div className="form-floating mb-3 position-relative" style={{ fontFamily: 'monospace' }}>
              <textarea
                ref={textareaRef}
                className="form-control"
                id="entriesTextarea"
                style={{ minHeight: 120, maxHeight: 300, resize: 'none', fontFamily: 'inherit', paddingLeft: 40 }}
                rows={Math.max(8, entryLines.length)}
                placeholder="Enter each item on a new line..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Entries textarea"
              />
            </div>
            <RandomizerControls
              input={input}
              attempts={attempts}
              setAttempts={setAttempts}
              onRandomize={handleRandomize}
              onShuffle={handleShuffle}
              onClearEntries={handleClearEntries}
              onClearResults={handleClearResults}
              onShare={handleShare}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              entries={entries}
            />
            <ResultsList results={results} onRemoveResult={handleRemoveResult} />
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        show={showConfirm}
        onConfirm={confirmClear}
        onCancel={cancelClear}
        message={confirmType === 'removeOne' && pendingRemove ? `Remove '${pendingRemove}' from results?` : "Are you sure you want to clear your results?"}
      />
      {toast && (
        <div
          className={`toast align-items-center text-bg-${toast.type} border-0 show position-fixed bottom-0 end-0 m-4`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{ zIndex: 9999, minWidth: 200 }}
        >
          <div className="d-flex">
            <div className="toast-body">{toast.msg}</div>
          </div>
        </div>
      )}
    </div>
  );
}
