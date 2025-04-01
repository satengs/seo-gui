'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CustomButton from '@/components/shared/CustomButton';
import OrganizationActionForm from '@/components/pages/Organizations/OrganizationActionForm';
import OrganizationsList from '@/components/pages/Organizations/OrganizationsList';
import axiosClient from '@/lib/axiosClient';
import { IOrganization } from '@/types';

const OrganizationsSection = () => {
  const { toast } = useToast();

  const [showAddForm, setShowAddForm] = useState(false);
  const [organizations, setOrganizations] = useState<IOrganization[] | null>(
    null
  );

  const fetchOrganizations = useCallback(async () => {
    try {
      const resp = await axiosClient.get('/api/organizations');
      setOrganizations(resp?.data || []);
    } catch (err) {
      toast({
        title: 'Failed',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const toggleShowAddForm = useCallback(
    () => setShowAddForm((prevState) => !prevState),
    []
  );

  const onOrganizationAdd = useCallback(
    (item: IOrganization) => {
      if (organizations?.length) {
        const newUsers = [item, ...organizations];
        setOrganizations(newUsers);
      } else {
        setOrganizations([item]);
      }
    },
    [organizations]
  );

  const onOrganizationEdit = useCallback(
    (item: IOrganization) => {
      if (organizations?.length) {
        const data = organizations.map((_item) =>
          _item._id === item._id ? { ...item } : _item
        );
        setOrganizations(data);
      } else {
        setOrganizations([item]);
      }
    },
    [organizations]
  );
  const onOrganizationDelete = useCallback(
    (item: IOrganization) => {
      if (organizations?.length) {
        setOrganizations(
          (prevState) =>
            prevState && prevState.filter((_item) => _item._id !== item._id)
        );
      }
    },
    [organizations]
  );

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return (
    <div className={'px-4'}>
      <CustomButton
        variant={'secondary'}
        className={'w-56 flex items-center justify-center text-sm'}
        onClick={toggleShowAddForm}
      >
        <Plus className="mr-4 h-4 w-4" />
        Add Organization
      </CustomButton>
      {showAddForm ? (
        <OrganizationActionForm onOrganizationAdd={onOrganizationAdd} />
      ) : null}
      <OrganizationsList
        organizations={organizations}
        onOrganizationDelete={onOrganizationDelete}
        onOrganizationEdit={onOrganizationEdit}
      />
    </div>
  );
};

export default OrganizationsSection;
