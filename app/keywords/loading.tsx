import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-8 w-[200px]" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <Skeleton className="h-10 w-[300px]" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-[400px] w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}