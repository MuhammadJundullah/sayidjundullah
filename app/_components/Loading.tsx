import React, { FC } from 'react';

const Loading: FC = () => {
    return (
      <div className="flex flex-col justify-center items-center">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
}

export default Loading;