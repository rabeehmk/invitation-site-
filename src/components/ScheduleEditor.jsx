import React from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { SUB_EVENT_PRESETS, createSubEvent } from '../data/invitationModel';

export default function ScheduleEditor({ schedule = [], onChange }) {
  const updateEvent = (id, field, value) => {
    onChange(
      schedule.map((evt) => (evt.id === id ? { ...evt, [field]: value } : evt))
    );
  };

  const handlePresetChange = (id, presetId) => {
    const preset = SUB_EVENT_PRESETS.find((p) => p.id === presetId);
    onChange(
      schedule.map((evt) =>
        evt.id === id
          ? {
              ...evt,
              presetId,
              name: presetId === 'custom' ? evt.name : preset?.label || evt.name
            }
          : evt
      )
    );
  };

  const addEvent = () => {
    onChange([...schedule, createSubEvent({ presetId: 'mehendi', name: 'Mehendi' })]);
  };

  const removeEvent = (id) => {
    onChange(schedule.filter((evt) => evt.id !== id));
  };

  return (
    <div className="schedule-editor">
      <p style={{ fontSize: '12px', opacity: 0.7, margin: '0 0 12px 0' }}>
        Add sub-events for multi-day weddings (Mehendi, Sangeet, Nikah, Reception, etc.)
      </p>

      {schedule.length === 0 && (
        <div className="schedule-empty">
          <Calendar size={24} style={{ opacity: 0.3 }} />
          <p>No sub-events yet. Add functions for multi-day celebrations.</p>
        </div>
      )}

      {schedule.map((evt, idx) => (
        <div key={evt.id} className="schedule-item">
          <div className="schedule-item-header">
            <span>Function {idx + 1}</span>
            <button type="button" className="btn-icon-danger" onClick={() => removeEvent(evt.id)}>
              <Trash2 size={14} />
            </button>
          </div>

          <div className="form-group">
            <label>Event Type</label>
            <select
              value={evt.presetId}
              onChange={(e) => handlePresetChange(evt.id, e.target.value)}
            >
              {SUB_EVENT_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              value={evt.name}
              onChange={(e) => updateEvent(evt.id, 'name', e.target.value)}
              placeholder="e.g. Mehendi Ceremony"
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Date & Start Time</label>
              <input
                type="datetime-local"
                value={evt.date}
                onChange={(e) => updateEvent(evt.id, 'date', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>End Time (optional)</label>
              <input
                type="time"
                value={evt.endTime}
                onChange={(e) => updateEvent(evt.id, 'endTime', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Venue Name</label>
            <input
              type="text"
              value={evt.venue}
              onChange={(e) => updateEvent(evt.id, 'venue', e.target.value)}
              placeholder="e.g. Grand Ballroom"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={evt.address}
              onChange={(e) => updateEvent(evt.id, 'address', e.target.value)}
              placeholder="Full address"
            />
          </div>

          <div className="form-group">
            <label>Maps Link (optional)</label>
            <input
              type="url"
              value={evt.mapLink}
              onChange={(e) => updateEvent(evt.id, 'mapLink', e.target.value)}
              placeholder="https://maps.google.com/..."
            />
          </div>
        </div>
      ))}

      <button type="button" className="btn-secondary-outline" onClick={addEvent}>
        <Plus size={14} /> Add Sub-Event
      </button>
    </div>
  );
}
