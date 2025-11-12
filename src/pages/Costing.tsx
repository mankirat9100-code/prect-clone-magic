import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CostingTable, CostItem } from "@/components/costing/CostingTable";
import { CostingAISidebar } from "@/components/costing/CostingAISidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const INITIAL_COST_ITEMS: CostItem[] = [
  // Preliminary & Consultants
  {
    id: '1',
    category: 'Preliminary & Consultants',
    item: 'Site Survey & Feature Levels',
    units: 'item',
    quantity: 1,
    rate: 1500,
    costType: 'Professional Fee',
    cost: 1500,
    notes: 'Required for contours/boundaries.',
    citation: 'Based on NSW regional surveyor rates, 2024 average.',
    isEdited: false
  },
  {
    id: '2',
    category: 'Preliminary & Consultants',
    item: 'Geotechnical Site Classification (AS 2870)',
    units: 'item',
    quantity: 1,
    rate: 1000,
    costType: 'Professional Fee',
    cost: 1000,
    notes: 'Soil class for slab/footings.',
    citation: 'Derived from local Mid-North Coast testing labs, 2025 average.',
    isEdited: false
  },
  {
    id: '3',
    category: 'Preliminary & Consultants',
    item: 'Architect / Building Designer (DA/CC docs)',
    units: 'item',
    quantity: 1,
    rate: 5000,
    costType: 'Professional Fee',
    cost: 5000,
    notes: 'DA+CC drawings, schedules.',
    citation: 'NSW Building Designers Association rate guide, 2024.',
    isEdited: false
  },
  {
    id: '4',
    category: 'Preliminary & Consultants',
    item: 'Structural Engineering',
    units: 'item',
    quantity: 1,
    rate: 2800,
    costType: 'Professional Fee',
    cost: 2800,
    notes: 'Slab, footings, beams; pre or post-DA.',
    citation: 'Dennis Partners Engineers benchmark rate, 2025 internal database.',
    isEdited: false
  },
  {
    id: '5',
    category: 'Preliminary & Consultants',
    item: 'BASIX',
    units: 'item',
    quantity: 1,
    rate: 1000,
    costType: 'Council/Statutory',
    cost: 1000,
    notes: 'NatHERS certificate cost range, 2024.',
    citation: 'NSW Planning BASIX compliance.',
    isEdited: false
  },
  {
    id: '6',
    category: 'Preliminary & Consultants',
    item: 'Engineering Consultation',
    units: 'hr',
    quantity: 4,
    rate: 220,
    costType: 'Professional Fee',
    cost: 880,
    notes: 'Hourly charge-out rate for design changes.',
    citation: 'Based on IEAust professional hourly billing, 2024.',
    isEdited: false
  },
  // Planning & Approvals
  {
    id: '7',
    category: 'Planning & Approvals',
    item: 'DA or CDC Lodgement',
    units: 'item',
    quantity: 1,
    rate: 1800,
    costType: 'Council/Statutory',
    cost: 1800,
    notes: 'Council/Certifier lodgement (est.).',
    citation: 'Kempsey Shire Council fee schedule, 2025.',
    isEdited: false
  },
  {
    id: '8',
    category: 'Planning & Approvals',
    item: 'Construction Certificate (CC)',
    units: 'item',
    quantity: 1,
    rate: 2500,
    costType: 'Council/Statutory',
    cost: 2500,
    notes: 'Approval to commence building.',
    citation: 'Certifier NSW portal fee averages, 2025.',
    isEdited: false
  },
  {
    id: '9',
    category: 'Planning & Approvals',
    item: 'Long Service Levy (NSW 0.35%)',
    units: '%',
    quantity: 0.35,
    rate: 0,
    costType: 'Council/Statutory',
    cost: 3448,
    notes: 'Based on build value ≈ $985,222.',
    citation: 'NSW Long Service Corporation levy calculator, 2025.',
    isEdited: false
  },
  // Site Works & Services
  {
    id: '10',
    category: 'Site Works & Services',
    item: 'Site clearing, set-out allowance',
    units: 'item',
    quantity: 1,
    rate: 9000,
    costType: 'Supply & Install',
    cost: 9000,
    notes: 'Clearing, temp fencing/sediment.',
    citation: 'Rawlinsons Construction Handbook 2024 regional NSW adjustments.',
    isEdited: false
  },
  {
    id: '11',
    category: 'Site Works & Services',
    item: 'Utility connections (water/sewer/power/NBN)',
    units: 'item',
    quantity: 1,
    rate: 3500,
    costType: 'Council/Statutory',
    cost: 3500,
    notes: 'Standard serviced lot.',
    citation: 'Typical Mid-North Coast subdivision connection fees, 2024.',
    isEdited: false
  },
  {
    id: '12',
    category: 'Site Works & Services',
    item: 'Driveway (exposed/colored concrete)',
    units: 'm²',
    quantity: 45,
    rate: 120,
    costType: 'Supply & Install',
    cost: 5400,
    notes: 'Allow $120/m²; adjust to finish.',
    citation: 'Boral Concrete & Decorative Finishes NSW price list, 2024.',
    isEdited: false
  },
  {
    id: '13',
    category: 'Site Works & Services',
    item: 'Fencing',
    units: 'lm',
    quantity: 70,
    rate: 90,
    costType: 'Supply & Install',
    cost: 6300,
    notes: 'Allow $90/lm; type to confirm.',
    citation: 'Bunnings Colorbond supply and install average.',
    isEdited: false
  },
  {
    id: '14',
    category: 'Site Works & Services',
    item: 'Soft landscaping allowance',
    units: 'item',
    quantity: 1,
    rate: 7500,
    costType: 'Supply & Install',
    cost: 7500,
    notes: 'Turf, garden beds, basic planting.',
    citation: 'HIA NSW Residential Landscape Cost Guide, 2024.',
    isEdited: false
  },
  // Building Construction
  {
    id: '15',
    category: 'Building Construction',
    item: 'Base Structure',
    units: 'm²',
    quantity: 283.55,
    rate: 2880,
    costType: 'Supply & Install',
    cost: 816624,
    notes: 'Structure, envelope, linings, PC items.',
    citation: 'Rawlinsons 2024 – Single-storey brick veneer (NSW Coastal Region).',
    isEdited: false
  },
  {
    id: '16',
    category: 'Building Construction',
    item: 'Ceiling height uplift (to 2.7 m)',
    units: '%',
    quantity: 2,
    rate: 0,
    costType: 'Supply & Install',
    cost: 16332,
    notes: 'Framing & plasterboard adjustments for ceiling height variance.',
    citation: 'Rawlinsons 2024.',
    isEdited: false
  },
  {
    id: '17',
    category: 'Building Construction',
    item: 'Kitchen upgrades (stone/appliances)',
    units: 'item',
    quantity: 1,
    rate: 6500,
    costType: 'Supply & Install',
    cost: 6500,
    notes: 'Premium finishes.',
    citation: 'HIA Kitchen Upgrade Allowances NSW 2024.',
    isEdited: false
  },
  // Services & Sustainability
  {
    id: '18',
    category: 'Services & Sustainability',
    item: 'Ducted Air Conditioning',
    units: 'item',
    quantity: 1,
    rate: 12000,
    costType: 'Supply & Install',
    cost: 12000,
    notes: 'Complete system incl. NSW average 2024–2025.',
    citation: 'FairAir Ducted Systems.',
    isEdited: false
  },
  {
    id: '19',
    category: 'Services & Sustainability',
    item: 'Solar PV system (≈ 6.6 kW)',
    units: 'item',
    quantity: 1,
    rate: 7500,
    costType: 'Supply & Install',
    cost: 7500,
    notes: 'Panels & inverter; STCs assumed.',
    citation: 'Clean Energy Council Q2 2025 solar price index.',
    isEdited: false
  },
  {
    id: '20',
    category: 'Services & Sustainability',
    item: 'Rainwater tank + pump set',
    units: 'item',
    quantity: 1,
    rate: 5000,
    costType: 'Supply & Install',
    cost: 5000,
    notes: 'Tank, pad, pump, plumbing.',
    citation: 'Reece Plumbing & Davey Pumps NSW pricing, 2025.',
    isEdited: false
  },
  // Completion
  {
    id: '21',
    category: 'Completion',
    item: 'Final certifier inspection / OC',
    units: 'item',
    quantity: 1,
    rate: 800,
    costType: 'Professional Fee',
    cost: 800,
    notes: 'PCA/Certifier final & OC.',
    citation: 'Private Certifier NSW portal rates, 2025.',
    isEdited: false
  },
  {
    id: '22',
    category: 'Completion',
    item: 'Handover documentation & manuals',
    units: 'item',
    quantity: 1,
    rate: 1500,
    costType: 'Professional Fee',
    cost: 1500,
    notes: 'Warranties, O&M, certificates.',
    citation: 'Builder standard handover documentation allowance, 2025.',
    isEdited: false
  },
  // Builder's Margin & Contingency
  {
    id: '23',
    category: "Builder's Margin & Contingency",
    item: 'Applied to Buildable Scope',
    units: '%',
    quantity: 10,
    rate: 0,
    costType: 'Contingency/Margin',
    cost: 89566,
    notes: 'Overheads & profit.',
    citation: 'Master Builders Association NSW Benchmark Survey 2024.',
    isEdited: false
  },
  {
    id: '24',
    category: "Builder's Margin & Contingency",
    item: 'Construction Contingency',
    units: '%',
    quantity: 5,
    rate: 0,
    costType: 'Contingency/Margin',
    cost: 44783,
    notes: 'Applied to Buildable Scope. Latent conditions, minor scope drift.',
    citation: 'HIA NSW 2024 guidelines.',
    isEdited: false
  }
];

