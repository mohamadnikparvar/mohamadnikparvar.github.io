/* ============================================================
   PORTFOLIO CONTENT — this is the only file you need to edit.
   ------------------------------------------------------------
   • Add a case study:   copy one object in `caseStudies` and change it.
   • Add a job:          copy one object in `experience`.
   • Add a process demo: copy one object in `processes`.
   • Anything with `sample: true` shows a small "Sample" badge on
     the site. Replace the text with your real details, then delete
     the `sample: true` line.
   ============================================================ */

window.PORTFOLIO = {
  profile: {
    name: "Mohamad Nikparvar",
    initials: "MN",
    headline: "Product Owner · Odoo ERP Lead · Supply Chain",
    tagline: "I turn difficult business problems into simple systems, and lead the teams that ship them.",
    location: "Tabriz, Iran",
    available: "Accepting Odoo implementation projects",
    bio: [
      "Studying Industrial Engineering at Sharif University of Technology made me love how businesses work. When I discovered Odoo, I found the place where that interest and my software background meet, and I moved into ERP.",
      "What I enjoy most is analyzing a business, finding the real problem, and turning a difficult situation into something simple. I also love leading teams and helping people achieve more than they thought they could.",
      "Today I'm a Product Owner at Bulut, where I lead supply chain product development. Part-time, I lead Odoo implementation for Elison (Huger Holding), and I run my own Odoo team for clients across Iran. My MBA thesis studied what makes ERP rollouts succeed, and I'm preparing for the PhD entrance exam in management."
    ],
    photo: "assets/photo.jpg",            // Empty = initials avatar.
    sketch: "assets/photo-sketch.png",    // Pencil version. After changing the photo, run: python3 tools/make_sketch.py
    email: "muhammad10nikparvar@gmail.com",
    phone: "+98 914 850 2709",            // shown in Contact; set to "" to hide
    website: "https://mohamadnikparvar.github.io",
    linkedin: "https://www.linkedin.com/in/mohamad-nikparvar-5214aa209/",
    github: "https://github.com/mohamadnikparvar",
    cv: "cv.pdf"                          // Empty = button hidden.
  },

  // Big numbers shown in the Highlights widget.
  highlights: [
    { value: 8, label: "companies on Odoo in 3 months" },
    { value: 100, suffix: "+", label: "users live across 4 countries" },
    { value: 30, prefix: "$", suffix: "K", label: "saved every year" }
  ],

  // ---- Used by the scrolling site (index.html) ----
  // Big numbers in the "Impact" strip.
  impact: [
    { value: 8, label: "companies moved to Odoo in 3 months" },
    { value: 3, suffix: " mo", label: "to ship a WMS that had stalled for 2 years" },
    { value: 100, suffix: "+", label: "users live across 4 countries" },
    { value: 30, prefix: "$", suffix: "K", label: "saved every year" }
  ],
  // What I love doing (About section).
  loves: [
    { title: "Analyzing businesses", text: "Finding the real problem behind the symptoms, then designing the solution." },
    { title: "Making hard things simple", text: "Turning difficult, messy situations into processes people can follow." },
    { title: "Leading teams", text: "Helping my team achieve more than they thought they could, and solving problems together." }
  ],
  // Names in the scrolling strip under the hero.
  clients: ["Shoniz", "Elison", "D3", "NextLayer", "Syngenta", "Gilsa", "BiNiCi", "Aref Saze Sadra", "Zebrang", "Rayshan", "Baghboon", "Evimo", "Saman Daroo"],
  // Words that rotate in the hero ("I'm a ...").
  roles: ["Product Owner", "Odoo ERP Lead", "Business Analyst", "Team Lead"],

  experience: [
    {
      role: "Product Owner",
      company: "Bulut (Shoniz Tech Team) · Tabriz, on-site",
      period: "Jan 2026 — Present",
      summary: "Lead supply chain product development for a team that had gone about two years without a major release.",
      points: [
        "Introduced Scrum and an SDLC-based delivery process.",
        "Own four modules: Warehouse Management System (WMS / Inventory), Procurement, Cataloging and Warehouse Request.",
        "Rebuilt the WMS from scratch and launched the MVP in 3 months, after a previous two-year effort failed to ship it. It's now in use at Shoniz.",
        "Shipped four major releases in 8 months.",
        "Prototyped the Procurement module (ProcureFlow) in under a week from stakeholder user stories, using AI and Odoo 19 Purchase as a reference.",
        "Own the backlog, PRDs, BRDs, user stories and acceptance criteria."
      ],
      tags: ["Scrum", "Supply chain", "WMS", "Azure DevOps"]
    },
    {
      role: "ERP Implementation Team Lead",
      company: "Elison (Huger Holding) · Dubai, remote, part-time",
      period: "May 2025 — Present",
      summary: "Lead the Odoo rollout across 8 companies in the holding, in the UAE, KSA, Iraq and Pakistan.",
      points: [
        "Went live in 3 months, against 7 to 8 months estimated by other teams.",
        "100+ users live across D3 (multi-company), IX, NextLayer and Elison.",
        "Saves $30K per year by replacing the previous system before its contract renewal.",
        "Implemented Supply Chain, HR, CRM, Project and Marketing modules; led data migration, UAT and training."
      ],
      tags: ["Odoo", "Multi-company", "Data migration", "UAT"]
    },
    {
      role: "Odoo Implementation Lead",
      company: "Independent, with my own team",
      period: "Jun 2023 — Present",
      summary: "Deliver Odoo ERP projects for companies across several industries, mostly supply chain modules.",
      points: [
        "Core team: an accounting manager who implements the accounting modules and two developers, plus specialists per project.",
        "Clients include Syngenta, Gilsa, BiNiCi, Aref Saze Sadra, Zebrang, Rayshan and Baghboon.",
        "Odoo app expert on further projects, including Evimo (Istanbul) and Saman Daroo (Mashhad).",
        "Run each project end to end: requirements, process mapping, configuration, migration, UAT and training."
      ],
      tags: ["Odoo", "Inventory", "Purchase", "Manufacturing"]
    },
    {
      role: "ERP Implementation Consultant",
      company: "Altech Electric Ltd · Tehran, remote, part-time",
      period: "Dec 2025 — May 2026",
      summary: "Consulted on Odoo ERP implementation and ROI analysis.",
      points: [],
      tags: ["Odoo", "ROI analysis"]
    },
    {
      role: "Front-end Developer",
      company: "Sonat (sonat.com) · California, remote",
      period: "Oct 2022 — Oct 2023",
      summary: "Built web application interfaces with Next.js, React and TypeScript.",
      points: [],
      tags: ["Next.js", "React", "TypeScript"]
    },
    {
      role: "Front-end Developer",
      company: "Shab (shab.ir) · Tehran, remote",
      period: "Dec 2021 — 2022",
      summary: "Built web application interfaces with Next.js, React and TypeScript.",
      points: [],
      tags: ["Next.js", "React", "TypeScript"]
    }
  ],

  caseStudies: [
    {
      id: "odoo-8-companies",
      title: "Odoo across 8 companies in 3 months",
      area: "ERP · Multi-company rollout",
      system: "Odoo",
      year: "2025",
      problem: "Elison's holding was paying for a system with a contract renewal coming up. Other teams estimated 7 to 8 months to move 8 companies in 4 countries to Odoo, which was too slow to avoid the renewal.",
      approach: [
        "Analyzed how each company worked and mapped the gaps against Odoo.",
        "Set up a multi-company structure for D3 across the UAE, KSA, Iraq and Pakistan, plus IX, NextLayer and Elison.",
        "Implemented Supply Chain, HR, CRM, Project and Marketing modules.",
        "Led data migration, UAT and user training, then optimized after go-live."
      ],
      results: [
        { value: "3 months", label: "to go live, vs 7–8 estimated" },
        { value: "100+", label: "users live" },
        { value: "$30K", label: "saved per year" }
      ],
      tags: ["Odoo", "Multi-company", "Data migration", "Training"]
    },
    {
      id: "bulut-restart",
      title: "Restarting a stalled supply chain product",
      area: "Product · Supply chain",
      system: "In-house product",
      year: "2026",
      problem: "The supply chain product team at Bulut had gone about two years without a major release. A previous two-year attempt at the Warehouse Management System (Inventory) had never shipped. When my team and I said we could deliver it in 3 months, almost nobody believed us.",
      approach: [
        "Introduced Scrum and an SDLC-based delivery process.",
        "Restarted the WMS from scratch with a tight MVP scope, documented in PRDs and BRDs.",
        "Built one prioritized backlog across four modules: WMS, Procurement, Cataloging and Warehouse Request.",
        "Started daily stand-ups with developers and weekly sessions with stakeholders."
      ],
      results: [
        { value: "3 months", label: "to the WMS MVP, after 2 stalled years" },
        { value: "Live", label: "in use at Shoniz" },
        { value: "4", label: "major releases in 8 months" }
      ],
      tags: ["Scrum", "WMS", "Procurement", "PRD / BRD"]
    },
    {
      id: "wms-prototype",
      title: "Warehouse Management System: from scope to prototype",
      area: "Product · WMS",
      system: "In-house product",
      year: "2026",
      problem: "Before building, the team and stakeholders needed one shared picture of everything a complete WMS had to do, from warehouses and tanks to mobile scanners, and a prototype people could click through before any development time was spent.",
      approach: [
        "Mapped the full scope with stakeholders into 8 areas and 77 features, from warehouse setup to mobile (PDA) operations and dashboards.",
        "Designed multi-stage receipts and deliveries with quality control, quantity control, putaway and picking.",
        "Added location and item-based physical counts with manager and finance approval.",
        "Built a clickable prototype with 15 screens, including live tank monitoring with sensors and alerts, to validate flows with users before development."
      ],
      results: [
        { value: "77", label: "features mapped in 8 areas" },
        { value: "15", label: "screens in the prototype" },
        { value: "3 months", label: "to the WMS MVP" }
      ],
      tags: ["Product discovery", "Scope mapping", "Prototyping", "WMS", "Quality control"],
      // Interactive scope map (from the NotebookLM mind map). branches -> children -> items.
      mindmap: {
        root: "Warehouse Management System",
        image: "assets/wms-mindmap.jpg",
        branches: [
          { name: "Warehouse configuration", children: [
            { name: "Warehouse types & definitions", items: ["Warehouse type definition (tag categories)", "Type deletion only with no linked warehouses", "Type editing with warning prompt", "Warehouse definition: code, name, type, status, site, location", "Editing active warehouses only with no tasks in progress", "Warehouse deletion & deactivation rules", "Warehouse types list", "Warehouses list view"] },
            { name: "Hierarchical locations", items: ["Location type definition", "Location type editing & deletion", "Location definition: name, parent, rules, type, environment", "Location deletion & deactivation rules", "QR barcode printing for shelves", "Location editing", "Location tree view", "Location types list"] },
            { name: "Sites", items: ["Site definition", "Site editing & deletion only with no active warehouses"] },
            { name: "Reason codes", items: ["Scrap reasons", "Return reasons", "Receipt cancellation reasons"] }
          ] },
          { name: "Inventory management", children: [
            { name: "Inventory reports", items: ["Item & location breakdown", "System, available, reserved and forecasted stock", "Storage units & conversion rules"] },
            { name: "Minimum stock & replenishment", items: ["Min / max planning with lead time", "In stock, low stock and out of stock statuses", "Stock rule editing & deletion"] }
          ] },
          { name: "Physical counts", children: [
            { name: "Location-based counts", items: ["Warehouse list & count overview", "Active counts & history", "Count creation & assignment", "Manager approval: variance check & re-count", "Finance approval: system update & final posting", "Count history per location"] },
            { name: "Item-based counts", items: ["Item count list", "Count creation & assignment", "Expert approval", "Finance approval", "Item count history"] }
          ] },
          { name: "Transfers", children: [
            { name: "Inbound goods receipt", items: ["Transfers list", "Receipt vouchers", "Goods entry stage", "Quality control (QC) stage", "Quantity control stage", "Putaway stage", "Completed receipt items", "Receipt types: purchase, return, production, transfer"] },
            { name: "Outbound delivery", items: ["Delivery vouchers list", "Delivery voucher creation", "Draft deliveries", "Picking stage", "Delivery & handover stage", "Completed delivery items", "Pending purchase items", "Items returned to expert", "Delivery types: sales, return to vendor, production"] }
          ] },
          { name: "Mobile warehouse app (PDA)", items: ["Dashboard & task management", "Location & item counts", "Quality control inspection", "Quantity control counting", "Putaway", "Picking"] },
          { name: "Access control", items: ["Access groups", "Group members", "Feature permissions", "Site & warehouse scope", "Combined user access", "Three-layer model: role, permission, scope"] },
          { name: "Phase two enhancements", items: ["Site & warehouse names on every screen", "Combined stock for parent locations", "System stock shown on zero counts", "Conversion rates on items", "Cataloging & request system integration", "Receipt & delivery type definitions", "Receipt actions: rework, scrap, return, approve"] },
          { name: "Dashboards", items: ["Counts: variance & accuracy", "Receipts & deliveries: processing times & volumes", "Inventory: stock status, turnover & slow movers"] }
        ]
      },
      gallery: [
        { src: "assets/wms3-dashboard.jpg", caption: "Management dashboard" },
        { src: "assets/wms3-tanks.jpg", caption: "Live tank monitoring with sensors and alerts" },
        { src: "assets/wms3-qc.jpg", caption: "Quality control" },
        { src: "assets/wms3-counts.jpg", caption: "Physical counts with approvals" },
        { src: "assets/wms3-locations.jpg", caption: "Hierarchical locations" }
      ],
      prototype: { href: "prototypes/wms.html", label: "Open the WMS prototype (v3)" }
    },
    {
      id: "procureflow",
      title: "ProcureFlow: a procurement module in under a week",
      area: "Product · Procurement",
      system: "Prototype",
      year: "2026",
      problem: "Procurement was the next module at Bulut. Stakeholders needed to see and test the whole purchasing flow early, before the team committed development time.",
      approach: [
        "Turned stakeholders' user stories into the screens and flows of the module.",
        "Used Odoo 19's Purchase module as a reference for proven purchasing practice: requests, RFQs, vendor quotes and purchase orders.",
        "Built it with AI-assisted prototyping, so stakeholders could click through a working version within days.",
        "Designed a drag-and-drop procurement board, an approval inbox, a supplier panel, a supplier list, pricing and purchasing regulations."
      ],
      results: [
        { value: "< 1 week", label: "from user stories to working prototype" },
        { value: "8", label: "screens" },
        { value: "Odoo 19", label: "Purchase as the reference model" }
      ],
      tags: ["AI prototyping", "User stories", "Procurement", "Odoo 19"],
      gallery: [
        { src: "assets/proc-kanban.jpg", caption: "Drag-and-drop board: request → RFQ → quote → purchase order" },
        { src: "assets/proc-dashboard.jpg", caption: "Purchasing dashboard" },
        { src: "assets/proc-kartabl.jpg", caption: "Approval inbox" },
        { src: "assets/proc-suppliers.jpg", caption: "Supplier list" },
        { src: "assets/proc-pricing.jpg", caption: "Pricing" }
      ],
      prototype: { href: "prototypes/procurement.html", label: "Open ProcureFlow" }
    },
    {
      id: "odoo-clients",
      title: "Odoo for supply chain teams",
      area: "ERP · Client projects",
      system: "Odoo",
      year: "2023 – now",
      problem: "Manufacturers and distributors across Iran needed their inventory, purchasing and production running in one system.",
      approach: [
        "Lead my own team: an accounting manager for the accounting modules and two developers, adding specialists when a project needs them.",
        "Map each client's processes, then configure Inventory, Purchase, Manufacturing and Sales.",
        "Handle data migration, UAT and training through to go-live."
      ],
      results: [
        { value: "7+", label: "client companies" },
        { value: "4", label: "cities: Tehran, Isfahan, Tabriz, Shiraz" }
      ],
      tags: ["Odoo", "Inventory", "Manufacturing", "Team lead"]
    }
  ],

  // Master's thesis (Research app).
  research: {
    title: "What really drives a successful ERP rollout?",
    formalTitle: "A Model of the Drivers of ERP Implementation: a case study at Shoniz (Dadash Baradar Industrial Co.)",
    school: "Islamic Azad University, Tabriz",
    degree: "MBA, Finance",
    year: "2026",
    summary: "Many ERP projects miss their goals because teams focus on the technology and neglect management, organization and people. I surveyed managers, specialists and ERP users at Shoniz to find which drivers actually predict a successful rollout, and by how much.",
    stats: [
      { value: "250", label: "managers and users surveyed" },
      { value: "48 → 18", label: "questions refined by experts and factor analysis" },
      { value: "0.95", label: "reliability (Cronbach's alpha)" },
      { value: "53%", label: "of rollout success explained (R²)" }
    ],
    insight: "Top-management support is necessary, but not enough. Its effect only shows up when it turns into execution: a capable team, budget control, user training and solid infrastructure.",
    drivers: [
      { name: "Project execution & technical infrastructure", alone: 0.656, together: 0.667 },
      { name: "Data quality & process standardization", alone: 0.558, together: 0.356 },
      { name: "Top-management support & readiness", alone: 0.399, together: -0.274 }
    ],
    driversNote: "Standardized coefficients, all significant at p < 0.001. Management support is positive on its own, but once execution is taken into account it adds nothing independent: its value flows through execution.",
    current: [
      { name: "Project execution", score: 3.95 },
      { name: "Management support", score: 3.99 },
      { name: "Data quality & processes", score: 3.36, flag: "Lowest score, biggest room to improve" },
      { name: "Rollout success", score: 3.91 }
    ],
    recommendations: [
      { title: "Strengthen execution", points: ["Clear, measurable goals and budget tracking for each module", "An in-house team with both IT and process expertise", "Training before and after launch, and with every new feature", "Phased rollout, evaluating each phase before the next"] },
      { title: "Fix data and processes", points: ["Clean master data: item codes, units, warehouse records", "Document and standardize warehouse, request and production processes", "A data owner and input-quality rules for every module"] },
      { title: "Turn support into resources", points: ["Convert verbal support into people, responsibilities and budget", "Involve key users in defining requirements", "Back gradual expansion to finance, sales and HR"] }
    ],
    methods: ["TOE framework", "DeLone & McLean IS success model", "Lawshe content validity", "Exploratory & confirmatory factor analysis", "Multiple regression", "SPSS 26", "Python (factor_analyzer, semopy)"],
    slides: "assets/erp-thesis-defense.pdf"
  },

  // My Odoo implementation methodology (Methodology app).
  // decision: true draws the step as a review gate. loopTo = the phase it sends work back to.
  methodology: {
    intro: "The structured approach I created and use to implement Odoo in different companies. Every project moves through these phases, with a review gate before any data is migrated.",
    image: "assets/odoo-methodology.jpg",
    phases: [
      { name: "Project Kick-off", tasks: ["Project initiation", "Stakeholder alignment", "Scope and objectives", "Project plan and timeline"] },
      { name: "Business Discovery & Analysis", tasks: ["Business process workshops", "As-Is analysis", "To-Be design", "Requirements gathering", "Gap analysis"] },
      { name: "Solution Design", tasks: ["Solution architecture", "Functional design", "Technical design", "Integration design", "Detailed planning"] },
      { name: "System Configuration", tasks: ["Odoo setup", "Module configuration", "Workflow setup", "User roles and access", "Customization, if needed"] },
      { name: "Review & Approval", decision: true, loopTo: 3, tasks: ["Solution review", "Walkthrough", "Validation", "Approval to proceed"] },
      { name: "Data Migration", tasks: ["Data cleansing", "Data preparation", "Data migration", "Data validation"] },
      { name: "Testing (UAT)", tasks: ["Test planning", "Scenario execution", "Issue tracking", "User acceptance", "Sign-off"] },
      { name: "Go-Live", tasks: ["Final data migration", "System deployment", "Go-live checklist", "Project go-live"] },
      { name: "Hypercare & Support", tasks: ["Hypercare support", "Issue resolution", "User assistance", "System stabilization", "Project handover"] }
    ]
  },

  // Ways to work with me (Services app).
  services: {
    intro: "Flexible ways to work together, depending on what your business needs.",
    image: "assets/odoo-services.jpg",
    items: [
      {
        name: "Full Implementation",
        tagline: "End-to-end Odoo implementation",
        text: "A complete Odoo rollout, from analyzing your needs to go-live and initial support, following my methodology.",
        points: ["Kick-off and planning", "Business analysis and requirements", "Solution design and configuration", "Data migration and testing", "Training, go-live and hypercare"],
        pricing: "Fixed price, proposed scope"
      },
      {
        name: "Consulting by the Hour",
        tagline: "Expert advice, as you need it",
        text: "Buy consulting hours and use our experts on the modules you need.",
        points: ["Flexible and on demand", "Certified Odoo experts", "Per-hour usage tracking", "Focus on your priorities", "Remote or on-site"],
        pricing: "Hourly"
      },
      {
        name: "Training Workshops",
        tagline: "Learn. Apply. Succeed.",
        text: "Step-by-step training on selected modules for your key users and stakeholders.",
        points: ["Module-based workshops", "Step-by-step learning path", "Hands-on exercises", "Best practices and real scenarios", "Empowered key users"],
        pricing: "Per workshop or program"
      },
      {
        name: "Consulting + Training",
        tagline: "Consult. Learn. Implement.",
        text: "Expert consulting combined with practical training, for the fastest adoption.",
        points: ["Purchased hours used for consulting", "Structured workshops", "Practical guidance and mentoring", "Faster adoption", "Ongoing support and improvement"],
        pricing: "Hybrid: hours + workshops"
      }
    ]
  },

  // Interactive process maps in the Process Lab app.
  // lanes: the swimlanes. steps: in order. lane = index into lanes. manual: true = highlighted as a pain point.
  processes: [
    {
      id: "p2p",
      name: "Procure-to-Pay",
      lanes: ["Requester", "Procurement", "Finance"],
      asIs: {
        steps: [
          { lane: 0, label: "Email request", manual: true },
          { lane: 1, label: "Manager OK", manual: true },
          { lane: 1, label: "Director OK", manual: true },
          { lane: 1, label: "Create PO" },
          { lane: 2, label: "Match by hand", manual: true },
          { lane: 2, label: "CFO OK", manual: true },
          { lane: 2, label: "Pay supplier" }
        ],
        metrics: { "Cycle time": "9 days", "Manual steps": "5", "Visibility": "None" }
      },
      toBe: {
        steps: [
          { lane: 0, label: "Request in ERP" },
          { lane: 1, label: "Rule approval" },
          { lane: 1, label: "Auto PO" },
          { lane: 2, label: "3-way match" },
          { lane: 2, label: "Pay supplier" }
        ],
        metrics: { "Cycle time": "3 days", "Manual steps": "0", "Visibility": "Live status" }
      },
      sample: true
    },
    {
      id: "o2c",
      name: "Order-to-Cash",
      lanes: ["Customer", "Sales", "Warehouse", "Finance"],
      asIs: {
        steps: [
          { lane: 0, label: "Phone order", manual: true },
          { lane: 1, label: "Retype order", manual: true },
          { lane: 1, label: "Check stock", manual: true },
          { lane: 2, label: "Pick & ship" },
          { lane: 3, label: "Excel invoice", manual: true },
          { lane: 3, label: "Chase payment", manual: true }
        ],
        metrics: { "Cycle time": "11 days", "Manual steps": "5", "Errors": "~8%" }
      },
      toBe: {
        steps: [
          { lane: 0, label: "Online order" },
          { lane: 1, label: "Auto credit check" },
          { lane: 2, label: "Pick & ship" },
          { lane: 3, label: "Auto invoice" },
          { lane: 3, label: "Dunning rules" }
        ],
        metrics: { "Cycle time": "4 days", "Manual steps": "0", "Errors": "<1%" }
      },
      sample: true
    }
  ],

  skills: [
    { group: "Product", items: ["Product ownership", "Backlog management", "User stories", "Acceptance criteria", "Project management", "Sprint planning", "Roadmapping", "OKRs", "PRD / BRD", "Scrum", "AI-assisted prototyping", "Scope mapping"] },
    { group: "ERP & Odoo", items: ["Odoo implementation", "Configuration & customization", "Odoo Studio", "Multi-company setup", "Data migration", "UAT", "User training", "ROI analysis"] },
    { group: "Supply chain", items: ["Inventory", "Warehouse management (WMS)", "Procurement", "Purchasing", "Manufacturing", "Sales", "POS", "CRM"] },
    { group: "Business analysis", items: ["Requirements engineering", "BPM", "As-Is / To-Be mapping", "Gap analysis", "Requirement elicitation", "Solution design"] },
    { group: "Tools & tech", items: ["Azure DevOps", "Microsoft Azure", "ClickUp", "Trello", "Figma", "React", "Next.js", "TypeScript"] }
  ],

  education: [
    {
      school: "Sharif University of Technology",
      place: "Tehran, Iran",
      degree: "Bachelor of Science",
      field: "Industrial Engineering",
      period: "2017 — 2023",
      note: "Iran's leading engineering university, where I learned to see a business as a system of processes, data and people."
    },
    {
      school: "Islamic Azad University",
      place: "Tabriz, Iran",
      degree: "Master of Business Administration (MBA)",
      field: "Finance",
      period: "2023 — 2026",
      note: "Thesis: a model of the drivers of ERP implementation, based on a survey of 250 managers and users at Shoniz."
    },
    {
      school: "PhD in Management",
      place: "Iran",
      degree: "Next step",
      field: "",
      period: "Entrance exam now · starting 2027",
      note: "Preparing for the national PhD entrance exam in management, to continue researching how organizations adopt ERP."
    }
  ],

  // Persian section (helps people find the site when searching in Persian)
  fa: {
    title: "سید محمد نیک‌پرور",
    subtitle: "مالک محصول، تحلیلگر کسب‌وکار و سرپرست تیم استقرار اودو (Odoo)",
    paragraphs: [
      "سید محمد نیک‌پرور هستم؛ مالک محصول (Product Owner) و سرپرست تیم استقرار اودو. در استقرار ای‌آر‌پی (ERP) و سیستم مدیریت جامع سازمان، مدیریت پروژه، تحلیل کسب‌وکار و زنجیره تأمین کار می‌کنم.",
      "استقرار اودو در ۸ شرکت هلدینگ در امارات، عربستان، عراق و پاکستان را در ۳ ماه به نتیجه رساندم؛ با بیش از ۱۰۰ کاربر فعال و صرفه‌جویی سالانهٔ ۳۰ هزار دلار. در شرکت بولوت، سیستم مدیریت انبار (WMS) را که دو سال متوقف مانده بود، در ۳ ماه به نسخهٔ اول رساندیم و اکنون در شونیز استفاده می‌شود.",
      "فارغ‌التحصیل مهندسی صنایع از دانشگاه صنعتی شریف و کارشناسی ارشد مدیریت کسب‌وکار هستم. پایان‌نامه‌ام دربارهٔ پیشران‌های استقرار موفق ERP بوده و برای دکتری مدیریت آماده می‌شوم."
    ],
    services: ["استقرار کامل اودو", "مشاورهٔ ساعتی اودو", "آموزش ماژول‌های اودو", "مدیریت پروژهٔ استقرار ای‌آر‌پی", "تحلیل و بازطراحی فرآیندها"],
    cta: "برای پروژه‌های استقرار اودو و ای‌آر‌پی در ایران و منطقه، با من در تماس باشید."
  },

  honors: [
    { title: "Top 1% in Iran's national university entrance exam (Konkur)", detail: "Mathematics and Physics, among more than 130,000 candidates", year: "2017" }
  ],

  certifications: [
    { name: "Odoo Functional Certification", issuer: "Odoo", year: "2024" },
    { name: "IBM Data Science Professional Certificate", issuer: "Coursera", year: "2021" }
  ],

  languages: ["Persian (native)", "English (professional)", "Azerbaijani Turkish", "Turkish"]
};
