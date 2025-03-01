# Demo ai chat app

- this is an ai chat app

# Desitions

- AI engine - used Groq (its free)
- routing - I used routing params for session id, allso settings modal uses routing
- lazy loading - settings modal component is not necessary on first entering the page so I can split the bundle and lazy load it.
- ui - I used material ui with syled components just to have a simple and nice feel to the app.
- old messages are stored in local storage
- I decided to use a context for global state instead of an external library.
- I made a `/help` command to tell the user about the app

# nice additions

if I had more time i would add:

1. testing
2. storing and getting the old messages from an api with pagination and infinate scroll (with react virtualized to not overload the dom)
3. log in

# Run

- make sure you have a Grok api key `https://console.groq.com/keys`
- I put a .env.example file - put you api key in `VITE_GROQ_API_KEY`
- make sure to have node v22.9.0 and npm 11.1.0 installed (I recommend using nvm or other node version managers)
- to run the app localy `npm install npm run dev`
