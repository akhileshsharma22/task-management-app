import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TaskCard from "./TaskCard";

afterEach(cleanup);

const task = {
  _id: "task-1",
  title: "Prepare launch brief",
  description: "Align stakeholders before launch.",
  status: "pending",
  priority: "high",
  deadline: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("TaskCard", () => {
  it("renders priority and deadline information", () => {
    const view = render(<TaskCard task={task} onEdit={() => {}} onDelete={() => {}} onToggle={() => {}} />);
    expect(view.getByText("high priority")).toBeTruthy();
    expect(view.getByText("Due today")).toBeTruthy();
  });

  it("calls the toggle handler", () => {
    const onToggle = vi.fn();
    const view = render(<TaskCard task={task} onEdit={() => {}} onDelete={() => {}} onToggle={onToggle} />);
    fireEvent.click(view.getByLabelText("Mark Prepare launch brief completed"));
    expect(onToggle).toHaveBeenCalledWith(task);
  });
});
