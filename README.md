# Pulse v1

## Overview

Pulse v1 is an event planning application designed to connect people with events or other individuals within their vicinity based on shared interests. The application leverages geolocation, user profiles, and real-time event management to display a personalized event feed. Users can create events, RSVP to events, and manage their profiles. Authentication is handled via Firebase Authentication, and global state is managed using React Context. This project is built with React Native, Expo, and TypeScript.

## Features

- **Event Discovery:**

  - Displays a dynamic, location-based feed of events.
  - Filters events based on user-selected interests.
  - Pull-to-refresh and manual refresh on the home screen.

- **User Profiles:**

  - Users can create and edit profiles (name, email, interests).
  - Profile data is stored locally using AsyncStorage.
  - Preferences influence the event feed.

- **Event Management:**
  - Users can create events (via the CreatePulse screen) including event details such as name, category, date, description, and an optional maximum attendee limit.
  - Organizers can view the RSVP count for each event.
  - Users can RSVP or cancel their RSVP from the EventDetails screen.
- **Authentication:**
  - Users sign up and log in using Firebase Authentication (email/password).
  - The app uses a conditional navigation flow to switch between authentication screens and the main app.
- **Global Event Context:**
  - A React Context manages event data globally, ensuring that updates (such as RSVP counts) are reflected throughout the app.
- **Security & Licensing:**
  - Project source code is now protected under **All Rights Reserved** license.

## Technology Stack & Tools

- **Frontend:**
  - React Native with Expo
  - TypeScript
  - React Navigation
- **Backend & Authentication:**
  - Firebase Authentication
  - Future plans include Firebase Firestore for real-time event storage
- **State Management:**
  - React Context API (Global Event Context)
- **Local Storage:**
  - AsyncStorage
- **Push Notifications:** (Planned)
  - Expo Notifications for real-time updates
- **Version Control:**
  - Git & GitHub

## Getting Started

### Prerequisites

- Node.js and npm (https://nodejs.org/)
- Expo CLI (https://docs.expo.dev/workflow/expo-cli/)
- Git (https://git-scm.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jamesalexmsekela/Pulse_v1.git
   ```
2. **Navigate to the repository:**
   ```bash
   cd Pulse_v1
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the application:**
   ```bash
   npx expo start
   ```

### Usage

- **Authentication:**
  - On launch, users see the Login screen with a link to the Signup screen.
  - New users sign up and existing users log in using their email and password.
  - After successful authentication, the main app (home feed) is displayed.
- **Home Feed:**
  - Displays nearby events filtered by user preferences and current location.
  - Users can refresh the feed by pulling down or by pressing the Home tab (when already on the home screen).
- **Event Creation & RSVP:**
  - The CreatePulse screen allows users to create new events, including an optional maximum attendee limit.
  - The EventDetails screen displays full event details, including RSVP count and the option to RSVP or cancel.
- **Profile Management:**
  - The Profile screen enables users to edit their personal details and update their interests, which then influence the home feed.

## Contributing

We welcome contributions to Pulse v1! Please refer to our CONTRIBUTING.md file for guidelines on how to submit pull requests.

## Versioning

For available versions, see the tags on this repository.

## Authors

- James Msekela - Initial work

## License

All Rights Reserved © James Msekela {2025}.

## Acknowledgments

- Thanks to the Expo team, Firebase, and the open-source community for providing tools and resources that made this project possible.
- Inspiration from social event and networking platforms.

## Contact Information

For inquiries, please contact jamesmsekela@gmail.com.
