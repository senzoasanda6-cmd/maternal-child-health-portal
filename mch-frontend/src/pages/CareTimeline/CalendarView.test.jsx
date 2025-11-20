import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CalendarView from "./CalendarView";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

// Mock the modules that are not relevant to the test or cause issues in Jest
jest.mock("../../services/api");

// Mock RRule to avoid errors in test environment
jest.mock("rrule", () => ({
  RRule: jest.fn().mockImplementation(() => ({
    all: () => [],
  })),
  Frequency: {
    YEARLY: 0,
    MONTHLY: 1,
    WEEKLY: 2,
    DAILY: 3,
  },
}));

const mockUser = {
  id: 1,
  name: "Test Doctor",
  role: "admin", // A role that allows dragging
};

const mockFacilities = [
  { id: 1, name: "Clinic A" },
  { id: 2, name: "Clinic B" },
];

const mockEvents = [
  {
    id: 1,
    title: "Prenatal Checkup",
    start: new Date(2023, 10, 25, 10, 0, 0),
    end: new Date(2023, 10, 25, 11, 0, 0),
    extendedProps: { careType: "prenatal", location: "Clinic A", status: "confirmed" },
  },
  {
    id: 2,
    title: "Postnatal Follow-up",
    start: new Date(2023, 10, 26, 14, 0, 0),
    end: new Date(2023, 10, 26, 15, 0, 0),
    extendedProps: { careType: "postnatal", location: "Clinic B", status: "pending" },
  },
];

const renderWithContext = (component) => {
  return render(
    <AuthContext.Provider value={{ user: mockUser }}>
      {component}
    </AuthContext.Provider>
  );
};

describe("CalendarView CRUD Functionality", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Default mock implementations
    api.get.mockImplementation((url) => {
      if (url === "/events") {
        return Promise.resolve({ data: mockEvents });
      }
      if (url === "/facilities") {
        return Promise.resolve({ data: mockFacilities });
      }
      return Promise.resolve({ data: [] });
    });
  });

  // READ
  test("should fetch and display events on mount", async () => {
    renderWithContext(<CalendarView />);

    // Wait for events to be fetched and rendered
    expect(await screen.findByText("Prenatal Checkup")).toBeInTheDocument();
    expect(screen.getByText("Postnatal Follow-up")).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith("/events");
    expect(api.get).toHaveBeenCalledWith("/facilities");
  });

  // CREATE
  test("should create a new event", async () => {
    const newEvent = {
      id: 3,
      title: "New Appointment",
      start: new Date(),
      end: new Date(),
    };
    api.post.mockResolvedValue({ data: newEvent });

    renderWithContext(<CalendarView />);
    const user = userEvent.setup();

    // 1. Click the "New Event" button
    const newEventButton = await screen.findByText("+ New Event");
    await user.click(newEventButton);

    // 2. Modal appears, fill in the form (assuming input has a label "Title")
    const titleInput = await screen.findByLabelText("Title");
    const saveButton = screen.getByRole("button", { name: "Save" });

    await user.type(titleInput, newEvent.title);
    await user.click(saveButton);

    // 3. Assert API was called and new event is displayed
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/events", expect.any(Object));
    });

    expect(await screen.findByText(newEvent.title)).toBeInTheDocument();
  });

  // UPDATE
  test("should update an existing event", async () => {
    const updatedTitle = "Updated Checkup";
    const updatedEvent = { ...mockEvents[0], title: updatedTitle };
    api.put.mockResolvedValue({ data: updatedEvent });

    renderWithContext(<CalendarView />);
    const user = userEvent.setup();

    // 1. Click on an existing event
    const eventElement = await screen.findByText("Prenatal Checkup");
    await user.click(eventElement);

    // 2. Modal appears, update the title
    const titleInput = await screen.findByLabelText("Title");
    const saveButton = screen.getByRole("button", { name: "Save" });

    await user.clear(titleInput);
    await user.type(titleInput, updatedTitle);
    await user.click(saveButton);

    // 3. Assert API was called and the view is updated
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        `/events/${mockEvents[0].id}`,
        expect.objectContaining({ title: updatedTitle })
      );
    });

    expect(await screen.findByText(updatedTitle)).toBeInTheDocument();
    expect(screen.queryByText("Prenatal Checkup")).not.toBeInTheDocument();
  });

  // DELETE
  test("should delete an event", async () => {
    api.delete.mockResolvedValue({});

    renderWithContext(<CalendarView />);
    const user = userEvent.setup();

    // 1. Click on an existing event
    const eventElement = await screen.findByText("Prenatal Checkup");
    await user.click(eventElement);

    // 2. Modal appears, click delete
    const deleteButton = await screen.findByRole("button", { name: "Delete" });
    await user.click(deleteButton);

    // 3. Assert API was called and event is removed
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith(`/events/${mockEvents[0].id}`);
    });

    expect(screen.queryByText("Prenatal Checkup")).not.toBeInTheDocument();
  });
});