import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import axiosClient from '@/lib/axiosClient';
import { ILocation } from '@/types';

interface LocationSelectProps {
  onValueChange: (item: ILocation | string) => void;
  defaultLocation?: string;
  disabled?: boolean;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  onValueChange,
  defaultLocation,
  disabled = false,
}) => {
  const { toast } = useToast();
  const locationSelectRef = useRef<HTMLDivElement>(null);
  const [locationText, setLocationText] = useState<string>(
    defaultLocation || ''
  );
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [openList, setOpenList] = useState<boolean>(false);

  const fetchLocations = useCallback(async (loc?: string) => {
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
  }, []);

  useEffect(() => {
    (async function fetchInitialLocations() {
      const locData = await fetchLocations();

      if (locData?.length) {
        const options = locData?.map((loc: any) => {
          return { ...loc, label: loc.name, value: loc.name };
        });
        setLocations(options);
      } else {
        setLocations([]);
      }
    })();
  }, [fetchLocations]);

  const onOpenList = () => setOpenList(true);
  const onCLoseList = () => setOpenList(false);

  const onLocationItemClick = useCallback(
    (e: any, item: ILocation) => {
      e.stopPropagation();
      onValueChange(item.name);
      setLocationText(item.name);
      onCLoseList();
    },
    [onValueChange]
  );

  const onInputClick = useCallback(() => {
    if (!disabled) {
      onOpenList();
    }
  }, [disabled]);

  const onInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setLocationText(e.target.value);
    const locData = await fetchLocations(e.target.value);
    setLocations(locData || []);
    onValueChange(e.target.value);

    onOpenList();
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      locationSelectRef.current &&
      !locationSelectRef.current?.contains(event.target as Node)
    ) {
      onCLoseList();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className={'relative'} ref={locationSelectRef}>
      <Input
        placeholder="Search Location"
        className="w-full"
        type="search"
        value={locationText}
        onChange={onInputChange}
        onClick={onInputClick}
        disabled={disabled}
      />
      {openList && locations?.length ? (
        <div
          className={
            'absolute z-10 bg-white w-full border border-gray-200 rounded-sm'
          }
        >
          {locations.map((location, index) => (
            <div
              key={`${location?.name}-${index}`}
              className={
                'leading-8 px-2 py-1 border-b border-gray-200 cursor-pointer'
              }
              onClick={(e) => onLocationItemClick(e, location)}
            >
              <p className={'text-sm text-gray-800 font-medium leading-7'}>
                {location?.name || ''}
              </p>
              <p className={'text-xs text-gray-700'}>
                {location?.reach?.toLocaleString('en-US') || ''}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(LocationSelect);
