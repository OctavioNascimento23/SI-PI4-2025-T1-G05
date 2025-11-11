import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

export const Navbar = ({ minimal = false }: { minimal?: boolean }) => {
  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>NextWork</span>
          </Link>
          
          {!minimal && (
            <div className="flex items-center gap-4">
              <Link to="/dashboard/empresa">
                <Button variant="ghost">Para Clientes</Button>
              </Link>
              <Link to="/dashboard/consultor">
                <Button variant="ghost">Para Consultores</Button>
              </Link>
              <Link to="/auth">
                <Button variant="default" size="sm">Entrar</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
