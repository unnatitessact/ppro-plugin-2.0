import React from 'react';

import dayjs from 'dayjs';

const LastActive = ({ date }: { date: string | undefined }) => {
  const isValidDate = dayjs(date).isValid();

  if (!date) {
    return null;
  }
  return (
    <div className="flex flex-col gap-1 text-xs">
      <p className="font-medium">
        {!isValidDate ? 'Yet to log in' : dayjs(date).format('DD MMM, YYYY')}
      </p>
      {isValidDate && (
        <p className="font-regular text-sm text-default-500">{dayjs(date).format('h:mm A')}</p>
      )}
    </div>
  );
};

export default LastActive;
