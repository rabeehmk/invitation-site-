import React from 'react';
import { getReligion } from '../config/religions';

const FIELD_STATE_MAP = {
  groomParents: 'parentsGroom',
  brideParents: 'parentsBride',
  muhurthamDate: 'date',
  nikahDate: 'date',
  matrimonyDate: 'date',
  eventDate: 'date',
  templeVenue: 'venueName',
  mosqueVenue: 'venueName',
  churchName: 'venueName',
  venueName: 'venueName',
  hostNames: 'names'
};

function getFieldValue(formState, fieldId) {
  const stateKey = FIELD_STATE_MAP[fieldId] || fieldId;
  return formState[stateKey] ?? formState[fieldId] ?? '';
}

export default function ReligionFieldsEditor({ religionId, formState, onChange, onBatchChange }) {
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

        if (field.id === 'groomName' || field.id === 'brideName' || field.id === 'hostNames') {
          const groom = field.id === 'groomName' ? v : formState.groomName;
          const bride = field.id === 'brideName' ? v : formState.brideName;
          const host = field.id === 'hostNames' ? v : formState.hostNames;
          if (groom || bride) updates.names = [groom, bride].filter(Boolean).join(' & ');
          else if (host) updates.names = host;
        }
        if (['muhurthamDate', 'nikahDate', 'matrimonyDate', 'eventDate'].includes(field.id)) {
          updates.date = v;
        }
        if (['templeVenue', 'mosqueVenue', 'churchName', 'venueName'].includes(field.id)) {
          updates.venueName = v;
        }
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
        .map((group) => (
          <div key={group.id} className="religion-field-group">
            <h4 className="studio-subsection-title">{group.label}</h4>
            {group.fields.map(renderField)}
          </div>
        ))}
    </div>
  );
}
