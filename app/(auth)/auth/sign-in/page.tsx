import React from 'react';
import SignInForm from '@/components/pages/Auth/SignIn';
import { H1 } from '@/components/shared/Headings';

const SignInPage = () => {
  return (
    <div className={''}>
      <H1 headingText={'Sign In'} />
      <div className={'mt-6 w-full sm:max-w-lg sm:mx-auto sm:w-full'}>
        <SignInForm />
      </div>
    </div>
  );
};

export default SignInPage;
