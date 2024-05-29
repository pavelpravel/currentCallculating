import { Result } from "antd";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Graph from "./Graph";
const Results = ({ results, formulas, graph }) => {
    console.log('graph: ', graph)
    return (
        <MathJaxContext>
        <div className="resultsContainer">
          {results ? (
            <div>
              <h2>Результаты:</h2>
              {formulas.map((formula, index) => (
                <div key={index} className="resultItem">
                  <h3>{formula.title}</h3>
                  {formula?.formula && (
                    <p><strong>Формула:</strong>{" "}
                      <MathJax>{`$$${formula.formula}$$`}</MathJax>
                    </p>
                  )}
                  {formula?.formula ? (
                    <p><strong>Подставленные значения:</strong>{" "}
                      <MathJax>{`$$${formula.substitution}= ${formula.result}$$ `}</MathJax>
                    </p>
                  ) : (
                    formula.result
                  )}
                  <hr />
                </div>
              ))}
              {results?.Frab && (
                <div className="graphContainer">
                  <Graph graph={graph} />
                </div>
              )}
              {results?.k4 && results?.k4 > 1.5 ? (
                <Result
                  status="success"
                  title={<span style={{ color: 'white' }}>Коэффициент чувствительности удовлетворяет условию, больше 1,5</span>}
                />
              ) : (
                <Result
                  status="403"
                  title="Коэффициент чувствительности не удовлетворяет условию, меньше 1,5"
                />
              )}
            </div>
          ) : (
            <p>Введите данные и нажмите "Рассчитать" для получения результатов.</p>
          )}
        </div>
      </MathJaxContext>
    );
};

export default Results;
