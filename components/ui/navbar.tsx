import NavbarLinks from "@/components/ui/navbar-links";

export default function Navbar() {
    return (
        <div className="hidden w-full md:block">
            <div className="flex grow flex-row bg-black">
                <NavbarLinks/>
                <div className={"flex grow bg-_dark-gray"}></div>
            </div>
        </div>
    );
}