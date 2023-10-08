import classNames from 'classnames';

interface CustomInputProps {
  name: string;
  label: string;
  type: string;
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const Input: React.FC<CustomInputProps> = ({
  name,
  label,
  type,
  value,
  disabled,
  onChange,
  error,
}) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text">{label}</span>
    </label>
    <input
      disabled={disabled}
      type={type}
      name={name}
      className={classNames('input input-bordered w-full', {
        'input-error': error,
      })}
      value={value}
      onChange={onChange}
    />
    {error && (
      <label className="label">
        <span className="label-text text-error">{error}</span>
      </label>
    )}
  </div>
);
