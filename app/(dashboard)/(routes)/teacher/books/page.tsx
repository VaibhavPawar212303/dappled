import { Button } from "@/components/ui/button";
import Link from "next/link";

const bookPage = () => {
    return (
        <div>
            <Link href="/teacher/create/book">
                <Button>
                    New Book
                </Button>
            </Link>
        </div>
    );
}

export default bookPage;