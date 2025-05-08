'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/lib/axiosClient';
import { ILocation } from '@/types';

interface ILocationMultiSelect {
  name: string;
  setValue: (name: string, value: number | string) => void;
}

const LocationMultiSelect = ({ name, setValue }: ILocationMultiSelect) => {
  const { toast } = useToast();
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<ILocation[]>([]);
  const [locations, setLocations] = useState<ILocation[]>([]);

  const fetchLocations = useCallback(
    async (loc?: string) => {
      try {
        const response = await axiosClient.get(
          `/api/keywords/location?q=${loc || ''}`
        );
        return response?.data || [];
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to fetch locations',
          variant: 'destructive',
        });
      }
    },
    [toast]
  );

  const getLocationOptions = useCallback((data: ILocation[]) => {
    let _options = [];
    if (data?.length) {
      _options = data?.map((loc: any) => {
        return { ...loc, label: loc.name, value: loc.name };
      });
    } else {
      _options = [];
    }
    return _options;
  }, []);

  useEffect(() => {
    (async function fetchInitialLocations() {
      const locData = await fetchLocations();
      const _locations = getLocationOptions(locData);
      setLocations(_locations);
    })();
  }, [fetchLocations, getLocationOptions]);

  const onLocationSearchChange = useCallback(
    async (value: string) => {
      const locData = await fetchLocations(value);
      const _locations = getLocationOptions(locData);
      setLocations(_locations);
    },
    [fetchLocations, getLocationOptions]
  );

  const onChange = useCallback(
    (values: string[]) => {
      setSelected(values);
      setValue(name, values.join(','));
    },
    [name, setValue]
  );

  const onOptionSelect = useCallback(
    (data: ILocation) => {
      let _selectedOptions = [...selectedOptions];
      const existItemIndex = _selectedOptions.findIndex(
        (item) => item.id === data.id
      );
      if (existItemIndex !== -1) {
        _selectedOptions = _selectedOptions.filter(
          (item) => item.id !== data.id
        );
      } else {
        _selectedOptions.push(data);
      }

      if (_selectedOptions?.length) {
        const longitude = _selectedOptions[_selectedOptions.length - 1].gps[0];
        const latitude = _selectedOptions[_selectedOptions.length - 1].gps[1];
        setValue('longitude', longitude);
        setValue('latitude', latitude);
      }
      setSelectedOptions(_selectedOptions);
    },
    [selectedOptions, setValue]
  );

  return (
    <>
      <MultiSelect
        options={locations}
        onValueChange={onLocationSearchChange}
        onOptionSelect={onOptionSelect}
        selected={selected}
        onChange={onChange}
        onSearchValueChange={onLocationSearchChange}
        placeholder="Select languages..."
      />
    </>
  );
};

export default LocationMultiSelect;
