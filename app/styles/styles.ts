// app/styles/styles.ts
export const styles = {
  colors: {
    primary: '#9b59b6',        // Light Purple
    secondary: '#FF9500',      // Orange
    background: '#F5F5FF',     // Light purple background
    text: '#1c1c1e',           // Dark Gray
    headerText: '#333333',     // Darker for headers
    buttonText: '#ffffff',     // White
    danger: '#FF3B30',         // Red
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  typography: {
    header: {
      fontSize: 24,
      fontWeight: "700" as const,
    },
    subheader: {
      fontSize: 20,
      fontWeight: "600" as const,
    },
    body: {
      fontSize: 16,
      fontWeight: "400" as const,
    },
    button: {
      fontSize: 18,
      fontWeight: "500" as const,
    },
  },
  button: {
    borderRadius: 8,
    padding: 12,
  },
};

export default styles;
