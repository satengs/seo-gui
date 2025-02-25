"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/lib/axiosClient';

interface User {
    _id: string;
    email: string;
    name: string;
}

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onDelete: () => void;
}

export default function DeleteConfirmDialog({
                                                isOpen,
                                                onClose,
                                                user,
                                                onDelete
                                            }: DeleteConfirmDialogProps) {
    const { toast } = useToast();

    const handleDelete = async () => {
        try {
            if (!user) return;

            await axiosClient.delete(`/api/users/${user._id}`);

            toast({
                title: 'Success',
                description: 'User deleted successfully',
            });

            onDelete();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to delete user',
                variant: 'destructive',
            });
        }
    };

    if (!user) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the user account for {user.name} ({user.email}).
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}