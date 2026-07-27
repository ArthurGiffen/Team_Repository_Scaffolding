import { Component } from 'react';

// A real React Error Boundary — catches render/lifecycle errors thrown by
// any page beneath it and shows a fallback instead of a blank white screen.
// This is distinct from the per-request try/catch error messages inside
// individual pages (e.g. "could not reach server"); this catches bugs, not
// just failed network calls.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error in a routed page:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p className="lead">This page hit an unexpected error.</p>
          <button onClick={() => this.setState({ hasError: false })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
