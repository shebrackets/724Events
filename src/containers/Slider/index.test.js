import { render, screen } from "@testing-library/react";
import Slider from "./index";
import { api, DataProvider } from "../../contexts/DataContext";

const data = {
  focus: [
    {
      title: "World economic forum",
      description:
        "Oeuvre à la coopération entre le secteur public et le privé.",
      date: "2022-02-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DbU-unsplash1.png",
    },
    {
      title: "World Gaming Day",
      description: "Evenement mondial autour du gaming",
      date: "2022-03-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DbU-unsplash1.png",
    },
    {
      title: "World Farming Day",
      description: "Evenement mondial autour de la ferme",
      date: "2022-01-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DbU-unsplash1.png",
    },
  ],
};

describe("When slider is created", () => {
  it("a list card is displayed", async () => {
    window.console.error = jest.fn();
    api.loadData = jest.fn().mockReturnValue(data);
    render(
      <DataProvider>
        <Slider />
      </DataProvider>
    );
    await screen.findByText("World economic forum");
    await screen.findByText("janvier");
    await screen.findByText(
      "Oeuvre à la coopération entre le secteur public et le privé."
    );
  });

  it("the events are displayed sorted by date, most recent first", async () => {
    api.loadData = jest.fn().mockReturnValue(data);
    const { container } = render(
      <DataProvider>
        <Slider />
      </DataProvider>
    );

    const titles = await screen.findAllByRole("heading", { level: 3 });
    expect(titles.map((title) => title.textContent)).toEqual([
      "World Gaming Day",
      "World economic forum",
      "World Farming Day",
    ]);

    const firstSlide = container.querySelector(".SlideCard");
    expect(firstSlide).toHaveClass("SlideCard--display");
    expect(firstSlide).toHaveTextContent("World Gaming Day");
  });
});
