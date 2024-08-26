import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AuthSignIn from "@/components/auth/auth.signin";
const SignInPage = async () => {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/");
    }
    return (
        <div>
            <AuthSignIn />
        </div>
    )
}
export default SignInPage;