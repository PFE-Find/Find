
import Offre from "../components/OffrePage/Offres";
import Navbar from "../components/Nav";
import Footer from "../components/Footer";
import ChatBot from "../components/Chat/Chatbot";



export default function OffrePage() {
    return (
        <>
        <Navbar/>
        <div className="">
        {/* <Search /> */}
        <Offre />
        <Footer></Footer>
        <ChatBot/>
        
        </div>
        </>
    );
}