"use client"

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};
