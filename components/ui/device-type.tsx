import { Computer, Phone } from 'lucide-react';
import React from 'react';

export const DeviceType = ({
  type,
}: {
  type: 'desktop' | 'mobile' | 'tablet';
}) => {
  return type === 'desktop' ? (
    <Computer className="h-4 w-4" />
  ) : (
    <Phone className="h-4 w-4" />
  );
};
