import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { searchLocations, LocationSuggestion } from '../utils/geocoding';
import { cn } from './ui/utils';

interface LocationSearchProps {
  label: string;
  placeholder: string;
  value: string;
  onSelect: (suggestion: LocationSuggestion) => void;
  selectedName?: string;
}

export function LocationSearch({ label, placeholder, value, onSelect, selectedName }: LocationSearchProps) {
  const [query, setQuery] = useState(selectedName || '');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedName) {
      setQuery(selectedName);
    }
  }, [selectedName]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2 && isOpen) {
        setIsLoading(true);
        const results = await searchLocations(query);
        setSuggestions(results);
        setIsLoading(false);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-blue-200 mb-2 text-sm">{label}</label>
      <div className="relative">
        <Input
          className="bg-white/10 border-white/20 text-white pl-10 h-12 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 animate-spin" />
        )}
      </div>

      {isOpen && (suggestions.length > 0 || isLoading) && (
        <Card className="absolute z-[100] w-full mt-2 bg-slate-900 border-white/20 shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              className="w-full flex items-start gap-3 p-3 hover:bg-white/10 text-left transition-colors border-b border-white/5 last:border-0"
              onClick={() => {
                onSelect(suggestion);
                setQuery(suggestion.name);
                setIsOpen(false);
              }}
            >
              <MapPin className={cn(
                "w-4 h-4 mt-0.5",
                suggestion.isStop ? "text-green-400" : "text-blue-400"
              )} />
              <div>
                <div className="text-white font-medium text-sm">{suggestion.name}</div>
                <div className="text-xs text-blue-300">
                  {suggestion.isStop ? 'Official Stop' : 'Area/Establishment'}
                </div>
              </div>
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}
