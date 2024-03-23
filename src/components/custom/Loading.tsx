const Loading = () => {
  return (
    <div
      className="fixed top-0 right-0 bottom-0 left-0 bg-secondary bg-opacity-10 flex items-center justify-center"
      aria-label="読み込み中"
    >
      <div className="animate-spin h-12 w-12 bg-primary rounded-xl"></div>
    </div>
  );
};
export default Loading;
