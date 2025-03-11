
import Favorie from "../components/Favorie/Favorie";
import Search  from "../components/OffrePage/Search"
import Navbar from "../components/Nav";
import ChatBot from "../components/Chat/Chatbot";



export default function OffrePage() {
    return (
        <>
        <Navbar/>
        <Search />
        <Favorie />
        <ChatBot/>
        </>
    );
}