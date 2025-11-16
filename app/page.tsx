import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div>
        <main>
          <p className="text-3xl font-medium text-sky-700">Hello Dappled</p>
        </main>
        <Button>
          Click me
        </Button>
      </div>
    </div>
  );
}
