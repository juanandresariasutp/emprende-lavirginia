import { LogOut } from "lucide-react";

import { logout } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="outline" size="lg">
        <LogOut aria-hidden="true" data-icon="inline-start" />
        Cerrar sesión
      </Button>
    </form>
  );
}