const Costing = () => {
  const [costItems, setCostItems] = useState<CostItem[]>(
    INITIAL_COST_ITEMS.map(item => ({
      ...item,
      originalValues: {
        quantity: item.quantity,
        rate: item.rate,
        units: item.units,
        costType: item.costType
      }
    }))
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = () => {
    toast({
      title: "Generating Costings Report",
      description: "Your costings report is being generated...",
    });
  };

  const handleItemUpdate = (id: string, field: keyof CostItem, value: string | number) => {
    setCostItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updates: Partial<CostItem> = { [field]: value };
          
          // Check if the field has been edited compared to original value
          if (field === "quantity" || field === "rate" || field === "units" || field === "costType") {
            const originalValue = item.originalValues?.[field];
            const isEdited = value !== originalValue;
            
            updates.editedFields = {
              ...item.editedFields,
              [field]: isEdited
            };
            
            // Check if any field is still edited
            const anyFieldEdited = Object.values({
              ...updates.editedFields
            }).some(v => v === true);
            
            updates.isEdited = anyFieldEdited;
          }
          
          return { ...item, ...updates };
        }
        return item;
      })
    );
  };

  const handleAddRow = (afterId: string) => {
    const index = costItems.findIndex((item) => item.id === afterId);
    const itemBefore = costItems[index];
    
    const newItem: CostItem = {
      id: `new-${Date.now()}`,
      category: itemBefore.category,
      item: "New Item",
      units: "item",
      quantity: 1,
      rate: 0,
      costType: "Supply & Install",
      cost: 0,
      notes: "",
      isEdited: true,
      originalValues: {
        quantity: 1,
        rate: 0,
        units: "item",
        costType: "Supply & Install"
      }
    };

    setCostItems((prev) => [
      ...prev.slice(0, index + 1),
      newItem,
      ...prev.slice(index + 1),
    ]);
  };

  const handleDeleteRow = (id: string) => {
    setCostItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMoveRow = (id: string, direction: 'up' | 'down') => {
    const index = costItems.findIndex((item) => item.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= costItems.length) return;

    const newItems = [...costItems];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setCostItems(newItems);
  };

  const grandTotal = costItems.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="w-full p-3 sm:p-4 lg:p-6">
          {/* Header */}
          <header className="sticky top-0 z-header bg-background mb-4 pb-3 border-b -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">Project Costings</h1>
              <div className="flex gap-2">
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 lg:hidden">
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">Ask Trevor</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                    <CostingAISidebar />
                  </SheetContent>
                </Sheet>
                <Button onClick={handleGenerateReport} size="sm" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Generate Report</span>
                  <span className="sm:hidden">Report</span>
                </Button>
              </div>
            </div>
          </header>
          {/* Summary Snapshot */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">🏠 Bell Bird – Cascade Facade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-semibold text-sm">24 Harvest Street</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Floor Area</p>
                  <p className="font-semibold text-sm">283.55 m²</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Refined Estimate</p>
                  <p className="font-bold text-base text-primary">
                    {new Intl.NumberFormat("en-AU", {
                      style: "currency",
                      currency: "AUD",
                      minimumFractionDigits: 0,
                    }).format(grandTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge className="gap-1 text-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    AI Generated
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Panel */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Compliance & Context Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Lot Width:</span>
                  <span className="font-semibold">24.99 m ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dwelling Width:</span>
                  <span className="font-semibold">13.5 m ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Depth Fit:</span>
                  <span className="font-semibold">Yes ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Height Limit:</span>
                  <span className="font-semibold">5.0 m &lt; 8.5 m ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Site Coverage:</span>
                  <span className="font-semibold">28.4% ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">FSR:</span>
                  <span className="font-semibold">0.28 : 1 ✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown Table */}
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-bold mb-3">Detailed Cost Breakdown</h2>
            <p className="text-xs text-muted-foreground mb-3">
              Edit quantity or rate fields - costs auto-calculate (Qty × Rate). Edited cells turn{" "}
              <span className="text-green-600 font-semibold">green</span>. The estimated cost is locked and updates automatically.
            </p>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <CostingTable 
                  items={costItems} 
                  onItemUpdate={handleItemUpdate}
                  onAddRow={handleAddRow}
                  onDeleteRow={handleDeleteRow}
                  onMoveRow={handleMoveRow}
                />
              </div>
            </div>
          </div>

          {/* Reference Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Cost Type Categories */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Cost Type Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <div className="font-semibold text-sm">Professional Fee</div>
                    <div className="text-xs text-muted-foreground">Architects, engineers, certifiers, planners, consultants.</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Council/Statutory</div>
                    <div className="text-xs text-muted-foreground">DA, CC, OC fees, levies, and inspections.</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Supply & Install</div>
                    <div className="text-xs text-muted-foreground">Trade packages with both materials and labour (e.g., roofing, flooring, windows).</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Material Supply</div>
                    <div className="text-xs text-muted-foreground">Material-only items (e.g., concrete, blocks, fittings).</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Labour Only</div>
                    <div className="text-xs text-muted-foreground">Trades providing labour only (e.g., painters, plasterers).</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Equipment/Plant</div>
                    <div className="text-xs text-muted-foreground">Machinery hire, excavation, scaffolding, site plant.</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Contingency/Margin</div>
                    <div className="text-xs text-muted-foreground">Builder overheads, profit, risk, insurance, and allowances.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Unit Type Definitions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Unit Type Definitions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <div className="font-semibold text-sm">item</div>
                    <div className="text-xs text-muted-foreground">Single item or service fee.</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">m²</div>
                    <div className="text-xs text-muted-foreground">Square metre – area measurement (e.g., floor, wall, roof).</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">lm</div>
                    <div className="text-xs text-muted-foreground">Linear metre – length measurement (e.g., fencing, pipes).</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">m³</div>
                    <div className="text-xs text-muted-foreground">Cubic metre – volume (e.g., concrete, excavation).</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">hr</div>
                    <div className="text-xs text-muted-foreground">Per hour rate for labour, supervision, or consultancy work.</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">%</div>
                    <div className="text-xs text-muted-foreground">Percentage applied to a cost basis (e.g., margin, contingency).</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Sidebar - Desktop Only */}
      <div className="hidden lg:block w-96 border-l z-sidebar relative">
        <CostingAISidebar />
      </div>
    </div>
  );
};

export default Costing;
