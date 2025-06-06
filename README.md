# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Project Setup

To set up and run this project on your local machine, follow these steps:

1.  **Prerequisites:**
    *   Ensure you have **Node.js** installed. Version 18.x or later is recommended. You can download it from [nodejs.org](https://nodejs.org/).
    *   You'll also need a package manager like **npm** (which comes with Node.js) or **Yarn**.

2.  **Get the Project Files:**
    *   Clone the repository or download the project files to your local machine.

3.  **Navigate to the Project Directory:**
    *   Open your terminal or command prompt.
    *   Change your current directory to the root of the project folder (where `package.json` is located).
        ```bash
        cd path/to/your/SafoRoom-project
        ```

4.  **Install Dependencies:**
    *   Install all the project dependencies using your package manager:
        *   Using npm:
            ```bash
            npm install
            ```
        *   Using Yarn:
            ```bash
            yarn install
            ```

5.  **Environment Variables (for AI features):**
    *   This project uses Genkit for AI functionalities. If you plan to use Google AI models, you'll need to configure authentication.
    *   Create a file named `.env.local` in the root of your project.
    *   Add your Google API key to this file:
        ```
        GOOGLE_API_KEY=your_google_api_key_here
        ```
    *   Alternatively, you can set up Google Cloud Application Default Credentials by running:
        ```bash
        gcloud auth application-default login
        ```
    *   Refer to the Genkit and Google AI documentation for more details on authentication.

6.  **Run the Next.js Development Server:**
    *   Start the main application development server:
        ```bash
        npm run dev
        ```
    *   This will typically start the application on `http://localhost:9002` (as specified in `package.json`).

7.  **Run the Genkit Development Server (in a separate terminal):**
    *   If you are developing or testing AI features, you need to run the Genkit server. Open a **new terminal window** or tab, navigate to the project root, and run:
        ```bash
        npm run genkit:dev
        ```
    *   For automatic reloading of Genkit flows when files change, use:
        ```bash
        npm run genkit:watch
        ```

8.  **Access the Application:**
    *   Open your web browser and navigate to `http://localhost:9002`.

You should now have the SafoRoom application running locally. Remember to have both the Next.js and Genkit development servers running if you're working with AI features.
