'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Download,
  Search,
  ArrowUpDown,
  // ChevronDown,
  // Filter,
  RefreshCw,
  // MoreVertical,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuCheckboxItem,
//   DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Modal from '@/components/shared/Modal';
import DifferenceModal from '@/components/pages/Keywords/DifferenceModal';
import ActionsComponent from '@/components/pages/Keywords/KeywordsTable/ActionsComponent';
import { generateMultiCSV } from '@/lib/utils';

interface IKeywordsTable {
  keywords: any[];
  onActionKeywordsChange: (data: any) => void;
}

const KeywordsTable: React.FC<IKeywordsTable> = ({
  keywords,
  onActionKeywordsChange,
}) => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // const [filters, setFilters] = useState({
  //   device: '',
  //   location: '',
  // });
  const [showModal, setShowModal] = useState<boolean>(false);

  // Sorting function
  const sortData = (data: any[], key: string, direction: string) => {
    const sortedData = data.filter((item) => item[key]);
    const nonSortedData = data.filter((item) => !item[key]);
    const _data = [...sortedData].sort((a, b): any => {
      let aValue = a[key];
      let bValue = b[key];

      if (aValue && bValue && typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }

      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return [..._data, ...nonSortedData];
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = keywords.filter((keyword) => {
      return keyword.term.toLowerCase().includes(searchTerm.toLowerCase());
      // const matchesDevice =
      //   keyword.searchParameters.device === filters.device;
      // console.log('matches device: ', matchesDevice);
      //
      // const matchesGeography =
      //   || keyword.location === filters.location;
    });

    return sortData(filtered, sortConfig.key, sortConfig.direction);
  }, [searchTerm, sortConfig, keywords]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const downloadAsCSV = (data: any[]) => {
    const csvMulti = generateMultiCSV(data);

    const blob = new Blob([csvMulti], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const toggleAllRows = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((_, index) => index)));
    }
  };

  const toggleRowSelection = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const selectedKeywords = useMemo(() => {
    if (selectedRows?.size) {
      const _keywords = Array.from(selectedRows);
      return _keywords.map((item) => {
        if (paginatedData[item]) {
          return paginatedData[item];
        }
      });
    }
    return [];
  }, [selectedRows, paginatedData]);

  const onModalOpen = useCallback(() => setShowModal(true), []);

  const onModalClose = useCallback(() => setShowModal(false), []);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Keywords </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadAsCSV(filteredAndSortedData)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
              {selectedRows.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    downloadAsCSV(
                      paginatedData.filter((_, index) =>
                        selectedRows.has(index)
                      )
                    )
                  }
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected ({selectedRows.size})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  // setFilters({ device: '', location: '' });
                  setSortConfig({ key: 'term', direction: 'asc' });
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              {/*<DropdownMenu>*/}
              {/*  <DropdownMenuTrigger asChild>*/}
              {/*    <Button*/}
              {/*      variant="outline"*/}
              {/*      size="sm"*/}
              {/*      className={'focus:outline-none'}*/}
              {/*    >*/}
              {/*      <Filter className="h-4 w-4 mr-2" />*/}
              {/*      Filters*/}
              {/*    </Button>*/}
              {/*  </DropdownMenuTrigger>*/}
              {/*  <DropdownMenuContent align="end" className="w-[200px]">*/}
              {/*    <div className="p-2">*/}
              {/*      <div className="space-y-4">*/}
              {/*        <div>*/}
              {/*          <label className="text-sm font-medium">Device</label>*/}
              {/*          <Select*/}
              {/*            value={filters.device}*/}
              {/*            onValueChange={(value) =>*/}
              {/*              setFilters({ ...filters, device: value })*/}
              {/*            }*/}
              {/*          >*/}
              {/*            <SelectTrigger>*/}
              {/*              <SelectValue placeholder="All devices" />*/}
              {/*            </SelectTrigger>*/}
              {/*            <SelectContent>*/}
              {/*              <SelectItem value="all">All devices</SelectItem>*/}
              {/*              <SelectItem value="desktop">Desktop</SelectItem>*/}
              {/*              <SelectItem value="mobile">Mobile</SelectItem>*/}
              {/*              <SelectItem value="tablet">Tablet</SelectItem>*/}
              {/*            </SelectContent>*/}
              {/*          </Select>*/}
              {/*        </div>*/}
              {/*        <div>*/}
              {/*          <label className="text-sm font-medium">Location</label>*/}
              {/*          <Select*/}
              {/*            value={filters.location}*/}
              {/*            onValueChange={(value) =>*/}
              {/*              setFilters({ ...filters, location: value })*/}
              {/*            }*/}
              {/*          >*/}
              {/*            <SelectTrigger>*/}
              {/*              <SelectValue placeholder="All locations" />*/}
              {/*            </SelectTrigger>*/}
              {/*            <SelectContent>*/}
              {/*              <SelectItem value="all">All locations</SelectItem>*/}
              {/*              <SelectItem value="United States">*/}
              {/*                United States*/}
              {/*              </SelectItem>*/}
              {/*              <SelectItem value="United Kingdom">*/}
              {/*                United Kingdom*/}
              {/*              </SelectItem>*/}
              {/*              <SelectItem value="Canada">Canada</SelectItem>*/}
              {/*              <SelectItem value="Australia">Australia</SelectItem>*/}
              {/*            </SelectContent>*/}
              {/*          </Select>*/}
              {/*        </div>*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*  </DropdownMenuContent>*/}
              {/*</DropdownMenu>*/}
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]">
                    <Checkbox
                      checked={selectedRows.size === paginatedData.length}
                      onCheckedChange={toggleAllRows}
                    />
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('term')}>
                      Keyword
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('kgmid')}>
                      KGMID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('kgmTitle')}
                    >
                      KGM Title
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('kgmWebsite')}
                    >
                      KGM Website
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('location')}
                    >
                      Location
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('device')}
                    >
                      Device Type
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('organicResultsCount')}
                    >
                      Organic Results
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('lastChecked')}
                    >
                      Last Checked
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className={'text-center'}>
                {paginatedData.map((keyword, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(index)}
                        onCheckedChange={() => toggleRowSelection(index)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {keyword?.term || ''}
                    </TableCell>
                    <TableCell>
                      {keyword?.kgmid || keyword?.knowledge_graph?.kgmid}
                    </TableCell>
                    <TableCell>
                      {keyword?.knowledge_graph?.title ||
                        keyword?.dynamicData?.data?.knowledge_graph?.title ||
                        ''}
                    </TableCell>
                    <TableCell>
                      {keyword?.kgmWebsite ||
                      keyword?.dynamicData?.data?.knowledge_graph?.website ? (
                        <Link
                          href={
                            keyword?.keyword?.kgmWebsite ||
                            keyword?.dynamicData?.data?.knowledge_graph?.website
                          }
                          target={'_blank'}
                        >
                          {keyword?.knowledge_graph?.website ||
                            keyword?.dynamicData?.data?.knowledge_graph
                              ?.website ||
                            ''}
                        </Link>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {keyword?.location ||
                        keyword?.search_parameters?.location_used ||
                        ''}
                    </TableCell>
                    <TableCell className="capitalize">
                      {keyword?.device ||
                        keyword?.search_parameters?.device ||
                        ''}
                    </TableCell>
                    <TableCell>
                      {keyword?.organicResultsCount?.toLocaleString() ||
                        keyword?.organic_results?.length ||
                        ''}
                    </TableCell>
                    <TableCell>
                      {keyword?.updatedAt
                        ? new Date(keyword?.updatedAt).toLocaleDateString()
                        : ''}
                    </TableCell>
                    <TableCell>
                      <ActionsComponent
                        keyword={keyword}
                        onActionKeywordsChange={onActionKeywordsChange}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {selectedRows?.size >= 2 ? (
            <div className={'my-3'}>
              <Button
                variant={'secondary'}
                className={
                  'text-white bg-gray-800 border-[0.5px] hover:bg-gray-500 border-red-800 h-auto py-3 px-4'
                }
                onClick={onModalOpen}
              >
                See difference
              </Button>
            </div>
          ) : null}
          {showModal ? (
            <Modal
              isOpen={showModal}
              onClose={onModalClose}
              customContainerClassName={'bg-white rounded-md'}
            >
              <DifferenceModal keywords={selectedKeywords} />
            </Modal>
          ) : null}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 / page</SelectItem>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="20">20 / page</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredAndSortedData.length
                )}{' '}
                of {filteredAndSortedData.length} results
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeywordsTable;
