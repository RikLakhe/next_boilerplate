import { authenticateUser } from "@/utils";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";

import withAuth from "@/hoc/withAuth";
import Link from "next/link";

const AuthLayout = dynamic(() => import("@/components/layout/AuthLayout"));

function Login() {
    const router = useRouter();

    const loginFormik = useFormik({
        initialValues: {
            userName: undefined,
            password: undefined,
        },
        onSubmit: () => {
            authenticateUser();
            router.push("/dashboard");
        },
    });

    return (
        <>
            <Typography component="h1" variant="h5">
                Login
            </Typography>

            <Box
                component="form"
                noValidate
                onSubmit={loginFormik.handleSubmit}
                sx={{ mt: 3 }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="email"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            autoFocus
                            variant="standard"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="password"
                            name="password"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            variant="standard"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/auth/sign-up">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default withAuth(Login, {
    public: true,
    restricted: true,
    Layout: AuthLayout,
});
