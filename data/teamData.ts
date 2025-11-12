import { ProjectStage } from '@/types/team';

export const initialTeamData: ProjectStage[] = [
  {
    id: 'stage-1',
    title: 'Stage 1, Concept & Design',
    consultants: [
      { 
        id: 'bd-1', 
        role: 'Building Designer', 
        icon: '🧑‍🎨', 
        status: 'required',
        category: 'Consultant',
        whyNeeded: 'Creates detailed architectural plans and ensures your design meets building codes and planning requirements',
        whenNeeded: 'Early stage - before DA submission. Required throughout concept and construction documentation phases',
        notes: 'Prepare floor plans, elevations, and layouts for approvals.'
      },
      { 
        id: 'ge-1', 
        role: 'Geotechnical Engineer', 
        icon: '🧱', 
        status: 'required',
        category: 'Consultant',
        whyNeeded: 'Assesses soil conditions to determine appropriate foundation type and structural requirements',
        whenNeeded: 'Early stage - after site purchase and before structural design begins',
        notes: 'Determines soil classification and bearing capacity for slab and footing design (AS 2870).'
      },
      { 
        id: 'sv-1', 
        role: 'Surveyor', 
        icon: '📐', 
        status: 'required',
        category: 'Consultant',
        whyNeeded: 'Provides accurate site measurements, contours, and boundaries for design and planning',
        whenNeeded: 'Very early - before design work begins to establish site constraints and opportunities',
        notes: 'Provides contour levels and property boundaries for design and approvals.'
      },
      { 
        id: 'bc-1', 
        role: 'Bushfire Consultant', 
        icon: '🌿', 
        status: 'not-required',
        category: 'Consultant',
        whyNeeded: 'Required if your site is in a bushfire-prone area to ensure compliance with bushfire attack level (BAL) requirements',
        whenNeeded: 'Early stage - during design phase if site is in bushfire zone',
        notes: 'Only needed for bushfire-prone sites.'
      },
      { 
        id: 'wc-1', 
        role: 'Wastewater Consultant', 
        icon: '💧', 
        status: 'not-required',
        category: 'Consultant',
        whyNeeded: 'Designs on-site wastewater systems if your property is not connected to sewer',
        whenNeeded: 'Design phase - if sewer connection is not available',
        notes: 'Only required for rural or unsewered lots.'
      },
      { 
        id: 'se-1', 
        role: 'Structural Engineer', 
        icon: '🏗', 
        status: 'required',
        category: 'Consultant',
        whyNeeded: 'Designs structural elements (footings, beams, frames) and ensures structural integrity',
        whenNeeded: 'Design phase - after geotechnical report is complete',
        notes: 'Can be completed after the Development Application or before a CDC submission. Includes design of slabs, footings, beams, and retaining walls.'
      },
      { 
        id: 'ea-1', 
        role: 'Energy Assessor', 
        icon: '🔆', 
        status: 'required',
        category: 'Consultant',
        whyNeeded: 'Prepares BASIX certificate showing your home meets energy and water efficiency requirements',
        whenNeeded: 'Before DA submission - certificate must accompany your development application',
        notes: 'Provides thermal and energy compliance certificate for NSW dwellings (NatHERS / BASIX).'
      },
    ],
  },
  {
    id: 'stage-2',
    title: 'Stage 2, Planning & Approvals',
    consultants: [
      { 
        id: 'tp-1', 
        role: 'Town Planner / DA Coordinator', 
        icon: '🧭', 
        status: 'optional',
        category: 'Consultant',
        whyNeeded: 'Navigates planning requirements and manages DA submission process for complex applications',
        whenNeeded: 'If your project has complex planning issues or heritage considerations',
        notes: 'Prepares Statement of Environmental Effects (SEE) - mandatory for Development Applications lodged with Council.'
      },
      { 
        id: 'cert-1', 
        role: 'Council or Private Certifier', 
        icon: '🏢', 
        status: 'required',
        category: 'Consultant',
        whyNeeded: 'Assesses building plans for compliance and issues Construction Certificate',
        whenNeeded: 'After DA approval - before construction can commence',
        notes: 'Certifier or council approval allowing construction to begin following DA or CDC consent.'
      },
    ],
  },
  {
    id: 'stage-3',
    title: 'Stage 3, Tender & Construction',
    consultants: [
      { 
        id: 'builder-1', 
        role: 'Builder', 
        icon: '👷', 
        status: 'required',
        category: 'Contractor',
        whyNeeded: 'Constructs your home according to approved plans and specifications',
        whenNeeded: 'After Construction Certificate is issued',
        notes: 'Verify builder licence. Manages site preparation, excavation, framing, roofing, fit-out & finishes through to lock-up and completion.'
      },
      { 
        id: 'est-1', 
        role: 'Estimator', 
        icon: '🧮', 
        status: 'optional',
        category: 'Consultant',
        whyNeeded: 'Provides detailed cost estimates before tendering to help budget planning',
        whenNeeded: 'Before going to tender if you need independent cost verification',
        notes: 'Prepares detailed construction cost breakdown for builder pricing and tender comparison.'
      },
      { 
        id: 'se-2', 
        role: 'Structural Engineer (Inspection)', 
        icon: '🔩', 
        status: 'required',
        category: 'Consultant',
        whyNeeded: 'Inspects structural works during construction to verify compliance with engineering plans',
        whenNeeded: 'During construction - at key structural stages (footings, frame, etc.)',
        notes: 'Mandatory inspections for staged sign-offs at slab, frame, and other critical construction stages.'
      },
      { 
        id: 'sv-2', 
        role: 'Surveyor (Set-Out)', 
        icon: '📏', 
        status: 'required',
        category: 'Consultant',
        whyNeeded: 'Marks out building location on site and verifies it matches approved plans',
        whenNeeded: 'Before construction starts - to establish accurate building position',
        notes: 'Ensures house is correctly positioned on the lot before excavation.'
      },
    ],
  },
  {
    id: 'stage-4',
    title: 'Stage 4, Completion & Certification',
    consultants: [
      { 
        id: 'cert-2', 
        role: 'Certifier / PCA', 
        icon: '🧾', 
        status: 'required',
        category: 'Consultant',
        whyNeeded: 'Conducts final inspections and issues Occupation Certificate',
        whenNeeded: 'End of construction - before you can legally occupy the building',
        notes: 'Confirms compliance with DA/CDC conditions and building standards. Issues Occupation Certificate (OC).'
      },
      { 
        id: 'builder-2', 
        role: 'Builder', 
        icon: '👷', 
        status: 'required',
        category: 'Contractor',
        whyNeeded: 'Completes defects rectification and hands over completed home',
        whenNeeded: 'Final stage - addressing any defects found during final inspection',
        notes: 'Builder supplies warranties, certificates, and manuals at handover.'
      },
    ],
  },
];

