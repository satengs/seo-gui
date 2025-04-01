'use client';

import React, { useCallback, useState, useRef, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LocationSelect from '@/components/shared/LocationSelect';
import DeviceSelect from '@/components/shared/DeviceSelect';

export default function KeywordPidPage() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const searchParams = useSearchParams();
  const params: { keyword: string } = useParams();
  const location = searchParams.get('location');
  const device = searchParams.get('device');
  const [locationText, setLocationText] = useState<string>('');
  const [deviceType, setDeviceType] = useState<string>(device || '');
  const [loading, setLoading] = useState<boolean>(false);
  const { keyword } = params;

  const onLocationValueChange = useCallback((data: any) => {
    setLocationText(data?.name);
  }, []);

  const onSelectValueChange = useCallback((value: any) => {
    setDeviceType(value);
  }, []);

  const searchKeywordHtml = () => {
    if (iframeRef?.current) {
      setLoading(true);
      iframeRef.current.src = `/api/keywords/search/html?keyword=${keyword}&location=${locationText || location}&device=${deviceType}`;
    }
  };

  const onIframeLoad = () => setLoading(false);

  return (
    <div className={'p-6 space-y-6'}>
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search keywords..."
            className="w-full"
            type="search"
            disabled={true}
            value={keyword?.replace(/-/g, ' ') || 'seda'}
          />
        </div>
        <div className="flex-1">
          <LocationSelect
            onValueChange={onLocationValueChange}
            defaultLocation={location || ''}
          />
        </div>
        <div className="flex-0.5">
          <DeviceSelect
            onValue={onSelectValueChange}
            defaultValue={device || ''}
          />
        </div>

        <Button
          variant="outline"
          onClick={searchKeywordHtml}
          disabled={loading}
        >
          <Search className={`h-4 w-4 mr-2 `} />
          Search
        </Button>
      </div>

      <Suspense fallback={<p>....Loading</p>}>
        <iframe
          src={`/api/keywords/search/html?keyword=${keyword}&location=${location}`}
          ref={iframeRef}
          style={{ width: '100%', height: '100vh', border: 'none' }}
          onLoad={onIframeLoad}
        ></iframe>
      </Suspense>
    </div>
  );
}
