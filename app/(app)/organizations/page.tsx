'use client';

import React from 'react';
import OrganizationsSection from '@/components/pages/Organizations';

export default function WorkspacesPage() {
  return (
    <div className="container p-4">
      <h1 className="text-4xl font-bold mb-8">Organizations</h1>
      <OrganizationsSection />
    </div>
  );
}
