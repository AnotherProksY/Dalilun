const en = {
  nav: {
    about: 'About',
    path: 'Path',
    aiMentor: 'AI Mentor',
    vr: '3D/VR',
  },
  hero: {
    title: 'Your Personal Path in Islam',
    subtitle: 'A digital ecosystem for Muslims:\u00A0from your first questions about faith to preparing for Hajj and Umrah, all in one place',
    cta: 'Start My Journey',
  },
  weHelp: {
    heading: 'Who do we help?',
    cards: [
      {
        tag: 'New Muslims',
        title: 'Just entered Islam and don\'t know where to begin?',
        text: 'We will create your personal roadmap: "from Shahada to Hajj". Step by step, at your own pace',
      },
      {
        tag: 'Young Muslims',
        title: 'Want to strengthen your Iman and stay connected to tradition?',
        text: 'You know faith matters, but you\'re afraid to make mistakes in prayer or the basics. Our AI mentor answers without judgment 24/7',
      },
      {
        tag: 'Preparing for Hajj or Umrah',
        title: 'Want to perform pilgrimage but don\'t understand the order?',
        text: 'Our 3D/VR guide recreates the rituals so you can prepare in advance without fear of making mistakes in a sacred place',
      },
    ],
  },
  simpleCtaBlock: {
    title: 'With us, the complex becomes simple',
    cta: 'Start My Journey',
  },
  contactForm: {
    title: 'Join Dalilun',
    formLabel: 'Application Form',
    contactPlaceholder: 'Email or @telegram*',
    namePlaceholder: 'What should we call you?',
    goalPlaceholder: 'What interests you most?*',
    goalOptions: ['Learning Islam', 'Preparing for Pilgrimage', 'I want to learn about the project'],
    consent: 'I give ',
    consentLink: 'consent to personal data processing',
    submit: 'Start My Journey',
    sideText: 'Leave your contact — we\'ll tell you about the launch first',
    successMessage: 'Thank you! We will contact you.',
    successTitle: 'Your contacts have been sent',
    successSubtitle: 'We will keep you up to date',
    successButton: 'OK',
    errorMessage: 'An error occurred. Please try again.',
    validationContact: 'This field cannot be empty',
    validationContactFormat: 'Invalid format',
    validationGoal: 'Please select an option',
    validationConsent: 'Your consent is required',
  },
  footer: {
    scrollUp: 'Back to top',
    privacy: 'Privacy Policy',
    cookies: 'Cookie Policy',
  },
} as const

export default en
