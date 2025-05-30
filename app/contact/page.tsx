import NavBar from '../components/NavBar';

export default function Contact() {
  return (
    <div className="flex">
      <NavBar />
      <main className="p-6">
        <h2 className="text-3xl font-semibold">Contact us</h2>
        <p className="mt-8 text-xl">Email: {process.env.NEXT_PUBLIC_CONTACT_EMAIL}</p>
        <p className="text-xl">Telephone: {process.env.NEXT_PUBLIC_PHONE_NUMBER}</p>
      </main>
    </div>
  );
}