import { Button } from "@/components/ui/button";
import Link from "next/link";

const bookPage = () => {
    return (
        <div>
            <Link href="/teacher/create/blog">
                <Button>
                    New Blog
                </Button>
            </Link>
        </div>
    );
}

export default bookPage;