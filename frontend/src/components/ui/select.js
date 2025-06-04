export const Select = ({ children, ...props }) => (
  <select className="border px-3 py-2 rounded w-full" {...props}>
    {children}
  </select>
);

export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

// Optional for custom dropdown UI:
export const SelectTrigger = ({ children }) => <div>{children}</div>;
export const SelectValue = ({ value }) => <div>{value}</div>;
export const SelectContent = ({ children }) => <div>{children}</div>;
