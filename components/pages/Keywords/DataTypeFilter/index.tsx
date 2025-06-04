'use client';

import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { dataTypes, DataType } from '@/consts/dataTypes';
import { Spinner } from '@/components/ui/spinner';
import DataTypeFilterPanel from '@/components/pages/Keywords/DataTypeFilterPanel';

interface DataTypeFilterProps {
  value: DataType | 'All';
  onValueChange: (value: DataType) => void;
  keywords: any;
}

export default function DataTypeFilter({
  value,
  onValueChange,
  keywords,
}: DataTypeFilterProps) {
  const [openPanel, setOpenPanel] = useState<DataType | 'All' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleValueChange = (newValue: string) => {
    if (dataTypes.some((dt) => dt.value === newValue)) {
      setLoading(true);
      setTimeout(() => {
        setOpenPanel(newValue as DataType);
        setLoading(false);
      }, 0);
    }

    onValueChange(newValue as DataType);
  };

  return (
    <div>
      <h4 className="text-sm font-medium mb-3">Data Type</h4>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={handleValueChange}
        className="inline-flex border rounded-lg divide-x shadow-[0_1px_3px_0_rgb(0,0,0,0.1)]"
      >
        {dataTypes.map((type) => {
          const Icon = type.icon;
          return (
            <ToggleGroupItem
              key={type.value}
              value={type.value}
              aria-label={type.label}
              className="flex items-center gap-2 px-4 py-2 first:rounded-l-md last:rounded-r-md border-0 data-[state=on]:bg-primary/5 data-[state=on]:text-primary hover:bg-muted/50 transition-colors border-primary/10"
            >
              <Icon className="h-4 w-4" />
              <span>{type.label}</span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      {loading && (
        <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
          <Spinner className="mr-2 h-4 w-4 animate-spin" /> Loading...
        </div>
      )}

      {!loading && openPanel !== null && openPanel !== 'All' && (
        <DataTypeFilterPanel
          isOpen={true}
          onClose={() => setOpenPanel(null)}
          type={openPanel}
          data={keywords}
        />
      )}
    </div>
  );
}
