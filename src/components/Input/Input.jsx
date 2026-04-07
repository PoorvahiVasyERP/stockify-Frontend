import "./Input.css";

export default function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  autoComplete = "on",
  error,
  multiline = false,
  rows = 3,
}) {
  const isStatic = readOnly || disabled;

  return (
    <div className={`form-group ${error ? "has-error" : ""}`}>
      {label && <label htmlFor={name}>{label}</label>}

      <div
        className={`input-wrapper ${isStatic ? "input-static" : ""} ${error ? "input-error" : ""}`}
      >
        {multiline ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            rows={rows}
            className="form-textarea"
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            autoComplete={autoComplete}
            className="form-input"
          />
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
