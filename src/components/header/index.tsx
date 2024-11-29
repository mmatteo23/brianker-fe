import { HeaderDesktop } from "./header-desktop";
import { HeaderMobile } from "./header-mobile";

const Header = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-2">
      <div className="px-4 w-full hidden sm:block">
        <HeaderDesktop />
      </div>
      <div className="px-4 w-full block sm:hidden">
        <HeaderMobile />
      </div>
    </div>
  );
};

export default Header;
