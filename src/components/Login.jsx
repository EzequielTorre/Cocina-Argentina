import { SignIn } from "@clerk/clerk-react";
import { Container } from "react-bootstrap";

const Login = () => {
  return (
    <Container
      className="py-5 d-flex align-items-center justify-content-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="shadow-lg rounded overflow-hidden">
        <SignIn />
      </div>
    </Container>
  );
};

export default Login;
