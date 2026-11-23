/* ==================================================================
   JAWARC — content
   Everything the site shows comes from this file.

   1) CONFIG  — contact details, social links, enquiry form.
                Anything left empty shows as "To be supplied".
   2) DATA    — projects, art, films, studio, services.
                Images live in /assets/img (see "src" on every image).
   ================================================================== */

window.JAWARC_CONFIG = {
  email: "",
  phone: "",
  /* digits only, with country code — e.g. 919876543210 */
  whatsapp: "",
  address: "",
  social: [
    { label: "Instagram", href: "" },
    { label: "LinkedIn", href: "" },
    { label: "Behance", href: "" },
    { label: "Pinterest", href: "" }
  ],
  /* POST endpoint for the enquiry form (Formspree, Basin, your own API…).
     Empty = the form validates but says honestly that nothing was sent. */
  formEndpoint: "",
  /* The small "Sample" badges on placeholder projects / art. Set to false to hide. */
  showSampleTags: true,
  /* false (default) = the browser's own smooth native scrolling: lowest lag.
     true = extra inertia-style wheel smoothing (can feel laggy on slower machines). */
  smoothScroll: false
};

window.JAWARC_DATA = {
 "site": {
  "name": "JAWARC Architects",
  "shortName": "JAWARC",
  "descriptor": "Architecture & Interior Design",
  "description": "JAWARC Architects — architecture and interior design for residential and commercial projects. Selected work, drawings, visualisations and film."
 },
 "nav": [
  {
   "href": "/projects",
   "label": "Projects"
  },
  {
   "href": "/art",
   "label": "Art & Experiments"
  },
  {
   "href": "/studio",
   "label": "Studio"
  },
  {
   "href": "/contact",
   "label": "Contact"
  }
 ],
 "categories": [
  {
   "id": "architecture",
   "label": "Architecture"
  },
  {
   "id": "interiors",
   "label": "Interiors"
  },
  {
   "id": "residential",
   "label": "Residential"
  },
  {
   "id": "commercial",
   "label": "Commercial"
  },
  {
   "id": "other",
   "label": "Other"
  }
 ],
 "artKinds": [
  {
   "id": "sketch",
   "label": "Sketches"
  },
  {
   "id": "drawing",
   "label": "Drawings"
  },
  {
   "id": "concept",
   "label": "Concepts"
  },
  {
   "id": "3d",
   "label": "3D experiments"
  },
  {
   "id": "study",
   "label": "Material studies"
  }
 ],
 "services": [
  {
   "id": "architecture",
   "title": "Architecture",
   "description": "New buildings, extensions and alterations.",
   "category": "architecture"
  },
  {
   "id": "interior-design",
   "title": "Interior Design",
   "description": "Interior spaces for homes and commercial settings.",
   "category": "interiors"
  },
  {
   "id": "residential",
   "title": "Residential Design",
   "description": "Houses, villas and apartments.",
   "category": "residential"
  },
  {
   "id": "commercial",
   "title": "Commercial Spaces",
   "description": "Offices, retail and hospitality interiors.",
   "category": "commercial"
  },
  {
   "id": "visualisation",
   "title": "3D Visualization",
   "description": "Architectural renders and visual studies.",
   "category": null
  }
 ],
 "studio": {
  "intro": "JAWARC Architects works across architecture and interior design, on residential and commercial projects, and presents its work through photography, drawings, visualisations and film.",
  "practice": [
   "Practice statement to be supplied by the architect."
  ],
  "architect": {
   "name": null,
   "role": "Architect",
   "bio": null,
   "portrait": {
    "alt": "Portrait of the architect (placeholder)",
    "width": 1000,
    "height": 1250,
    "kind": "photo",
    "src": "assets/img/interior-311-1250-dark.webp"
   }
  },
  "photographs": [
   {
    "alt": "Studio photograph (placeholder)",
    "width": 1600,
    "height": 1000,
    "kind": "photo",
    "src": "assets/img/interior-402-625-dark.webp"
   },
   {
    "alt": "Studio photograph (placeholder)",
    "width": 1000,
    "height": 1250,
    "kind": "photo",
    "src": "assets/img/facade-118-1250-dark.webp"
   },
   {
    "alt": "Studio photograph (placeholder)",
    "width": 1600,
    "height": 1000,
    "kind": "photo",
    "src": "assets/img/arches-77-625-dark.webp"
   }
  ],
  "photographsAreSample": true
 },
 "projects": [
  {
   "slug": "sample-residence-01",
   "title": "Sample Residence 01",
   "typology": "Residence",
   "categories": [
    "architecture",
    "residential"
   ],
   "location": null,
   "year": null,
   "status": null,
   "area": null,
   "services": [
    "Architecture",
    "Interior Design"
   ],
   "summary": "Sample project — details to be supplied.",
   "description": [
    "Sample project used to test layout and filtering. Replace this text with the project's own description."
   ],
   "featured": true,
   "order": 1,
   "isSample": true,
   "specs": [
    {
     "label": "Client",
     "value": null
    },
    {
     "label": "Structure",
     "value": null
    },
    {
     "label": "Materials",
     "value": null
    },
    {
     "label": "Site area",
     "value": null
    },
    {
     "label": "Photography",
     "value": null
    }
   ],
   "cover": {
    "alt": "Residence — exterior elevation (placeholder)",
    "width": 1500,
    "height": 1100,
    "kind": "photo",
    "src": "assets/img/elevation-101-733-dark.webp"
   },
   "hero": {
    "alt": "Residence — exterior elevation (placeholder)",
    "width": 2400,
    "height": 1000,
    "kind": "photo",
    "src": "assets/img/elevation-101-417-dark.webp"
   },
   "chapters": [
    {
     "type": "text-image",
     "heading": "Approach",
     "body": "Sample chapter. A short written note about the idea behind the project belongs here, beside the image it describes.",
     "side": "left",
     "media": {
      "alt": "Massing study (placeholder)",
      "width": 1000,
      "height": 1350,
      "kind": "model",
      "src": "assets/img/massing-111-1350-dark.webp"
     }
    },
    {
     "type": "pair",
     "offset": "right",
     "media": [
      {
       "alt": "Facade detail (placeholder)",
       "width": 1000,
       "height": 1350,
       "kind": "photo",
       "src": "assets/img/facade-112-1350-dark.webp"
      },
      {
       "alt": "Garden elevation (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "photo",
       "src": "assets/img/elevation-113-625-dark.webp"
      }
     ]
    },
    {
     "type": "full",
     "media": {
      "alt": "Living space (placeholder)",
      "width": 2400,
      "height": 1000,
      "kind": "photo",
      "src": "assets/img/interior-114-417-dark.webp"
     }
    },
    {
     "type": "compare",
     "title": "Render and built result",
     "before": {
      "alt": "Visualisation (placeholder)",
      "width": 1600,
      "height": 1000,
      "kind": "render",
      "src": "assets/img/massing-115-625-dark.webp"
     },
     "after": {
      "alt": "Completed building (placeholder)",
      "width": 1600,
      "height": 1000,
      "kind": "photo",
      "src": "assets/img/elevation-116-625-dark.webp"
     },
     "labels": [
      "Render",
      "Built"
     ]
    },
    {
     "type": "sticky",
     "heading": "Interior",
     "body": "Sample chapter. Text stays in view while the images pass alongside it.",
     "media": [
      {
       "alt": "Interior view one (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "photo",
       "src": "assets/img/interior-117-625-dark.webp"
      },
      {
       "alt": "Interior view two (placeholder)",
       "width": 1000,
       "height": 1350,
       "kind": "photo",
       "src": "assets/img/interior-118-1350-dark.webp"
      },
      {
       "alt": "Interior view three (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "photo",
       "src": "assets/img/arches-119-625-dark.webp"
      }
     ]
    },
    {
     "type": "drawings",
     "title": "Drawings",
     "media": [
      {
       "alt": "Ground floor plan (placeholder)",
       "width": 1200,
       "height": 1200,
       "kind": "plan",
       "src": "assets/img/plan-120-1000-light.webp"
      },
      {
       "alt": "Long section (placeholder)",
       "width": 1200,
       "height": 1200,
       "kind": "drawing",
       "src": "assets/img/section-121-1000-light.webp"
      },
      {
       "alt": "First floor plan (placeholder)",
       "width": 1200,
       "height": 1200,
       "kind": "plan",
       "src": "assets/img/plan-122-1000-light.webp"
      }
     ]
    },
    {
     "type": "video",
     "video": {
      "id": "sample-walkthrough-01",
      "title": "Sample Walkthrough 01",
      "kind": "Walkthrough",
      "year": null,
      "duration": null,
      "description": "Placeholder entry. Video to be supplied.",
      "poster": {
       "alt": "Poster frame for a sample walkthrough",
       "width": 2400,
       "height": 1000,
       "kind": "render",
       "src": "assets/img/interior-5021-417-dark.webp"
      },
      "src": null,
      "embed": null,
      "isSample": true
     }
    },
    {
     "type": "trio",
     "media": [
      {
       "alt": "Detail one (placeholder)",
       "width": 1000,
       "height": 1350,
       "kind": "photo",
       "src": "assets/img/facade-123-1350-dark.webp"
      },
      {
       "alt": "Detail two (placeholder)",
       "width": 1000,
       "height": 1350,
       "kind": "photo",
       "src": "assets/img/arches-124-1350-dark.webp"
      },
      {
       "alt": "Detail three (placeholder)",
       "width": 1000,
       "height": 1350,
       "kind": "photo",
       "src": "assets/img/facade-125-1350-dark.webp"
      }
     ]
    }
   ]
  },
  {
   "slug": "sample-office-02",
   "title": "Sample Office 02",
   "typology": "Office building",
   "categories": [
    "architecture",
    "commercial"
   ],
   "location": null,
   "year": null,
   "status": null,
   "area": null,
   "services": [
    "Architecture",
    "3D Visualization"
   ],
   "summary": "Sample project — details to be supplied.",
   "description": [
    "Sample project used to test layout and filtering. Replace this text with the project's own description."
   ],
   "featured": true,
   "order": 2,
   "isSample": true,
   "specs": [
    {
     "label": "Client",
     "value": null
    },
    {
     "label": "Structure",
     "value": null
    },
    {
     "label": "Materials",
     "value": null
    },
    {
     "label": "Floors",
     "value": null
    },
    {
     "label": "Photography",
     "value": null
    }
   ],
   "cover": {
    "alt": "Office — facade (placeholder)",
    "width": 1000,
    "height": 1350,
    "kind": "photo",
    "src": "assets/img/facade-201-1350-dark.webp"
   },
   "hero": {
    "alt": "Office — facade (placeholder)",
    "width": 2400,
    "height": 1000,
    "kind": "photo",
    "src": "assets/img/facade-201-417-dark.webp"
   },
   "chapters": [
    {
     "type": "full",
     "media": {
      "alt": "Office — street elevation (placeholder)",
      "width": 2400,
      "height": 1000,
      "kind": "photo",
      "src": "assets/img/elevation-211-417-dark.webp"
     }
    },
    {
     "type": "trio",
     "media": [
      {
       "alt": "Facade module (placeholder)",
       "width": 1000,
       "height": 1350,
       "kind": "photo",
       "src": "assets/img/facade-212-1350-dark.webp"
      },
      {
       "alt": "Entrance (placeholder)",
       "width": 1200,
       "height": 1200,
       "kind": "photo",
       "src": "assets/img/facade-213-1000-dark.webp"
      },
      {
       "alt": "Lobby (placeholder)",
       "width": 1000,
       "height": 1350,
       "kind": "photo",
       "src": "assets/img/interior-214-1350-dark.webp"
      }
     ]
    },
    {
     "type": "sticky",
     "heading": "Structure",
     "body": "Sample chapter. Describe the structural and material logic of the building here.",
     "media": [
      {
       "alt": "Structural massing (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "model",
       "src": "assets/img/massing-215-625-dark.webp"
      },
      {
       "alt": "Section (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "drawing",
       "src": "assets/img/section-216-625-light.webp"
      }
     ]
    },
    {
     "type": "drawings",
     "title": "Plans",
     "media": [
      {
       "alt": "Typical floor (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "plan",
       "src": "assets/img/plan-217-625-light.webp"
      },
      {
       "alt": "Ground floor (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "plan",
       "src": "assets/img/plan-218-625-light.webp"
      }
     ]
    },
    {
     "type": "full",
     "media": {
      "alt": "Night view (placeholder)",
      "width": 2400,
      "height": 1000,
      "kind": "render",
      "src": "assets/img/elevation-219-417-dark.webp"
     }
    }
   ]
  },
  {
   "slug": "sample-interior-03",
   "title": "Sample Interior 03",
   "typology": "Apartment interior",
   "categories": [
    "interiors",
    "residential"
   ],
   "location": null,
   "year": null,
   "status": null,
   "area": null,
   "services": [
    "Interior Design"
   ],
   "summary": "Sample project — details to be supplied.",
   "description": [
    "Sample project used to test layout and filtering. Replace this text with the project's own description."
   ],
   "featured": true,
   "order": 3,
   "isSample": true,
   "specs": [
    {
     "label": "Client",
     "value": null
    },
    {
     "label": "Structure",
     "value": null
    },
    {
     "label": "Materials",
     "value": null
    },
    {
     "label": "Photography",
     "value": null
    }
   ],
   "cover": {
    "alt": "Apartment — living room (placeholder)",
    "width": 1000,
    "height": 1350,
    "kind": "photo",
    "src": "assets/img/interior-301-1350-dark.webp"
   },
   "hero": {
    "alt": "Apartment — living room (placeholder)",
    "width": 2400,
    "height": 1000,
    "kind": "photo",
    "src": "assets/img/interior-301-417-dark.webp"
   },
   "chapters": [
    {
     "type": "pair",
     "offset": "left",
     "media": [
      {
       "alt": "Living room (placeholder)",
       "width": 1000,
       "height": 1350,
       "kind": "photo",
       "src": "assets/img/interior-311-1350-dark.webp"
      },
      {
       "alt": "Dining area (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "photo",
       "src": "assets/img/interior-312-625-dark.webp"
      }
     ]
    },
    {
     "type": "text-image",
     "heading": "Materials",
     "body": "Sample chapter. Notes on material choices and the palette of the interior.",
     "side": "right",
     "media": {
      "alt": "Material palette (placeholder)",
      "width": 1200,
      "height": 1200,
      "kind": "study",
      "src": "assets/img/study-313-1000-dark.webp"
     }
    },
    {
     "type": "full",
     "media": {
      "alt": "Kitchen (placeholder)",
      "width": 2400,
      "height": 1000,
      "kind": "photo",
      "src": "assets/img/interior-314-417-dark.webp"
     }
    },
    {
     "type": "pair",
     "offset": "right",
     "media": [
      {
       "alt": "Bedroom (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "photo",
       "src": "assets/img/interior-315-625-dark.webp"
      },
      {
       "alt": "Passage (placeholder)",
       "width": 1000,
       "height": 1350,
       "kind": "photo",
       "src": "assets/img/arches-316-1350-dark.webp"
      }
     ]
    },
    {
     "type": "drawings",
     "title": "Layout",
     "media": [
      {
       "alt": "Apartment plan (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "plan",
       "src": "assets/img/plan-317-625-light.webp"
      }
     ]
    }
   ]
  },
  {
   "slug": "sample-villa-04",
   "title": "Sample Villa 04",
   "typology": "Villa",
   "categories": [
    "architecture",
    "residential"
   ],
   "location": null,
   "year": null,
   "status": null,
   "area": null,
   "services": [
    "Architecture",
    "Interior Design",
    "3D Visualization"
   ],
   "summary": "Sample project — details to be supplied.",
   "description": [
    "Sample project used to test layout and filtering. Replace this text with the project's own description."
   ],
   "featured": true,
   "order": 4,
   "isSample": true,
   "specs": [
    {
     "label": "Client",
     "value": null
    },
    {
     "label": "Structure",
     "value": null
    },
    {
     "label": "Materials",
     "value": null
    },
    {
     "label": "Site area",
     "value": null
    },
    {
     "label": "Photography",
     "value": null
    }
   ],
   "cover": {
    "alt": "Villa — arcade (placeholder)",
    "width": 1600,
    "height": 1000,
    "kind": "photo",
    "src": "assets/img/arches-401-625-dark.webp"
   },
   "hero": {
    "alt": "Villa — arcade (placeholder)",
    "width": 2400,
    "height": 1000,
    "kind": "photo",
    "src": "assets/img/arches-401-417-dark.webp"
   },
   "chapters": [
    {
     "type": "full",
     "media": {
      "alt": "Arcade (placeholder)",
      "width": 2400,
      "height": 1000,
      "kind": "photo",
      "src": "assets/img/arches-411-417-dark.webp"
     }
    },
    {
     "type": "compare",
     "title": "Concept to completion",
     "before": {
      "alt": "Concept sketch (placeholder)",
      "width": 1600,
      "height": 1000,
      "kind": "sketch",
      "src": "assets/img/sketch-412-625-light.webp"
     },
     "after": {
      "alt": "Completed building (placeholder)",
      "width": 1600,
      "height": 1000,
      "kind": "photo",
      "src": "assets/img/arches-413-625-dark.webp"
     },
     "labels": [
      "Sketch",
      "Built"
     ]
    },
    {
     "type": "trio",
     "media": [
      {
       "alt": "Courtyard (placeholder)",
       "width": 900,
       "height": 1400,
       "kind": "photo",
       "src": "assets/img/arches-414-1556-dark.webp"
      },
      {
       "alt": "Screen (placeholder)",
       "width": 900,
       "height": 1400,
       "kind": "photo",
       "src": "assets/img/facade-415-1556-dark.webp"
      },
      {
       "alt": "Hall (placeholder)",
       "width": 900,
       "height": 1400,
       "kind": "photo",
       "src": "assets/img/interior-416-1556-dark.webp"
      }
     ]
    },
    {
     "type": "drawings",
     "title": "Drawings",
     "media": [
      {
       "alt": "Section (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "drawing",
       "src": "assets/img/section-417-625-light.webp"
      },
      {
       "alt": "Plan (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "plan",
       "src": "assets/img/plan-418-625-light.webp"
      },
      {
       "alt": "Sketch (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "sketch",
       "src": "assets/img/sketch-419-625-light.webp"
      }
     ]
    },
    {
     "type": "video",
     "video": {
      "id": "sample-film-02",
      "title": "Sample Film 02",
      "kind": "Film",
      "year": null,
      "duration": null,
      "description": "Placeholder entry. Video to be supplied.",
      "poster": {
       "alt": "Poster frame for a sample film",
       "width": 2400,
       "height": 1000,
       "kind": "render",
       "src": "assets/img/elevation-5088-417-dark.webp"
      },
      "src": null,
      "embed": null,
      "isSample": true
     }
    }
   ]
  },
  {
   "slug": "sample-retail-05",
   "title": "Sample Retail Space 05",
   "typology": "Retail interior",
   "categories": [
    "interiors",
    "commercial"
   ],
   "location": null,
   "year": null,
   "status": null,
   "area": null,
   "services": [
    "Interior Design"
   ],
   "summary": "Sample project — details to be supplied.",
   "description": [
    "Sample project used to test layout and filtering. Replace this text with the project's own description."
   ],
   "featured": true,
   "order": 5,
   "isSample": true,
   "specs": [
    {
     "label": "Client",
     "value": null
    },
    {
     "label": "Structure",
     "value": null
    },
    {
     "label": "Materials",
     "value": null
    },
    {
     "label": "Area",
     "value": null
    },
    {
     "label": "Photography",
     "value": null
    }
   ],
   "cover": {
    "alt": "Retail — interior (placeholder)",
    "width": 1600,
    "height": 1000,
    "kind": "photo",
    "src": "assets/img/interior-501-625-dark.webp"
   },
   "hero": {
    "alt": "Retail — interior (placeholder)",
    "width": 2400,
    "height": 1000,
    "kind": "photo",
    "src": "assets/img/interior-501-417-dark.webp"
   },
   "chapters": [
    {
     "type": "pair",
     "offset": "right",
     "media": [
      {
       "alt": "Shopfront (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "photo",
       "src": "assets/img/interior-511-625-dark.webp"
      },
      {
       "alt": "Display wall (placeholder)",
       "width": 1000,
       "height": 1350,
       "kind": "photo",
       "src": "assets/img/facade-512-1350-dark.webp"
      }
     ]
    },
    {
     "type": "full",
     "media": {
      "alt": "Main floor (placeholder)",
      "width": 2400,
      "height": 1000,
      "kind": "photo",
      "src": "assets/img/interior-513-417-dark.webp"
     }
    },
    {
     "type": "sticky",
     "heading": "Fixtures",
     "body": "Sample chapter. Describe bespoke fixtures, joinery and lighting.",
     "media": [
      {
       "alt": "Joinery study (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "study",
       "src": "assets/img/study-514-625-dark.webp"
      },
      {
       "alt": "Display detail (placeholder)",
       "width": 1000,
       "height": 1350,
       "kind": "photo",
       "src": "assets/img/interior-515-1350-dark.webp"
      }
     ]
    },
    {
     "type": "drawings",
     "title": "Layout",
     "media": [
      {
       "alt": "Store plan (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "plan",
       "src": "assets/img/plan-516-625-light.webp"
      }
     ]
    }
   ]
  },
  {
   "slug": "sample-courtyard-06",
   "title": "Sample Courtyard House 06",
   "typology": "Courtyard house",
   "categories": [
    "architecture",
    "residential"
   ],
   "location": null,
   "year": null,
   "status": null,
   "area": null,
   "services": [
    "Architecture"
   ],
   "summary": "Sample project — details to be supplied.",
   "description": [
    "Sample project used to test layout and filtering. Replace this text with the project's own description."
   ],
   "featured": false,
   "order": 6,
   "isSample": true,
   "specs": [
    {
     "label": "Client",
     "value": null
    },
    {
     "label": "Structure",
     "value": null
    },
    {
     "label": "Materials",
     "value": null
    },
    {
     "label": "Photography",
     "value": null
    }
   ],
   "cover": {
    "alt": "Courtyard house — massing (placeholder)",
    "width": 1200,
    "height": 1200,
    "kind": "render",
    "src": "assets/img/massing-601-1000-dark.webp"
   },
   "hero": {
    "alt": "Courtyard house — massing (placeholder)",
    "width": 2400,
    "height": 1000,
    "kind": "render",
    "src": "assets/img/massing-601-417-dark.webp"
   },
   "chapters": [
    {
     "type": "full",
     "media": {
      "alt": "Aerial massing (placeholder)",
      "width": 2400,
      "height": 1000,
      "kind": "render",
      "src": "assets/img/massing-611-417-dark.webp"
     }
    },
    {
     "type": "text-image",
     "heading": "Courtyard",
     "body": "Sample chapter. How the courtyard organises light, air and circulation.",
     "side": "right",
     "media": {
      "alt": "Courtyard (placeholder)",
      "width": 1000,
      "height": 1350,
      "kind": "photo",
      "src": "assets/img/arches-612-1350-dark.webp"
     }
    },
    {
     "type": "trio",
     "media": [
      {
       "alt": "Street (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "photo",
       "src": "assets/img/elevation-613-625-dark.webp"
      },
      {
       "alt": "Screen (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "photo",
       "src": "assets/img/facade-614-625-dark.webp"
      },
      {
       "alt": "Living (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "photo",
       "src": "assets/img/interior-615-625-dark.webp"
      }
     ]
    },
    {
     "type": "drawings",
     "title": "Drawings",
     "media": [
      {
       "alt": "Plan (placeholder)",
       "width": 1200,
       "height": 1200,
       "kind": "plan",
       "src": "assets/img/plan-616-1000-light.webp"
      },
      {
       "alt": "Section (placeholder)",
       "width": 1200,
       "height": 1200,
       "kind": "drawing",
       "src": "assets/img/section-617-1000-light.webp"
      }
     ]
    }
   ]
  },
  {
   "slug": "sample-studio-07",
   "title": "Sample Studio 07",
   "typology": "Workspace interior",
   "categories": [
    "interiors",
    "commercial"
   ],
   "location": null,
   "year": null,
   "status": null,
   "area": null,
   "services": [
    "Interior Design",
    "3D Visualization"
   ],
   "summary": "Sample project — details to be supplied.",
   "description": [
    "Sample project used to test layout and filtering. Replace this text with the project's own description."
   ],
   "featured": false,
   "order": 7,
   "isSample": true,
   "specs": [
    {
     "label": "Client",
     "value": null
    },
    {
     "label": "Structure",
     "value": null
    },
    {
     "label": "Materials",
     "value": null
    },
    {
     "label": "Photography",
     "value": null
    }
   ],
   "cover": {
    "alt": "Workspace — stair (placeholder)",
    "width": 1000,
    "height": 1350,
    "kind": "render",
    "src": "assets/img/form-701-1350-dark.webp"
   },
   "hero": {
    "alt": "Workspace — stair (placeholder)",
    "width": 2400,
    "height": 1000,
    "kind": "render",
    "src": "assets/img/form-701-417-dark.webp"
   },
   "chapters": [
    {
     "type": "pair",
     "offset": "left",
     "media": [
      {
       "alt": "Stair (placeholder)",
       "width": 1000,
       "height": 1350,
       "kind": "photo",
       "src": "assets/img/form-711-1350-dark.webp"
      },
      {
       "alt": "Open workspace (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "photo",
       "src": "assets/img/interior-712-625-dark.webp"
      }
     ]
    },
    {
     "type": "full",
     "media": {
      "alt": "Meeting room (placeholder)",
      "width": 2400,
      "height": 1000,
      "kind": "photo",
      "src": "assets/img/interior-713-417-dark.webp"
     }
    },
    {
     "type": "video",
     "video": {
      "id": "sample-process-03",
      "title": "Sample Process Reel 03",
      "kind": "Process",
      "year": null,
      "duration": null,
      "description": "Placeholder entry. Video to be supplied.",
      "poster": {
       "alt": "Poster frame for a sample process reel",
       "width": 2400,
       "height": 1000,
       "kind": "model",
       "src": "assets/img/massing-5140-417-dark.webp"
      },
      "src": null,
      "embed": null,
      "isSample": true
     }
    }
   ]
  },
  {
   "slug": "sample-pavilion-08",
   "title": "Sample Pavilion 08",
   "typology": "Pavilion",
   "categories": [
    "architecture",
    "other"
   ],
   "location": null,
   "year": null,
   "status": null,
   "area": null,
   "services": [
    "Architecture",
    "3D Visualization"
   ],
   "summary": "Sample project — details to be supplied.",
   "description": [
    "Sample project used to test layout and filtering. Replace this text with the project's own description."
   ],
   "featured": false,
   "order": 8,
   "isSample": true,
   "specs": [
    {
     "label": "Client",
     "value": null
    },
    {
     "label": "Structure",
     "value": null
    },
    {
     "label": "Materials",
     "value": null
    },
    {
     "label": "Photography",
     "value": null
    }
   ],
   "cover": {
    "alt": "Pavilion — elevation (placeholder)",
    "width": 1500,
    "height": 1100,
    "kind": "render",
    "src": "assets/img/elevation-801-733-dark.webp"
   },
   "hero": {
    "alt": "Pavilion — elevation (placeholder)",
    "width": 2400,
    "height": 1000,
    "kind": "render",
    "src": "assets/img/elevation-801-417-dark.webp"
   },
   "chapters": [
    {
     "type": "full",
     "media": {
      "alt": "Pavilion (placeholder)",
      "width": 2400,
      "height": 1000,
      "kind": "render",
      "src": "assets/img/elevation-811-417-dark.webp"
     }
    },
    {
     "type": "pair",
     "offset": "right",
     "media": [
      {
       "alt": "Model (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "model",
       "src": "assets/img/massing-812-625-dark.webp"
      },
      {
       "alt": "Section (placeholder)",
       "width": 1600,
       "height": 1000,
       "kind": "drawing",
       "src": "assets/img/section-813-625-light.webp"
      }
     ]
    },
    {
     "type": "full",
     "media": {
      "alt": "Interior (placeholder)",
      "width": 2400,
      "height": 1000,
      "kind": "render",
      "src": "assets/img/arches-814-417-dark.webp"
     }
    }
   ]
  }
 ],
 "videos": [
  {
   "id": "sample-walkthrough-01",
   "title": "Sample Walkthrough 01",
   "kind": "Walkthrough",
   "year": null,
   "duration": null,
   "description": "Placeholder entry. Video to be supplied.",
   "poster": {
    "alt": "Poster frame for a sample walkthrough",
    "width": 2400,
    "height": 1000,
    "kind": "render",
    "src": "assets/img/interior-5021-417-dark.webp"
   },
   "src": null,
   "embed": null,
   "isSample": true
  },
  {
   "id": "sample-film-02",
   "title": "Sample Film 02",
   "kind": "Film",
   "year": null,
   "duration": null,
   "description": "Placeholder entry. Video to be supplied.",
   "poster": {
    "alt": "Poster frame for a sample film",
    "width": 2400,
    "height": 1000,
    "kind": "render",
    "src": "assets/img/elevation-5088-417-dark.webp"
   },
   "src": null,
   "embed": null,
   "isSample": true
  },
  {
   "id": "sample-process-03",
   "title": "Sample Process Reel 03",
   "kind": "Process",
   "year": null,
   "duration": null,
   "description": "Placeholder entry. Video to be supplied.",
   "poster": {
    "alt": "Poster frame for a sample process reel",
    "width": 2400,
    "height": 1000,
    "kind": "model",
    "src": "assets/img/massing-5140-417-dark.webp"
   },
   "src": null,
   "embed": null,
   "isSample": true
  }
 ],
 "art": [
  {
   "id": "sample-art-01",
   "title": "Sample Sketch 01",
   "kind": "sketch",
   "year": null,
   "medium": null,
   "isSample": true,
   "media": {
    "alt": "Sample Sketch 01 — placeholder",
    "width": 1000,
    "height": 1350,
    "kind": "sketch",
    "src": "assets/img/sketch-11-1350-light.webp"
   }
  },
  {
   "id": "sample-art-02",
   "title": "Sample Study 02",
   "kind": "study",
   "year": null,
   "medium": null,
   "isSample": true,
   "media": {
    "alt": "Sample Study 02 — placeholder",
    "width": 1600,
    "height": 1100,
    "kind": "study",
    "src": "assets/img/study-12-688-dark.webp"
   }
  },
  {
   "id": "sample-art-03",
   "title": "Sample 3D 03",
   "kind": "3d",
   "year": null,
   "medium": null,
   "isSample": true,
   "media": {
    "alt": "Sample 3D 03 — placeholder",
    "width": 1200,
    "height": 1200,
    "kind": "model",
    "src": "assets/img/massing-13-1000-dark.webp"
   }
  },
  {
   "id": "sample-art-04",
   "title": "Sample Drawing 04",
   "kind": "drawing",
   "year": null,
   "medium": null,
   "isSample": true,
   "media": {
    "alt": "Sample Drawing 04 — placeholder",
    "width": 1600,
    "height": 1100,
    "kind": "drawing",
    "src": "assets/img/plan-14-688-light.webp"
   }
  },
  {
   "id": "sample-art-05",
   "title": "Sample Concept 05",
   "kind": "concept",
   "year": null,
   "medium": null,
   "isSample": true,
   "media": {
    "alt": "Sample Concept 05 — placeholder",
    "width": 900,
    "height": 1500,
    "kind": "render",
    "src": "assets/img/form-15-1667-dark.webp"
   }
  },
  {
   "id": "sample-art-06",
   "title": "Sample Sketch 06",
   "kind": "sketch",
   "year": null,
   "medium": null,
   "isSample": true,
   "media": {
    "alt": "Sample Sketch 06 — placeholder",
    "width": 2000,
    "height": 1000,
    "kind": "sketch",
    "src": "assets/img/sketch-16-500-light.webp"
   }
  },
  {
   "id": "sample-art-07",
   "title": "Sample Drawing 07",
   "kind": "drawing",
   "year": null,
   "medium": null,
   "isSample": true,
   "media": {
    "alt": "Sample Drawing 07 — placeholder",
    "width": 1000,
    "height": 1350,
    "kind": "drawing",
    "src": "assets/img/section-17-1350-light.webp"
   }
  },
  {
   "id": "sample-art-08",
   "title": "Sample 3D 08",
   "kind": "3d",
   "year": null,
   "medium": null,
   "isSample": true,
   "media": {
    "alt": "Sample 3D 08 — placeholder",
    "width": 1600,
    "height": 1100,
    "kind": "model",
    "src": "assets/img/massing-18-688-light.webp"
   }
  },
  {
   "id": "sample-art-09",
   "title": "Sample Concept 09",
   "kind": "concept",
   "year": null,
   "medium": null,
   "isSample": true,
   "media": {
    "alt": "Sample Concept 09 — placeholder",
    "width": 1200,
    "height": 1200,
    "kind": "render",
    "src": "assets/img/arches-19-1000-dark.webp"
   }
  },
  {
   "id": "sample-art-10",
   "title": "Sample Study 10",
   "kind": "study",
   "year": null,
   "medium": null,
   "isSample": true,
   "media": {
    "alt": "Sample Study 10 — placeholder",
    "width": 1000,
    "height": 1350,
    "kind": "study",
    "src": "assets/img/study-20-1350-dark.webp"
   }
  },
  {
   "id": "sample-art-11",
   "title": "Sample Sketch 11",
   "kind": "sketch",
   "year": null,
   "medium": null,
   "isSample": true,
   "media": {
    "alt": "Sample Sketch 11 — placeholder",
    "width": 1600,
    "height": 1100,
    "kind": "sketch",
    "src": "assets/img/sketch-21-688-light.webp"
   }
  },
  {
   "id": "sample-art-12",
   "title": "Sample Concept 12",
   "kind": "concept",
   "year": null,
   "medium": null,
   "isSample": true,
   "media": {
    "alt": "Sample Concept 12 — placeholder",
    "width": 1200,
    "height": 1200,
    "kind": "render",
    "src": "assets/img/form-22-1000-dark.webp"
   }
  },
  {
   "id": "sample-art-13",
   "title": "Sample 3D 13",
   "kind": "3d",
   "year": null,
   "medium": null,
   "isSample": true,
   "media": {
    "alt": "Sample 3D 13 — placeholder",
    "width": 900,
    "height": 1500,
    "kind": "model",
    "src": "assets/img/facade-23-1667-dark.webp"
   }
  },
  {
   "id": "sample-art-14",
   "title": "Sample Drawing 14",
   "kind": "drawing",
   "year": null,
   "medium": null,
   "isSample": true,
   "media": {
    "alt": "Sample Drawing 14 — placeholder",
    "width": 1200,
    "height": 1200,
    "kind": "drawing",
    "src": "assets/img/plan-24-1000-light.webp"
   }
  }
 ]
};
