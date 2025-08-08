import React, { FC } from 'react';

const Loading: FC = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <span className="loading loading-dots loading-xl"></span>
        </div>
    );
}

export default Loading;