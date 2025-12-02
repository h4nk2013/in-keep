export default function Square({ value, onSquareClick }: { value: string | null; onSquareClick: () => void; }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}
