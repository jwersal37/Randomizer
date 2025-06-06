import React from "react";

export default function RandomizerControls({
  input,
  attempts,
  setAttempts,
  onRandomize,
  onShuffle,
  onClearEntries,
  onClearResults,
  dropdownOpen,
  setDropdownOpen,
  entries
}) {
  return (
    <div className="d-flex mb-4 gap-2 align-items-center flex-wrap justify-content-center">
      <button
        onClick={onRandomize}
        className="btn btn-primary btn-lg flex-shrink-0"
        disabled={input.trim() === ""}
        aria-label="Randomize entries"
      >
        Randomize
      </button>
      <input
        type="number"
        min="1"
        max="25"
        value={attempts}
        onChange={e => setAttempts(Math.max(1, Math.min(25, Number(e.target.value) || 1)))}
        className="form-control form-control-lg flex-shrink-0"
        style={{ width: 100, minWidth: 0 }}
        title="Number of attempts"
        placeholder="Attempts"
        aria-label="Number of attempts"
      />
      <button
        onClick={onShuffle}
        className="btn btn-secondary btn-lg flex-shrink-0"
        aria-label="Shuffle entries"
        disabled={entries.length < 2}
      >
        Shuffle
      </button>
      {/* Dropdown nav for actions */}
      <div className="nav-item dropdown" style={{ position: 'relative' }}>
        <button
          className="btn btn-outline-secondary btn-lg flex-shrink-0 d-flex align-items-center"
          type="button"
          aria-label="More actions"
          onClick={() => setDropdownOpen(v => !v)}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          id="randomizerDropdown"
          data-bs-toggle="dropdown"
        >
          <span className="visually-hidden">More actions</span>
          <span style={{ fontSize: 20 }}>⋮</span>
        </button>
        <ul
          className={`dropdown-menu${dropdownOpen ? ' show' : ''}`}
          aria-labelledby="randomizerDropdown"
          style={{ minWidth: 220, right: 0, left: 'auto', position: 'absolute', zIndex: 10, display: dropdownOpen ? 'block' : 'none' }}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <li>
            <button
              onClick={() => { onClearEntries(); setDropdownOpen(false); }}
              className="dropdown-item"
              aria-label="Clear entries"
              disabled={input.trim() === ""}
            >
              Clear Entries
            </button>
          </li>
          <li>
            <button
              onClick={() => { onClearResults(); setDropdownOpen(false); }}
              className="dropdown-item text-danger"
              aria-label="Clear results"
            >
              Clear Results
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
