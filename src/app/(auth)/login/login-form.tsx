import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function LoginForm() {
  return (
    <div className="mt-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="block text-sm">
          Username
        </Label>
        <Input type="email" required name="email" id="email" />
      </div>

      <div className="space-y-0.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="pwd" className="text-sm">
            Password
          </Label>
          <Button asChild variant="link" size="sm">
            <Link href="#" className="link intent-info variant-ghost text-sm">
              Forgot your Password ?
            </Link>
          </Button>
        </div>
        <Input
          type="password"
          required
          name="pwd"
          id="pwd"
          className="input sz-md variant-mixed"
        />
      </div>

      <Button className="w-full">Sign In</Button>
    </div>
  );
}

export default LoginForm;
