
import Offre from "../components/OffrePage/Offres";
import Search  from "../components/OffrePage/Search"
import Navbar from "../components/Nav";
import ChatBot from "../components/Chat/Chatbot";



export default function OffrePage() {
    return (
        <>
        <Navbar/>
        <div className="">
        {/* <Search /> */}
        <Offre />
        
        <ChatBot/>
        </div>
        </>
    );
}