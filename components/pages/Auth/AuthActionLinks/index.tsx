import React from 'react';
import CustomButton from '@/components/shared/CustomButton';

interface IAuthActionLinks {
  actionTitle: string;
  actionText: string;
  actionHandler: () => void;
}

const AuthActionLinks = ({
  actionTitle,
  actionText,
  actionHandler,
}: IAuthActionLinks) => {
  return (
    <div className={'my-6 flex flex-col gap-6'}>
      <div className={'relative'}>
        <div className={'absolute inset-0 flex items-center'}>
          <div className={'w-full border-t border-gray-400'} />
        </div>
        <div className={'relative flex justify-center z-10 '}>
          <span className={'px-2 text-gray-500 bg-white'}>{actionTitle}</span>
        </div>
      </div>
      <CustomButton
        variant={'secondary'}
        type={'button'}
        onClick={actionHandler}
      >
        {actionText}
      </CustomButton>
    </div>
  );
};

export default React.memo(AuthActionLinks);
