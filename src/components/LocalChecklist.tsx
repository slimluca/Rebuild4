"use client";

import { useId, useState } from "react";

export function LocalChecklist({
  title,
  description,
  items,
  privacyNote,
}: {
  title: string;
  description: string;
  items: string[];
  privacyNote: string;
}) {
  const id = useId();
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const complete = checked.filter(Boolean).length;
  const percentage = Math.round((complete / items.length) * 100);

  return (
    <section className="local-checklist" aria-labelledby={`${id}-title`}>
      <div className="checklist-heading">
        <div>
          <p className="eyebrow">Strumento interattivo</p>
          <h2 id={`${id}-title`}>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="checklist-score" aria-live="polite">
          <strong>{percentage}%</strong>
          <span>{complete} di {items.length} controlli</span>
        </div>
      </div>
      <div className="checklist-progress" aria-hidden="true">
        <span style={{ width: `${percentage}%` }} />
      </div>
      <fieldset>
        <legend>Seleziona i controlli già completati</legend>
        <div className="checklist-grid">
          {items.map((item, index) => (
            <label key={item}>
              <input
                checked={checked[index]}
                type="checkbox"
                onChange={(event) => {
                  const isChecked = event.target.checked;
                  setChecked((current) => current.map((value, itemIndex) => (itemIndex === index ? isChecked : value)));
                }}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="checklist-privacy">{privacyNote}</p>
    </section>
  );
}
