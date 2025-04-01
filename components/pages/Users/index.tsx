'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import CustomButton from '@/components/shared/CustomButton';
import { useToast } from '@/hooks/use-toast';
import UsersActionForm from '@/components/pages/Users/UsersActionForm';
import UserList from '@/components/pages/Users/UserList';
import axiosClient from '@/lib/axiosClient';
import { IUser } from '@/types';

const UsersSection = () => {
  const { toast } = useToast();

  const [showAddForm, setShowAddForm] = useState(false);
  const [users, setUsers] = useState<IUser[] | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const resp = await axiosClient.get('/api/users');
      setUsers(resp?.data || []);
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

  const onUserAdd = useCallback(
    (item: IUser) => {
      if (users?.length) {
        const newUsers = [item, ...users];
        setUsers(newUsers);
      } else {
        setUsers([item]);
      }
    },
    [users]
  );

  const onUserEdit = useCallback(
    (item: IUser) => {
      if (users?.length) {
        console.log('item: ', item);
        const data = users.map((_item) =>
          _item._id === item._id ? { ...item } : _item
        );
        setUsers(data);
      } else {
        setUsers([item]);
      }
    },
    [users]
  );
  const onUserDelete = useCallback(
    (item: IUser) => {
      if (users?.length) {
        setUsers(
          (prevState) =>
            prevState && prevState.filter((_item) => _item._id !== item._id)
        );
      }
    },
    [users]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className={'px-4'}>
      <CustomButton
        variant={'secondary'}
        className={'w-56 flex items-center justify-center text-sm'}
        onClick={toggleShowAddForm}
      >
        <Plus className="mr-4 h-4 w-4" />
        Add User
      </CustomButton>
      {showAddForm ? <UsersActionForm onUserAdd={onUserAdd} /> : null}
      <UserList
        users={users}
        onUserDelete={onUserDelete}
        onUserEdit={onUserEdit}
      />
    </div>
  );
};

export default UsersSection;
