import Navbar from "../components/Nav";
import Search  from "../components/OffrePage/Search"
import OffreImages  from "../components/OffreDetails/Images"
import Detail  from "../components/OffreDetails/Detail"
import Maps  from "../components/OffreDetails/Maps"
import ChatBot from "../components/Chat/Chatbot";




export default function OffreDetail() {
    return (
        <>
        <Navbar/>
        <Search />
        <OffreImages />
        <Detail />
        <Maps />
        <ChatBot/>
        </>
    );
}