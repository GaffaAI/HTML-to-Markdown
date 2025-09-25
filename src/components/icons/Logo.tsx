export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 8.88988C10.15 7.31988 13.85 7.31988 17 8.88988M12 16.2999V7.92988M9 21.9999H15C20 21.9999 22 19.9999 22 14.9999V8.99988C22 3.99988 20 1.99988 15 1.99988H9C4 1.99988 2 3.99988 2 8.99988V14.9999C2 19.9999 4 21.9999 9 21.9999Z"
        stroke="#101726"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
