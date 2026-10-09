'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle>Something went wrong</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                        {error.message || 'An unexpected error occurred in the admin panel.'}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button onClick={reset}>Try Again</Button>
                        <Button variant="outline" asChild>
                            <a href="/admin">Back to Dashboard</a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
