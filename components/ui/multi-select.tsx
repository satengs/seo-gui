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

export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
  /** Optional group for categorizing options */
  group?: string;
};

type MultiSelectProps = {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  /** Placeholder for the main trigger button */
  placeholder?: string;
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Message to show when no options match the search */
  emptyMessage?: string;
  /** Custom class for the trigger button */
  className?: string;
  /** Max number of items that can be selected */
  maxSelected?: number;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Function to render custom pill content */
  renderPill?: (option: Option) => React.ReactNode;
  /** Function to render custom option content */
  renderOption?: (option: Option) => React.ReactNode;
  /** Group options by the group property */
  groupBy?: boolean;
};

export function MultiSelect({
  options,
  selected,
  onChange,
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

  // Group options if needed
  const groupedOptions = React.useMemo(() => {
    if (!groupBy) return { undefined: options };

    return options.reduce<Record<string, Option[]>>((groups, option) => {
      const group = option.group || 'Other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(option);
      return groups;
    }, {});
  }, [options, groupBy]);

  // Get selected option objects
  const selectedOptions = React.useMemo(() => {
    return options.filter((option) => selected.includes(option.value));
  }, [options, selected]);

  // Check if max selected is reached
  const isMaxSelected = React.useMemo(() => {
    return maxSelected !== undefined && selected.length >= maxSelected;
  }, [maxSelected, selected]);

  // Handle selection of an option
  const handleSelect = React.useCallback(
    (value: string) => {
      if (disabled) return;
      const option = options.find((o) => o.value === value);
      if (!option || option.disabled) return;

      const newSelected = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : isMaxSelected
          ? selected
          : [...selected, value];

      onChange(newSelected);
    },
    [disabled, isMaxSelected, onChange, options, selected]
  );

  // Handle removal of a selected item
  const handleRemove = React.useCallback(
    (e: React.MouseEvent, value: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      onChange(selected.filter((item) => item !== value));
    },
    [disabled, onChange, selected]
  );

  // Handle clearing all selected items
  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      onChange([]);
    },
    [disabled, onChange]
  );

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'min-h-10 h-auto w-full justify-between p-2',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1">
            {selectedOptions.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {selectedOptions.map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
              >
                {renderPill ? renderPill(option) : option.label}
                <span
                  role="button"
                  className="h-4 w-4 p-0 hover:bg-secondary-foreground/20 rounded-full cursor-pointer"
                  onClick={(e) => handleRemove(e, option.value)}
                  // disabled={disabled}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {option.label}</span>
                </span>
              </Badge>
              // <Badge
              //   key={option.value}
              //   variant="secondary"
              //   className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
              // >
              //   {renderPill ? renderPill(option) : option.label}
              //   <Button
              //     variant="ghost"
              //     size="sm"
              //     className="h-4 w-4 p-0 hover:bg-secondary-foreground/20 rounded-full"
              //     onClick={(e) => handleRemove(e, option.value)}
              //     disabled={disabled}
              //   >
              //     <X className="h-3 w-3" />
              //     <span className="sr-only">Remove {option.label}</span>
              //   </Button>
              // </Badge>
            ))}
          </div>
          <div className="flex items-center self-start ml-1">
            {selected.length > 0 && (
              <span
                role="button"
                className="h-4 w-4 p-0 rounded-full mr-1 hover:bg-secondary/80 cursor-pointer"
                onClick={handleClear}
                disabled={disabled} // `span` doesn't accept `disabled`, so we check the condition in `onClick`
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear all</span>
              </span>
              // <Button
              //   variant="ghost"
              //   size="sm"
              //   onClick={handleClear}
              //   className="h-4 w-4 p-0 rounded-full mr-1 hover:bg-secondary/80"
              //   disabled={disabled}
              // >
              //   <X className="h-3 w-3" />
              //   <span className="sr-only">Clear all</span>
              // </Button>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={setSearch}
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
                        (option) =>
                          option.label
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          option.value
                            .toLowerCase()
                            .includes(search.toLowerCase())
                      )
                      .map((option) => (
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
                    .filter((option) =>
                      option.label.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((option) => (
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
