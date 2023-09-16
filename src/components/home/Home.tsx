import { useNavigate } from "react-router-dom";
import { UserRole } from "../../cores/types/UserRole";


export interface HomeProps {
    setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
}


export default function Home({ setUserRole }: HomeProps) {
    const history = useNavigate();

    const moveClient = (userRole: UserRole) => {
        setUserRole(userRole);
        history("/client");
    }

    return (
        <div>
            <button className="" type="button" onClick={() => { moveClient(UserRole.USER) }}>Client</button>
            <button className="" type="button" onClick={() => { moveClient(UserRole.DEVELOPER) }}>Client Developer</button>
        </div>
    );
}