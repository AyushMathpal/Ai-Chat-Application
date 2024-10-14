
# **ChatVerse: Craft Conversations with AI Personas**

_A Full Stack Generative AI Chat Application – Build, Customize, and Chat with Personalized AI Personas!_

---

## 🚀 **Project Overview**  
ChatVerse is an AI-powered full-stack chat interface where users engage with dynamic AI personas – characters built with specific personalities, tones, and styles. Create and chat with predefined personas like **Elon Musk** or **Albert Einstein**, or unlock premium features to design your own companions from scratch. Your personas respond based on personality traits you define, giving each conversation a unique and immersive twist.  

---

## 🎯 **Features**  
- **Predefined Personas**: Chat with quirky personas or iconic figures with preset traits.
- **Custom Persona Creation**: Unlock premium features to craft and train AI companions.  
- **Context-Aware Conversations**: Pinecone vector search ensures the AI remembers previous chats and provides relevant responses.
- **User Authentication**: Secure account creation with the option to switch to **guest mode** (coming soon!).  
- **Payment Integration**: Use **Stripe** to subscribe to premium membership plans and unlock advanced features.  
- **Persistent Storage**: MySQL database integration ensures user data and chat histories are safely stored.  

---

## 🛠 **Tech Stack**  
- **Frontend**: Next.js, React.js, TailwindCSS  
- **Backend**: Next.js API Routes, Prisma ORM  
- **Database**: MySQL, Pinecone (vector DB)  
- **Payment Gateway**: Stripe  
- **ORM**: Prisma for schema and database management  

---

## 📑 **Setup and Installation**  
Follow these steps to set up the project on your local machine:  

1. **Clone the Repository:**  
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies:**  
   ```bash
   npm install
   ```

3. **Generate Prisma Schema:**  
   ```bash
   npx prisma generate
   ```

4. **Start the Development Server:**  
   ```bash
   npm run dev
   ```

5. **Access the App:**  
   Open [http://localhost:3000](http://localhost:3000) in your browser.  

---

## 🔑 **Usage**  
1. **Create an Account**: Sign up to start interacting with predefined personas.  
2. **Chat Away**: Select a persona and begin chatting! The AI remembers context for seamless conversations.  
3. **Unlock Premium Membership**: Subscribe via Stripe to design your own AI companions.  

---

## 📊 **How It Works**  
1. **Prisma & MySQL**: Prisma ORM manages the database schema, and MySQL stores chat histories, users, and metadata.  
2. **Pinecone Vector Database**: Provides context-aware responses by storing chat embeddings for similarity search.  
3. **Stripe Integration**: Handles subscription plans and payments securely.

---

## 🖼 **Screenshots**  
 
<img width="1380" alt="Screenshot 2024-10-14 at 9 03 07 PM" src="https://github.com/user-attachments/assets/ba093ec0-2f44-413b-9ac0-dbefccac6ad0">
<img width="1045" alt="Screenshot 2024-10-14 at 9 04 33 PM" src="https://github.com/user-attachments/assets/4d348b2a-7fbe-470d-a4b4-4ca1cc377590">

---

## ⚙️ **Architecture Overview**  
Here’s how everything connects in the system:

![Architecture Diagram](./fullstack_chat_app_architecture.png)  

---

## 🔒 **Security and Authentication**  
- User authentication is managed through **JWT** to secure sessions.  
- Passwords are securely hashed to protect user data.  

---

## 🌐 **Future Improvements**  
- **Guest Mode**: Enable chatting without signing up.  
- **Advanced Personalization**: Allow users to train AI companions with external datasets.  
- **Real-Time Deployment**: Host the application on a cloud platform for global accessibility.

---

## 📄 **License**  
This project is licensed under the MIT License.

---

## 📬 **Acknowledgements**  
Special thanks to **LangChain** and **Pinecone** for providing powerful tools to build conversational AI.  
