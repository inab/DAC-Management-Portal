import Link from "next/link";
const NavItem = ({ text, href }) => {
    return (
        <li>
            <Link href={href}>
                <a> {text} </a>
            </Link>
        </li>

    );
};

export default NavItem;