import { BlogNavbar } from "./_components/blog-navbar";

const BlogLayout = ({ 
    children 
}: { 
    children: React.ReactNode 
}) => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar Wrapper */}
            <div className="h-[80px] fixed inset-y-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
                <BlogNavbar />
            </div>

            {/* Main Content */}
            <main className="h-full">
                <div className="max-w-6xl mx-auto p-6 h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default BlogLayout;