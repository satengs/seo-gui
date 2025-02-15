"use client";

import React, { useState, useMemo } from 'react';
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
    ChevronRight,
    ChevronDown,
    History,
    ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { IKeyword, DailyData } from '@/types';

interface KeywordsTableProps {
    keywords: IKeyword[];
    currentPage: number;
    totalCount: number;
    totalPages: number;
    onActionKeywordsChange: (data: any) => void;
}

export default function KeywordsTable({
                                          keywords = [],
                                          currentPage,
                                          totalCount,
                                          totalPages,
                                          onActionKeywordsChange
                                      }: KeywordsTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [sortConfig, setSortConfig] = useState({
        key: '',
        direction: 'asc'
    });

    const toggleRowExpansion = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const sortData = (data: IKeyword[], key: string, direction: string) => {
        return [...data].sort((a: any, b: any) => {
            let aValue = a[key];
            let bValue = b[key];

            // Handle historical data fields
            if (key.startsWith('historical.')) {
                const historyKey = key.split('.')[1] as keyof DailyData;
                const aHistory = Array.from(a.historicalData.values())[0];
                const bHistory = Array.from(b.historicalData.values())[0];
                aValue = aHistory?.[historyKey];
                bValue = bHistory?.[historyKey];
            }

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const filteredAndSortedData = useMemo(() => {
        if (!keywords) return [];

        // Ensure historicalData is a Map
        const processedKeywords = keywords.map(keyword => ({
            ...keyword,
            historicalData: keyword.historicalData instanceof Map
                ? keyword.historicalData
                : new Map(Object.entries(keyword.historicalData || {}))
        }));

        let filtered = processedKeywords.filter((keyword) =>
            keyword.term.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortConfig.key) {
            filtered = sortData(filtered, sortConfig.key, sortConfig.direction);
        }

        return filtered;
    }, [keywords, searchTerm, sortConfig]);

    const getLatestHistoricalData = (keyword: IKeyword) => {
        if (!keyword.historicalData) return null;

        try {
            const histData = keyword.historicalData instanceof Map
                ? keyword.historicalData
                : new Map(Object.entries(keyword.historicalData || {}));

            const values = Array.from(histData.values());
            return values[0] || null;
        } catch (error) {
            console.error('Error processing historical data:', error);
            return null;
        }
    };

    const getHistoricalDates = (keyword: IKeyword) => {
        if (!keyword.historicalData) return [];

        const histData = keyword.historicalData instanceof Map
            ? keyword.historicalData
            : new Map(Object.entries(keyword.historicalData));

        return Array.from(histData.keys()).sort().reverse();
    };

    const handleSort = (key: string) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const toggleAllRows = () => {
        if (selectedRows.size === filteredAndSortedData.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(filteredAndSortedData.map(k => k._id)));
        }
    };

    const toggleRowSelection = (id: string) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedRows(newSelected);
    };

    const downloadAsCSV = (data: IKeyword[]) => {
        const headers = [
            "Date",
            "Keyword",
            "Location",
            "Device Type",
            "KGM Title",
            "KGM Website",
            "Organic Results",
            "Difficulty",
            "Volume",
            "Backlinks Needed",
            "Is Default"
        ];

        const csvRows = [
            headers.join(","),
            ...data.flatMap(keyword =>
                Array.from(keyword.historicalData.entries()).map(([date, entry]) => [
                    date,
                    keyword.term,
                    keyword.location,
                    keyword.device,
                    `"${entry.kgmTitle || ''}"`,
                    `"${entry.kgmWebsite || ''}"`,
                    entry.organicResultsCount,
                    entry.difficulty || '',
                    entry.volume || '',
                    entry.backlinksNeeded || '',
                    keyword.isDefaultKeywords
                ].join(","))
            )
        ];

        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "keyword-data.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="mx-1 py-3">
            <Card className={"bg-opacity-5 bg-gray-200"}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Keywords</CardTitle>
                        <div className="text-sm text-muted-foreground">
                            Total: {totalCount} keywords
                        </div>
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
                                            filteredAndSortedData.filter(k => selectedRows.has(k._id))
                                        )
                                    }
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Selected ({selectedRows.size})
                                </Button>
                            )}
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
                        </div>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[30px]">
                                        <Checkbox
                                            checked={selectedRows.size === filteredAndSortedData.length}
                                            onCheckedChange={toggleAllRows}
                                        />
                                    </TableHead>
                                    <TableHead className="w-[30px]"></TableHead>
                                    <TableHead>
                                        <Button variant="ghost" onClick={() => handleSort('term')}>
                                            Keyword
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant="ghost" onClick={() => handleSort('location')}>
                                            Location
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant="ghost" onClick={() => handleSort('device')}>
                                            Device Type
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant="ghost" onClick={() => handleSort('historical.kgmTitle')}>
                                            KGM Title
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>KGM Website</TableHead>
                                    <TableHead className="text-right">
                                        <Button variant="ghost" onClick={() => handleSort('historical.organicResultsCount')}>
                                            Organic Results
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <Button variant="ghost" onClick={() => handleSort('historical.difficulty')}>
                                            Difficulty
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <Button variant="ghost" onClick={() => handleSort('historical.volume')}>
                                            Volume
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <Button variant="ghost" onClick={() => handleSort('historical.backlinksNeeded')}>
                                            Backlinks
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedData.map((keyword) => {
                                    const latestData = getLatestHistoricalData(keyword);
                                    const dates = getHistoricalDates(keyword);

                                    return (
                                        <React.Fragment key={keyword._id}>
                                            <TableRow className="hover:bg-muted/50">
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedRows.has(keyword._id)}
                                                        onCheckedChange={() => toggleRowSelection(keyword._id)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => toggleRowExpansion(keyword._id)}
                                                    >
                                                        {expandedRows.has(keyword._id) ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="font-medium">
                          <span className={`${keyword.isDefaultKeywords ? "bg-blue-100 dark:bg-blue-950" : ""} px-2 py-1 rounded-md`}>
                            {keyword.term}
                          </span>
                                                </TableCell>
                                                <TableCell>{keyword.location}</TableCell>
                                                <TableCell className="capitalize">{keyword.device}</TableCell>
                                                <TableCell>{latestData?.kgmTitle || ''}</TableCell>
                                                <TableCell>
                                                    {latestData?.kgmWebsite && (
                                                        <Link
                                                            href={latestData.kgmWebsite}
                                                            target="_blank"
                                                            className="flex items-center hover:underline"
                                                        >
                                                            {new URL(latestData.kgmWebsite).hostname}
                                                            <ExternalLink className="ml-1 h-3 w-3" />
                                                        </Link>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {latestData?.organicResultsCount?.toLocaleString() || ''}
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {latestData?.difficulty || '-'}
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {latestData?.volume?.toLocaleString() || '-'}
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {latestData?.backlinksNeeded || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {dates[0] || ''}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => downloadAsCSV([keyword])}
                                                        className="h-8 w-8 p-0"
                                                        title="Export keyword history"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            {expandedRows.has(keyword._id) && (
                                                <TableRow>
                                                    <TableCell colSpan={13} className="p-0">
                                                        <div className="bg-muted/50 border-y">
                                                            <div className="p-2 border-b bg-muted/70">
                                <span className="flex items-center text-sm font-medium text-muted-foreground">
                                  <History className="h-4 w-4 mr-2" />
                                  Historical Data
                                </span>
                                                            </div>
                                                            <div className="px-4">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow className="hover:bg-transparent">
                                                                            <TableHead className="w-[100px]">Date</TableHead>
                                                                            <TableHead>KGM Title</TableHead>
                                                                            <TableHead>KGM Website</TableHead>
                                                                            <TableHead className="text-right">Organic Results</TableHead>
                                                                            <TableHead className="text-right">Difficulty</TableHead>
                                                                            <TableHead className="text-right">Volume</TableHead>
                                                                            <TableHead className="text-right">Backlinks</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {dates.slice(1).map((date) => {
                                                                            const entry = keyword.historicalData.get(date);
                                                                            if (!entry) return null;

                                                                            return (
                                                                                <TableRow key={date} className="hover:bg-muted/30">
                                                                                    <TableCell className="py-2 font-medium">{date}</TableCell>
                                                                                    <TableCell>{entry.kgmTitle || ''}</TableCell>
                                                                                    <TableCell>
                                                                                        {entry.kgmWebsite && (
                                                                                            <Link
                                                                                                href={entry.kgmWebsite}
                                                                                                target="_blank"
                                                                                                className="flex items-center hover:underline"
                                                                                            >
                                                                                                {new URL(entry.kgmWebsite).hostname}
                                                                                                <ExternalLink className="ml-1 h-3 w-3" />
                                                                                            </Link>
                                                                                        )}
                                                                                    </TableCell>
                                                                                    <TableCell className="text-right font-mono">
                                                                                        {entry.organicResultsCount?.toLocaleString() || ''}
                                                                                    </TableCell>
                                                                                    <TableCell className="text-right font-mono">
                                                                                        {entry.difficulty || '-'}
                                                                                    </TableCell>
                                                                                    <TableCell className="text-right font-mono">
                                                                                        {entry.volume?.toLocaleString() || '-'}
                                                                                    </TableCell>
                                                                                    <TableCell className="text-right font-mono">
                                                                                        {entry.backlinksNeeded || '-'}
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            );
                                                                        })}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}