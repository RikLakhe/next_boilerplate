import withAuth from "@/hoc/withAuth";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const AuthLayout = dynamic(() => import("@/components/layout/AuthLayout"));

function Login() {
    const router = useRouter();
    const loginFormik = useFormik({
        initialValues: {
            userName: undefined,
            password: undefined,
        },
        onSubmit: () => {
            router.push("/");
        },
    });

    return (
        <>
            <h1>Sign-up</h1>
            <form onSubmit={loginFormik.handleSubmit}>
                <label htmlFor="email">
                    Email Address
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={loginFormik.handleChange}
                        value={loginFormik.values.userName}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </>
    );
}

export default withAuth(Login, {
    public: true,
    restricted: true,
    Layout: AuthLayout,
});
