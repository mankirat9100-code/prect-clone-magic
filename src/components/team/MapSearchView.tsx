import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { ConsultantResultCard } from './ConsultantResultCard';
import { DirectoryResult } from '@/types/team';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MapSearchViewProps {
  onClose: () => void;
  onAddConsultant: (result: DirectoryResult, taskRole?: string) => void;
  onMessageConsultant: (company: string, role: string) => void;
  availableTasks: { role: string; id: string }[];
}

export const MapSearchView = ({ onClose, onAddConsultant, onMessageConsultant, availableTasks }: MapSearchViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [distance, setDistance] = useState('50');
  const [results, setResults] = useState<DirectoryResult[]>([]);
  const [selectedConsultant, setSelectedConsultant] = useState<DirectoryResult | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Mock results with locations - in real app, these would come from API
  const mockConsultants: (DirectoryResult & { lat: number; lng: number })[] = [
    {
      id: '1',
      companyName: 'GeoTech Solutions',
      specialty: 'Soil Analysis & Foundation Design',
      rating: 4.8,
      responseTime: '< 2 hours',
      location: 'Sydney, NSW',
      role: 'Geotechnical Engineer',
      lat: -33.8688,
      lng: 151.2093,
    },
    {
      id: '2',
      companyName: 'Foundation Experts',
      specialty: 'Ground Investigation',
      rating: 4.6,
      responseTime: '< 4 hours',
      location: 'Parramatta, NSW',
      role: 'Geotechnical Engineer',
      lat: -33.8150,
      lng: 151.0000,
    },
    {
      id: '3',
      companyName: 'Earth Engineering',
      specialty: 'Site Assessment',
      rating: 4.9,
      responseTime: '< 1 hour',
      location: 'North Sydney, NSW',
      role: 'Geotechnical Engineer',
      lat: -33.8400,
      lng: 151.2070,
    },
    {
      id: '4',
      companyName: 'Structural Design Co',
      specialty: 'Residential & Commercial',
      rating: 4.7,
      responseTime: '< 3 hours',
      location: 'Chatswood, NSW',
      role: 'Structural Engineer',
      lat: -33.7969,
      lng: 151.1831,
    },
    {
      id: '5',
      companyName: 'Ground Solutions',
      specialty: 'Geotechnical Reports',
      rating: 4.5,
      responseTime: '< 6 hours',
      location: 'Penrith, NSW',
      role: 'Geotechnical Engineer',
      lat: -33.7507,
      lng: 150.6942,
    },
  ];

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [151.2093, -33.8688],
      zoom: 10,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for results
    results.forEach((result) => {
      const consultant = mockConsultants.find(c => c.id === result.id);
      if (!consultant) return;

      const el = document.createElement('div');
      el.className = 'map-marker';
      el.style.backgroundColor = 'hsl(var(--primary))';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([consultant.lng, consultant.lat])
        .addTo(map.current!);

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
          <div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${result.companyName}</h3>
            <p style="font-size: 12px; color: #666;">${result.specialty}</p>
            <p style="font-size: 12px; margin-top: 4px;">⭐ ${result.rating} • ${result.responseTime}</p>
          </div>
        `);

      el.addEventListener('click', () => {
        setSelectedConsultant(result);
        marker.setPopup(popup);
        marker.togglePopup();
      });

      markers.current.push(marker);
    });

    // Fit bounds to show all markers
    if (results.length > 0) {
      const consultantsWithLocations = results
        .map(r => mockConsultants.find(c => c.id === r.id))
        .filter(c => c !== undefined);

      if (consultantsWithLocations.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        consultantsWithLocations.forEach(c => {
          bounds.extend([c.lng, c.lat]);
        });
        map.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
      }
    }
  }, [results]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // Filter mock consultants based on search query and distance
    const filtered = mockConsultants.filter(c => 
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filtered);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1 max-w-2xl flex items-center gap-2">
                <Input
                  placeholder="Find consultants (e.g., geotech, structural engineer...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              <Select value={distance} onValueChange={setDistance}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">Within 50 km</SelectItem>
                  <SelectItem value="100">Within 100 km</SelectItem>
                  <SelectItem value="150">Within 150 km</SelectItem>
                  <SelectItem value="all">All distances</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Map */}
        <div className="w-1/2 relative">
          <div ref={mapContainer} className="absolute inset-0" />
          {results.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 pointer-events-none">
              <p className="text-muted-foreground">Search for consultants to see them on the map</p>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="w-1/2 overflow-y-auto bg-muted/20 p-6">
          {results.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                Found {results.length} consultant{results.length !== 1 ? 's' : ''}
              </h2>
              {results.map((result) => (
                <ConsultantResultCard
                  key={result.id}
                  consultant={result}
                  onAdd={onAddConsultant}
                  onMessage={onMessageConsultant}
                  availableTasks={availableTasks}
                  isSelected={selectedConsultant?.id === result.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter a search term to find consultants</p>
                <p className="text-sm mt-2">Try "geotech", "structural", or "architect"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
