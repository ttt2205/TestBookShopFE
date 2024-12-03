const App = ({ className, startNum, setStartNum, endNum, setEndNum }) => {
  return (
    <>
      <div className={className}>
        <input
          type="number"
          defaultValue={startNum}
          onChange={(e) => setStartNum(e.target.value)}
          className="form-control"
          placeholder="Từ"
        />
      </div>
      <div className={className}>
        <input
          type="number"
          defaultValue={endNum}
          onChange={(e) => setEndNum(e.target.value)}
          className="form-control"
          placeholder="Đến"
        />
      </div>
    </>
  );
};

export default App;
