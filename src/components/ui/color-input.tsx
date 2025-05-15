import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";

interface ColorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (value: string) => void;
}

export function ColorInput({ className, value, onChange, ...props }: ColorInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <div 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-sm border cursor-pointer" 
          style={{ backgroundColor: value }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <Input
          type="text"
          className={cn("pl-9", className)}
          value={value}
          onChange={handleInputChange}
          {...props}
        />
      </div>
      
      {showPicker && (
        <div className="absolute z-50 mt-2 shadow-lg rounded-md bg-background border">
          <HexColorPicker color={value} onChange={onChange} />
        </div>
      )}
    </div>
  );
} 