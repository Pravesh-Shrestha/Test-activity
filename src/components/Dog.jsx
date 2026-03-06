import React from 'react';
import './ComponentStyles.css';

export function Dog({ show = true }) {
  if (!show) return null;

  return (
    <div className="guide-dog relative z-50">
      <div className="dog-head">
        <div className="dog-ear left"></div>
        <div className="dog-ear right"></div>
        <div className="dog-eye left"></div>
        <div className="dog-eye right"></div>
        <div className="dog-snout"></div>
        <div className="dog-nose"></div>
        <div className="dog-mouth"></div>
        <div className="dog-tongue"></div>
      </div>
      <div className="dog-body"></div>
      <div className="dog-collar"></div>
      <div className="dog-tag"></div>
      <div className="dog-paw left"></div>
      <div className="dog-paw right"></div>
      <div className="dog-tail"></div>
    </div>
  );
}

export function Guide({ text, show = true }) {
  if (!show) return null;

  return (
    <div className="guide-wrapper">
      <div className="think-cloud">
        {text}
      </div>
      <Dog />
    </div>
  );
}
