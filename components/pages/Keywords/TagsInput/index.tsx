"use client";

import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TagsInputProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
}

export default function TagsInput({
                                      tags = [],
                                      onTagsChange,
                                      placeholder = "Add tags...",
                                      maxTags = 10,
                                  }: TagsInputProps) {
    const [input, setInput] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        }
    };

    const addTag = () => {
        const trimmedInput = input.trim().toLowerCase();
        if (trimmedInput && !tags.includes(trimmedInput) && tags.length < maxTags) {
            onTagsChange([...tags, trimmedInput]);
            setInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full text-sm"
                    >
            {tag}
                        <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-destructive"
                        >
              <X className="h-3 w-3" />
            </button>
          </span>
                ))}
            </div>
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1"
                />
                <Button
                    onClick={addTag}
                    variant="outline"
                    size="sm"
                    disabled={!input.trim() || tags.length >= maxTags}
                >
                    Add Tag
                </Button>
            </div>
            {tags.length >= maxTags && (
                <p className="text-xs text-muted-foreground">
                    Maximum {maxTags} tags allowed
                </p>
            )}
        </div>
    );
}
