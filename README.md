# EDH Tracker

EDH Tracker is a tool for managing Magic: The Gathering Commander decks and tracking matches. This project includes both a frontend and a backend. The frontend is built using Vite, React, and TypeScript, while the backend leverages AWS Amplify.

## Features

### Deck Management

- **Add Deck**: Create a new deck by providing details like name, format, etc.
  <img src="./assets/add-deck-1.png" alt="adding a new deck" width="400"/>
  <img src="./assets/add-deck-2.png" alt="setting commander while adding deck" width="400"/>
- **Edit Deck**: Modify existing deck details.
- **Mark Inactive**: Mark decks as inactive to hide them from active use.
  <img src="./assets/update-deck.png" alt="updating an existing deck" width="400"/>
- **Remove Deck**: Delete a deck from your collection (only available if the deck has not participated in a match).
  <img src="./assets/profile-decks.png" alt="list of decks in profile" width="600"/>
- **View Other Decks**: View and filter other player's decks, as well as see generated statistics based on their match history
  <img src="./assets/decks-table.png" alt="list of decks with stats" width="600"/>
  <img src="./assets/decks-table-2.png" alt="filtering list of decks" width="600"/>
  <img src="./assets/commander-card.png" alt="commander card previews on hover" width="600"/>

### Match Management

- **Add Match**: Log a new match with players, decks, and results.
  <img src="./assets/add-match-1.png" alt="adding a new match" width="400"/>
  <img src="./assets/add-match-2.png" alt="adding participant decks in a new match" width="400"/>
  <img src="./assets/add-match-3.png" alt="setting a winner in a new match" width="400"/>
- **Edit Match**: Modify the details of an existing match (**DANGEROUS**: only available to admins).
  <img src="./assets/edit-match.png" alt="updating an existing match" width="400"/>
- **Remove Match**: Delete a match from the history (**DANGEROUS**: only available to admins) .
- **View Match History**: View and filter match history based on player, deck, and format
  <img src="./assets/match-table.png" alt="viewing match history table" width="600"/>

### User Statistics

Customize your profile to reflect your play style, manage your decks, and track your game history. You can update personal information, set profile images, and configure preferences for a more personalized experience within the app.
<img src="./assets/users-table.png" alt="viewing users table" width="600"/>

### User Profiles

Customize your profile to reflect your play style, manage your decks, and track your game history. You can update personal information, set profile images, and configure preferences for a more personalized experience within the app.
<img src="./assets/user-profile.png" alt="view user profiles" width="600"/>
<img src="./assets/profile-mini-card.png" alt="user profile previews on hover" width="600"/>

### Light and Dark Themes

EDH Tracker supports both light and dark themes to enhance user experience. Users can toggle between these modes based on their preferences, ensuring optimal visibility and comfort. Highlight colors can be set in individual user profiles.
<img src="./assets/dark-theme.png" alt="user profile previews on hover" width="600"/>
<img src="./assets/light-theme.png" alt="user profile previews on hover" width="600"/>

## Setup Instructions

### Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/odevine/edh-tracker.git
   cd edh-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   This will start the Vite development server, providing hot module replacement for React and TypeScript.

### Backend Setup (AWS Amplify)

1. Install the Amplify CLI:

   ```bash
   npm install -g @aws-amplify/cli
   ```

2. Configure Amplify:

   ```bash
   amplify configure
   ```

   Follow the instructions to set up your AWS credentials.

3. Initialize Amplify in the project:

   ```bash
   amplify init
   ```

4. Deploy the backend:
   ```bash
   amplify push
   ```
   This will deploy the AWS resources needed (API, authentication, storage, etc.) for the backend.
