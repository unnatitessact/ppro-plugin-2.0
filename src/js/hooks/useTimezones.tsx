import type { TimezoneName } from 'countries-and-timezones';

import { useMemo } from 'react';

import { getAllTimezones } from 'countries-and-timezones';

export const useTimezones = () => {
  const timeZoneItems = useMemo(() => {
    const allTimeZones = getAllTimezones();
    return Object.keys(allTimeZones)
      .map((key) => {
        const names = allTimeZones[key as TimezoneName].name
          .split('/')
          .map((name) => name.replace('_', ' ').trim());
        return {
          key: allTimeZones[key as TimezoneName].name,
          label: `${names?.[1]} - ${names?.[0]} (GMT ${allTimeZones[key as TimezoneName].utcOffsetStr})`,
          utcOffset: allTimeZones[key as TimezoneName].utcOffset
        };
      })
      .sort((a, b) => a.utcOffset - b.utcOffset);
  }, []);
  return { timeZoneItems };
};
