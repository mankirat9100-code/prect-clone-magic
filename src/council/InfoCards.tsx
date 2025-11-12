import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const InfoCards = () => {
  const navigate = useNavigate();

  const handlePrivateCertifierClick = () => {
    navigate("/search?role=certifier");
  };

  const handleCouncilClick = () => {
    window.open("https://www.pmhc.nsw.gov.au/Services/Building-and-Development/Certifiers", "_blank");
  };

  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Your Certifier Options</CardTitle>
          </div>
          <CardDescription>
            You have two options for appointing a Principal Certifying Authority (PCA)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Option</th>
                  <th className="text-left p-2 font-semibold">Who They Are</th>
                  <th className="text-left p-2 font-semibold">Key Advantage</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  className="border-b hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={handleCouncilClick}
                >
                  <td className="p-2 font-medium flex items-center gap-2">
                    Council (PCA)
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </td>
                  <td className="p-2">Port Macquarie–Hastings Council Certifiers</td>
                  <td className="p-2">Direct access to Council systems</td>
                </tr>
                <tr 
                  className="hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={handlePrivateCertifierClick}
                >
                  <td className="p-2 font-medium">Private Certifier (PCA)</td>
                  <td className="p-2">Accredited independent certifier</td>
                  <td className="p-2">Faster turnaround and flexible communication</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">
            Both options issue the Construction Certificate, conduct inspections, and issue the Occupation Certificate.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
