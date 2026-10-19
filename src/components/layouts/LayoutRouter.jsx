import React from 'react';
import { getTemplateById } from '../../config/index';
import { getReligion } from '../../config/religions';
import { isLightBackground } from '../../utils/colorUtils';
import MotifBackground from '../tradition/MotifBackground';
import { useLayoutContext } from './layoutUtils';
import HeroFullBleed from './HeroFullBleed';
import SplitScreen from './SplitScreen';
import CardOnCanvas from './CardOnCanvas';
import TypographyMinimal from './TypographyMinimal';
import IllustratedStorybook from './IllustratedStorybook';

const LAYOUTS = {
  'full-bleed': HeroFullBleed,
  split: SplitScreen,
  'card-canvas': CardOnCanvas,
  'typography-minimal': TypographyMinimal,
  illustrated: IllustratedStorybook
};

export default function LayoutRouter({ state, hijriDate, hasFamilyDetails, coverPhotoUrl }) {
  const template = getTemplateById(state.templateId || state.selectedTemplateId);
  const ctx = useLayoutContext(state, template, hijriDate, hasFamilyDetails);
  const Component = LAYOUTS[ctx.structure] || CardOnCanvas;
  const religionConfig = getReligion(state.religion || 'custom');
  const isLight = isLightBackground(ctx.palette?.bg || '#fff8f0');

  return (
    <div className={`layout-root layout-root--${ctx.structure} religion-${state.religion || 'custom'} ${isLight ? '' : 'layout-root--dark'}`}>
      <MotifBackground religion={religionConfig} accentColor={ctx.accent} isLight={isLight} />
      <Component state={state} ctx={ctx} coverPhotoUrl={coverPhotoUrl} />
    </div>
  );
}

export { useLayoutContext };
