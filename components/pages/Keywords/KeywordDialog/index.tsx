"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { IKeyword } from "@/types";
import TagsInput from "../TagsInput";
import axiosClient from "@/lib/axiosClient";

interface KeywordDialogProps {
    isOpen: boolean;
    onCloseAction: () => void;  // Renamed from onClose to onCloseAction
    keyword: IKeyword | null;
    onSaveAction: () => void;  // Renamed from onSave to onSaveAction
}

const MAX_TAGS = 10;

export default function KeywordDialog({
                                          isOpen,
                                          onCloseAction,
                                          keyword,
                                          onSaveAction,
                                      }: KeywordDialogProps) {
    const [tags, setTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (keyword) {
            setTags(keyword.tags || []);
        }
    }, [keyword]);

    const handleTagsChange = useCallback((newTags: string[]) => {
        setTags(newTags);
    }, []);

    const handleSave = async () => {
        try {
            setIsLoading(true);

            if (!keyword?._id) {
                throw new Error("Invalid keyword");
            }

            await axiosClient.patch(`/api/keywords/${keyword._id}`, {
                tags,
            });

            toast({
                title: "Success",
                description: "Tags updated successfully",
            });

            onSaveAction();
            onCloseAction();
        } catch (error) {
            toast({
                title: "Error",
                description:
                    error instanceof Error ? error.message : "Failed to update tags",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!keyword) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Tags for "{keyword.term}"</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <TagsInput
                        tags={tags}
                        maxTags={MAX_TAGS}
                        onTagsChange={handleTagsChange}
                        placeholder="Add tags (press Enter or comma to add)"
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={onCloseAction} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Tags"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
