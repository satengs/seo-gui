import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface ILocation {
  id: string;
  canonical_name: string;
  country_code: string;
  google_id: number;
  google_parent_id: number | null;
  gps: number[];
  keys: string[];
  name: string;
  reach: number;
  target_type: string;
}

interface LocationSelectProps {
  onValueChange: (item: ILocation) => void;
  defaultLocation?: string;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  onValueChange,
  defaultLocation,
}) => {
  const { toast } = useToast();
  const locationSelectRef = useRef<HTMLDivElement>(null);
  const [locationText, setLocationText] = useState<string>(
    defaultLocation || ''
  );
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    defaultLocation
  );
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [openList, setOpenList] = useState<boolean>(false);

  const fetchLocations = useCallback(async (loc?: string) => {
    try {
      const response = await fetch(`/api/keywords/location?q=${loc || ''}`);
      return await response.json();
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
      onValueChange(item);
      setLocationText(item.name);
      onCLoseList();
    },
    [onValueChange]
  );

  const onInputClick = () => {
    onOpenList();
  };

  const onInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setLocationText(e.target.value);
    const locData = await fetchLocations(e.target.value);
    setLocations(locData || []);
    onOpenList();
  };

  const handleClickOutside = (event: MouseEvent) => {
    // @ts-ignore
    if (
      locationSelectRef.current &&
      !locationSelectRef.current?.contains(event.target as Node)
    ) {
      onCLoseList();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={'relative'} ref={locationSelectRef}>
      <Input
        placeholder="Search Location"
        className="w-full"
        type="search"
        value={locationText}
        onChange={onInputChange}
        onClick={onInputClick}
      />
      {openList && locations?.length ? (
        <div
          className={
            'absolute z-10 bg-white w-full border border-gray-200 rounded-sm'
          }
        >
          {locations.map((location) => (
            <div
              key={location.name}
              className={
                'leading-8 px-2 py-1 border-b border-gray-200 cursor-pointer'
              }
              onClick={(e) => onLocationItemClick(e, location)}
            >
              <p className={'text-sm text-gray-800 font-medium leading-7'}>
                {location.name}
              </p>
              <p className={'text-xs text-gray-700'}>
                {location.reach.toLocaleString('en-US')}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(LocationSelect);
