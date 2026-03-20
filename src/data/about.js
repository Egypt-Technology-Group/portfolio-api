export const aboutData = {
  personalInfo: [
    { label: 'تاريخ الميلاد', label_en: 'Date of Birth', value: '20/4/1999', icon: 'fas fa-calendar-alt' },
    { label: 'العمر', label_en: 'Age', value: '26', value_en: '26 years', icon: 'fas fa-user' },
    { label: 'الوظيفة', label_en: 'Position', value: 'مطور ويب', value_en: 'Web Developer', icon: 'fas fa-briefcase' },
    { label: 'الهاتف', label_en: 'Phone', value: '01021891641', icon: 'fas fa-phone' },
    { label: 'البريد', label_en: 'Email', value: 'karimgamal.wd@gmail.com', icon: 'fas fa-envelope' },
    { label: 'العنوان', label_en: 'Location', value: 'المنيا - ملوي', value_en: 'Minia, Egypt', icon: 'fas fa-map-marker-alt' }
  ],
  skillSections: [
    {
      id: 'web',
      title: 'تطوير الويب',
      title_en: 'Web Development',
      icon: 'fas fa-code',
      items: [
        { name: 'HTML', icon: 'fab fa-html5', color: '#E34F26' },
        { name: 'CSS', icon: 'fab fa-css3-alt', color: '#1572B6' },
        { name: 'Bootstrap', icon: 'fab fa-bootstrap', color: '#7952B3' },
        { name: 'JavaScript', icon: 'fab fa-js', color: '#F7DF1E' },
        { name: 'Angular', icon: 'fab fa-angular', color: '#DD0031' },
        { name: 'PHP', icon: 'fab fa-php', color: '#777BB4' },
        { name: 'SQL Server', icon: 'fas fa-database', color: '#CC2927' },
        { name: 'MySQL', icon: 'fas fa-database', color: '#4479A1' }
      ]
    },
    {
      id: 'design',
      title: 'التصميم',
      title_en: 'Design',
      icon: 'fas fa-palette',
      items: [
        { name: 'Figma', icon: 'fab fa-figma', color: '#F24E1E' },
        { name: 'Adobe XD', icon: 'fab fa-adobe', color: '#FF61F6' },
        { name: 'Photoshop', icon: 'fab fa-adobe', color: '#31A8FF' }
      ]
    }
  ],
  experiences: [
    {
      title: 'مطور واجهة أمامية',
      title_en: 'Frontend Developer',
      description: 'مطور واجهات ويب (Front-End Developer) متخصص في بناء تطبيقات الويب أحادية الصفحة (SPA) باستخدام Angular. خبير في تحويل تصاميم UI/UX إلى واجهات تفاعلية سريعة الأداء باستخدام Bootstrap و CSS3 و TypeScript. أركز على تقديم أكواد نظيفة (Clean Code) وتصاميم متجاوبة بالكامل (Responsive Web Design) لضمان أفضل تجربة مستخدم وتوافق تام مع محركات البحث',
      description_en: 'Frontend Developer specializing in building Single Page Applications (SPA) using Angular. Expert in converting UI/UX designs into high-performance interactive interfaces using Bootstrap, CSS3, and TypeScript. Focus on delivering clean code and fully responsive designs to ensure the best user experience and full search engine compatibility.'
    },
    {
      title: 'مطور نهاية خلفية',
      title_en: 'Backend Developer',
      description: 'متخصص في تصميم وتطوير بنية تحتية قوية (Scalable Architecture) وبناء Restful APIs عالية الأداء. خبير في إدارة وقواعد البيانات (SQL/NoSQL) وتحسين استعلاماتها لضمان أقصى سرعة واستقرار للأنظمة. أركز على الأمان (Security)، وتكامل الأنظمة (System Integration)، وضمان كفاءة التعامل مع البيانات الضخمة تحت ضغط عالي',
      description_en: 'Specialized in designing and developing robust scalable architecture and building high-performance Restful APIs. Expert in database management (SQL/NoSQL) and query optimization to ensure maximum system speed and stability. Focus on security, system integration, and efficient handling of big data under high pressure.'
    }
  ],
  education: {
    title: 'بكالوريوس نظم المعلومات',
    title_en: 'BSc in Information Systems',
    description: 'حاصل على بكالوريوس نظم المعلومات (BSc)، بخلفية تقنية ترتكز على الفهم الشامل لإدارة قواعد البيانات، هندسة البرمجيات، وأمن الشبكات. متمكن من تحليل مشاكل الأعمال المعقدة وتحويلها إلى حلول تكنولوجية مبتكرة.',
    description_en: 'Holder of a Bachelor of Information Systems (BSc), with a technical background focused on a comprehensive understanding of database management, software engineering, and network security. Proficient in analyzing complex business problems and transforming them into innovative technological solutions.'
  }
}

export default aboutData
