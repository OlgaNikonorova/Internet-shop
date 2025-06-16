interface CounterProps {
  count: number;
  onIncrease: () => void;
  onDecrease: () => void;
  className?: string;
}

const Counter = (props: CounterProps) => {
  const { count, onIncrease, onDecrease, className } = props;

  return (
    <div className={className}>
      <div className="flex items-center space-x-2 bg-gray-100 rounded-md px-2 py-1">
        <button
          onClick={onDecrease}
          className="w-6 h-6 flex justify-center items-center text-xl"
        >
          −
        </button>
        <span className="min-w-[20px] text-center text-xl">{count}</span>
        <button
          onClick={onIncrease}
          className="w-6 h-6 flex justify-center items-center text-xl"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;
