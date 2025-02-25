"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PieChart, BarChart3, Globe } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const mockData = [
    { date: "2024-01", knowledgePanel: 85, featuredSnippet: 45, peopleAlsoAsk: 30 },
    { date: "2024-02", knowledgePanel: 88, featuredSnippet: 52, peopleAlsoAsk: 35 },
    { date: "2024-03", knowledgePanel: 92, featuredSnippet: 58, peopleAlsoAsk: 42 },
    { date: "2024-04", knowledgePanel: 90, featuredSnippet: 62, peopleAlsoAsk: 48 },
];

const mockEntities = [
    {
        type: "Organization",
        name: "Example Corp",
        features: ["Knowledge Panel", "Logo", "Social Profiles"],
        score: 85,
    },
    {
        type: "Product",
        name: "Product X",
        features: ["Featured Snippet", "Product Carousel"],
        score: 72,
    },
    {
        type: "Person",
        name: "John Smith",
        features: ["Knowledge Panel", "People Also Ask"],
        score: 68,
    },
];

// Custom chart components with modern props pattern
const CustomXAxis = (props: any) => (
    <XAxis
        padding={{ left: 0, right: 0 }}
        tickLine={true}
        axisLine={true}
        {...props}
    />
);

const CustomYAxis = (props: any) => (
    <YAxis
        padding={{ top: 0, bottom: 0 }}
        tickLine={true}
        axisLine={true}
        {...props}
    />
);

export default function Home() {
    const [domain, setDomain] = useState("");

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Globe className="h-6 w-6" />
                            <h1 className="text-2xl font-bold">SERP Feature Tracker</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex w-96 items-center space-x-2">
                                <Input
                                    placeholder="Enter domain..."
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                />
                                <Button>
                                    <Search className="h-4 w-4 mr-2" />
                                    Track
                                </Button>
                            </div>
                            <Link href="/keywords">
                                <Button variant="outline">
                                    View Keywords
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Knowledge Panel Visibility
                                </CardTitle>
                                <PieChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">92%</div>
                                <p className="text-xs text-muted-foreground">
                                    +4% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Featured Snippets
                                </CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">58</div>
                                <p className="text-xs text-muted-foreground">
                                    +6 new snippets this month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    People Also Ask
                                </CardTitle>
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">42</div>
                                <p className="text-xs text-muted-foreground">
                                    +7 new questions
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="trends" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="trends">Visibility Trends</TabsTrigger>
                            <TabsTrigger value="entities">Entity Tracking</TabsTrigger>
                        </TabsList>
                        <TabsContent value="trends" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>SERP Features Trend</CardTitle>
                                    <CardDescription>
                                        Track your visibility across different SERP features over time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <div className="h-[400px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={mockData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <CustomXAxis dataKey="date" />
                                                <CustomYAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="knowledgePanel"
                                                    stroke="hsl(var(--chart-1))"
                                                    name="Knowledge Panel"
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="featuredSnippet"
                                                    stroke="hsl(var(--chart-2))"
                                                    name="Featured Snippet"
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="peopleAlsoAsk"
                                                    stroke="hsl(var(--chart-3))"
                                                    name="People Also Ask"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="entities" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Entity Tracking</CardTitle>
                                    <CardDescription>
                                        Monitor entities associated with your brand in the Knowledge Graph
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {mockEntities.map((entity, index) => (
                                            <Card key={index}>
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="font-semibold">{entity.name}</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                Type: {entity.type}
                                                            </p>
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {entity.features.map((feature, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                                    >
                                    {feature}
                                  </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold">
                                                                {entity.score}%
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                Visibility Score
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}