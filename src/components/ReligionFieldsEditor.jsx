import React from 'react';
import { getReligion } from '../config/religions';

const FIELD_STATE_MAP = {
  groomParents: 'parentsGroom',
  brideParents: 'parentsBride',
  muhurthamDate: 'date',
  nikahDate: 'date',
  matrimonyDate: 'date',
  anandKarajDate: 'date',
  eventDate: 'date',
  templeVenue: 'venueName',
  mosqueVenue: 'venueName',
  churchName: 'venueName',
  gurdwaraName: 'venueName',
  venueName: 'venueName',
  hostNames: 'names',
  eventTitle: 'title'
};

const DATE_FIELDS = ['muhurthamDate', 'nikahDate', 'matrimonyDate', 'anandKarajDate', 'eventDate'];
const VENUE_FIELDS = ['templeVenue', 'mosqueVenue', 'churchName', 'gurdwaraName', 'venueName'];

/** Fields a couple must fill: names, main date and venue */
export function isEssentialField(field) {
  return !!field.required || VENUE_FIELDS.includes(field.id);
}

function getFieldValue(formState, fieldId) {
  const stateKey = FIELD_STATE_MAP[fieldId] || fieldId;
  return formState[stateKey] ?? formState[fieldId] ?? '';
}

/** mode: 'all' | 'essential' (names, date, venue) | 'optional' (everything else) */
export default function ReligionFieldsEditor({ religionId, formState, onChange, onBatchChange, mode = 'all' }) {
  const religion = getReligion(religionId);
  if (!religion?.fieldGroups) return null;

  const renderField = (field) => {
    const value = getFieldValue(formState, field.id);
    const common = {
      id: field.id,
      value,
      onChange: (e) => {
        const v = field.type === 'boolean' ? e.target.checked : e.target.value;
        const updates = { [field.id]: v };

        if (field.id === 'hostNames') {
          // The field being typed in wins over leftover sample groom/bride names
          updates.names = v;
        } else if (field.id === 'groomName' || field.id === 'brideName') {
          const groom = field.id === 'groomName' ? v : formState.groomName;
          const bride = field.id === 'brideName' ? v : formState.brideName;
          updates.names = [groom, bride].filter(Boolean).join(' & ');
        }
        if (DATE_FIELDS.includes(field.id)) {
          updates.date = v;
        }
        if (VENUE_FIELDS.includes(field.id)) {
          updates.venueName = v;
        }
        if (field.id === 'eventTitle') updates.title = v;
        if (field.id === 'groomParents') updates.parentsGroom = v;
        if (field.id === 'brideParents') updates.parentsBride = v;

        if (onBatchChange && Object.keys(updates).length > 1) {
          onBatchChange(updates);
        } else {
          Object.entries(updates).forEach(([k, val]) => onChange(k, val));
        }
      }
    };

    if (field.type === 'boolean') {
      return (
        <label key={field.id} className="customize-toggle-row">
          <span>{field.label}</span>
          <input type="checkbox" checked={!!value} onChange={common.onChange} />
        </label>
      );
    }

    if (field.type === 'datetime') {
      return (
        <div key={field.id} className="form-group">
          <label htmlFor={field.id}>{field.label}{field.required ? ' *' : ''}</label>
          <input id={field.id} type="datetime-local" {...common} />
        </div>
      );
    }

    return (
      <div key={field.id} className="form-group">
        <label htmlFor={field.id}>{field.label}{field.required ? ' *' : ''}{field.private ? ' (private)' : ''}</label>
        <input
          id={field.id}
          type="text"
          placeholder={field.placeholder || ''}
          {...common}
        />
      </div>
    );
  };

  return (
    <div className="religion-fields">
      {religion.fieldGroups
        .filter((g) => g.type !== 'schedule')
        .map((group) => {
          const fields = group.fields.filter((f) =>
            mode === 'all' ? true : mode === 'essential' ? isEssentialField(f) : !isEssentialField(f)
          );
          if (!fields.length) return null;
          return (
            <div key={group.id} className="religion-field-group">
              {mode !== 'essential' && <h4 className="studio-subsection-title">{group.label}</h4>}
              {fields.map(renderField)}
            </div>
          );
        })}
    </div>
  );
}
