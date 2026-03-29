import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // ඊළඟ පාර render වෙද්දි Error UI එක පෙන්නන්න
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Error එක Console එකේ සටහන් කරන්න
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <h2 style={{ color: '#dc3545' }}>⚠️ Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={styles.button}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    padding: '50px',
    textAlign: 'center',
    backgroundColor: '#fff3f3',
    borderRadius: '8px',
    margin: '20px'
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
  }
};

export default ErrorBoundary;