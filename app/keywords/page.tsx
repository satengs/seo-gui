'use client';

import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LocationSelect from '@/components/shared/LocationSelect';
import { KeyRound, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DeviceSelect from '@/components/shared/DeviceSelect';
import axiosClient from '@/lib/axiosClient';
import { IKeyword } from '@/types';
import KeywordsTable from '@/components/pages/Keywords/KeywordsTable';

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<IKeyword[] | null>(null);
  // const [selectedKeywords, setSelectedKeywords] = useState<IKeyword[] | []>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [device, setDevice] = useState<string>('mobile');
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<string>('');
  const { toast } = useToast();

  const fetchKeywords = useCallback(async () => {
    try {
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
        location: location?.length ? location : 'United States',
        device,
      };
      const response = await axiosClient.post('/api/keywords/search', reqBody);
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

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  const onDeviceSelect = useCallback((value: string) => setDevice(value), []);

  const onValueChange = useCallback((value: any) => {
    setLocation(value.name);
  }, []);

  // const onKeywordSelect = (keyword: IKeyword) => {
  //   let currentSelected: IKeyword[] = [...selectedKeywords];
  //
  //   const existKeyword = currentSelected.findIndex(
  //     (item: IKeyword) => item.term === keyword.term
  //   );
  //   if (existKeyword !== -1) {
  //     currentSelected = currentSelected.filter(
  //       (item: IKeyword) => item.term !== keyword.term
  //     );
  //   } else if (currentSelected?.length < 3) {
  //     currentSelected.push(keyword);
  //   }
  //
  //   setSelectedKeywords(currentSelected);
  // };

  const onKeywordsChange = useCallback((data: any) => {
    setKeywords(data);
  }, []);

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
            <DeviceSelect onValue={onDeviceSelect} defaultValue={'mobile'} />
          </div>

          <Button variant="outline" onClick={searchKeywords} disabled={loading}>
            <Search
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Search:
          </Button>
        </div>
        {keywords?.length ? (
          <KeywordsTable
            keywords={keywords}
            onActionKeywordsChange={onKeywordsChange}
          />
        ) : (
          <p>Loading keywords</p>
        )}

        {/*<div className="relative overflow-x-auto">*/}
        {/*  <table className="w-full text-sm text-left overflow-auto">*/}
        {/*    <thead className="text-xs uppercase bg-muted">*/}
        {/*      <tr>*/}
        {/*        <th className="px-6 py-3">Keyword</th>*/}
        {/*        <th className="px-6 py-3">KGMID</th>*/}
        {/*        <th className="px-6 py-3">Location</th>*/}
        {/*        <th className="px-6 py-3">Device Type</th>*/}
        {/*        <th className="px-6 py-3">Organic Results Count</th>*/}
        {/*        <th className="px-6 py-3">Last Checked</th>*/}
        {/*        <th className="px-6 py-3">Actions</th>*/}
        {/*      </tr>*/}
        {/*    </thead>*/}
        {/*    <tbody>*/}
        {/*      {keywords ? (*/}
        {/*        keywords?.length ? (*/}
        {/*          keywords.map((keyword, index) => {*/}
        {/*            const selectedTerms = selectedKeywords.map(*/}
        {/*              (keyword) => keyword.term*/}
        {/*            );*/}
        {/*            return (*/}
        {/*              <tr key={keyword?.term || index} className="border-b">*/}
        {/*                <td*/}
        {/*                  className="px-1 py-4 flex items-center gap-3 cursor-pointer "*/}
        {/*                  onClick={() => onKeywordSelect(keyword)}*/}
        {/*                >*/}
        {/*                  {selectedTerms.includes(keyword.term) ? (*/}
        {/*                    <CheckSquare className={`h-5 w-5 text-blue-800`} />*/}
        {/*                  ) : (*/}
        {/*                    <Square className={`h-5 w-5 text-gray-800`} />*/}
        {/*                  )}*/}

        {/*                  {keyword.term || ''}*/}
        {/*                </td>*/}
        {/*                <td className="px-6 py-4">*/}
        {/*                  {keyword.kgmid || 'No kgmid'}*/}
        {/*                </td>*/}
        {/*                <td className="px-6 py-4">{keyword.location}</td>*/}
        {/*                <td className="px-6 py-4">*/}
        {/*                  {keyword.device.charAt(0).toUpperCase() +*/}
        {/*                    keyword.device.slice(1)}*/}
        {/*                </td>*/}
        {/*                <td className="px-6 py-4">*/}
        {/*                  {keyword.organicResultsCount.toString()}*/}
        {/*                </td>*/}
        {/*                <td className="px-6 py-4">*/}
        {/*                  {keyword.updatedAt*/}
        {/*                    ? new Date(keyword.updatedAt).toLocaleString()*/}
        {/*                    : 'Never'}*/}
        {/*                </td>*/}
        {/*                <td className="px-6 py-4 flex flex-row items-center justify-between gap-3 ">*/}
        {/*                  {!keyword?.isDefaultKeywords ? (*/}
        {/*                    <div className={'relative group'}>*/}
        {/*                      <Button*/}
        {/*                        variant="secondary"*/}
        {/*                        className={*/}
        {/*                          'text-green-800 p-1 h-auto border bg-white border-green-800'*/}
        {/*                        }*/}
        {/*                        disabled={loading}*/}
        {/*                        onClick={() =>*/}
        {/*                          handleActionBtn(keyword, 'add-keyword')*/}
        {/*                        }*/}
        {/*                      >*/}
        {/*                        <>*/}
        {/*                          <Plus className={`h-4 w-4 text-green-800`} />*/}
        {/*                          <span className="absolute top-full mt-2 bg-green-50 text-center  w-48 right-0 text-green-800 text-sm px-3 py-1 rounded-md shadow-lg z-50 hidden group-hover:block">*/}
        {/*                            Add to default keywords*/}
        {/*                          </span>*/}
        {/*                        </>*/}
        {/*                      </Button>*/}
        {/*                    </div>*/}
        {/*                  ) : (*/}
        {/*                    <div className="relative group">*/}
        {/*                      <Button*/}
        {/*                        variant="secondary"*/}
        {/*                        className="text-red-800 p-1 h-auto bg-white border-[0.5px] border-red-800"*/}
        {/*                        disabled={loading}*/}
        {/*                        onClick={() =>*/}
        {/*                          handleActionBtn(*/}
        {/*                            keyword,*/}
        {/*                            'remove-from-default'*/}
        {/*                          )*/}
        {/*                        }*/}
        {/*                      >*/}
        {/*                        <Minus className="h-4 w-4 text-red-800" />*/}
        {/*                      </Button>*/}

        {/*                      <span className="absolute top-full mt-2 bg-red-50 text-center  w-36 right-0 text-red-800 text-sm px-3 py-1 rounded-md shadow-lg z-50 hidden group-hover:block">*/}
        {/*                        Remove from default keywords*/}
        {/*                      </span>*/}
        {/*                    </div>*/}
        {/*                  )}*/}
        {/*                  <div className={'relative group'}>*/}
        {/*                    <Button*/}
        {/*                      variant={'secondary'}*/}
        {/*                      className={*/}
        {/*                        'text-blue-800 border-[0.5px] bg-white border-blue-800 h-auto p-1'*/}
        {/*                      }*/}
        {/*                      onClick={() =>*/}
        {/*                        handleActionBtn(keyword, 'new-tab')*/}
        {/*                      }*/}
        {/*                    >*/}
        {/*                      <SquareArrowOutUpRight*/}
        {/*                        className={`h-4 w-4 text-blue-800`}*/}
        {/*                      />*/}
        {/*                    </Button>*/}
        {/*                    <span className="absolute top-full mt-2 bg-blue-50 text-blue-800  text-center  w-36  right-0 text-sm px-3 py-2 rounded-md shadow-lg z-50 hidden group-hover:block">*/}
        {/*                      Open Html results*/}
        {/*                    </span>*/}
        {/*                  </div>*/}
        {/*                  <div className={'relative group'}>*/}
        {/*                    <Button*/}
        {/*                      variant={'secondary'}*/}
        {/*                      className={*/}
        {/*                        'text-orange-800-800 border-[0.5px] bg-white border-yellow-500 h-auto p-1'*/}
        {/*                      }*/}
        {/*                    >*/}
        {/*                      <DownloadIcon*/}
        {/*                        className={`h-4 w-4 text-yellow-500`}*/}
        {/*                      />*/}
        {/*                    </Button>*/}
        {/*                    <span className="absolute top-full mt-2 bg-blue-50 text-blue-800  text-center  w-36  right-0 text-sm px-3 py-2 rounded-md shadow-lg z-50 hidden group-hover:block">*/}
        {/*                      Download csv*/}
        {/*                    </span>*/}
        {/*                  </div>*/}
        {/*                  {keyword?.['_id'] ? (*/}
        {/*                    <div className={'relative group'}>*/}
        {/*                      <Button*/}
        {/*                        variant={'secondary'}*/}
        {/*                        className={*/}
        {/*                          'text-blue-800 bg-white border-[0.5px] border-red-800 h-auto p-1'*/}
        {/*                        }*/}
        {/*                        onClick={() =>*/}
        {/*                          handleActionBtn(keyword, 'remove-keyword')*/}
        {/*                        }*/}
        {/*                      >*/}
        {/*                        <Trash className={`h-4 w-4 text-red-800`} />*/}
        {/*                      </Button>*/}
        {/*                      <span className="absolute top-full mt-2 bg-red-50 text-red-800  text-center  w-36  right-0 text-sm px-3 py-2 rounded-md shadow-lg z-50 hidden group-hover:block">*/}
        {/*                        Remove from keywords*/}
        {/*                      </span>*/}
        {/*                    </div>*/}
        {/*                  ) : null}*/}
        {/*                </td>*/}
        {/*              </tr>*/}
        {/*            );*/}
        {/*          })*/}
        {/*        ) : (*/}
        {/*          <tr>*/}
        {/*            <td colSpan={6} className="text-center py-6">*/}
        {/*              No keywords found.*/}
        {/*            </td>*/}
        {/*          </tr>*/}
        {/*        )*/}
        {/*      ) : (*/}
        {/*        <tr>*/}
        {/*          <td className={'p-4'}>...Loading keywords</td>*/}
        {/*        </tr>*/}
        {/*      )}*/}
        {/*    </tbody>*/}
        {/*  </table>*/}
        {/*  {selectedKeywords?.length === 2 ? (*/}
        {/*    <div className={'my-3'}>*/}
        {/*      <Button*/}
        {/*        variant={'secondary'}*/}
        {/*        className={*/}
        {/*          'text-white bg-gray-800 border-[0.5px] hover:bg-gray-500 border-red-800 h-auto py-3 px-4'*/}
        {/*        }*/}
        {/*        onClick={onModalOpen}*/}
        {/*      >*/}
        {/*        See difference*/}
        {/*      </Button>*/}
        {/*    </div>*/}
        {/*  ) : null}*/}
        {/*  {showModal ? (*/}
        {/*    <Modal*/}
        {/*      isOpen={showModal}*/}
        {/*      onClose={onModalClose}*/}
        {/*      customContainerClassName={'bg-white rounded-md'}*/}
        {/*    >*/}
        {/*      <DifferenceModal keywords={selectedKeywords} />*/}
        {/*    </Modal>*/}
        {/*  ) : null}*/}
        {/*</div>*/}
      </Card>
    </div>
  );
}
