import {Button } from "@/components/ui/button";
import Link from 'next/link';
const LandingPage = () => {
  return (
    <div>
      <h1>Welcome to the landing page</h1>
      <div>
        <Link href="/sign-in">
        <Button>
          Login
        </Button>
        </Link>
        <Link href="/sign-up">
        <Button>
          Register
        </Button>
        </Link>
        
      </div>
    </div>
  );
}

export default LandingPage;