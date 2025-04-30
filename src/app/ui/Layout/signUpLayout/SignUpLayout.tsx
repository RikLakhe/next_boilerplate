import SignUpLayoutBody from "./SignUpLayoutBody";
import SignUpLayoutHeader from "./SignUpLayoutHeader";

type SignUpLayoutProps = {
  children: React.ReactNode;
};

const SignUpLayout: React.FC<SignUpLayoutProps> = ({ children }) => {
  return (
    <div>
      <SignUpLayoutHeader />
      <SignUpLayoutBody>{children}</SignUpLayoutBody>
    </div>
  );
};

export default SignUpLayout;
