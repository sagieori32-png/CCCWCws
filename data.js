// ============================================
//  CCCWC — Initial content
//  All editable content lives here. Edits made
//  through the UI are stored in localStorage and
//  override these defaults until reset.
// ============================================

const INITIAL_DATA = {

  // ---------- Fresh from the Field ----------
  fresh: [
    {
      id: 'fresh-1',
      image: 'assets/news/fresh_how_children_feel.png',
      title: 'How children feel',
      subtitle: "Children's perceptions of mental health in 4 EU Member States",
      date: '4 June 2025',
      link: ''
    },
    {
      id: 'fresh-2',
      image: 'assets/news/fresh_child_indicators.png',
      title: 'Life Stressors, Social Support, and Children\'s Subjective Well-Being during the COVID-19 Pandemic',
      subtitle: 'Evidence from a Cross-National Survey of 20 Societies — Child Indicators Research, Vol. 18, pp. 905–936 (2025)',
      date: 'Published 11 January 2025',
      link: ''
    }
  ],

  // ---------- Research Focus Areas / Teams ----------
  teams: [
    {
      id: 'team-1',
      title: 'Emotional Abuse',
      members: 'Prof. Dr. Anne Piezunka · Prof. Yochay Nadan · Hanin Moradi · Dr. Dana Lassri'
    },
    {
      id: 'team-2',
      title: 'Youth Perspectives on Economic Mobility',
      members: 'Dr. Daphna Gross-Manos · Dr. Johanna Wilmes · Dr. Hanita Kosher'
    },
    {
      id: 'team-3',
      title: 'Well-Being of Six-Year-Olds',
      members: 'Dr. Hanita Kosher · Dr. Johanna Wilmes'
    },
    {
      id: 'team-4',
      title: 'Cultural Sensitivity and Universal Children\'s Rights',
      members: 'Prof. Yochay Nadan · Dr. Eran Melkman'
    },
    {
      id: 'team-5',
      title: 'Refugee Children',
      members: 'Tatjana Dietz · Mais Eissa'
    }
  ],

  // ---------- Members ----------
  members: [
    {
      id: 'm-01',
      name: 'Prof. Dr. Sabine Andresen',
      photo: 'assets/portraits/01_sabine_andresen.png',
      affiliation: 'Goethe University Frankfurt',
      bio: 'Professor Dr. Sabine Andresen is a professor of educational science with a focus on social pedagogy and family research at Goethe University Frankfurt. Since 2024 she is the vice president of the Goethe University for Career Development & Advancement, Diversity and Gender Equality. Her research focusses on child and family poverty, children\'s rights, vulnerability, historical perspectives on childhood and youth, international well-being research, as well as on studies in the context of the prevention of (sexual) violence against children and adolescents and transitional justice.',
      email: 'S.Andresen@em.uni-frankfurt.de'
    },
    {
      id: 'm-02',
      name: 'Prof. Asher Ben-Arieh',
      photo: 'assets/portraits/02_asher_ben_arieh.png',
      affiliation: 'The Hebrew University of Jerusalem',
      bio: 'Professor Asher Ben-Arieh is the Dean of the Paul Baerwald School of Social Work and Social Welfare at the Hebrew University of Jerusalem. He is a leading international expert on child well-being and social indicators, with a research focus on child well-being, child maltreatment, and the measurement of well-being indicators. He served as Director and Editor of the Statistical Yearbook – Children in Israel and was Deputy Director General of the National Council for the Child. He also served as director of the Haruv Institute and was the founding chair of the International Society for Child Indicators (ISCI).',
      email: 'benarieh@mail.huji.ac.il'
    },
    {
      id: 'm-03',
      name: 'Tatjana Dietz',
      photo: 'assets/portraits/03_tatjana_dietz.png',
      affiliation: 'Goethe University Frankfurt',
      bio: 'Tatjana Dietz is a research assistant and works in teaching and research at the Department of Educational Sciences at Goethe University. She is a trained nursery school teacher, studied International Social Work in her B.A. and Educational Science in her M.A. She wrote her doctorate about infants in educational science and the scientific knowledge production about infants in the 20th century in the western context. In her work she is interested in the prevention of child maltreatment, child protection as well as childhood and family research focussing on the concepts of agency and vulnerability.',
      email: 'T.Dietz@em.uni-frankfurt.de'
    },
    {
      id: 'm-04',
      name: 'Dr. Daphna Gross-Manos',
      photo: 'assets/portraits/04_daphna_gross-manos.png',
      affiliation: 'Tel-Hai Academic College',
      bio: 'Dr. Daphna Gross-Manos is a Senior Lecturer in the Social Work Department at Tel-Hai Academic College in Israel. Her research focuses on child poverty and child well-being, different perspectives of child neglect, and community prevention of child maltreatment. She examines the subjective well-being of vulnerable children and explores how neighborhood and community contexts shape experiences of maltreatment and protection. She is also one of the Co-Editors in Chief of the journal Child Indicators Research, contributing to the advancement of international scholarship on child well-being.',
      email: 'grossdaphna@gmail.com'
    },
    {
      id: 'm-05',
      name: 'Dr. Maksim Huebenthal',
      photo: 'assets/portraits/05_maksim_huebenthal.png',
      affiliation: 'Freie Universität Berlin',
      bio: 'Maksim Huebenthal is a tenured research associate and lecturer in the Social Work Division of the Department of Education and Psychology at Freie Universität Berlin. He has been involved since 2020 in the "ProChild" research consortium, studying support systems for mothers with borderline personality disorder. With a background in Educational Science from the University of Halle, where he also earned his PhD on child poverty in German politics, he previously served as Interim Professor for Childhood Research at the University of Wuppertal. His research focuses on childhood studies, poverty, child and youth welfare systems, and interprofessional support for families with mentally ill parents. He maintains active academic collaboration with Israeli colleagues through research and teaching.',
      email: 'maksim.huebenthal@fu-berlin.de'
    },
    {
      id: 'm-14',
      name: 'Dr. Mor Keleynikov',
      photo: '',
      affiliation: '',
      bio: 'Bio coming soon.',
      email: 'Moravraham38@gmail.com'
    },
    {
      id: 'm-06',
      name: 'Dr. Hanita Kosher',
      photo: 'assets/portraits/06_hanita_kosher.png',
      affiliation: 'The Hebrew University of Jerusalem',
      bio: 'Dr. Hanita Kosher is a Senior Lecturer at the Paul Baerwald School of Social Work and Social Welfare at the Hebrew University of Jerusalem. Her research focuses on children\'s rights, particularly children\'s right to participation in the child welfare system. Another strand of her work explores children\'s subjective well-being.',
      email: 'hanita.kosher@mail.huji.ac.il'
    },
    {
      id: 'm-07',
      name: 'Dr. Dana Lassri',
      photo: 'assets/portraits/07_dana_lassri.png',
      affiliation: 'The Hebrew University of Jerusalem',
      bio: 'Dr. Dana Lassri is a lecturer and the director of the ChARMS (Childhood Adversities, Resilience, and Mental health under Stress) Research Lab at the Paul Baerwald School of Social Work and Social Welfare at the Hebrew University of Jerusalem. She is also a research fellow at the Research Department of Clinical, Educational and Health Psychology at University College London (UCL) and a fellow at the Haruv Institute. Her research focuses on the impact of traumatic and chronic stress on psychological, interpersonal, and biological development and well-being throughout the lifespan. She also investigates underlying mechanisms and individual differences in psychosocial risk and protective factors and their relation to resilience.',
      email: 'dana.lassri@mail.huji.ac.il'
    },
    {
      id: 'm-08',
      name: 'Dr. Eran Melkman',
      photo: 'assets/portraits/08_eran_melkman.png',
      affiliation: 'Tel Aviv University',
      bio: 'Dr. Eran Melkman is a faculty member at the Jaime and Joan Constantiner School of Education at Tel Aviv University. His research focuses on child welfare, foster care, and youth aging out of care, as well as the role of educators in the context of child maltreatment.',
      email: 'eranmelkman@tauex.tau.ac.il'
    },
    {
      id: 'm-09',
      name: 'Prof. Yochay Nadan',
      photo: 'assets/portraits/09_yochay_nadan.png',
      affiliation: 'The Hebrew University of Jerusalem',
      bio: 'Professor Yochay Nadan is an Associate Professor and Head of the Master\'s Programs at the Paul Baerwald School of Social Work and Social Welfare at the Hebrew University of Jerusalem. His research focuses on child risk, maltreatment, well-being, and protection in diverse contexts; research on practice, including psycho-social interventions in diverse contexts, clinical training, and supervision; and the LGBTQ+ community, including LGBTQ+ parenting, sexual abuse in the LGBTQ+ community, and gender-diverse children and families.',
      email: 'yochay.nadan@mail.huji.ac.il'
    },
    {
      id: 'm-10',
      name: 'Dr. Anne Piezunka',
      photo: 'assets/portraits/10_anne_piezunka.png',
      affiliation: 'TU Dresden / Goethe University Frankfurt',
      bio: 'Dr. Anne Piezunka is a post-doctoral researcher at the Institute for Special Education at Goethe University Frankfurt and also holds a professorship at the University of Applied Sciences for Social Work and Education (HSAP) in Berlin since 2020. In her research, she is interested in experiences of recognition and emotional violence in educational relationships, the implementation of inclusive education and assessment of discrimination in educational research. Her research is located at the interface between sociology and educational science.',
      email: 'anne.piezunka@tu-dresden.de'
    },
    {
      id: 'm-11',
      name: 'Prof. Dafna Tener',
      photo: 'assets/portraits/11_dafna_tener.png',
      affiliation: 'The Hebrew University of Jerusalem',
      bio: 'Professor Dafna Tener is a Senior Lecturer and Head of the BSW Program at the Paul Baerwald School of Social Work and Social Welfare at the Hebrew University of Jerusalem. Her research focuses on child sexual abuse, including sibling sexual abuse and preadolescent child sexual abuse. She also examines child sexual abuse within specific social and cultural contexts, such as the Ultra-Orthodox community and the LGBTQ+ community.',
      email: 'dafna.tener@mail.huji.ac.il'
    },
    {
      id: 'm-12',
      name: 'Dr. Anna Wanka',
      photo: 'assets/portraits/12_anna_wanka.png',
      affiliation: 'Goethe University Frankfurt',
      bio: 'Dr. Anna Wanka is a sociologist and critical gerontologist interested in un/doing difference and the material-discursive construction of age across the life course. She did her PhD in Sociology at the University of Vienna, Austria, and is currently a research group leader at Goethe University Frankfurt, Germany. Her areas of expertise comprise life course transitions and the re/production of intersectional inequalities across the life course, ageing and technologies, age-friendly cities and communities, ageing migrants, and lifelong learning. She has expertise in both qualitative and quantitative methods and has developed reflexive approaches to mixed-methods research.',
      email: 'wanka@em.uni-frankfurt.de'
    },
    {
      id: 'm-13',
      name: 'Dr. Johanna Wilmes',
      photo: 'assets/portraits/13_johanna_wilmes.png',
      affiliation: 'Goethe University Frankfurt',
      bio: 'Johanna is a research assistant and works in teaching and research at the Department of Educational Sciences at Goethe University. She has studied at Goethe University and received her doctorate in 2022 with a critical examination of the well-being concept, which she based on a study of children in children\'s homes in Nepal. She has been working on the international study on children\'s well-being "Children\'s Worlds" since 2012 and has also been PI of the international project since 2023. As part of this and other projects, she deals with issues of social inequality.',
      email: 'wilmes@em.uni-frankfurt.de'
    }
  ]
};
