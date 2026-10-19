import React from 'react';
import { MapPin, Train, Bus, Phone, AlertTriangle, Navigation, Heart, User } from 'lucide-react';

function EventLocationCard({ title, icon: Icon, accentClass, venueName, address, mapLink, isPreviewMode }) {
  if (!venueName && !address && !mapLink) return null;
  return (
    <div className={`event-location-card ${accentClass}`}>
      <div className="event-location-header">
        <Icon size={16} />
        <strong>{title}</strong>
      </div>
      {venueName && <p className="event-location-venue">{venueName}</p>}
      {address && <p className="event-location-address">{address}</p>}
      {mapLink && (
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-theme-outline event-location-map-btn"
          style={{ pointerEvents: isPreviewMode ? 'none' : 'auto' }}
        >
          <Navigation size={12} /> Get Directions
        </a>
      )}
    </div>
  );
}

export default function DirectionsSection({
  nearestStation,
  nearestBusStand,
  emergencyContact,
  brideEventName,
  brideEventVenue,
  brideEventAddress,
  brideEventMapLink,
  groomEventName,
  groomEventVenue,
  groomEventAddress,
  groomEventMapLink,
  brideSideContact,
  groomSideContact,
  mapLink,
  showBrideGroomEvents = true,
  isPreviewMode = false
}) {
  const hasTravel = nearestStation || nearestBusStand || emergencyContact;
  const hasBrideEvent = showBrideGroomEvents && (brideEventVenue || brideEventAddress || brideEventMapLink);
  const hasGroomEvent = showBrideGroomEvents && (groomEventVenue || groomEventAddress || groomEventMapLink);
  const hasSideContacts = brideSideContact || groomSideContact;

  if (!hasTravel && !hasBrideEvent && !hasGroomEvent && !hasSideContacts && !mapLink) return null;

  return (
    <div className="guest-card-panel animate-fade-in-up animate-delay-3">
      <h3>
        <MapPin size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
        How to Reach & Contacts
      </h3>

      {hasTravel && (
        <div className="directions-travel-grid">
          {nearestStation && (
            <div className="direction-item">
              <Train size={16} className="direction-icon" />
              <div>
                <span className="direction-label">Nearest Railway / Metro</span>
                <p className="direction-value">{nearestStation}</p>
              </div>
            </div>
          )}
          {nearestBusStand && (
            <div className="direction-item">
              <Bus size={16} className="direction-icon" />
              <div>
                <span className="direction-label">Nearest Bus / Auto Stand</span>
                <p className="direction-value">{nearestBusStand}</p>
              </div>
            </div>
          )}
          {emergencyContact && (
            <div className="direction-item direction-emergency">
              <AlertTriangle size={16} className="direction-icon" />
              <div>
                <span className="direction-label">Emergency Contact</span>
                <a href={`tel:${emergencyContact}`} className="direction-value contact-link">
                  {emergencyContact}
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {(hasBrideEvent || hasGroomEvent) && (
        <div className="event-locations-grid">
          <EventLocationCard
            title={brideEventName || "Bride's Event"}
            icon={Heart}
            accentClass="bride-event"
            venueName={brideEventVenue}
            address={brideEventAddress}
            mapLink={brideEventMapLink}
            isPreviewMode={isPreviewMode}
          />
          <EventLocationCard
            title={groomEventName || "Groom's Event"}
            icon={User}
            accentClass="groom-event"
            venueName={groomEventVenue}
            address={groomEventAddress}
            mapLink={groomEventMapLink}
            isPreviewMode={isPreviewMode}
          />
        </div>
      )}

      {(brideSideContact || groomSideContact) && (
        <div className="directions-side-contacts">
          {brideSideContact && (
            <div className="side-contact-card bride-side">
              <strong>Bride&apos;s Side Contact</strong>
              <a href={`tel:${brideSideContact}`} className="contact-link">
                <Phone size={12} /> {brideSideContact}
              </a>
            </div>
          )}
          {groomSideContact && (
            <div className="side-contact-card groom-side">
              <strong>Groom&apos;s Side Contact</strong>
              <a href={`tel:${groomSideContact}`} className="contact-link">
                <Phone size={12} /> {groomSideContact}
              </a>
            </div>
          )}
        </div>
      )}

      {mapLink && (
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-theme-outline"
          style={{ marginTop: '12px', pointerEvents: isPreviewMode ? 'none' : 'auto' }}
        >
          <Navigation size={14} style={{ marginRight: '6px' }} />
          Main Venue — Open in Google Maps
        </a>
      )}
    </div>
  );
}

function LocationFields({ prefix, label, accentClass, formState, onChange }) {
  const fields = {
    name: `${prefix}EventName`,
    venue: `${prefix}EventVenue`,
    address: `${prefix}EventAddress`,
    map: `${prefix}EventMapLink`
  };

  return (
    <div className={`location-fields-block ${accentClass}`}>
      <h4 className="location-fields-title">{label}</h4>
      <div className="form-group">
        <label>Event Name</label>
        <input
          type="text"
          placeholder="e.g. Mehendi / Reception / Nikah"
          value={formState[fields.name] || ''}
          onChange={(e) => onChange(fields.name, e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Venue Name</label>
        <input
          type="text"
          placeholder="e.g. Taj Convention Centre"
          value={formState[fields.venue] || ''}
          onChange={(e) => onChange(fields.venue, e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Full Address</label>
        <input
          type="text"
          placeholder="Street, landmark, city, pin code"
          value={formState[fields.address] || ''}
          onChange={(e) => onChange(fields.address, e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Google Maps Link</label>
        <input
          type="url"
          placeholder="https://maps.google.com/?q=..."
          value={formState[fields.map] || ''}
          onChange={(e) => onChange(fields.map, e.target.value)}
        />
      </div>
    </div>
  );
}

/** Studio editor for travel & event location fields */
export function TravelDirectionsEditor({ formState, onChange }) {
  return (
    <div className="travel-editor">
      <h3 className="studio-section-title">Travel & Directions</h3>
      <p className="studio-section-desc">
        Add how guests can reach you — stations, contacts, and separate locations for bride & groom events.
      </p>

      <div className="studio-subsection">
        <h4 className="studio-subsection-title">General Travel Info</h4>
        <div className="form-group">
          <label htmlFor="nearestStation">Nearest Railway / Metro Station</label>
          <input
            id="nearestStation"
            type="text"
            placeholder="e.g. Kozhikode Railway Station (2 km)"
            value={formState.nearestStation}
            onChange={(e) => onChange('nearestStation', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="nearestBusStand">Nearest Bus / Auto Stand</label>
          <input
            id="nearestBusStand"
            type="text"
            placeholder="e.g. Palayam Bus Stand (500 m from venue)"
            value={formState.nearestBusStand}
            onChange={(e) => onChange('nearestBusStand', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="emergencyContact">Emergency Contact</label>
          <input
            id="emergencyContact"
            type="tel"
            placeholder="e.g. +91 9876543210"
            value={formState.emergencyContact}
            onChange={(e) => onChange('emergencyContact', e.target.value)}
          />
        </div>
      </div>

      <div className="studio-subsection">
        <h4 className="studio-subsection-title">Side Contacts</h4>
        <div className="form-row-2">
          <div className="form-group">
            <label htmlFor="brideSideContact">Bride Side Contact</label>
            <input
              id="brideSideContact"
              type="tel"
              placeholder="WhatsApp / phone"
              value={formState.brideSideContact}
              onChange={(e) => onChange('brideSideContact', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="groomSideContact">Groom Side Contact</label>
            <input
              id="groomSideContact"
              type="tel"
              placeholder="WhatsApp / phone"
              value={formState.groomSideContact}
              onChange={(e) => onChange('groomSideContact', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="studio-subsection">
        <h4 className="studio-subsection-title">Bride & Groom Event Locations</h4>
        <p className="studio-section-desc" style={{ marginBottom: '12px' }}>
          Add venue details for each side&apos;s functions — no image upload needed, just location & maps link.
        </p>
        <LocationFields
          prefix="bride"
          label="Bride's Event Location"
          accentClass="bride-fields"
          formState={formState}
          onChange={onChange}
        />
        <LocationFields
          prefix="groom"
          label="Groom's Event Location"
          accentClass="groom-fields"
          formState={formState}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
