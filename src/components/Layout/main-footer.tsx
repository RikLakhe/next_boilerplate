import Link from "next/link";

const MainFooter = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full text-center border-t border-grey p-1  bg-black">
      <Link href="/about">About Us</Link>\
      <Link href="/contact">Contact Us</Link>
    </div>
  );
};
export default MainFooter;
