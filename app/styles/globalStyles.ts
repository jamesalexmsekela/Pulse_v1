import { StyleSheet } from 'react-native';
import styles from './styles';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: styles.colors.background,
  },
  header: {
    fontSize: styles.typography.header.fontSize,
    fontWeight: styles.typography.header.fontWeight,
    marginBottom: styles.spacing.large,
    marginVertical: styles.spacing.small,
    color: styles.colors.headerText,
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
  card: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width: '95%',
    alignItems: 'center',
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  eventDate: {
    fontSize: 14,
    color: 'gray',
  },
});
