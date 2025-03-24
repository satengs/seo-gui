import React from 'react';
import SignUpForm from '@/components/pages/Auth/SignUp';
import { H1 } from '@/components/shared/Headings';

const SignUpPage = () => {
  return (
    <>
      <H1 headingText={'Sign Up'} />
      <div className={'mt-6 w-full sm:max-w-lg sm:mx-auto sm:w-full'}>
        <SignUpForm />
      </div>
    </>
  );
};

export default SignUpForm;
