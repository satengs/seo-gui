import React from 'react';

const RememberMeBox = () => {
  const [rememberMe, setRememberMe] = React.useState(false);

  return (
    <div className="flex items-center gap-2 px-1">
      <input
        type="checkbox"
        id="rememberMe"
        checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
        className="w-4 h-4 p-2 cursor-pointer"
      />
      <label htmlFor="rememberMe" className="text-sm font-medium text-gray-600">
        Remember Me
      </label>
    </div>
  );
};

export default RememberMeBox;
