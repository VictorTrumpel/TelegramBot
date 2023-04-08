require("dotenv").config();

const firebaseConfig_production = {
  apiKey: "AIzaSyA4GRvEQRVxpKQMs-4ajtjgp0Wr9j1-RVQ",
  authDomain: "chat-react-c7ab2.firebaseapp.com",
  projectId: "chat-react-c7ab2",
  storageBucket: "chat-react-c7ab2.appspot.com",
  messagingSenderId: "669072458296",
  appId: "1:669072458296:web:6922388e0f11b21c849ccd",
  measurementId: "G-NCDJTGQLDK",
};

const firebaseConfig_development = {
  apiKey: "AIzaSyAC6nFA1CiZgmlBJ8-CeyVtY1iobY84x9Q",
  authDomain: "oracle-bot-dev.firebaseapp.com",
  projectId: "oracle-bot-dev",
  storageBucket: "oracle-bot-dev.appspot.com",
  messagingSenderId: "235767517355",
  appId: "1:235767517355:web:bd4f3fb5e538a9ca5ee7ee",
  measurementId: "G-FSTV4XL8NL"
}

module.exports.firebaseConfig = 
  process.env.MODE === 'PRODUCTION'
    ? firebaseConfig_production
    : firebaseConfig_development