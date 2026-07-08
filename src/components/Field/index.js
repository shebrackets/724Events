import PropTypes from "prop-types";

import "./style.scss";

export const FIELD_TYPES = {
  INPUT_TEXT: 1,
  TEXTAREA: 2,
};

const Field = ({
  type = FIELD_TYPES.INPUT_TEXT,
  label,
  name,
  placeholder,
  required,
  inputType,
  dataCy,
}) => {
  let component;
  switch (type) {
    case FIELD_TYPES.INPUT_TEXT:
      component = (
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          required={required}
          data-testid="field-testid"
          data-cy={dataCy}
        />
      );
      break;
    case FIELD_TYPES.TEXTAREA:
      component = (
        <textarea
          name={name}
          placeholder={placeholder}
          required={required}
          data-testid="field-testid"
          data-cy={dataCy}
        />
      );
      break;
    default:
      component = (
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          required={required}
          data-testid="field-testid"
        />
      );
  }
  return (
    <div className="inputField">
      <span>{label}</span>
      {component}
    </div>
  );
};

Field.propTypes = {
  type: PropTypes.oneOf(Object.values(FIELD_TYPES)),
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  inputType: PropTypes.string,
  dataCy: PropTypes.string,
};
Field.defaultProps = {
  label: "",
  placeholder: "",
  type: FIELD_TYPES.INPUT_TEXT,
  name: "field-name",
  required: false,
  inputType: "text",
  dataCy: "",
}

export default Field;
