// Shared sample data for all pages (no database in this release)
const heritageSites = [
  {
    "siteID": 1,
    "nameAr": "المتحف الوطني السعودي",
    "nameEn": "The National Museum of Saudi Arabia",
    "cityAr": "الرياض",
    "cityEn": "Riyadh",
    "classificationAr": "متحف",
    "classificationEn": "Museum",
    "descriptionAr": "يأخذ المتحف زواره في رحلة عبر تاريخ الجزيرة العربية من عصور ما قبل التاريخ إلى العصر الحديث. افتُتح عام 1419هـ على مساحة نحو 17 ألف م²، ويضم أكثر من 3,700 قطعة أثرية.",
    "descriptionEn": "A journey through the history of the Arabian Peninsula, from prehistoric times to the modern era. Opened in 1419 AH, it covers about 17,000 m² and holds over 3,700 artifacts.",
    "address": "حي المربع، بجوار قصر الملك عبدالعزيز / Al-Murabba, next to King Abdulaziz Palace",
    "workingHours": "السبت إلى الأربعاء 9:00 ص – 7:00 م، الجمعة 2:00 م – 10:00 م / Sat–Wed 9:00 AM – 7:00 PM, Fri 2:00 PM – 10:00 PM",
    "photos": [
      "images/1.jpg",
      "images/1.2.jpg"
      "images/1.3.jpg",
      "images/1.4.jpg",
      "images/1.5.jpg",
    ]
  },
  {
    "siteID": 2,
    "nameAr": "قصر المصمك",
    "nameEn": "Al Masmak Palace",
    "cityAr": "الرياض",
    "cityEn": "Riyadh",
    "classificationAr": "قلعة",
    "classificationEn": "Fort",
    "descriptionAr": "حصن طيني عريق شهد معركة استرداد الرياض عام 1902م على يد الملك عبدالعزيز، وما زال أثر رمح ابن جلوي ظاهرًا على بابه. وتحوّل اليوم إلى متحف يروي قصة توحيد المملكة.",
    "descriptionEn": "A historic mud-brick fortress where King Abdulaziz recaptured Riyadh in 1902; the mark of Ibn Jiluwi's spear is still visible on its door. Today it is a museum telling the story of the Kingdom's unification.",
    "address": "وسط مدينة الرياض / Central Riyadh",
    "workingHours": "السبت إلى الخميس 8:00 ص – 9:00 م، الجمعة 8:00 ص – 4:00 م / Sat–Thu 8:00 AM – 9:00 PM, Fri 8:00 AM – 4:00 PM",
    "photos": [
      "images/2.jpg"
      "images/2.2.jpg",
      "images/2.3.jpg",
      "images/2.4.jpg",
    ]
  },
  {
    "siteID": 3,
    "nameAr": "سوق الزل",
    "nameEn": "Souq Al-Zal",
    "cityAr": "الرياض",
    "cityEn": "Riyadh",
    "classificationAr": "سوق تقليدي",
    "classificationEn": "Traditional Market",
    "descriptionAr": "من أقدم أسواق الرياض وأعرقها، يمتد على مساحة 38 ألف م² ويعود تاريخه إلى أكثر من 100 عام. يشتهر بالبشوت والسجاد والعود والبخور والتحف القديمة.",
    "descriptionEn": "One of Riyadh's oldest markets, spanning 38,000 m² with over 100 years of history. It is known for bishts, carpets, oud, incense and antiques.",
    "address": "حي الديرة، وسط الرياض، قرب قصر المربع التاريخي / Al-Dirah, central Riyadh, near Al Murabba Palace",
    "workingHours": "يوميًا 3:30 م – 10:30 م / Daily 3:30 PM – 10:30 PM",
    "photos": [
      "images/3.jpg"
      "images/3.2.jpg",
      "images/3.3.jpg",
    ]
  },
  {
    "siteID": 4,
    "nameAr": "قصر المربع",
    "nameEn": "Al Murabba Palace",
    "cityAr": "الرياض",
    "cityEn": "Riyadh",
    "classificationAr": "قلعة",
    "classificationEn": "Fort",
    "descriptionAr": "أول قصر بُني خصيصًا للملك عبدالعزيز، وقد أمر ببنائه عام 1355هـ/1936م خارج أسوار الرياض القديمة. شهد تأسيس أوائل الأنظمة والمؤسسات الحكومية في الدولة.",
    "descriptionEn": "The first palace built specifically for King Abdulaziz, commissioned in 1936 outside Riyadh's old city walls. It witnessed the founding of the state's earliest government systems and institutions.",
    "address": "حي المربع، وسط الرياض، ضمن مركز الملك عبدالعزيز التاريخي / Al-Murabba, central Riyadh, within the King Abdulaziz Historical Center",
    "workingHours": "السبت إلى الخميس 9:00 ص – 8:00 م، الجمعة 5:00 م – 8:00 م / Sat–Thu 9:00 AM – 8:00 PM, Fri 5:00 PM – 8:00 PM",
    "photos": [
      "images/4.jpg"
      "images/4.2.jpg",
      "images/4.3.jpg",

    ]
  },
  {
    "siteID": 5,
    "nameAr": "جدة التاريخية (البلد)",
    "nameEn": "Historic Jeddah (Al-Balad)",
    "cityAr": "جدة",
    "cityEn": "Jeddah",
    "classificationAr": "حي تاريخي",
    "classificationEn": "Historic District",
    "descriptionAr": "بوابة البحر الأحمر التاريخية، ومحطة الحجاج، ومركز تجاري عريق. أُدرجت في قائمة اليونسكو للتراث العالمي لمبانيها العريقة ونسيجها العمراني الفريد، وتشهد اليوم مشروعًا لإعادة إحيائها ضمن رؤية 2030.",
    "descriptionEn": "The historic gateway to the Red Sea, a major trade hub and the main arrival point for pilgrims. A UNESCO World Heritage Site known for its historic buildings and unique urban fabric, it is now being revitalized as part of Vision 2030.",
    "address": "حي البلد، جدة / Al-Balad, Jeddah",
    "workingHours": "مفتوح يوميًا على مدار الساعة / Open daily, 24 hours",
    "photos": [
      "images/5.jpg"
      "images/5.2.jpg",
      "images/5.3.jpg",
    ]
  },
  {
    "siteID": 6,
    "nameAr": "سوق العلوي",
    "nameEn": "Souq Al-Alawi",
    "cityAr": "جدة",
    "cityEn": "Jeddah",
    "classificationAr": "سوق تقليدي",
    "classificationEn": "Traditional Market",
    "descriptionAr": "من أكبر أسواق جدة التاريخية وأقدمها وأكثرها حيوية، وكان محطة رئيسية للحجاج المتجهين إلى مكة. يجد فيه الزائر الملابس التقليدية والبخور والتوابل والأعشاب.",
    "descriptionEn": "One of Historic Jeddah's largest, oldest and liveliest markets, once a key stop for pilgrims heading to Makkah. It offers traditional clothing, incense, spices and herbs.",
    "address": "جدة التاريخية (البلد) / Historic Jeddah (Al-Balad)",
    "workingHours": "السبت إلى الأربعاء 9:00 ص – 10:30 م، الجمعة 4:30 م – 10:30 م / Sat–Wed 9:00 AM – 10:30 PM, Fri 4:30 PM – 10:30 PM",
    "photos": [
      "images/6.jpg"
      "images/6.2.jpg",
      "images/6.3.jpg",
    ]
  },
  {
    "siteID": 7,
    "nameAr": "بيت نصيف",
    "nameEn": "Beit Nassif",
    "cityAr": "جدة",
    "cityEn": "Jeddah",
    "classificationAr": "متحف",
    "classificationEn": "Museum",
    "descriptionAr": "قصر تاريخي يزيد عمره على 155 عامًا، استضاف الملك عبدالعزيز عند دخوله جدة. يضم غرفًا واسعة وتحفًا أثرية، وتقف عند مدخله شجرة النيم الشهيرة التي يتجاوز عمرها 130 عامًا.",
    "descriptionEn": "A historic house over 155 years old that hosted King Abdulaziz when he entered Jeddah. It features spacious rooms and antiques, with a famous neem tree over 130 years old at its entrance.",
    "address": "جدة التاريخية (البلد) / Historic Jeddah (Al-Balad)",
    "workingHours": "يوميًا 10:00 ص – 1:00 م و5:00 م – 9:00 م / Daily 10:00 AM – 1:00 PM and 5:00 PM – 9:00 PM",
    "photos": [
      "images/7.jpg"
      "images/7.2.jpg",
      "images/7.3.jpg",
    ]
  },
  {
    "siteID": 8,
    "nameAr": "الحِجر",
    "nameEn": "Hegra",
    "cityAr": "العلا",
    "cityEn": "AlUla",
    "classificationAr": "موقع أثري",
    "classificationEn": "Archaeological Site",
    "descriptionAr": "أول موقع سعودي يُدرج في قائمة اليونسكو للتراث العالمي، وكان ملتقى للقوافل على طريق البخور. يضم أكثر من 110 مدافن نبطية، منها 94 بواجهات منحوتة في الصخر، وأشهرها قصر الفريد.",
    "descriptionEn": "Saudi Arabia's first UNESCO World Heritage Site and a meeting point for caravans on the ancient Incense Route. It contains over 110 Nabataean tombs, 94 with carved rock facades, including the famous Qasr Al-Farid.",
    "address": "العُلا / AlUla",
    "workingHours": "مركز الزوار: يوميًا 7:30 ص – 6:00 م / Visitor center: daily 7:30 AM – 6:00 PM",
    "photos": [
      "images/8.jpg"
      "images/8.2.jpg",
      "images/8.3.jpg",
    ]
  },
  {
    "siteID": 9,
    "nameAr": "البلدة القديمة في العُلا",
    "nameEn": "AlUla Old Town",
    "cityAr": "العلا",
    "cityEn": "AlUla",
    "classificationAr": "حي تاريخي",
    "classificationEn": "Historic District",
    "descriptionAr": "بلدة طينية تعود نشأتها إلى القرن الثاني عشر الميلادي، وكانت محطة رئيسية على طريق الحج بين دمشق ومكة. تحيط بها أسوار ذات 14 بوابة، وتعلوها قلعة يعود بناؤها إلى القرن العاشر الميلادي.",
    "descriptionEn": "A mud-brick town dating back to the 12th century AD and a key stop on the pilgrimage route between Damascus and Makkah. It is enclosed by walls with 14 gates and overlooked by a 10th-century fortress.",
    "address": "العُلا / AlUla",
    "workingHours": "مفتوح يوميًا على مدار الساعة / Open daily, 24 hours",
    "photos": [
      "images/9.jpg"
      "images/9.2.jpg",
      "images/9.3.jpg",
    ]
  },
  {
    "siteID": 10,
    "nameAr": "موقع دادان الأثري وجبل عِكمة",
    "nameEn": "Dadan Archaeological Site and Jabal Ikmah",
    "cityAr": "العلا",
    "cityEn": "AlUla",
    "classificationAr": "موقع أثري",
    "classificationEn": "Archaeological Site",
    "descriptionAr": "رحلة عبر حضارات ازدهرت قديمًا في العُلا. تشتهر دادان بمقابرها المنحوتة في الصخر، ويُعرف جبل عِكمة بأنه \"مكتبة مفتوحة\" لكثرة النقوش القديمة على صخوره.",
    "descriptionEn": "A journey through ancient civilizations that once flourished in AlUla. Dadan is known for its rock-cut tombs, while Jabal Ikmah is called an \"open library\" for its many ancient inscriptions.",
    "address": "العُلا / AlUla",
    "workingHours": "يوميًا 9:00 ص – 11:00 م / Daily 9:00 AM – 11:00 PM",
    "photos": [
      "images/10.jpg"
      "images/10.2.jpg",
      "images/10.3.jpg",
    ]
  },
  {
    "siteID": 11,
    "nameAr": "حي الطريف",
    "nameEn": "At-Turaif District",
    "cityAr": "الدرعية",
    "cityEn": "Diriyah",
    "classificationAr": "حي تاريخي",
    "classificationEn": "Historic District",
    "descriptionAr": "من أهم المعالم التراثية في المملكة، ورمز خالد لتاريخ الدولة السعودية الأولى. شُيّد في القرن الثامن عشر الميلادي، ويُعد اليوم من أكبر المدن الطينية المتكاملة في العالم.",
    "descriptionEn": "One of the Kingdom's most important heritage landmarks and a lasting symbol of the First Saudi State. Built in the 18th century, it is today one of the largest intact mud-brick cities in the world.",
    "address": "الدرعية التاريخية، شمال غرب الرياض / Historic Diriyah, northwest of Riyadh",
    "workingHours": "الأحد إلى الأربعاء 9:00 ص – 12:00 ص، الخميس إلى السبت 9:00 ص – 1:00 ص / Sun–Wed 9:00 AM – 12:00 AM, Thu–Sat 9:00 AM – 1:00 AM",
    "photos": [
      "images/11.jpg"
      "images/11.2.jpg",
      "images/11.3.jpg",
    ]
  },
  {
    "siteID": 12,
    "nameAr": "قصر سلوى",
    "nameEn": "Salwa Palace",
    "cityAr": "الدرعية",
    "cityEn": "Diriyah",
    "classificationAr": "موقع أثري",
    "classificationEn": "Archaeological Site",
    "descriptionAr": "معلم تاريخي في حي الطريف، كان مقر الحكم والإدارة في عهد الدولة السعودية الأولى.",
    "descriptionEn": "A historic landmark in At-Turaif that served as the seat of government during the First Saudi State.",
    "address": "حي الطريف، الدرعية / At-Turaif, Diriyah",
    "workingHours": "يوميًا 5:00 م – 12:00 ص / Daily 5:00 PM – 12:00 AM",
    "photos": [
      "images/12.jpg"
      "images/12.2.jpg",
      "images/12.3.jpg",
    ]
  },
  {
    "siteID": 13,
    "nameAr": "حي سمحان (السمحانية)",
    "nameEn": "Samhan District (Al-Samhaniya)",
    "cityAr": "الدرعية",
    "cityEn": "Diriyah",
    "classificationAr": "حي تاريخي",
    "classificationEn": "Historic District",
    "descriptionAr": "من أبرز الأحياء الطينية في الدرعية، ويضم 36 مبنى تراثيًا على هضبة تطل على وادي حنيفة. كان مقرًا للحكم في بدايات الدولة السعودية الأولى، ورُمّم ليصبح وجهة تراثية نابضة بالحياة.",
    "descriptionEn": "One of Diriyah's most prominent mud-brick districts, with 36 heritage buildings on a hill overlooking Wadi Hanifa. Once a seat of rule in the early First Saudi State, it has been restored into a vibrant heritage destination.",
    "address": "الدرعية التاريخية، على هضبة مطلة على وادي حنيفة / Historic Diriyah, on a plateau overlooking Wadi Hanifa",
    "workingHours": "مفتوح يوميًا على مدار الساعة / Open daily, 24 hours",
    "photos": [
      "images/13.jpg"
      "images/13.2.jpg",
      "images/13.3.jpg",
    ]
  },
  {
    "siteID": 14,
    "nameAr": "سوق الثلاثاء الشعبي",
    "nameEn": "Al-Thulatha Popular Market (Tuesday Market)",
    "cityAr": "عسير",
    "cityEn": "Asir",
    "classificationAr": "سوق تقليدي",
    "classificationEn": "Traditional Market",
    "descriptionAr": "من أقدم أسواق عسير، ويجمع بين الأصالة والمعاصرة. يعرض الحرف اليدوية والسلال المنسوجة والأقمشة، إلى جانب منتجات الألبان والنباتات العطرية والتمور.",
    "descriptionEn": "One of Asir's oldest markets, blending tradition and modernity. It offers handicrafts, woven baskets and fabrics, along with dairy products, aromatic plants and dates.",
    "address": "منطقة عسير / Asir region",
    "workingHours": "يوميًا 8:00 ص – 9:30 م / Daily 8:00 AM – 9:30 PM",
    "photos": [
      "images/14.jpg"
      "images/14.2.jpg",

    ]
  },
  {
    "siteID": 15,
    "nameAr": "قرية رجال ألمع التراثية",
    "nameEn": "Rijal Almaa Heritage Village",
    "cityAr": "عسير",
    "cityEn": "Asir",
    "classificationAr": "حي تاريخي",
    "classificationEn": "Historic District",
    "descriptionAr": "قرية تراثية يمتد تاريخها لأكثر من 700 عام، تتميز بمبانيها الحجرية الملوّنة وطرازها المعماري الفريد. نالت اعترافًا عالميًا كواحدة من أفضل القرى السياحية، ويضم متحفها 20 قسمًا من القطع التراثية.",
    "descriptionEn": "A heritage village with over 700 years of history, known for its colorful stone buildings and unique architecture. It has been recognized internationally as one of the best tourism villages, and its museum holds 20 sections of heritage artifacts.",
    "address": "محافظة رجال ألمع، على بعد نحو 45 كم من أبها / Rijal Almaa, about 45 km from Abha",
    "workingHours": "مركز الزوار: السبت إلى الخميس 10:00 ص – 6:00 م، الجمعة 1:00 م – 6:00 م / Visitor center: Sat–Thu 10:00 AM – 6:00 PM, Fri 1:00 PM – 6:00 PM",
    "photos": [
      "images/15.jpg"
      "images/15.2.jpg",
      "images/15.3.jpg",
      "images/15.4.jpg",
    ]
  },
  {
    "siteID": 16,
    "nameAr": "متحف قصر الحضارات التراثي",
    "nameEn": "Qasr Al-Hadarat Heritage Museum",
    "cityAr": "عسير",
    "cityEn": "Asir",
    "classificationAr": "متحف",
    "classificationEn": "Museum",
    "descriptionAr": "قصر في قلب منطقة عسير يضم مجموعة ضخمة من المخطوطات والقطع الأثرية القديمة. وأبرز ما فيه أكثر من ألف مخطوطة للقرآن الكريم.",
    "descriptionEn": "A palace in the heart of Asir housing a vast collection of manuscripts and antiques. Its highlight is more than a thousand manuscripts of the Holy Quran.",
    "address": "منطقة عسير / Asir region",
    "workingHours": "السبت إلى الخميس 7:00 ص – 7:30 م، الجمعة 1:30 م – 7:30 م / Sat–Thu 7:00 AM – 7:30 PM, Fri 1:30 PM – 7:30 PM",
    "photos": [
      "images/16.jpg"
      "images/16.2.jpg",
      "images/16.3.jpg",
    ]
  }
];
