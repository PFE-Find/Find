
import Nav from "@/app/components/Nav"
import Footer from "../components/Footer"
import "../styles/Profile.css";
export default function Profile() {
    const posts = [
        {
            id: 1,
            title: 'Boost your conversion rate',
            href: '#',
            description:
                'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
            date: 'Mar 16, 2020',
            datetime: '2020-03-16',
            category: { title: 'Marketing', href: '#' },
            author: {
                name: 'Michael Foster',
                role: 'Co-Founder / CTO',
                href: '#',
                imageUrl:
                    'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
        },
        {
            id: 1,
            title: 'Boost your conversion rate',
            href: '#',
            description:
                'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
            date: 'Mar 16, 2020',
            datetime: '2020-03-16',
            category: { title: 'Marketing', href: '#' },
            author: {
                name: 'Michael Foster',
                role: 'Co-Founder / CTO',
                href: '#',
                imageUrl:
                    'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
        },
        {
            id: 1,
            title: 'Boost your conversion rate',
            href: '#',
            description:
                'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
            date: 'Mar 16, 2020',
            datetime: '2020-03-16',
            category: { title: 'Marketing', href: '#' },
            author: {
                name: 'Michael Foster',
                role: 'Co-Founder / CTO',
                href: '#',
                imageUrl:
                    'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
        },
        // More posts...
    ]
    return (
        <div>
            <Nav></Nav>
            <div className="container ">

                <div className="left_side mt-5">
                    <div className="card shadow-md flex border-black profile-card mb-5 mt-5">
                        <div className="flex-col justify-center content-center infos-profile">
                            <img src="/assets/profile.png" width={100} id="profile_img"></img>
                            <span className="text-gray-600 font-bold" >Akram Zaabi</span>
                            <span className="text-gray-500">Super Hote </span>
                        </div>
                        <div className="flex-col justify-center content-center tags">
                            <span className=" score">13</span>
                            <span className="text-gray-500 text-sm notes">évaluations </span>
                            <span className=" score">4,65</span>
                            <span className="text-gray-500 text-sm notes">en note globale </span>
                            <span className=" score">7</span>
                            <span className="text-gray-500 text-sm notes">mois d'experience  en tant que hote</span>
                        </div>
                    </div>
                    <div className="card shadow-md  profile-verif ">
                        <div className="rapper">
                            <span className="text-black text-xl font-bold">Vérifications éffectuées par
                                Akram Zaabi</span>
                            <div className="verification">
                                <img src="/assets/verif.png" ></img>
                                <span className="text-gray-400 font-bold">Addresse mail</span>
                            </div>
                            <div className="verification">
                                <img src="/assets/verif.png" ></img>
                                <span className="text-gray-400 font-bold">Numéro de télephone
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="details mt-4">
                    <h1 className="text-black font-bold text-3xl mt-5" id="title" style={{ 'borderBottom': '1px solid lightgray' }}>Informations sur Akram Zaabi</h1>
                    <h3 className="text-black font-bold text-2xl mt-5">Commentaires sur Akram Zaabi</h3>
                    <div className="bg-white  ">
                        <div className="mx-auto max-w-7xl px-6 ">
                            <div className="mx-auto grid mt-4 max-w-2xl grid-cols-1 gap-x-8 gap-y-8 border-t border-b border-gray-200 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                                {posts.map((post) => (
                                    <article key={post.id} className="mt-2 flex max-w-xl flex-col items-start justify-between">
                                        <div className="flex items-center gap-x-4 text-xs">
                                            <time dateTime={post.datetime} className="text-gray-500">
                                                {post.date}
                                            </time>
                                            <a
                                                href={post.category.href}
                                                className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                                            >
                                                {post.category.title}
                                            </a>
                                        </div>
                                        <div className="group relative">
                                            <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                                                <a href={post.href}>
                                                    <span className="absolute inset-0" />
                                                    {post.title}
                                                </a>
                                            </h3>
                                            <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">{post.description}</p>
                                        </div>
                                        <div className="relative mt-8 flex items-center gap-x-4 mb-3">
                                            <img alt="" src="/assets/profile.png" className="size-10 rounded-full bg-gray-50" />
                                            <div className="text-sm/6">
                                                <p className="font-semibold text-gray-900">
                                                    <a href={post.author.href}>
                                                        <span className="absolute inset-0" />
                                                       Akram Zaabi
                                                    </a>
                                                </p>
                                                <p className="text-gray-600">{post.author.role}</p>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                    <h3 className="text-black font-bold text-xl mt-5">Quelques Annonces Publiées par Akram Zaabi </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 ">

                       <div className="h-auto bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 m-2 sm:m-5 w-full max-w-xs sm:max-w-sm">
                            <a href="#">
                                <img className="rounded-xl w-full h-40 object-cover" src="/assets/terrain.png" alt="Terrain Image" />
                            </a>
                            <div className="p-4">
                                <a href="#">
                                    <h5 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">Terrain à Bizerte</h5>
                                </a>
                                <p className="text-sm text-gray-700 dark:text-gray-400">5 hectares</p>
                                <p className="text-sm text-gray-700 dark:text-gray-400">Agricole</p>
                                <a href="#">
                                    <h5 className="text-sm font-bold text-gray-900 dark:text-white">250 000 TND</h5>

                                </a>
                            </div>
                        </div><div className="h-auto bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 m-2 sm:m-5 w-full max-w-xs sm:max-w-sm">
                            <a href="#">
                                <img className="rounded-xl w-full h-40 object-cover" src="/assets/terrain.png" alt="Terrain Image" />
                            </a>
                            <div className="p-4">
                                <a href="#">
                                    <h5 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">Terrain à Bizerte</h5>
                                </a>
                                <p className="text-sm text-gray-700 dark:text-gray-400">5 hectares</p>
                                <p className="text-sm text-gray-700 dark:text-gray-400">Agricole</p>
                                <a href="#">
                                    <h5 className="text-sm font-bold text-gray-900 dark:text-white">250 000 TND</h5>

                                </a>
                            </div>
                        </div><div className="h-auto bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 m-2 sm:m-5 w-full max-w-xs sm:max-w-sm">
                            <a href="#">
                                <img className="rounded-xl w-full h-40 object-cover" src="/assets/terrain.png" alt="Terrain Image" />
                            </a>
                            <div className="p-4">
                                <a href="#">
                                    <h5 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">Terrain à Bizerte</h5>
                                </a>
                                <p className="text-sm text-gray-700 dark:text-gray-400">5 hectares</p>
                                <p className="text-sm text-gray-700 dark:text-gray-400">Agricole</p>
                                <a href="#">
                                    <h5 className="text-sm font-bold text-gray-900 dark:text-white">250 000 TND</h5>

                                </a>
                            </div>
                        </div>



                    </div>

                </div>
            </div>

            <Footer></Footer>
        </div>
    )
}