const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER;

import NavBar from './components/NavBar';

export default function Home() {
  return (
    <div className="flex">
      <NavBar />
  
      <main className="p-6 flex-1">

      <div className="border-b-4 border-blue-600 mb-6 pb-4">
        <h2 className="text-4xl font-bold text-blue-600">{process.env.NEXT_PUBLIC_SITE_NAME || "Strata Management System"}</h2>
      </div>

        <img
          src="/jamie-davies-FXEaV3aEQW8-unsplash.jpg"  
          alt="download form the Internet https://unsplash.com/photos/white-and-blue-boat-on-body-of-water-during-daytime-FXEaV3aEQW8"
          className="rounded-lg shadow-md"
        />

        <p className="mt-10 text-xl">Welcome to {siteName}</p>
        <p className="text-xl">According to the <a href="https://classic.austlii.edu.au/au/legis/nsw/consol_act/ssma2015242/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800">
            Strata Schemes Management Act 2015
          </a>
          , the website is used to help managing the building better.
        </p>
        <p className="mt-10 text-xl">Contact us at: <a href={`mailto:${email}`}>{email}</a></p>
        <p className="text-xl">Telephone: {phone}</p>
      </main>
    </div>
  );
}