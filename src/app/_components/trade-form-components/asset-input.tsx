"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { filterAssets } from "@/lib/asset-utils";

interface AssetInputProps {
  value: string;
  onChange: (value: string) => void;
  allAssets: string[];
  onSelectAsset: (asset: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function AssetInput({
  value,
  onChange,
  allAssets,
  onSelectAsset,
  placeholder = "e.g., AAPL, BTC, ETH",
  required = false,
}: AssetInputProps) {
  const [filteredAssets, setFilteredAssets] = useState<string[]>(allAssets);
  const [showAssetSuggestions, setShowAssetSuggestions] = useState(false);
  const assetInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilteredAssets(allAssets);
  }, [allAssets]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Filter assets based on input
    if (newValue.trim() === "") {
      setFilteredAssets(allAssets);
      setShowAssetSuggestions(false);
    } else {
      const filtered = filterAssets(newValue, allAssets);
      setFilteredAssets(filtered);
      setShowAssetSuggestions(true);
    }
  };

  const handleAssetSelect = (asset: string) => {
    onSelectAsset(asset);
    setShowAssetSuggestions(false);
    // Focus on the next input field
    setTimeout(() => {
      const nextInput = document.querySelector('input[name="quantity"]');
      if (nextInput instanceof HTMLInputElement) nextInput.focus();
    }, 0);
  };

  const handleAssetBlur = () => {
    // Delay hiding suggestions to allow for clicks on suggestions
    setTimeout(() => setShowAssetSuggestions(false), 200);
  };

  return (
    <div className="relative space-y-2">
      <Label htmlFor="asset">Asset</Label>
      <Input
        type="text"
        id="asset"
        name="asset"
        value={value}
        onChange={handleChange}
        onBlur={handleAssetBlur}
        placeholder={placeholder}
        required={required}
        ref={assetInputRef}
        className="text-base md:text-sm"
        inputMode="text"
        autoComplete="off"
        autoCapitalize="off"
      />
      {showAssetSuggestions && filteredAssets.length > 0 && (
        <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-background shadow-lg transition-all duration-200 ease-in-out">
          {filteredAssets.map((asset) => (
            <div
              key={asset}
              className="cursor-pointer px-4 py-3 transition-colors duration-150 first:rounded-t-md last:rounded-b-md hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleAssetSelect(asset)}
            >
              <div className="font-medium">{asset}</div>
            </div>
          ))}
        </div>
      )}
      {/* Asset Badges */}
      {allAssets.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {allAssets.slice(0, 5).map((asset) => (
            <Badge
              key={asset}
              variant="secondary"
              className="cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleAssetSelect(asset)}
            >
              {asset}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
