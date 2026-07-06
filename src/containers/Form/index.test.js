import { fireEvent, render, screen } from "@testing-library/react";
import Form from "./index";

describe("When Events is created", () => {
  it("a list of event card is displayed", async () => {
    render(<Form />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success action is called", async () => {
      const onSuccess = jest.fn();
      render(<Form onSuccess={onSuccess} />);

      const fields = await screen.findAllByTestId("field-testid");
      fireEvent.change(fields[0], { target: { value: "Doe" } });
      fireEvent.change(fields[1], { target: { value: "John" } });
      fireEvent.change(fields[2], { target: { value: "john@doe.com" } });
      fireEvent.change(fields[3], { target: { value: "Bonjour" } });

      fireEvent(
        await screen.findByTestId("collapse-button-testid"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      fireEvent(
        (await screen.findAllByText("Entreprise"))[0],
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );

      fireEvent(
        await screen.findByTestId("button-test-id"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      await screen.findByText("En cours");
      await screen.findByText("Envoyer");
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
