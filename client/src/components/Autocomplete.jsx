import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCitySuggestions } from '@/data/locations';

const Autocomplete = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '',
  iconClassName = '',
  ...props 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (value && value.length >= 2) {
      const citySuggestions = getCitySuggestions(value);
      setSuggestions(citySuggestions);
      setIsOpen(citySuggestions.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
    setHighlightedIndex(-1);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          selectSuggestion(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion) => {
    onChange(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  return (
    <div className="relative flex-1">
      <div className="flex items-center">
        <MapPin className={cn("opacity-50", iconClassName)} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value && value.length >= 2 && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className={cn(
            "focus-visible:ring-0 md:text-base focus-visible:ring-transparent focus-visible:ring-offset-0 border-none px-1 w-full",
            className
          )}
          {...props}
        />
      </div>
      
      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              onClick={() => selectSuggestion(suggestion)}
              className={cn(
                "px-3 py-2 cursor-pointer flex items-center gap-2 hover:bg-gray-100 transition-colors",
                highlightedIndex === index && "bg-gray-100"
              )}
            >
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
