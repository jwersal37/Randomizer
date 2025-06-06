import React from "react";

export default function ConfirmDeleteModal({ show, onConfirm, onCancel, message }) {
  if (!show) return null;
  return (
    <div
      className="modal fade show"
      style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }}
      tabIndex="-1"
      onClick={onCancel}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm</h5>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button className="btn btn-danger" onClick={onConfirm}>Clear Results</button>
          </div>
        </div>
      </div>
    </div>
  );
}
