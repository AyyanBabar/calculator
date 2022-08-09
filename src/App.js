import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete_digit",
  EVALUATE: "evaluate",
};
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite)
        return { ...state, curr: payload.digit, overwrite: false };
      if (payload.digit === "0" && state.curr === "0") return state;
      if (payload.digit === "." && state.curr.includes(".")) return state;

      return {
        ...state,
        curr: `${state.curr || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.curr == null && state.prev == null) return null;

      if (state.curr == null)
        return {
          ...state,
          op: payload.op,
        };
      if (state.prev == null)
        return {
          ...state,
          op: payload.op,
          prev: state.curr,
          curr: null,
        };
      return {
        ...state,
        prev: evaluate(state),
        op: payload.op,
        curr: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if (state.op == null || state.prev == null || state.curr == null)
        return state;
      return {
        ...state,
        overwrite: true,
        prev: null,
        op: null,
        curr: evaluate(state),
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) return { ...state, curr: null, overwrite: false };
      if (state.curr == null) return state;
      if (state.curr.length === 1) return { ...state, curr: null };
      return { ...state, curr: state.curr.slice(0, -1) };
    default:
      return {};
  }
}
function evaluate({ curr, prev, op }) {
  const previous = parseFloat(prev);
  const current = parseFloat(curr);
  if (isNaN(previous) || isNaN(current)) return "";
  let computation = "";
  switch (op) {
    case "+":
      computation = previous + current;
      break;
    case "-":
      computation = previous - current;
      break;
    case "*":
      computation = previous * current;
      break;
    case "÷":
      computation = previous / current;
      break;
    default:
      computation = "";
  }
  return computation.toString();
}
const INTEGER_FORMATER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function format(op) {
  if (op == null) return;
  const [integer, dec] = op.split(".");
  if (dec == null) return INTEGER_FORMATER.format(integer);
  return `${INTEGER_FORMATER.format(integer)}.${dec}`;
}
function App() {
  const [{ curr, prev, op }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-op">
          {format(prev)} {op}
        </div>
        <div className="current-op">{format(curr)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton op="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton op="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton op="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton op="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
