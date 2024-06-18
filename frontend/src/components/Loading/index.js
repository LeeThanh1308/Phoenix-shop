import "./loading.model.css";

function Loading({ status = true, className, children }) {
  return (
    <>
      {status ? (
        <div
          className={
            "absolute top-0 right-0 left-0 bottom-0 bg-white z-50 flex justify-center items-center " +
            className
          }
        >
          <div className="loader">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
}

export default Loading;
