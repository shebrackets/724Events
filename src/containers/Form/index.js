import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 500); })

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [formKey, setFormKey] = useState(0);
  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();

      const formData = new FormData(evt.target);
      if (!formData.get("contactType")) {
        setFormError("Veuillez sélectionner un profil (Personnel ou Entreprise).");
        return;
      }

      setFormError("");
      setSending(true);
      try {
        await mockContactApi();
        setSending(false);
        setFormKey((key) => key + 1);
        onSuccess();
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    [onSuccess, onError]
  );
  return (
    <form key={formKey} onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field placeholder="" label="Nom" name="lastName" required />
          <Field placeholder="" label="Prénom" name="firstName" required />
          <Select
            selection={["Personel", "Entreprise"]}
            onChange={() => null}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
            name="contactType"
          />
          <Field
            placeholder=""
            label="Email"
            name="email"
            inputType="email"
            required
          />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
          {formError && <span>{formError}</span>}
        </div>
        <div className="col">
          <Field
            placeholder="message"
            label="Message"
            name="message"
            type={FIELD_TYPES.TEXTAREA}
            required
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
}

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
}

export default Form;
