import React, { useState } from 'react';
import ReligionSelectScreen from './ReligionSelectScreen';
import TemplateSelectScreen from './TemplateSelectScreen';
import StudioView from './StudioView';
import { createTraditionInvitation } from '../config/index';

export default function BuilderView({ onNavigate, initialReligionId = null }) {
  const [religionId, setReligionId] = useState(initialReligionId);
  const [step, setStep] = useState(initialReligionId ? 'template' : 'religion');
  const [initialState, setInitialState] = useState(null);

  const handleReligionSelect = (id) => {
    setReligionId(id);
    setStep('template');
  };

  const handleTemplateSelect = (templateId) => {
    const state = createTraditionInvitation(religionId, templateId);
    setInitialState(state);
    setStep('studio');
  };

  const handleBackFromTemplate = () => {
    setStep('religion');
    setReligionId(null);
  };

  const handleBackFromStudio = () => {
    setStep('template');
    setInitialState(null);
  };

  if (step === 'religion') {
    return (
      <ReligionSelectScreen
        onSelect={handleReligionSelect}
        onBack={() => onNavigate('home')}
      />
    );
  }

  if (step === 'template') {
    return (
      <TemplateSelectScreen
        religionId={religionId}
        onSelect={handleTemplateSelect}
        onBack={handleBackFromTemplate}
      />
    );
  }

  return (
    <StudioView
      onNavigate={onNavigate}
      initialState={initialState}
      religionId={religionId}
      onBackToTemplates={handleBackFromStudio}
    />
  );
}
