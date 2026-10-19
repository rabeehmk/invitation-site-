/**
 * Culturally accurate, religion-specific copy — not generic "with the blessings of".
 */
export const RELIGION_LABELS = {
  hindu: {
    invitationBadge: 'Muhurtham Invitation',
    ceremonyName: 'Muhurtham',
    familyIntro: 'With the blessings of our elders',
    groomParentLabel: 'S/o',
    brideParentLabel: 'D/o',
    scrollHint: 'Scroll for celebration details',
    dateLabel: 'Auspicious Date'
  },
  muslim: {
    invitationBadge: 'Nikah Invitation',
    ceremonyName: 'Nikah',
    familyIntro: 'By the grace of Allah',
    groomParentLabel: 'S/o',
    brideParentLabel: 'D/o',
    scrollHint: 'Scroll for Walima & venue details',
    dateLabel: 'Nikah Date'
  },
  christian: {
    invitationBadge: 'Holy Matrimony',
    ceremonyName: 'Holy Matrimony',
    familyIntro: 'With joy in Christ',
    groomParentLabel: 'Son of',
    brideParentLabel: 'Daughter of',
    scrollHint: 'Scroll to celebrate with us',
    dateLabel: 'Ceremony Date'
  },
  sikh: {
    invitationBadge: 'Anand Karaj Invitation',
    ceremonyName: 'Anand Karaj',
    familyIntro: 'With Waheguru Ji’s grace',
    groomParentLabel: 'S/o',
    brideParentLabel: 'D/o',
    scrollHint: 'Scroll for ceremony details',
    dateLabel: 'Anand Karaj Date'
  },
  custom: {
    invitationBadge: 'You Are Invited',
    ceremonyName: 'Celebration',
    familyIntro: 'Hosted by',
    groomParentLabel: 'From',
    brideParentLabel: 'And',
    scrollHint: 'Scroll for details',
    dateLabel: 'Date'
  }
};

export function getReligionLabels(religionId) {
  return RELIGION_LABELS[religionId] || RELIGION_LABELS.custom;
}
