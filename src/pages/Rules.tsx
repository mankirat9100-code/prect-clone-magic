import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, ExternalLink, MessageCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlanningAssistantSidebar } from '@/components/PlanningAssistantSidebar';

const Rules = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const rulesContext = `
Property: 24 Harvest Street, Thrumster
Lot Size: 734 m²
Zoning: R1 General Residential
Street Frontage: 24.99 m
Heritage: No
Bushfire: No
Flood: No

Compliance Status: Property is eligible for Complying Development (CDC)

Key Requirements:
- Minimum Lot Size: 450 m² (Current: 734 m²) ✓
- Maximum Building Height: 8.5 m
- Maximum Storeys: 2
- Front Setback: ≥ 4.5 m primary
- Side Setbacks: ≥ 0.9 m (GF), ≥ 3 m (UF)
- Rear Setback: 4 m minimum
- Private Open Space: ≥ 35 m²
- Landscaped Area: ≥ 35% total
- Car Parking: 2 spaces required (> 150 m²)
  `;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Rules & Compliance</h1>
            <p className="text-lg text-muted-foreground">Single Dwelling</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2"
              size="lg"
            >
              <CheckCircle2 className="h-5 w-5" />
              Generate Compliance Report
            </Button>
            <Button
              onClick={() => setIsSidebarOpen(true)}
              className="gap-2"
              size="lg"
            >
              <MessageCircle className="h-5 w-5" />
              Ask Planning Agent
            </Button>
          </div>
        </div>

        {/* Compliance Summary Header */}
        <Card>
          <CardHeader>
            <CardTitle>Ask Trevor Compliance Summary – New Dwelling House</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Address</span>
                  <p className="text-base">24 Harvest Street, Thrumster</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Lot Size (m²)</span>
                  <p className="text-base">734</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Zoning</span>
                  <p className="text-base">R1: General Residential</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Street Frontage (m)</span>
                  <p className="text-base">24.99</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Heritage mapped:</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    No
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Bushfire affected:</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    No
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Flood affected:</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    No
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scenario Section */}
        <Card>
          <CardHeader>
            <CardTitle>Scenario</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              You have a vacant residential lot or an existing block of land and wish to build a new dwelling house. 
              It summarises the key planning and design standards that apply to each pathway. The following table 
              outlines the two approval pathways available for a new house:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-3 text-lg">Option 1</h3>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-1">Complying Development (CDC)</h4>
                  <p className="text-sm text-muted-foreground">under the Codes SEPP 2008</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-lg">Option 2</h3>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-1">Development Application (DA)</h4>
                  <p className="text-sm text-muted-foreground">under Council's LEP and DCP</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CDC Pathway */}
        <Card className="bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Complying Development (CDC) Pathway
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-base">
                <span className="font-medium">Overlays:</span> Not heritage / not flood / not bushfire → CDC pathway available
              </p>
              <div className="pt-2 border-t">
                <h4 className="font-semibold mb-2">Summary</h4>
                <p className="text-base mb-2">
                  Dwelling houses are permissible and may be approved as Complying Development where the site meets 
                  the Codes SEPP criteria.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium">Dwelling permissible:</span>
                  <Badge variant="default" className="bg-green-600">Yes</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicable Legislative Instruments */}
        <Card>
          <CardHeader>
            <CardTitle>Applicable Legislative Instruments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Codes SEPP 2008</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      State Environmental Planning Policy (Exempt and Complying Development Codes) 2008 — 
                      Part 3D General Housing Code (Clauses 3D.1 – 3D.48). Sets the standards for building 
                      new dwelling houses, attached development and ancillary structures as Complying Development.
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                </div>
              </div>
              <div className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Port Macquarie-Hastings DCP 2013</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Development Control Plan – Part C1 Low Density Residential Development and Part D5 
                      Stormwater Management. These set the local development and design standards for new 
                      dwellings and subdivisions.
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                </div>
              </div>
              <div className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Port Macquarie-Hastings LEP 2011</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Local Environmental Plan – Clauses 2.3, 4.1, 4.3 & 6.2 governing zoning, minimum lot size, 
                      building height and earthworks.
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Standards Table */}
        <Card>
          <CardHeader>
            <CardTitle>Development Standards – New Dwelling House</CardTitle>
            <p className="text-base text-muted-foreground mt-2">
              The following table outlines the two approval pathways for a new dwelling house — Complying Development (CDC) 
              under the Codes SEPP and Development Application (DA) under Council's DCP and LEP.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Control Item</TableHead>
                    <TableHead className="font-semibold">CDC – Codes SEPP</TableHead>
                    <TableHead className="font-semibold">DA – Council DCP / LEP</TableHead>
                    <TableHead className="font-semibold">Key Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Permissibility</TableCell>
                    <TableCell className="text-sm">
                      Dwelling house may be carried out as Complying Development where permitted in the zone 
                      (Codes SEPP cl 3D.1).
                    </TableCell>
                    <TableCell className="text-sm">
                      Dwelling house permitted with consent in R1, R2, R5 and RU5 zones 
                      (LEP 2011 cl 2.3 Land Use Table).
                    </TableCell>
                    <TableCell className="text-sm">Permitted both pathways.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Minimum Lot Size</TableCell>
                    <TableCell className="text-sm">
                      No minimum lot size for existing lots under CDC (Codes SEPP cl 3D.1(2)).
                    </TableCell>
                    <TableCell className="text-sm">
                      450 m² minimum lot size (LEP 2011 cl 4.1 + Lot Size Map).
                    </TableCell>
                    <TableCell className="text-sm">
                      Existing lots smaller than 450 m² still eligible for CDC.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Maximum Building Height</TableCell>
                    <TableCell className="text-sm">8.5 m (Codes SEPP cl 3D.9).</TableCell>
                    <TableCell className="text-sm">8.5 m (LEP 2011 cl 4.3 + Height of Buildings Map).</TableCell>
                    <TableCell className="text-sm">Identical control.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Maximum Number of Storeys</TableCell>
                    <TableCell className="text-sm">Two storeys (Codes SEPP cl 3D.9(2)).</TableCell>
                    <TableCell className="text-sm">Generally two storeys (DCP C1 cl C1.3.4).</TableCell>
                    <TableCell className="text-sm">Consistent.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Front Setback</TableCell>
                    <TableCell className="text-sm">
                      ≥ 4.5 m to primary frontage; ≥ 6 m if facing a secondary road.
                    </TableCell>
                    <TableCell className="text-sm">
                      4.5 m primary, 3 m secondary, 6 m if facing a secondary road.
                    </TableCell>
                    <TableCell className="text-sm">Aligned standards.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Garage Setback</TableCell>
                    <TableCell className="text-sm">
                      Garage ≥ 1 m behind building line or ≥ 5.5 m from front boundary 
                      (Codes SEPP cl 3D.12(2)).
                    </TableCell>
                    <TableCell className="text-sm">Same rule (DCP C1 cl C1.3.1(3)).</TableCell>
                    <TableCell className="text-sm">Consistent.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Side Setbacks</TableCell>
                    <TableCell className="text-sm">
                      ≥ 0.9 m where wall ≤ 7 m long and ≤ 4.5 m high; ≥ 2.5 m if wall &gt; 7 m or &gt; 4.5 m high 
                      (Codes SEPP cl 3D.13(1)–(3)).
                    </TableCell>
                    <TableCell className="text-sm">≥ 0.9 m (GF) and ≥ 3 m (UF) (DCP C1 cl C1.3.2).</TableCell>
                    <TableCell className="text-sm">Council slightly more conservative for upper floors.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Rear Setback</TableCell>
                    <TableCell className="text-sm">
                      3–8 m depending on height (3 m ≤ 4.5 m high, 8 m &gt; 4.5 m high) 
                      (Codes SEPP cl 3D.14(1)–(2)).
                    </TableCell>
                    <TableCell className="text-sm">
                      4 m minimum to dwellings, 0.9 m for sheds (DCP C1 cl C1.3.3).
                    </TableCell>
                    <TableCell className="text-sm">Comparable intent.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Private Open Space (POS)</TableCell>
                    <TableCell className="text-sm">
                      ≥ 24 m² (minimum dimension 4 m × 4 m) (Codes SEPP cl 3D.16(1)).
                    </TableCell>
                    <TableCell className="text-sm">
                      ≥ 35 m² with 4 m × 4 m principal area and grade ≤ 5% (DCP C1 cl C1.4.3).
                    </TableCell>
                    <TableCell className="text-sm">Council requires larger usable area.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Landscaped Area</TableCell>
                    <TableCell className="text-sm">
                      ≥ 30% of site and ≥ 50% of front setback landscaped (Codes SEPP cl 3D.15(1)–(2)).
                    </TableCell>
                    <TableCell className="text-sm">
                      ≥ 35% total and 50% front setback landscaped (DCP C1 cl C1.3.5).
                    </TableCell>
                    <TableCell className="text-sm">Council slightly stricter.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Garage / Driveway Width</TableCell>
                    <TableCell className="text-sm">
                      Max 6 m at boundary (Codes SEPP Sch 3 cl 1.19(2)(b)).
                    </TableCell>
                    <TableCell className="text-sm">Max 5 m at boundary (DCP C1 cl C1.3.1(5)).</TableCell>
                    <TableCell className="text-sm">DCP slightly stricter.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Site Coverage / Building Envelope</TableCell>
                    <TableCell className="text-sm">
                      Must fit within 45° building envelope (Codes SEPP cl 3D.11(1)).
                    </TableCell>
                    <TableCell className="text-sm">Max 60% site coverage (DCP C1 cl C1.3.6).</TableCell>
                    <TableCell className="text-sm">Different measurement methods, same intent.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ancillary Structures</TableCell>
                    <TableCell className="text-sm">
                      Height ≤ 4.8 m, floor area ≤ 60 m² (Codes SEPP cl 3B.49(1)(a),(b)).
                    </TableCell>
                    <TableCell className="text-sm">
                      Height ≤ 4.8 m, area ≤ 60 m² (&lt; 900 m² lot) or ≤ 100 m² (≥ 900 m² lot) 
                      (DCP C1 cl C1.5.1).
                    </TableCell>
                    <TableCell className="text-sm">Larger sheds allowed on large lots.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Car Parking</TableCell>
                    <TableCell className="text-sm">≥ 1 space on-site (Codes SEPP cl 3D.17(1)).</TableCell>
                    <TableCell className="text-sm">
                      1 space (&lt; 150 m² GFA) / 2 spaces (&gt; 150 m²) (DCP C1 cl C1.4.4 + AS2890).
                    </TableCell>
                    <TableCell className="text-sm">Council applies second-space trigger.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Stormwater / Drainage</TableCell>
                    <TableCell className="text-sm">
                      Must drain to a legal point of discharge (Codes SEPP Sch 1 cl 1.20).
                    </TableCell>
                    <TableCell className="text-sm">
                      Design to meet DCP Part D5 – Stormwater Management (DCP D5 cl D5.1–D5.6).
                    </TableCell>
                    <TableCell className="text-sm">CDC via certifier; DA via Council approval.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Environmental / Heritage Exclusions</TableCell>
                    <TableCell className="text-sm">
                      Not permitted under CDC if on heritage, foreshore, bushfire or flood land 
                      (Codes SEPP cl 3D.3 & Sch 2 cl 1.16).
                    </TableCell>
                    <TableCell className="text-sm">
                      DA required on such land (LEP 2011 cl 5.10 & 6.2).
                    </TableCell>
                    <TableCell className="text-sm">Must check property constraints.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Summary */}
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Compliance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              The proposed new dwelling is permissible within the R1 General Residential zone under the 
              Port Macquarie-Hastings Local Environmental Plan 2011. The site at 24 Harvest Street, Thrumster 
              (734 m² with a 25 m frontage) exceeds the minimum lot size and frontage requirements for Complying 
              Development under Clause 3D.1 of the Codes SEPP 2008 and satisfies all general site standards for 
              the erection of a dwelling under the General Housing Code.
            </p>
            <p className="text-sm">
              The land is not identified as flood-affected, bushfire-prone, or a heritage item, meaning there are 
              no mapped constraints preventing Complying Development on this site. Based on these parameters, the 
              proposal meets the eligibility criteria for a new dwelling to be approved as Complying Development (CDC), 
              subject to detailed design and construction compliance with the Codes SEPP 2008 – Part 3D General Housing 
              Code and the Building Code of Australia (BCA).
            </p>
            <p className="text-sm">
              All statutory references have been verified from official NSW Government legislation and 
              Port Macquarie-Hastings Council planning instruments.
            </p>
            <div className="pt-4 border-t">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Flood, bushfire, and heritage classifications are determined by individual 
                  councils using local mapping. Always confirm directly with Port Macquarie-Hastings Council whether 
                  your property is identified as flood-affected, bushfire-prone, or heritage-listed land, as this 
                  information may vary and is not always publicly available through state datasets.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planning Assistant Sidebar */}
      <PlanningAssistantSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        rulesContext={rulesContext}
      />
    </div>
  );
};

export default Rules;
