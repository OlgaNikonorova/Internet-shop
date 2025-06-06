interface CounterProps {
  count: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const Counter = (props: CounterProps) => {
  const { count, onIncrease, onDecrease } = props;

  return (
    <div className="flex items-center space-x-2 bg-gray-100 rounded-md px-2 py-1 text-sm">
      <button
        onClick={onDecrease}
        className="w-6 h-6 flex justify-center items-center"
      >
        −
      </button>
      <span className="min-w-[20px] text-center">{count}</span>
      <button
        onClick={onIncrease}
        className="w-6 h-6 flex justify-center items-center"
      >
        +
      </button>
    </div>
  );
};

export default Counter;
