import * as React from 'react';
import { X, Check, ChevronsUpDown } from 'lucide-react';
import { Command as CommandPrimitive } from 'cmdk';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCallback } from 'react';
import { IOptionLocation } from '@/types';

export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
  group?: string;
  id?: string;
};

type MultiSelectProps = {
  options: IOptionLocation[];
  selected: string[];
  onChange: (values: string[]) => void;
  onValueChange: (values: string) => void;
  onOptionSelect: (value: IOptionLocation) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  maxSelected?: number;
  disabled?: boolean;
  renderPill?: (option: string) => React.ReactNode;
  renderOption?: (option: Option) => React.ReactNode;
  groupBy?: boolean;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  onValueChange,
  onOptionSelect,
  placeholder = 'Select options',
  searchPlaceholder = 'Search options...',
  emptyMessage = 'No options found.',
  className,
  maxSelected,
  disabled = false,
  renderPill,
  renderOption,
  groupBy = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const groupedOptions = React.useMemo(() => {
    if (!groupBy) return { undefined: options };

    return options.reduce<Record<string, Option[]>>((groups, option) => {
      const group = option.group || 'Other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(option);
      return groups;
    }, {});
  }, [options, groupBy]);

  // const selectedOptions = React.useMemo(() => {
  //   return options.filter((option) => selected.includes(option.value));
  // }, [options, selected]);

  const isMaxSelected = React.useMemo(() => {
    return maxSelected !== undefined && selected.length >= maxSelected;
  }, [maxSelected, selected]);

  const handleSelect = React.useCallback(
    (value: string) => {
      if (disabled) return;
      const option: IOptionLocation | undefined = options.find(
        (o) => o.value === value
      );
      if (!option || option.disabled) return;
      onOptionSelect(option);

      const newSelected = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : isMaxSelected
          ? selected
          : [...selected, value];
      onChange(newSelected);
    },
    [disabled, isMaxSelected, onChange, onOptionSelect, options, selected]
  );

  const handleRemove = React.useCallback(
    (e: React.MouseEvent, value: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      onChange(selected.filter((item) => item !== value));
      const option: IOptionLocation | undefined = options.find(
        (o) => o.value === value
      );
      if (!option || option.disabled) return;
      onOptionSelect(option);
    },
    [disabled, onChange, onOptionSelect, options, selected]
  );

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      onChange([]);
    },
    [disabled, onChange]
  );

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      if (onValueChange) {
        onValueChange(value);
      }
    },
    [onValueChange]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'h-16 overflow-y-auto w-full justify-between p-2',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1">
            {selected.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {selected.map((option) => (
              <Badge
                key={option}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
              >
                {renderPill ? renderPill(option) : option}
                <span
                  role="button"
                  className="h-4 w-4 p-0 hover:bg-secondary-foreground/20 rounded-full cursor-pointer"
                  onClick={(e) => handleRemove(e, option)}
                  // disabled={disabled}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {option}</span>
                </span>
              </Badge>
            ))}
          </div>
          <div className="flex items-center self-start ml-1">
            {selected.length > 0 && (
              <span
                role="button"
                className="h-4 w-4 p-0 rounded-full mr-1 hover:bg-secondary/80 cursor-pointer"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear all</span>
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={handleSearch}
            value={search}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {Object.entries(
              groupBy ? groupedOptions : { undefined: filteredOptions }
            ).map(([group, items]) => (
              <React.Fragment key={group}>
                {groupBy && group !== 'undefined' && (
                  <CommandGroup heading={group} className="capitalize">
                    {items
                      .filter(
                        (option: IOptionLocation) =>
                          option.label
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          option.value
                            .toLowerCase()
                            .includes(search.toLowerCase())
                      )
                      .map((option: IOptionLocation) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={handleSelect}
                          disabled={option.disabled || isMaxSelected}
                          className={cn(
                            'flex items-center justify-between',
                            option.disabled && 'opacity-50 cursor-not-allowed',
                            isMaxSelected &&
                              !selected.includes(option.value) &&
                              'opacity-50 cursor-not-allowed'
                          )}
                        >
                          <div className="flex items-center">
                            {renderOption ? renderOption(option) : option.label}
                          </div>
                          <Check
                            className={cn(
                              'h-4 w-4 opacity-0 transition-opacity',
                              selected.includes(option.value) && 'opacity-100'
                            )}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}
                {!groupBy &&
                  items
                    .filter((option: IOptionLocation) =>
                      option.label.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((option: IOptionLocation) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={handleSelect}
                        disabled={
                          option.disabled ||
                          (isMaxSelected && !selected.includes(option.value))
                        }
                        className={cn(
                          'flex items-center justify-between',
                          option.disabled && 'opacity-50 cursor-not-allowed',
                          isMaxSelected &&
                            !selected.includes(option.value) &&
                            'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <div className="flex items-center">
                          {renderOption ? renderOption(option) : option.label}
                        </div>
                        <Check
                          className={cn(
                            'h-4 w-4 opacity-0 transition-opacity',
                            selected.includes(option.value) && 'opacity-100'
                          )}
                        />
                      </CommandItem>
                    ))}
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
