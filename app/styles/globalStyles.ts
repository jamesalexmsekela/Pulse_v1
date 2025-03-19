// app/styles/globalStyles.ts
import { StyleSheet } from 'react-native';
import styles from './styles';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: styles.spacing.medium,
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
    marginVertical: styles.spacing.small,
  },
  buttonText: {
    fontSize: styles.typography.button.fontSize,
    fontWeight: styles.typography.button.fontWeight,
    color: styles.colors.buttonText,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: styles.spacing.medium,
    marginVertical: styles.spacing.small,
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
    marginTop: styles.spacing.small,
  },
  eventDate: {
    fontSize: 14,
    color: 'gray',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginLeft: styles.spacing.medium,
  },
  input: {
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: styles.spacing.medium,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryButton: {
    backgroundColor: '#E5E5E5',
    padding: styles.spacing.small,
    borderRadius: 5,
    margin: 5,
  },
  categorySelected: {
    backgroundColor: styles.colors.primary,
  },
  // New style definitions for profile picture
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    marginVertical: styles.spacing.small,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: styles.spacing.small,
  },
});

export default globalStyles;
