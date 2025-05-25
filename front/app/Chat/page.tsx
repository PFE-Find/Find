
import ChatPage from "../components/Chat/Chat";
import Navbar from "../components/Nav";
import ChatBot from "../components/Chat/Chatbot";

import Footer from "../components/Footer";

export default function Chat() {
    return (
        <>
        <Navbar/>
        <ChatPage/>
        {/* <ChatBot/> */}
        <Footer></Footer>
        </>
    );
}