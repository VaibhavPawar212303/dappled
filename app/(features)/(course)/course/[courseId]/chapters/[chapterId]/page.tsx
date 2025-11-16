import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";

// -------------------------
// ✅ Route Param Types
// -------------------------
type ChapterParams = {
  courseId: string;
  chapterId: string;
};

type ChapterPageProps = {
  params: ChapterParams;
};

// -------------------------
// ✅ Safe Promise Detection
// -------------------------
function isPromise<T>(value: unknown): value is Promise<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof (value as any).then === "function"
  );
}

// -------------------------
// ✅ Page
// -------------------------
export default async function ChapterIdPage({ params }: ChapterPageProps) {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  // Resolve params only if needed
  const resolvedParams = isPromise<ChapterParams>(params) ? await params : params;

  if (!resolvedParams) throw new Error("Missing route parameters.");

  const { courseId, chapterId } = resolvedParams;

  const {
    chapter,
    course: courseData,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId,
    courseId,
  });

  const course = isPromise<typeof courseData>(courseData)
    ? await courseData
    : courseData;

  if (!chapter || !course) return redirect("/");

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = Boolean(purchase && !userProgress?.isCompleted);

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}

      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}

      <div className="flex flex-col max-w-4xl ms-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>

        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>

            {purchase ? (
              <CourseProgressButton
                chapterId={chapterId}
                courseId={courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={Boolean(userProgress?.isCompleted)}
              />
            ) : (
              <CourseEnrollButton courseId={courseId} price={course.price} />
            )}
          </div>

          <Separator />

          <div>
            <Preview value={chapter.description ?? ""} />
          </div>

          {attachments.length > 0 && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    key={attachment.id}
                    target="_blank"
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
