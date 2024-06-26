import {SignInButton, SignedIn, SignedOut, UserButton, SignOutButton} from "@clerk/nextjs";
import {checkUser} from "@/lib/checkuser";


const Header = async () => {
    const user = await checkUser();

    return (<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="navbar-container">
            <h2>Expense Tracker</h2>
            <div>
                <SignedOut>
                    <SignInButton></SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton></UserButton>
                </SignedIn>
            </div>
        </div>

    </nav>)
}

export default Header;
