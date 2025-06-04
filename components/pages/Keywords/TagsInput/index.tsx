'use client';

import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
// Removed the Button import as it's no longer needed
// import { Button } from '@/components/ui/button';

interface TagsInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export default function TagsInput({
  tags = [],
  onTagsChange = () => {}, // Added a default empty function to prevent TypeError
  placeholder = 'Add tags...',
  maxTags = 10,
}: TagsInputProps) {
  const [input, setInput] = useState('');

  /**
   * Adds a list of new tags to the existing tags, ensuring uniqueness
   * and respecting the maximum tag limit.
   * @param {string[]} newTagsToAdd - An array of tags to be added.
   */
  const addTags = (newTagsToAdd: string[]) => {
    let currentTags = [...tags]; // Create a mutable copy of the tags array

    newTagsToAdd.forEach((tag) => {
      const trimmedTag = tag.trim().toLowerCase(); // Normalize the tag

      // Add tag only if it's not empty, not already present, and within the maxTags limit
      if (
        trimmedTag &&
        !currentTags.includes(trimmedTag) &&
        currentTags.length < maxTags
      ) {
        currentTags.push(trimmedTag);
      }
    });

    onTagsChange(currentTags); // Update the parent component with the new tags
  };

  /**
   * Handles key presses in the input field.
   * If 'Enter' is pressed, it processes the input for comma-separated tags.
   * @param {KeyboardEvent<HTMLInputElement>} e - The keyboard event.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission behavior

      // Split the input by commas, trim each part, and filter out empty strings
      const tagsFromInput = input
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');

      addTags(tagsFromInput); // Call the helper to add these tags
      setInput(''); // Clear the input field after adding tags
    }
  };

  /**
   * Removes a specific tag from the list.
   * @param {string} tagToRemove - The tag to be removed.
   */
  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove)); // Filter out the tag to remove
  };

  return (
    <div className="space-y-2">
      {/* Display existing tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full text-sm"
          >
            {tag}
            {/* Button to remove a tag */}
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-destructive"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Input field for adding new tags */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
        />
        {/* The "Add Tag" button has been removed from here */}
      </div>

      {/* Message when maximum tags limit is reached */}
      {tags.length >= maxTags && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxTags} tags allowed
        </p>
      )}
    </div>
  );
}
