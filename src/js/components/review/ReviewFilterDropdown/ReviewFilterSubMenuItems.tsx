import { DateValue } from '@internationalized/date';
import pluralize from 'pluralize';

import { CircleXFilled } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { DateInput } from '@/components/ui/DateInput';
import ProfileCard from '@/components/ui/ProfileCard';

interface ItemProps {
  label: string;
  instances?: number;
}

interface UserItemProps {
  avatar?: string | null;
}

export const CommenterFilterItem = ({ label, instances, avatar }: ItemProps & UserItemProps) => {
  return (
    <ProfileCard
      data={{
        email: label,
        displayName: label,
        profilePicture: avatar ?? ''
      }}
      primaryText={label}
      secondaryText={instances ? `${instances} ${pluralize('mention', instances)}` : ''}
      removePadding
    />
  );
};

export const MentionFilterItem = ({ label, instances }: ItemProps) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-ds-text-primary">@{label}</p>
      {instances && (
        <p className="text-xs font-medium text-ds-text-secondary">
          {instances} {pluralize('mention', instances)}
        </p>
      )}
    </div>
  );
};

export const TagFilterItem = ({ label, instances }: ItemProps) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-ds-text-primary">
        {label.startsWith('#') ? label : `#${label}`}
      </p>
      {instances && (
        <p className="text-xs font-medium text-ds-text-secondary">
          {instances} {pluralize('instance', instances)}
        </p>
      )}
    </div>
  );
};

export const CalendarFilter = ({
  value,
  onChange
}: {
  value: DateValue | null;
  onChange: (value: DateValue | null) => void;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-full p-2 text-sm font-medium text-ds-menu-text-header">
        Created date
      </div>
      <DateInput
        value={value}
        onChange={onChange}
        classNames={{
          inputWrapper: 'bg-default-200'
        }}
        endContent={
          value ? (
            <Button
              variant="light"
              isIconOnly
              onPress={() => onChange(null)}
              aria-label="Clear date"
            >
              <CircleXFilled size={16} className="text-ds-input-text-placeholder" />
            </Button>
          ) : null
        }
      />
      <Calendar
        showShadow={false}
        value={value}
        onChange={onChange}
        classNames={{
          base: 'border-none shadow-none'
        }}
      />
    </div>
  );
};
