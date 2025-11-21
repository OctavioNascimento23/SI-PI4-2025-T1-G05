# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e3a50f65-0e91-409d-a6a1-7a9199d71e1f

## API Configuration

This frontend integrates with a backend API. To configure the API connection:

### 1. Set up environment variables

Create a `.env` file in the `front-end` directory (use `.env.example` as reference):

```sh
# Copy the example file
cp .env.example .env

# Edit the .env file and set your API URL
# Example: VITE_API_URL=http://localhost:4000
```

The `VITE_API_URL` variable should point to your backend API base URL.

### 2. Authentication

The application uses Bearer token authentication stored in `localStorage` with the key `token`.

- The HTTP client automatically injects the token in the `Authorization` header for all requests
- When the token is present, the Navbar displays "Sair" (logout button)
- When no token is present, the Navbar displays "Entrar" (login button)

### 3. Quick Testing

To test the authentication flow:

1. Start the development server (see instructions below)
2. Open browser DevTools Console
3. Set a test token:
   ```javascript
   localStorage.setItem('token', 'FAKE_TOKEN');
   location.reload();
   ```
4. Observe the Navbar now shows "Sair" button
5. Click "Sair" to clear the token and return to "Entrar" state

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e3a50f65-0e91-409d-a6a1-7a9199d71e1f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Navigate to the front-end directory
cd front-end

# Step 4: Configure the API URL (optional, create .env file)
cp .env.example .env
# Edit .env and set VITE_API_URL

# Step 5: Install the necessary dependencies.
npm i

# Step 6: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e3a50f65-0e91-409d-a6a1-7a9199d71e1f) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
