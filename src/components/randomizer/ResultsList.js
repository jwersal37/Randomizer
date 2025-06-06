import React from "react";
import { FaTrash } from "react-icons/fa";

export default function ResultsList({ results, onRemoveResult }) {
  if (!results || Object.entries(results).length === 0) return null;
  return (
    <>
      <h5 className="mt-4 mb-3">Results</h5>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <ul className="list-group">
          {Object.entries(results)
            .sort((a, b) => b[1] - a[1])
            .map(([result, count], idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{result}</span>
                <span>
                  <span className="badge bg-success rounded-pill me-3">{count}</span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    title="Remove entry"
                    aria-label={`Remove ${result}`}
                    onClick={() => onRemoveResult(result)}
                  >
                    <FaTrash />
                  </button>
                </span>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
