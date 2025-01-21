'use client';

import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LocationSelect from '@/components/shared/LocationSelect';
import {
  KeyRound,
  Plus,
  Search,
  Trash,
  SquareArrowOutUpRight,
  Minus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DeviceSelect from '@/components/shared/DeviceSelect';
import axiosClient from '@/lib/axiosClient';

interface Keyword {
  _id: string;
  term: string;
  category: string;
  geography?: string;
  isDefaultKeywords: boolean;
  lastResults?: any[];
  lastChecked?: string;
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[] | null>(null);
  const [searchText, setSearchText] = useState('');
  const [device, setDevice] = useState('desktop');
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [location, setLocation] = useState<string>('');
  const { toast } = useToast();

  const fetchKeywords = useCallback(async () => {
    try {
      // const response = await fetch('/api/keywords');
      const response = await axiosClient.get('/api/keywords');
      setKeywords(response?.data || []);
    } catch (error) {
      console.error('Failed to fetch keywords:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch keywords',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  async function searchKeywords() {
    try {
      if (!searchText?.length) {
        return;
      }
      setLoading(true);
      const reqBody = {
        term: searchText.trim(),
        location,
        device,
      };
      // const response = await fetch('/api/keywords/search', {
      //   method: 'POST',
      //   body: JSON.stringify(reqBody),
      // });
      const response = await axiosClient.post('/api/keywords/search', reqBody);
      // const data = await response.json();
      setKeywords(response.data);
    } catch (error) {
      console.error('Failed to fetch keywords:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch keywords',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  // async function checkKeywords() {
  //   setChecking(true);
  //   try {
  //     // const response = await fetch('/api/keywords/check', {
  //     //   method: 'POST',
  //     // });
  //     const response = await axiosClient.post('/api/keywords/check');
  //     const data = await response.json();
  //
  //     toast({
  //       title: 'Success',
  //       description: `Checked ${data.length} keywords`,
  //     });
  //
  //     // Refresh keywords to get latest data
  //     await fetchKeywords();
  //   } catch (error) {
  //     console.error('Failed to check keywords:', error);
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to check keywords',
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setChecking(false);
  //   }
  // }

  function getRanking(keyword: Keyword) {
    if (!keyword.lastResults) return 'N/A';

    const position =
      keyword.lastResults.findIndex((result: any) =>
        result.link.includes('freedomdebtrelief.com')
      ) + 1;

    return position || 'Not found';
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  const onDeviceSelect = useCallback((value: string) => setDevice(value), []);

  const onValueChange = useCallback((value: any) => {
    setLocation(value.name);
  }, []);

  const changeKeyword = async (keyword: Keyword) => {
    try {
      const patchData = {
        term: keyword.term,
        updatedData: {
          isDefaultKeywords: false,
        },
      };
      // const response = await fetch('http://localhost:3000/api/keywords', {
      //   method: 'PATCH',
      //   body: JSON.stringify(patchData),
      // });
      const response = await axiosClient.patch('/api/keywords', patchData);
      setKeywords(response?.data || []);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to remove keyword from defaults',
        variant: 'destructive',
      });
    }
  };

  const deleteKeyword = async (keyword: Keyword) => {
    try {
      // const response = await fetch(
      //   `http://localhost:3000/api/keywords?keyword=${keyword.term}`,
      //   {
      //     method: 'DELETE',
      //   }
      // );
      const response = await axiosClient.delete(
        `/api/keywords?keyword=${keyword.term}`
      );
      setKeywords(response?.data || []);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to remove keyword',
        variant: 'destructive',
      });
    }
  };

  const addKeyword = async (keyword: Keyword) => {
    try {
      // const response = await fetch('http://localhost:3000/api/keywords', {
      //   method: 'POST',
      //   body: JSON.stringify(keyword),
      // });
      const response = await axiosClient.post('/api/keywords', keyword);
      setKeywords(response?.data || []);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add keyword',
        variant: 'destructive',
      });
    }
  };

  const handleActionBtn = async (keyword: Keyword, action: string) => {
    if (action === 'new-tab') {
      const keywordPid = keyword?.term.toLowerCase().replace(/\s+/g, '-');
      window.open(
        `/keywords/${keywordPid}?location=${keyword?.geography || 'United States'}&device=${device || 'desktop'}`,
        '_blank'
      );
    }
    if (action === 'remove-keyword') {
      deleteKeyword(keyword);
    }
    if (action === 'remove-from-default') {
      await changeKeyword(keyword);
    }
    if (action === 'add-keyword') {
      await addKeyword(keyword);
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Keywords</h1>
        {/*<div className="space-x-4">*/}
        {/*  <Button variant="outline" onClick={checkKeywords} disabled={checking}>*/}
        {/*    <RefreshCw*/}
        {/*      className={`h-4 w-4 mr-2 ${checking ? 'animate-spin' : ''}`}*/}
        {/*    />*/}
        {/*    Check Rankings*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Keywords
              </p>
              <h2 className="text-2xl font-bold">{keywords?.length || ''}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search keywords..."
              className="w-full"
              type="search"
              onChange={onInputChange}
            />
          </div>
          <div className="flex-1">
            <LocationSelect onValueChange={onValueChange} />
          </div>
          <div className="flex-0.5">
            <DeviceSelect onValue={onDeviceSelect} defaultValue={'desktop'} />
          </div>

          <Button variant="outline" onClick={searchKeywords} disabled={loading}>
            <Search
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Search:
          </Button>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left overflow-auto">
            <thead className="text-xs uppercase bg-muted">
              <tr>
                <th className="px-6 py-3">Keyword</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Default Keyword</th>
                <th className="px-6 py-3">Search Count</th>
                <th className="px-6 py-3">Last Checked</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keywords ? (
                keywords?.length ? (
                  keywords.map((keyword, index) => {
                    return (
                      <tr key={keyword?.term || index} className="border-b">
                        <td className="px-6 py-4">{keyword.term || ''}</td>
                        <td className="px-6 py-4">
                          {keyword.category || 'No category'}
                        </td>
                        <td className="px-6 py-4">
                          {keyword.isDefaultKeywords ? 'Yes' : 'No'}
                        </td>
                        <td className="px-6 py-4">{getRanking(keyword)}</td>
                        <td className="px-6 py-4">
                          {keyword.lastChecked
                            ? new Date(keyword.lastChecked).toLocaleString()
                            : 'Never'}
                        </td>
                        <td className="px-6 py-4 flex flex-row items-center justify-between gap-3 ">
                          {!keyword?.isDefaultKeywords ? (
                            <div className={'relative group'}>
                              <Button
                                variant="secondary"
                                className={
                                  'text-green-800 p-1 h-auto border bg-white border-green-800'
                                }
                                disabled={loading}
                                onClick={() =>
                                  handleActionBtn(keyword, 'add-keyword')
                                }
                              >
                                <>
                                  <Plus className={`h-4 w-4 text-green-800`} />
                                  <span className="absolute top-full mt-2 bg-green-50 text-center  w-48 right-0 text-green-800 text-sm px-3 py-1 rounded-md shadow-lg z-50 hidden group-hover:block">
                                    Add to default keywords
                                  </span>
                                </>
                              </Button>
                            </div>
                          ) : (
                            <div className="relative group">
                              <Button
                                variant="secondary"
                                className="text-red-800 p-1 h-auto bg-white border-[0.5px] border-red-800"
                                disabled={loading}
                                onClick={() =>
                                  handleActionBtn(
                                    keyword,
                                    'remove-from-default'
                                  )
                                }
                              >
                                <Minus className="h-4 w-4 text-red-800" />
                              </Button>

                              <span className="absolute top-full mt-2 bg-red-50 text-center  w-36 right-0 text-red-800 text-sm px-3 py-1 rounded-md shadow-lg z-50 hidden group-hover:block">
                                Remove from default keywords
                              </span>
                            </div>
                          )}
                          <div className={'relative group'}>
                            <Button
                              variant={'secondary'}
                              className={
                                'text-blue-800 border-[0.5px] bg-white border-blue-800 h-auto p-1'
                              }
                              onClick={() =>
                                handleActionBtn(keyword, 'new-tab')
                              }
                            >
                              <SquareArrowOutUpRight
                                className={`h-4 w-4 text-blue-800`}
                              />
                            </Button>
                            <span className="absolute top-full mt-2 bg-blue-50 text-blue-800  text-center  w-36  right-0 text-sm px-3 py-2 rounded-md shadow-lg z-50 hidden group-hover:block">
                              Open Html results
                            </span>
                          </div>
                          {keyword?.['_id'] ? (
                            <div className={'relative group'}>
                              <Button
                                variant={'secondary'}
                                className={
                                  'text-blue-800 bg-white border-[0.5px] border-red-800 h-auto p-1'
                                }
                                onClick={() =>
                                  handleActionBtn(keyword, 'remove-keyword')
                                }
                              >
                                <Trash className={`h-4 w-4 text-red-800`} />
                              </Button>
                              <span className="absolute top-full mt-2 bg-red-50 text-red-800  text-center  w-36  right-0 text-sm px-3 py-2 rounded-md shadow-lg z-50 hidden group-hover:block">
                                Remove from keywords
                              </span>
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6">
                      No keywords found.
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td className={'p-4'}>...Loading keywords</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
