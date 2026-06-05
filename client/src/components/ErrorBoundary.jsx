import { Component } from "react";
import ErrorPage from "../pages/ErrorPage";

export default class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { console.error("Application error:", error); }
  render() { return this.state.hasError ? <ErrorPage type="server" /> : this.props.children; }
}