export const mockDirectoryResults = {
  'Geotechnical Engineer': [
    {
      id: 'geo-1',
      companyName: 'GeoTech Services',
      specialty: 'Geotechnical Engineering',
      rating: 4.9,
      responseTime: 'Fast response',
      location: 'Port Macquarie',
      role: 'Geotechnical Engineer',
    },
    {
      id: 'geo-2',
      companyName: 'SoilTest NSW',
      specialty: 'Geotechnical Engineering',
      rating: 4.7,
      responseTime: '1-2 days',
      location: 'Port Macquarie',
      role: 'Geotechnical Engineer',
    },
    {
      id: 'geo-3',
      companyName: 'Foundation Experts',
      specialty: 'Soil Testing & Analysis',
      rating: 4.8,
      responseTime: 'Same day',
      location: 'Port Macquarie',
      role: 'Geotechnical Engineer',
    },
  ],
  'Building Designer': [
    {
      id: 'bd-1',
      companyName: 'Coastal Design Studio',
      specialty: 'Residential Design',
      rating: 4.9,
      responseTime: 'Fast response',
      location: 'Port Macquarie',
      role: 'Building Designer',
    },
    {
      id: 'bd-2',
      companyName: 'Modern Living Designs',
      specialty: 'Contemporary Homes',
      rating: 4.8,
      responseTime: '1 day',
      location: 'Port Macquarie',
      role: 'Building Designer',
    },
  ],
  'Surveyor': [
    {
      id: 'sv-1',
      companyName: 'Precision Survey Co',
      specialty: 'Land Surveying',
      rating: 4.9,
      responseTime: 'Fast response',
      location: 'Port Macquarie',
      role: 'Surveyor',
    },
  ],
};
