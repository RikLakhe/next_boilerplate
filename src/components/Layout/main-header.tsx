import Link from "next/link";

const MainHeader = () => {
  return (
    <header className="fixed top-0 left-0 w-full text-center border-b border-grey p-2 bg-black">
      <Link href="/">Next Boiler Plate</Link>
    </header>
  );
};
export default MainHeader;
