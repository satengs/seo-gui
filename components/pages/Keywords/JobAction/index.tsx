import React from 'react';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';

const JobAction = () => {
  return (
    <Card className={'py-3 my-3 flex items-center gap-4 border-0 shadow-none'}>
      <Button variant={'secondary'} className={'bg-blue-300 text-blue-17'}>
        Start Daily Job
      </Button>
      <Button variant={'secondary'} className={'bg-red-300 text-blue-17'}>
        Stop Daily Job
      </Button>
      {/*TODO Research how stop/start vercel cron job*/}
    </Card>
  );
};

export default JobAction;
