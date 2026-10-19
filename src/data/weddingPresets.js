/**
 * Authentic, culturally rich wedding data presets.
 * Supplies realistic demo data for every tradition and modern styles.
 */

// Helper to compute future dates dynamically so countdown timer is always active
export function getFutureDate(daysAhead = 55, hours = 9, minutes = 30) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(hours, minutes, 0, 0);
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hh}:${mm}`;
}

export const CURATED_GALLERY = [
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop&q=80'
];

export const WEDDING_PRESETS = {
  hindu: {
    religion: 'hindu',
    groomName: 'Aditya Menon',
    brideName: 'Ananya Nambiar',
    names: 'Aditya & Ananya',
    title: 'The Sacred Wedding Celebration of Aditya & Ananya',
    date: getFutureDate(55, 9, 30),
    endDate: getFutureDate(55, 13, 0),
    venueName: 'Sree Krishna Temple Auditorium, Guruvayur',
    venue: 'West Nada, Guruvayur, Thrissur, Kerala 680101',
    mapLink: 'https://maps.google.com/?q=Guruvayur+Temple+Auditorium',
    message: 'With the divine grace of Lord Guruvayurappan and the loving blessings of our families and elders, we cordially invite you to celebrate our sacred Muhurtham and the beginning of our new journey together.',
    parentsGroom: 'Shri. K. Rajan Menon & Smt. Radha Menon',
    parentsBride: 'Shri. P. Mohan Nambiar & Smt. Geetha Nambiar',
    familyGroom: 'The Menon Family, Calicut',
    familyBride: 'The Nambiar Family, Kannur',
    nakshatra: 'Rohini (Groom) · Makam (Bride)',
    gothram: 'Kashyapa',
    blessingText: 'May Lord Guruvayurappan remove all obstacles and bless this auspicious union with eternal love, harmony, health, and prosperity.',
    coupleStory: 'Two souls brought together by tradition, destiny, and countless shared laughs over steaming cups of filter coffee in Kochi. From our very first family introduction to long sunlit conversations and shared dreams, we discovered a bond that feels like coming home. We cannot wait to take our seven sacred steps together surrounded by the warmth of our loved ones.',
    dressCode: 'Muhurtham: Traditional Kasavu Mundu & Kanchipuram Silk Sarees\nSangeet: Pastel Glamour & Indo-Western\nGrand Reception: Royal Ethnic & Festive Silks',
    giftNote: 'Your presence, heartfelt blessings, and warm smiles are the greatest gifts we could ever ask for. (No boxed gifts, please)',
    liveStreamUrl: 'https://www.youtube.com/live/aditya-ananya-wedding',
    accommodationInfo: 'Complimentary stay arranged at Grand Regency Hotel, Guruvayur (Check-in: 12:00 PM). Please contact our guest hospitality desk at +91 98470 12345 for assistance.',
    nearestStation: 'Guruvayur Railway Station (1.2 km) / Thrissur Junction (28 km)',
    nearestBusStand: 'Guruvayur KSRTC Bus Stand (800 m)',
    emergencyContact: '+91 98470 54321',
    contactName: 'Rajesh Menon (Brother)',
    contactPhone: '+91 98470 12345',
    rsvpPhone: '+91 98470 12345',
    audioTrack: 'kerala-wedding',
    audioEnabled: true,
    galleryPhotos: CURATED_GALLERY,
    schedule: [
      {
        id: 'evt-hindu-1',
        presetId: 'haldi',
        name: 'Haldi & Mehendi Celebration',
        date: getFutureDate(53, 16, 0),
        endTime: '20:30',
        venue: 'The Palms Garden Lawn, Guruvayur',
        address: 'Temple Road, Guruvayur, Kerala',
        mapLink: 'https://maps.google.com/?q=Guruvayur'
      },
      {
        id: 'evt-hindu-2',
        presetId: 'sangeet',
        name: 'Sangeet & Musical Evening',
        date: getFutureDate(54, 18, 30),
        endTime: '23:00',
        venue: 'Orchid Banquet Ballroom',
        address: 'East Fort, Thrissur, Kerala',
        mapLink: 'https://maps.google.com/?q=Thrissur'
      },
      {
        id: 'evt-hindu-3',
        presetId: 'wedding',
        name: 'Sacred Muhurtham (Thalikettu)',
        date: getFutureDate(55, 9, 30),
        endTime: '11:30',
        venue: 'Sree Krishna Temple Auditorium',
        address: 'West Nada, Guruvayur, Kerala',
        mapLink: 'https://maps.google.com/?q=Guruvayur+Temple'
      },
      {
        id: 'evt-hindu-4',
        presetId: 'reception',
        name: 'Grand Wedding Reception & Traditional Sadya',
        date: getFutureDate(55, 12, 30),
        endTime: '16:00',
        venue: 'Grand Hyatt Bolgatty Palace',
        address: 'Mulavukad, Kochi, Kerala 682504',
        mapLink: 'https://maps.google.com/?q=Grand+Hyatt+Kochi'
      }
    ]
  },

  muslim: {
    religion: 'muslim',
    groomName: 'Farhan Ahmed',
    brideName: 'Ayesha Rahman',
    names: 'Farhan & Ayesha',
    title: 'The Sacred Nikah Ceremony of Farhan & Ayesha',
    date: getFutureDate(55, 11, 0),
    endDate: getFutureDate(55, 14, 30),
    venueName: 'Al-Ameen Grand Convention Centre, Calicut',
    venue: 'Mini Bypass Road, Govindapuram, Kozhikode, Kerala 673016',
    mapLink: 'https://maps.google.com/?q=Al-Ameen+Convention+Centre+Calicut',
    message: 'By the grace and mercy of Allah (SWT), we cordially invite you to witness our Nikah ceremony and grace this blessed occasion with your presence and heartfelt duas.',
    parentsGroom: 'Janab Mohammed Ahmed & Smt. Fatima Beevi',
    parentsBride: 'Janab Abdul Rahman & Smt. Zeenath Rahman',
    familyGroom: 'The Ahmed Family, Kozhikode',
    familyBride: 'The Rahman Family, Malappuram',
    showHijriDate: true,
    blessingText: '“And among His signs is that He created for you mates from among yourselves that you may dwell in tranquility with them; and He placed between you love and mercy.” (Surah Ar-Rum 30:21)',
    coupleStory: 'Guided by faith, destiny, and the gentle prayers of our parents, our lives intertwined in the most beautiful manner. Built upon shared values of kindness, mutual respect, and spiritual companionship, our bond grew into a deep and lasting friendship. With gratitude to the Almighty, we embark on this sacred chapter of life together.',
    dressCode: 'Nikah: Traditional Modest Formal / Sherwanis & Embroidered Kurtas\nWalima: Formal Suits, Anarkalis & Festive Sarees',
    giftNote: 'Your prayers, duas, and gracious presence are our most cherished blessing. (No boxed gifts requested)',
    liveStreamUrl: 'https://www.youtube.com/live/farhan-ayesha-nikah',
    accommodationInfo: 'Rooms reserved at The Gateway Hotel Beach Road, Kozhikode. For airport transfer or check-in assistance, please contact Janab Tariq at +91 98471 23456.',
    nearestStation: 'Kozhikode Main Railway Station (3.5 km)',
    nearestBusStand: 'Palayam KSRTC Terminal (2.8 km)',
    emergencyContact: '+91 98471 65432',
    contactName: 'Tariq Ahmed (Brother)',
    contactPhone: '+91 98471 23456',
    rsvpPhone: '+91 98471 23456',
    audioTrack: 'divine-flute',
    audioEnabled: true,
    galleryPhotos: CURATED_GALLERY,
    schedule: [
      {
        id: 'evt-muslim-1',
        presetId: 'haldi',
        name: 'Manji & Henna Night',
        date: getFutureDate(54, 17, 0),
        endTime: '21:00',
        venue: 'Rahman Villa Lawns',
        address: 'Down Hill, Malappuram, Kerala',
        mapLink: 'https://maps.google.com/?q=Malappuram'
      },
      {
        id: 'evt-muslim-2',
        presetId: 'nikah',
        name: 'Sacred Nikah Ceremony',
        date: getFutureDate(55, 11, 0),
        endTime: '13:00',
        venue: 'Al-Ameen Grand Convention Centre',
        address: 'Govindapuram, Kozhikode, Kerala',
        mapLink: 'https://maps.google.com/?q=Al-Ameen+Convention+Centre+Calicut'
      },
      {
        id: 'evt-muslim-3',
        presetId: 'reception',
        name: 'Grand Walima Feast & Dinner',
        date: getFutureDate(56, 19, 0),
        endTime: '22:30',
        venue: 'Le Méridien Grand Ballroom',
        address: 'Maradu, Kochi, Kerala 682304',
        mapLink: 'https://maps.google.com/?q=Le+Meridien+Kochi'
      }
    ]
  },

  christian: {
    religion: 'christian',
    groomName: 'Ethan Matthew',
    brideName: 'Maria Rose',
    names: 'Ethan & Maria',
    title: 'The Holy Matrimony of Ethan & Maria',
    date: getFutureDate(55, 10, 30),
    endDate: getFutureDate(55, 15, 0),
    venueName: 'St. Mary\'s Cathedral Basilica, Ernakulam',
    venue: 'Marine Drive, Broadway, Ernakulam, Kochi, Kerala 682031',
    mapLink: 'https://maps.google.com/?q=St+Marys+Cathedral+Basilica+Ernakulam',
    message: 'With grateful hearts and joy in Christ, we request the honour of your presence at our Holy Matrimony and celebratory reception dinner as we exchange our sacred vows before God and family.',
    parentsGroom: 'Mr. Thomas Matthew & Mrs. Susan Thomas',
    parentsBride: 'Mr. Joseph George & Mrs. Shiny Joseph',
    familyGroom: 'The Matthew Family, Kottayam',
    familyBride: 'The Joseph Family, Ernakulam',
    officiantName: 'Rev. Fr. George Jacob',
    showCrossMotif: true,
    blessingText: '“Love is patient, love is kind. It always protects, always trusts, always hopes, always perseveres. Love never fails.” (1 Corinthians 13:4-8)',
    coupleStory: 'Our journey began on a rainy monsoon evening overlooking Marine Drive, bonded by a shared love for music, deep conversations, and hearty laughter. Over five memorable years, God nurtured our friendship into an enduring covenant of love. We rejoice in the gift of each other and look forward to building our future side by side.',
    dressCode: 'Church Nuptials: Formal Church Attire / Elegant Sarees\nReception: Black Tie / Cocktail Evening Wear',
    giftNote: 'Your presence and prayers are the greatest blessing to our new beginning. A wishing well will be present at the reception.',
    liveStreamUrl: 'https://www.youtube.com/live/ethan-maria-matrimony',
    accommodationInfo: 'Rooms arranged at Olive Downtown, Kadavanthra. Please reach out to Mr. Kevin Matthew at +91 98472 34567 for room keys and shuttle timings.',
    nearestStation: 'Ernakulam South Railway Station (1.8 km)',
    nearestBusStand: 'KSRTC Central Bus Stand, Ernakulam (2.5 km)',
    emergencyContact: '+91 98472 76543',
    contactName: 'Kevin Matthew (Best Man)',
    contactPhone: '+91 98472 34567',
    rsvpPhone: '+91 98472 34567',
    audioTrack: 'romantic-piano',
    audioEnabled: true,
    galleryPhotos: CURATED_GALLERY,
    schedule: [
      {
        id: 'evt-chr-1',
        presetId: 'custom',
        name: 'Madhuramveppu (Eve of Nuptials)',
        date: getFutureDate(54, 18, 0),
        endTime: '21:30',
        venue: 'Matthew Heritage Villa',
        address: 'Baker Hill, Kottayam, Kerala',
        mapLink: 'https://maps.google.com/?q=Kottayam'
      },
      {
        id: 'evt-chr-2',
        presetId: 'wedding',
        name: 'Holy Matrimony Nuptial Mass',
        date: getFutureDate(55, 10, 30),
        endTime: '12:30',
        venue: 'St. Mary\'s Cathedral Basilica',
        address: 'Marine Drive, Ernakulam, Kochi',
        mapLink: 'https://maps.google.com/?q=St+Marys+Cathedral+Basilica+Ernakulam'
      },
      {
        id: 'evt-chr-3',
        presetId: 'reception',
        name: 'Gala Wedding Reception & Dinner',
        date: getFutureDate(55, 13, 0),
        endTime: '17:00',
        venue: 'Grand Hyatt Bolgatty Ballroom',
        address: 'Mulavukad, Kochi, Kerala 682504',
        mapLink: 'https://maps.google.com/?q=Grand+Hyatt+Kochi'
      }
    ]
  },

  sikh: {
    religion: 'sikh',
    groomName: 'Harpreet Singh',
    brideName: 'Jaspreet Kaur',
    names: 'Harpreet & Jaspreet',
    title: 'The Sacred Anand Karaj of Harpreet & Jaspreet',
    date: getFutureDate(55, 10, 0),
    endDate: getFutureDate(55, 14, 0),
    venueName: 'Gurdwara Sri Guru Singh Sabha',
    venue: 'Marine Drive / GT Road, Heritage Complex',
    mapLink: 'https://maps.google.com/?q=Gurdwara+Sahib',
    message: 'In the divine presence of Sri Guru Granth Sahib Ji, we joyfully invite you to witness our sacred Anand Karaj ceremony and bless our union with your love and presence.',
    parentsGroom: 'Sardar Manjit Singh & Sardarni Kuldeep Kaur',
    parentsBride: 'Sardar Gurmukh Singh & Sardarni Harjit Kaur',
    familyGroom: 'The Singh Family',
    familyBride: 'The Kaur Family',
    blessingText: '“They are not said to be husband and wife, who merely sit together. Rather they alone are called husband and wife, who have one soul in two bodies.” (Guru Amar Das Ji)',
    coupleStory: 'Two souls brought together with the grace of Waheguru and the love of our families. We are blessed to begin our sacred journey of four Laavan together.',
    dressCode: 'Anand Karaj: Traditional Punjabi Attire (Head covering mandatory inside Gurdwara)\nReception: Royal Evening Ethnic & Tuxedos',
    giftNote: 'Your warm presence and heartfelt blessings are the only gifts we cherish.',
    liveStreamUrl: 'https://www.youtube.com/live/harpreet-jaspreet-anandkaraj',
    accommodationInfo: 'Stay arranged at Radisson Blu Hotel. Hospitality desk available for all guests.',
    nearestStation: 'Main Railway Station (2.5 km)',
    nearestBusStand: 'Central Bus Terminal (1.5 km)',
    emergencyContact: '+91 98473 87654',
    contactName: 'Amanpreet Singh',
    contactPhone: '+91 98473 12345',
    rsvpPhone: '+91 98473 12345',
    audioTrack: 'peaceful-naad',
    audioEnabled: true,
    galleryPhotos: CURATED_GALLERY,
    schedule: [
      {
        id: 'evt-sikh-1',
        presetId: 'sangeet',
        name: 'Roka & Sangeet Night',
        date: getFutureDate(53, 18, 30),
        endTime: '23:30',
        venue: 'Royal Orchid Banquets',
        address: 'Palace Road',
        mapLink: 'https://maps.google.com'
      },
      {
        id: 'evt-sikh-2',
        presetId: 'haldi',
        name: 'Maiyan & Chooda Ceremony',
        date: getFutureDate(54, 10, 0),
        endTime: '13:00',
        venue: 'Bride\'s Residence',
        address: 'Kaur Villa',
        mapLink: 'https://maps.google.com'
      },
      {
        id: 'evt-sikh-3',
        presetId: 'wedding',
        name: 'Sacred Anand Karaj (Four Laavan)',
        date: getFutureDate(55, 10, 0),
        endTime: '12:30',
        venue: 'Gurdwara Sri Guru Singh Sabha',
        address: 'Heritage Complex',
        mapLink: 'https://maps.google.com'
      },
      {
        id: 'evt-sikh-4',
        presetId: 'reception',
        name: 'Grand Wedding Reception & Dinner',
        date: getFutureDate(55, 19, 0),
        endTime: '23:00',
        venue: 'Radisson Blu Grand Ballroom',
        address: 'City Center',
        mapLink: 'https://maps.google.com'
      }
    ]
  },

  custom: {
    religion: 'custom',
    groomName: 'Kabir Roy',
    brideName: 'Meera Kapoor',
    names: 'Kabir & Meera',
    title: 'The Wedding Celebration of Kabir & Meera',
    date: getFutureDate(60, 17, 30),
    endDate: getFutureDate(60, 23, 0),
    venueName: 'The Grand Waterfront Palace Heritage Resort',
    venue: 'Palace Island, Lake View Boulevard, Kochi / Udaipur',
    mapLink: 'https://maps.google.com/?q=Waterfront+Palace',
    message: 'We are getting married! Join us under the twilight sky for an enchanting celebration of love, music, laughter, and timeless memories.',
    parentsGroom: 'Mr. Vikram Roy & Mrs. Nandini Roy',
    parentsBride: 'Mr. Sanjay Kapoor & Mrs. Sunita Kapoor',
    familyGroom: 'The Roy Family',
    familyBride: 'The Kapoor Family',
    blessingText: '“Whatever our souls are made of, his and mine are the same.” — Emily Brontë',
    coupleStory: 'From college library study breaks to exploring cities across the world, we found our greatest adventure in each other. Join us as we dance into our forever.',
    dressCode: 'Welcome Sundowner: Breezy Pastels\nExchange of Vows & Dinner: Black-Tie & Royal Glamour',
    giftNote: 'Your presence at our celebration is the only present we request.',
    liveStreamUrl: 'https://www.youtube.com/live/kabir-meera-wedding',
    accommodationInfo: 'Luxury lakeside suites reserved for all traveling guests. Shuttle service operating from airport.',
    nearestStation: 'Central Railway Station (6 km)',
    nearestBusStand: 'Main Bus Terminal (4 km)',
    emergencyContact: '+91 98474 98765',
    contactName: 'Rohit Kapoor',
    contactPhone: '+91 98474 12345',
    rsvpPhone: '+91 98474 12345',
    audioTrack: 'golden-vows',
    audioEnabled: true,
    galleryPhotos: CURATED_GALLERY,
    schedule: [
      {
        id: 'evt-cust-1',
        presetId: 'custom',
        name: 'Sunset Welcome Cocktails',
        date: getFutureDate(59, 17, 30),
        endTime: '21:00',
        venue: 'Lakeside Pier Lawn',
        address: 'Waterfront Palace',
        mapLink: 'https://maps.google.com'
      },
      {
        id: 'evt-cust-2',
        presetId: 'wedding',
        name: 'Exchange of Vows & Rings',
        date: getFutureDate(60, 17, 30),
        endTime: '19:00',
        venue: 'The Palace Amphitheatre',
        address: 'Waterfront Palace',
        mapLink: 'https://maps.google.com'
      },
      {
        id: 'evt-cust-3',
        presetId: 'reception',
        name: 'Gala Dinner, Toast & Fireworks',
        date: getFutureDate(60, 19, 30),
        endTime: '23:30',
        venue: 'Grand Crystal Pavilion',
        address: 'Waterfront Palace',
        mapLink: 'https://maps.google.com'
      }
    ]
  }
};

export function getPresetForReligion(religionId = 'hindu') {
  return WEDDING_PRESETS[religionId] || WEDDING_PRESETS.hindu;
}
