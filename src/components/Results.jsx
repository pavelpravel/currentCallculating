import { Result } from "antd";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const Results = ({ results, formulas }) => {
    console.log(results);
    return (
        <MathJaxContext>
            <div>
                {results ? (
                    <div>
                        <h2>Результаты:</h2>
                        {formulas.map((formula, index) => (
                            <div key={index} style={{ marginBottom: "20px" }}>
                                <h3>{formula.title}</h3>
                                <p>
                                    <strong>Формула:</strong>{" "}
                                    <MathJax>{`$$${formula.formula}$$`}</MathJax>
                                </p>
                                <p>
                                    <strong>Подставленные значения:</strong>{" "}
                                    <MathJax>{`$$${formula.substitution}= ${formula.result}$$ `}</MathJax>
                                </p>
								<hr/>
                            </div>
                        ))}

                        {results?.tgaras && results?.tgaras < 1.3 ? (
                            <Result
                                status="success"
                                title={<span style={{ color: 'white' }}>Условие  кратной отстройки от тока внешнего к.з. на стороне НН выполняется </span>}
                            />
                        ) : (
                            <Result
                                status="403"
                                title="Условие  кратной отстройки от тока внешнего к.з. на стороне НН не выполняется"
                            />
                        )}
                    </div>
                ) : (
                    <p>
                        Введите данные и нажмите "Рассчитать" для получения
                        результатов.
                    </p>
                )}
            </div>
        </MathJaxContext>
    );
};

export default Results;
