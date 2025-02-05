import { StyleSheet } from 'react-native';
import styles from './styles';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: styles.colors.background,
  },
  header: {
    fontSize: styles.typography.header.fontSize,
    fontWeight: styles.typography.header.fontWeight,
    color: styles.colors.text,
    marginBottom: styles.spacing.large,
  },
  button: {
    backgroundColor: styles.colors.primary,
    padding: styles.button.padding,
    borderRadius: styles.button.borderRadius,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: styles.typography.button.fontSize,
    fontWeight: styles.typography.button.fontWeight,
    color: styles.colors.buttonText,
  },
});
